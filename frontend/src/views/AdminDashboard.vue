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
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-800">Products Management</h2>
          <router-link to="/admin/product/new" class="btn btn-primary">
            Add New Product
          </router-link>
        </div>
        
        <div v-if="loading" class="text-center py-10">
          <p class="text-lg">Loading products...</p>
        </div>
        
        <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{{ error }}</p>
          <button @click="fetchProducts" class="mt-2 text-blue-600 hover:underline">Try Again</button>
        </div>
        
        <div v-else-if="products.length === 0" class="bg-white rounded-lg shadow p-6 text-center">
          <p class="text-gray-500">No products available. Add your first product!</p>
          <router-link to="/admin/product/new" class="btn btn-primary mt-4">
            Add Product
          </router-link>
        </div>
        
        <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="product in products" :key="product.id" class="bg-white rounded-lg shadow overflow-hidden">
            <div class="h-48 w-full overflow-hidden">
              <img 
                :src="product.image ? `${baseUrl}${product.image}` : 'https://via.placeholder.com/300x200?text=No+Image'" 
                :alt="product.name"
                class="w-full h-full object-cover"
              >
            </div>
            <div class="p-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ product.name }}</h3>
              <p class="text-red-600 font-medium">${{ product.price.toFixed(2) }}</p>
              <p class="text-gray-500 text-sm mt-1 line-clamp-2">{{ product.description || 'No description' }}</p>
              
              <div class="mt-4 flex justify-between">
                <router-link :to="`/admin/product/${product.id}`" class="text-blue-600 hover:text-blue-800">
                  Edit
                </router-link>
                <button 
                  @click="confirmDelete(product)" 
                  class="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
              
              <div class="mt-3 pt-3 border-t border-gray-200">
                <a 
                  :href="`/product/${product.id}`" 
                  target="_blank"
                  class="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <span>View Product Page</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <!-- 删除确认对话框 -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium text-gray-900">Confirm Delete</h3>
        <p class="mt-2 text-gray-500">
          Are you sure you want to delete "{{ productToDelete?.name }}"? This action cannot be undone.
        </p>
        <div class="mt-4 flex justify-end space-x-3">
          <button 
            @click="showDeleteModal = false" 
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button 
            @click="deleteProduct" 
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            :disabled="deleting"
          >
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AdminDashboard',
  data() {
    return {
      products: [],
      loading: true,
      error: null,
      baseUrl: import.meta.env.VITE_API_URL || '',
      showDeleteModal: false,
      productToDelete: null,
      deleting: false
    };
  },
  created() {
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get('/api/products');
        this.products = response.data;
      } catch (err) {
        console.error('Error fetching products:', err);
        this.error = 'Failed to load products. Please try again.';
      } finally {
        this.loading = false;
      }
    },
    confirmDelete(product) {
      this.productToDelete = product;
      this.showDeleteModal = true;
    },
    async deleteProduct() {
      if (this.deleting) return;
      
      this.deleting = true;
      
      try {
        await axios.delete(`/product/${this.productToDelete.id}`);
        this.products = this.products.filter(p => p.id !== this.productToDelete.id);
        this.showDeleteModal = false;
        this.productToDelete = null;
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Failed to delete product. Please try again.');
      } finally {
        this.deleting = false;
      }
    },
    logout() {
      localStorage.removeItem('admin_authenticated');
      this.$router.push('/admin/login');
    }
  }
};
</script> 