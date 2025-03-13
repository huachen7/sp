<template>
  <div class="min-h-screen bg-gray-100">
    <!-- 管理员头部 -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div class="flex space-x-4">
          <router-link to="/admin" class="btn btn-primary">Products</router-link>
          <router-link to="/admin/orders" class="btn btn-primary">Orders</router-link>
          <button @click="logout" class="btn bg-gray-200 hover:bg-gray-300">Logout</button>
        </div>
      </div>
    </header>
    
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- 页面内容 -->
      <div class="px-4 py-6 sm:px-0">
        <div class="flex items-center mb-6">
          <router-link to="/admin" class="text-blue-600 hover:text-blue-800 mr-4">
            &larr; Back to Products
          </router-link>
          <h2 class="text-xl font-semibold text-gray-800">
            {{ isEditing ? 'Edit Product' : 'Add New Product' }}
          </h2>
        </div>
        
        <div v-if="loading" class="text-center py-10">
          <p class="text-lg">Loading product information...</p>
        </div>
        
        <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{{ error }}</p>
          <button v-if="isEditing" @click="fetchProduct" class="mt-2 text-blue-600 hover:underline">Try Again</button>
        </div>
        
        <div v-else class="bg-white rounded-lg shadow overflow-hidden">
          <form @submit.prevent="saveProduct" class="p-6">
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div class="md:col-span-2">
                <label for="name" class="form-label">Product Name</label>
                <input 
                  type="text" 
                  id="name" 
                  v-model="product.name" 
                  required
                  class="form-input"
                  placeholder="Enter product name"
                >
              </div>
              
              <div>
                <label for="price" class="form-label">Price ($)</label>
                <input 
                  type="number" 
                  id="price" 
                  v-model="product.price" 
                  required
                  min="0.01" 
                  step="0.01"
                  class="form-input"
                  placeholder="0.00"
                >
              </div>
              
              <div class="md:col-span-2">
                <label for="description" class="form-label">Description</label>
                <textarea 
                  id="description" 
                  v-model="product.description" 
                  rows="4"
                  class="form-input"
                  placeholder="Enter product description"
                ></textarea>
              </div>
              
              <div class="md:col-span-2">
                <label class="form-label">Main Image</label>
                <div class="mt-1 flex items-center">
                  <div v-if="mainImagePreview" class="mr-4">
                    <img :src="mainImagePreview" alt="Preview" class="h-32 w-32 object-cover rounded-md">
                  </div>
                  <input 
                    type="file" 
                    @change="handleMainImageChange" 
                    accept="image/*"
                    class="form-input"
                  >
                </div>
              </div>
              
              <div class="md:col-span-2">
                <label class="form-label">Description Images</label>
                <div class="mt-1 flex items-center">
                  <input 
                    type="file" 
                    @change="handleDescriptionImagesChange" 
                    accept="image/*"
                    multiple
                    class="form-input"
                  >
                </div>
                
                <!-- Debug info for description images -->
                <div class="mt-2 text-sm text-gray-500">
                  <p>Original description images: {{ product.original_description_images.length }}</p>
                  <p>New description images: {{ product.description_images.length }}</p>
                  <p>Preview images: {{ descriptionImagePreviews.length }}</p>
                </div>
                
                <div v-if="descriptionImagePreviews.length > 0" class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div v-for="(preview, index) in descriptionImagePreviews" :key="index" class="relative">
                    <img :src="preview" alt="Preview" class="h-24 w-24 object-cover rounded-md">
                    <button 
                      type="button" 
                      @click="removeDescriptionImage(index)" 
                      class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Product Attributes Section -->
              <div class="md:col-span-2 mt-6">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-medium text-gray-900">Product Attributes</h3>
                  <button 
                    type="button" 
                    @click="addAttributeType" 
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none"
                  >
                    Add Attribute Type
                  </button>
                </div>
                
                <div v-if="attributeTypes.length === 0" class="text-center py-4 text-gray-500">
                  No attributes defined. Click "Add Attribute Type" to add product attributes like size, color, etc.
                </div>
                
                <div v-for="(attrType, typeIndex) in attributeTypes" :key="typeIndex" class="mb-6 p-4 border border-gray-200 rounded-lg">
                  <div class="flex justify-between items-center mb-3">
                    <div class="flex-grow mr-4">
                      <label :for="`attrType-${typeIndex}`" class="block text-sm font-medium text-gray-700">Attribute Type</label>
                      <input 
                        :id="`attrType-${typeIndex}`" 
                        v-model="attrType.name" 
                        placeholder="e.g. Size, Color, Material"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                    </div>
                    <button 
                      type="button" 
                      @click="removeAttributeType(typeIndex)" 
                      class="mt-6 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div class="space-y-3">
                    <div v-for="(value, valueIndex) in attrType.values" :key="valueIndex" class="flex items-center">
                      <div class="flex-grow mr-4">
                        <input 
                          v-model="attrType.values[valueIndex]" 
                          placeholder="Attribute value"
                          class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                      </div>
                      <button 
                        type="button" 
                        @click="removeAttributeValue(typeIndex, valueIndex)" 
                        class="text-red-600 hover:text-red-800"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                  
                  <button 
                    type="button" 
                    @click="addAttributeValue(typeIndex)" 
                    class="mt-3 inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none"
                  >
                    Add Value
                  </button>
                </div>
                
                <!-- Inventory Management for Attribute Combinations -->
                <div v-if="attributeCombinations.length > 0" class="mt-6">
                  <h3 class="text-lg font-medium text-gray-900 mb-4">Inventory Management</h3>
                  <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                        <tr>
                          <th v-for="(type, index) in attributeTypes" :key="index" scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {{ type.name }}
                          </th>
                          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Stock
                          </th>
                          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            SKU
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="(combo, index) in attributeCombinations" :key="index">
                          <td v-for="(value, valueIndex) in combo.values" :key="valueIndex" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ value }}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <input 
                              v-model="combo.stock" 
                              type="number" 
                              min="0" 
                              class="block w-20 border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <input 
                              v-model="combo.sku" 
                              type="text" 
                              class="block w-32 border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="mt-6 flex justify-end space-x-3">
              <router-link 
                to="/admin" 
                class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </router-link>
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="saving"
              >
                {{ saving ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ProductForm',
  data() {
    return {
      product: {
        name: '',
        price: 0,
        description: '',
        image: null,
        description_images: [],
        original_image: '',
        original_description_images: []
      },
      mainImagePreview: null,
      descriptionImagePreviews: [],
      attributeTypes: [],
      attributeCombinations: [],
      loading: false,
      error: null,
      saving: false
    };
  },
  computed: {
    isEditing() {
      return !!this.$route.params.id;
    }
  },
  created() {
    // Set document title
    document.title = this.$route.meta.title;
    
    if (this.isEditing) {
      this.fetchProduct();
    }
  },
  methods: {
    async fetchProduct() {
      this.loading = true;
      this.error = null;
      
      try {
        console.log('Fetching product with ID:', this.$route.params.id);
        
        const response = await axios.get(`/api/product/${this.$route.params.id}`);
        const productData = response.data;
        
        console.log('Product data received (raw):', productData);
        console.log('Product data received (JSON):', JSON.stringify(productData));
        console.log('Description images type:', typeof productData.description_images);
        console.log('Description images instanceof Array:', productData.description_images instanceof Array);
        console.log('Description images:', productData.description_images);
        console.log('Attributes type:', typeof productData.attributes);
        console.log('Attributes instanceof Array:', productData.attributes instanceof Array);
        console.log('Attributes:', productData.attributes);
        
        // 直接使用后端返回的数据
        this.product = {
          name: productData.name || '',
          price: productData.price || 0,
          description: productData.description || '',
          image: null, // 新上传的图片
          description_images: [], // 新上传的描述图片
          original_image: productData.image || '',
          original_description_images: Array.isArray(productData.description_images) ? [...productData.description_images] : []
        };
        
        console.log('Product object initialized:', JSON.stringify(this.product));
        console.log('Original description images:', this.product.original_description_images);
        
        // 设置主图预览
        if (productData.image) {
          this.mainImagePreview = this.getImageUrl(productData.image);
          console.log('Main image preview set:', this.mainImagePreview);
        }
        
        // 设置描述图片预览
        this.descriptionImagePreviews = [];
        if (Array.isArray(productData.description_images)) {
          for (const img of productData.description_images) {
            if (img) {
              const url = this.getImageUrl(img);
              console.log('Adding description image preview:', url);
              this.descriptionImagePreviews.push(url);
            }
          }
        }
        
        console.log('Description image previews set:', this.descriptionImagePreviews);
        
        // 设置属性类型
        this.attributeTypes = [];
        if (Array.isArray(productData.attributes)) {
          console.log('Product has attributes:', productData.attributes.length);
          for (const attr of productData.attributes) {
            console.log('Processing attribute:', attr);
            if (attr && attr.name) {
              const values = Array.isArray(attr.values) ? [...attr.values] : [''];
              this.attributeTypes.push({
                name: attr.name,
                values: values
              });
              console.log(`Added attribute type: ${attr.name} with values:`, values);
            }
          }
        }
        
        // 如果没有属性，添加一个空属性
        if (this.attributeTypes.length === 0) {
          this.addAttributeType();
          console.log('No attributes found, added empty attribute type');
        } else {
          console.log('Attribute types set:', JSON.stringify(this.attributeTypes));
          
          // 生成属性组合
          this.generateCombinations();
          
          // 设置库存数据
          if (Array.isArray(productData.inventory)) {
            console.log('Product has inventory:', productData.inventory.length);
            
            this.attributeCombinations = this.attributeCombinations.map(combo => {
              const existingInventory = productData.inventory.find(inv => 
                JSON.stringify(inv.attributes) === JSON.stringify(combo.values)
              );
              
              return {
                values: combo.values,
                stock: existingInventory && !isNaN(existingInventory.stock) ? existingInventory.stock : 0,
                sku: existingInventory && existingInventory.sku ? existingInventory.sku : ''
              };
            });
            
            console.log('Attribute combinations set:', JSON.stringify(this.attributeCombinations));
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        console.error('Error details:', err.response?.data || err.message);
        this.error = `Failed to load product information: ${err.response?.data?.error || err.message}. Please try again.`;
      } finally {
        this.loading = false;
      }
    },
    handleMainImageChange(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      this.product.image = file;
      this.mainImagePreview = URL.createObjectURL(file);
    },
    handleDescriptionImagesChange(event) {
      const files = Array.from(event.target.files);
      if (files.length === 0) return;
      
      files.forEach(file => {
        this.product.description_images.push(file);
        this.descriptionImagePreviews.push(URL.createObjectURL(file));
      });
    },
    removeDescriptionImage(index) {
      // 如果是新上传的图片
      if (index < this.product.description_images.length) {
        this.product.description_images.splice(index, 1);
        this.descriptionImagePreviews.splice(index, 1);
        return;
      }
      
      // 如果是原有的图片
      const originalIndex = index - this.product.description_images.length;
      if (originalIndex >= 0 && originalIndex < this.product.original_description_images.length) {
        this.product.original_description_images.splice(originalIndex, 1);
        this.descriptionImagePreviews.splice(index, 1);
      }
    },
    getImageUrl(path) {
      if (!path) {
        console.log('Empty image path');
        return '';
      }
      
      if (path.startsWith('http')) {
        console.log('Image path is already a URL:', path);
        return path;
      }
      
      const baseUrl = import.meta.env.VITE_API_URL || '';
      let url = '';
      
      if (path.startsWith('/uploads/')) {
        const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        url = `${base}${path}`;
      } else if (!path.startsWith('/')) {
        url = `${baseUrl}/uploads/${path}`;
      } else {
        url = `${baseUrl}${path}`;
      }
      
      console.log(`Converted image path: ${path} to URL: ${url}`);
      return url;
    },
    addAttributeType() {
      console.log('Adding new attribute type');
      this.attributeTypes.push({
        name: '',
        values: ['']
      });
    },
    removeAttributeType(index) {
      this.attributeTypes.splice(index, 1);
    },
    addAttributeValue(typeIndex) {
      this.attributeTypes[typeIndex].values.push('');
    },
    removeAttributeValue(typeIndex, valueIndex) {
      this.attributeTypes[typeIndex].values.splice(valueIndex, 1);
    },
    generateCombinations() {
      // Filter out empty attribute types and values
      const validTypes = this.attributeTypes.filter(type => 
        type.name.trim() !== '' && 
        type.values.some(v => v.trim() !== '')
      ).map(type => ({
        name: type.name,
        values: type.values.filter(v => v.trim() !== '')
      }));
      
      if (validTypes.length === 0) {
        this.attributeCombinations = [];
        return;
      }
      
      // Generate all possible combinations
      const generateCombos = (types, current = [], index = 0) => {
        if (index === types.length) {
          return [current];
        }
        
        let result = [];
        for (const value of types[index].values) {
          result = result.concat(
            generateCombos(types, [...current, value], index + 1)
          );
        }
        
        return result;
      };
      
      const valuesCombinations = generateCombos(validTypes);
      
      // Create combination objects with stock and SKU
      this.attributeCombinations = valuesCombinations.map(values => {
        // Try to find existing combination to preserve stock and SKU
        const existing = this.attributeCombinations.find(c => 
          JSON.stringify(c.values) === JSON.stringify(values)
        );
        
        return {
          values,
          stock: existing ? existing.stock : 0,
          sku: existing ? existing.sku : ''
        };
      });
    },
    async saveProduct() {
      if (this.saving) return;
      this.saving = true;
      
      try {
        console.log('Saving product:', JSON.stringify(this.product));
        console.log('Attribute types:', JSON.stringify(this.attributeTypes));
        console.log('Attribute combinations:', JSON.stringify(this.attributeCombinations));
        
        const formData = new FormData();
        formData.append('name', this.product.name);
        formData.append('price', this.product.price);
        formData.append('description', this.product.description);
        
        // 处理主图
        if (this.product.image) {
          formData.append('image', this.product.image);
          console.log('Adding new main image to form data');
        } else if (this.product.original_image) {
          formData.append('original_image', this.product.original_image);
          console.log('Keeping original main image:', this.product.original_image);
        }
        
        // 处理描述图片
        if (this.product.description_images && this.product.description_images.length > 0) {
          for (const image of this.product.description_images) {
            formData.append('description_images', image);
          }
          console.log('Adding new description images to form data:', this.product.description_images.length);
        }
        
        // 处理原始描述图片
        if (this.product.original_description_images && this.product.original_description_images.length > 0) {
          formData.append('original_description_images', JSON.stringify(this.product.original_description_images));
          console.log('Keeping original description images:', JSON.stringify(this.product.original_description_images));
        }
        
        // 处理属性
        const validTypes = this.attributeTypes.filter(type => 
          type.name && type.name.trim() !== '' && 
          type.values && type.values.some(v => v && v.trim() !== '')
        ).map(type => ({
          name: type.name,
          values: type.values.filter(v => v && v.trim() !== '')
        }));
        
        if (validTypes.length > 0) {
          formData.append('attributes', JSON.stringify(validTypes));
          console.log('Adding attributes to form data:', JSON.stringify(validTypes));
          
          // 处理库存
          if (this.attributeCombinations && this.attributeCombinations.length > 0) {
            const inventory = this.attributeCombinations.map(combo => ({
              attributes: combo.values,
              stock: combo.stock || 0,
              sku: combo.sku || ''
            }));
            
            formData.append('inventory', JSON.stringify(inventory));
            console.log('Adding inventory to form data:', JSON.stringify(inventory));
          }
        }
        
        // 打印 FormData 内容
        for (const [key, value] of formData.entries()) {
          console.log(`FormData: ${key} = ${value}`);
        }
        
        let response;
        if (this.isEditing) {
          console.log('Updating existing product with ID:', this.$route.params.id);
          response = await axios.put(`/api/product/${this.$route.params.id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        } else {
          console.log('Creating new product');
          response = await axios.post('/api/product', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        }
        
        console.log('Product saved successfully:', response.data);
        this.$router.push('/admin');
      } catch (err) {
        console.error('Error saving product:', err);
        console.error('Error details:', err.response?.data || err.message);
        alert(`Failed to save product: ${err.response?.data?.error || err.message}`);
      } finally {
        this.saving = false;
      }
    },
    logout() {
      localStorage.removeItem('admin_authenticated');
      this.$router.push('/admin/login');
    }
  }
};
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  font-weight: 500;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}
</style>