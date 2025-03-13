import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Product from './views/Product.vue'
import AdminLogin from './views/AdminLogin.vue'
import AdminDashboard from './views/AdminDashboard.vue'
import ProductForm from './views/ProductForm.vue'
import OrdersManagement from './views/OrdersManagement.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/product/:id',
    name: 'Product',
    component: Product,
    meta: {
      title: 'Product'
    }
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLogin,
    meta: {
      title: 'Admin Login'
    }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: {
      title: 'Admin Dashboard',
      requiresAuth: true
    }
  },
  {
    path: '/admin/product/new',
    name: 'NewProduct',
    component: ProductForm,
    meta: {
      title: 'Add New Product',
      requiresAuth: true
    }
  },
  {
    path: '/admin/product/:id',
    name: 'EditProduct',
    component: ProductForm,
    meta: {
      title: 'Edit Product',
      requiresAuth: true
    }
  },
  {
    path: '/admin/orders',
    name: 'OrdersManagement',
    component: OrdersManagement,
    meta: {
      title: 'Orders Management',
      requiresAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局导航守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.name === 'Product') {
    // 产品页面的标题会在组件内动态设置
    document.title = 'Loading Product...';
  } else if (to.meta.title) {
    document.title = to.meta.title;
  }

  // 检查是否需要认证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const isAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
    if (!isAuthenticated) {
      next({ name: 'AdminLogin' });
    } else {
      next();
    }
  } else {
    next();
  }
})

export default router 