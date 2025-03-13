const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const fs = require('fs');

// 创建应用实例
const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 在 app.js 顶部添加
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// 确保上传目录存在
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

// 修改 multer 配置，直接使用单一配置
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 限制文件大小为10MB
});

// 初始化数据库
const dbPath = path.join(__dirname, 'db', 'database.db');
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('数据库连接错误:', err.message);
  } else {
    console.log('已连接到SQLite数据库');
    initDatabase();
  }
});

// 初始化数据库表
function initDatabase() {
  db.serialize(() => {
    // 创建商品表 - 使用 IF NOT EXISTS，这样不会删除现有数据
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        description_images TEXT DEFAULT '[]',
        price REAL NOT NULL,
        image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 创建订单表
    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        customer_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        status TEXT DEFAULT '待处理',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products (id)
      )
    `);
  });
}

// API 路由

// 获取所有商品
app.get('/api/products', (req, res) => {
  console.log('获取所有商品');
  const sql = 'SELECT * FROM products ORDER BY created_at DESC';
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('获取所有商品失败:', err);
      return res.status(500).json({ error: '数据库查询错误' });
    }
    console.log(`找到 ${rows.length} 个商品`);
    res.json(rows);
  });
});

// 获取单个商品
app.get('/api/product/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT * FROM products WHERE id = ?';
  
  db.get(sql, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: '数据库查询错误' });
    }
    
    if (!row) {
      return res.status(404).json({ error: '商品不存在' });
    }
    
    res.json(row);
  });
});

// 创建商品 - 修改创建商品的路由
app.post('/api/product', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'description_images', maxCount: 10 }
]), (req, res) => {
  console.log('=== 开始创建商品 ===');
  console.log('请求体:', req.body);
  console.log('上传的文件:', req.files);
  
  const { name, price, description } = req.body;
  
  // 验证必填字段
  if (!name || !price) {
    return res.status(400).json({ error: '商品名称和价格为必填项' });
  }
  
  try {
    // 处理主图片
    let imagePath = null;
    if (req.files && req.files.image && req.files.image[0]) {
      imagePath = `/uploads/${req.files.image[0].filename}`;
      console.log('主图片路径:', imagePath);
    }
    
    // 处理描述图片
    let descriptionImages = [];
    if (req.files && req.files.description_images) {
      descriptionImages = req.files.description_images.map(file => `/uploads/${file.filename}`);
      console.log('描述图片路径:', descriptionImages);
    }
    
    // 准备SQL语句和参数
    const sql = `
      INSERT INTO products (name, price, description, image, description_images) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [
      name,
      parseFloat(price), // 确保价格是数字
      description || '',
      imagePath,
      JSON.stringify(descriptionImages)
    ];
    
    console.log('执行SQL:', sql);
    console.log('SQL参数:', params);
    
    // 插入数据库
    db.run(sql, params, function(err) {
      if (err) {
        console.error('创建商品失败:', err);
        return res.status(500).json({ error: '创建商品失败', details: err.message });
      }
      
      const newProductId = this.lastID;
      console.log('创建商品成功, ID:', newProductId);
      
      // 查询新创建的商品完整信息
      db.get('SELECT * FROM products WHERE id = ?', [newProductId], (err, product) => {
        if (err) {
          console.error('获取新创建商品信息失败:', err);
          return res.status(500).json({ error: '获取新创建商品信息失败' });
        }
        
        console.log('=== 商品创建完成 ===');
        res.status(201).json(product);
      });
    });
    
  } catch (err) {
    console.error('创建商品过程中出错:', err);
    res.status(500).json({ error: '创建商品失败', details: err.message });
  }
});

// 更新商品 - 简化处理逻辑
app.put('/api/product/:id', upload.single('image'), (req, res) => {
  console.log('更新商品请求体:', req.body);
  console.log('更新商品文件:', req.file);
  
  const id = req.params.id;
  const { name, price, description } = req.body;
  
  if (!name || !price) {
    return res.status(400).json({ error: '商品名称和价格为必填项' });
  }
  
  // 先获取现有商品信息
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, product) => {
    if (err) {
      console.error('查询商品失败:', err);
      return res.status(500).json({ error: '数据库查询错误' });
    }
    
    if (!product) {
      return res.status(404).json({ error: '商品不存在' });
    }
    
    // 处理主图片
    let imagePath = product.image;
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
      
      // 如果上传了新图片，尝试删除旧图片
      if (product.image) {
        try {
          const oldImagePath = path.join(__dirname, product.image.replace('/uploads/', 'uploads/'));
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
            console.log('成功删除旧主图片:', oldImagePath);
          }
        } catch (e) {
          console.error('删除旧主图片失败:', e);
        }
      }
    }
    
    // 保留现有的描述图片
    const descriptionImages = product.description_images || '[]';
    
    // 更新数据库
    const sql = `
      UPDATE products 
      SET name = ?, price = ?, description = ?, image = ?
      WHERE id = ?
    `;
    
    db.run(
      sql, 
      [name, price, description || '', imagePath, id], 
      function(err) {
        if (err) {
          console.error('更新商品失败:', err);
          return res.status(500).json({ error: '更新商品失败' });
        }
        
        if (this.changes === 0) {
          return res.status(404).json({ error: '商品不存在' });
        }
        
        // 获取更新后的商品信息
        db.get('SELECT * FROM products WHERE id = ?', [id], (err, updatedProduct) => {
          if (err) {
            console.error('获取更新后的商品失败:', err);
            return res.status(500).json({ error: '获取更新后的商品失败' });
          }
          
          console.log('成功更新商品:', updatedProduct);
          res.json(updatedProduct);
        });
      }
    );
  });
});

// 删除商品
app.delete('/api/product/:id', (req, res) => {
  const id = req.params.id;
  
  // 先获取商品信息，以便删除图片文件
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, product) => {
    if (err) {
      return res.status(500).json({ error: '数据库查询错误' });
    }
    
    if (!product) {
      return res.status(404).json({ error: '商品不存在' });
    }
    
    // 删除商品
    db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).json({ error: '删除商品失败' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: '商品不存在' });
      }
      
      // 尝试删除主图片
      if (product.image) {
        const imagePath = path.join(__dirname, product.image.replace('/uploads/', 'uploads/'));
        try {
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        } catch (e) {
          console.error('删除图片文件失败:', e);
        }
      }
      
      // 尝试删除描述图片
      try {
        const descriptionImages = JSON.parse(product.description_images || '[]');
        descriptionImages.forEach(imgPath => {
          const fullPath = path.join(__dirname, imgPath.replace('/uploads/', 'uploads/'));
          try {
            if (fs.existsSync(fullPath)) {
              fs.unlinkSync(fullPath);
            }
          } catch (e) {
            console.error('删除描述图片文件失败:', e);
          }
        });
      } catch (e) {
        console.error('解析描述图片失败:', e);
      }
      
      res.json({ id });
    });
  });
});

// 删除商品描述图片
app.delete('/api/product/:id/description-image', (req, res) => {
  const id = req.params.id;
  const { imagePath } = req.body;
  
  if (!imagePath) {
    return res.status(400).json({ error: '图片路径为必填项' });
  }
  
  // 获取商品信息
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, product) => {
    if (err) {
      return res.status(500).json({ error: '数据库查询错误' });
    }
    
    if (!product) {
      return res.status(404).json({ error: '商品不存在' });
    }
    
    // 解析描述图片
    let descriptionImages = [];
    try {
      descriptionImages = product.description_images ? JSON.parse(product.description_images) : [];
    } catch (e) {
      return res.status(500).json({ error: '解析描述图片失败' });
    }
    
    // 从数组中移除指定图片
    const newDescriptionImages = descriptionImages.filter(img => img !== imagePath);
    
    // 更新数据库
    db.run(
      'UPDATE products SET description_images = ? WHERE id = ?',
      [JSON.stringify(newDescriptionImages), id],
      function(err) {
        if (err) {
          return res.status(500).json({ error: '更新商品失败' });
        }
        
        // 尝试删除图片文件
        const fullPath = path.join(__dirname, imagePath.replace('/uploads/', 'uploads/'));
        try {
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        } catch (e) {
          console.error('删除描述图片文件失败:', e);
        }
        
        res.json({ description_images: newDescriptionImages });
      }
    );
  });
});

// 添加一个新的路由，专门用于上传描述图片
app.post('/api/product/:id/description-images', upload.array('description_images', 10), (req, res) => {
  const id = req.params.id;
  
  console.log('=== 开始处理描述图片上传 ===');
  console.log(`产品ID: ${id}`);
  
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: '没有上传文件' });
  }
  
  // 先获取现有商品信息
  db.get('SELECT description_images FROM products WHERE id = ?', [id], (err, product) => {
    if (err) {
      console.error('查询商品失败:', err);
      return res.status(500).json({ error: '数据库查询错误' });
    }
    
    if (!product) {
      return res.status(404).json({ error: '商品不存在' });
    }
    
    // 解析现有描述图片
    let existingImages = [];
    try {
      existingImages = JSON.parse(product.description_images || '[]');
    } catch (e) {
      console.error('解析现有描述图片失败:', e);
      existingImages = [];
    }
    
    // 处理新上传的图片
    const newImages = req.files.map(file => `/uploads/${file.filename}`);
    
    // 合并图片数组
    const allImages = [...existingImages, ...newImages];
    
    // 更新数据库
    const updateSql = 'UPDATE products SET description_images = ? WHERE id = ?';
    const imagesJson = JSON.stringify(allImages);
    
    db.run(updateSql, [imagesJson, id], function(err) {
      if (err) {
        console.error('更新商品描述图片失败:', err);
        return res.status(500).json({ error: '更新商品描述图片失败' });
      }
      
      console.log('描述图片更新成功');
      res.json({
        success: true,
        description_images: allImages
      });
    });
  });
});

// 创建订单
app.post('/api/order/:productId', (req, res) => {
  const productId = req.params.productId;
  const { customer_name, phone, address } = req.body;
  
  if (!customer_name || !phone || !address) {
    return res.status(400).json({ error: '客户姓名、电话和地址为必填项' });
  }
  
  // 检查商品是否存在
  db.get('SELECT * FROM products WHERE id = ?', [productId], (err, product) => {
    if (err) {
      return res.status(500).json({ error: '数据库查询错误' });
    }
    
    if (!product) {
      return res.status(404).json({ error: '商品不存在' });
    }
    
    // 创建订单
    const sql = 'INSERT INTO orders (product_id, customer_name, phone, address) VALUES (?, ?, ?, ?)';
    db.run(sql, [productId, customer_name, phone, address], function(err) {
      if (err) {
        return res.status(500).json({ error: '创建订单失败' });
      }
      
      res.status(201).json({ 
        id: this.lastID, 
        product_id: productId,
        customer_name,
        phone,
        address,
        status: '待处理'
      });
    });
  });
});

// 获取所有订单
app.get('/api/orders', (req, res) => {
  const sql = `
    SELECT o.*, p.name as product_name, p.price as product_price 
    FROM orders o
    JOIN products p ON o.product_id = p.id
    ORDER BY o.created_at DESC
  `;
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: '数据库查询错误' });
    }
    res.json(rows);
  });
});

// 更新订单状态
app.put('/api/order/:id', (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json({ error: '状态为必填项' });
  }
  
  const sql = 'UPDATE orders SET status = ? WHERE id = ?';
  db.run(sql, [status, id], function(err) {
    if (err) {
      return res.status(500).json({ error: '更新订单状态失败' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: '订单不存在' });
    }
    
    res.json({ id, status });
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

// 优雅关闭
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('关闭数据库时出错:', err.message);
    } else {
      console.log('数据库连接已关闭');
    }
    process.exit(0);
  });
});

// 在所有路由之后添加
app.use((err, req, res, next) => {
  console.error('全局错误处理:', err);
  res.status(500).json({ 
    error: '服务器内部错误', 
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
}); 