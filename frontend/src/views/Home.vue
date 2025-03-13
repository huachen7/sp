<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-center text-gray-900 mb-8">Welcome to Our Store</h1>
      
      <div v-if="loading" class="text-center py-12">
        <p class="text-lg text-gray-600">Loading products...</p>
      </div>
      
      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{{ error }}</p>
        <button @click="fetchProducts" class="mt-2 text-blue-600 hover:underline">Try Again</button>
      </div>
      
      <div v-else-if="products.length === 0" class="text-center py-12">
        <p class="text-lg text-gray-600">No products available.</p>
      </div>
      
      <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="product in products" :key="product.id" class="bg-white rounded-lg shadow overflow-hidden">
          <div class="h-48 w-full overflow-hidden">
            <img 
              :src="getImageUrl(product.image)" 
              :alt="product.name"
              class="w-full h-full object-cover"
            >
          </div>
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-900">{{ product.name }}</h3>
            <p class="text-red-600 font-medium">${{ product.price }}</p>
            <p class="text-gray-500 text-sm mt-1 line-clamp-2">{{ product.description || 'No description' }}</p>
            
            <div class="mt-4">
              <router-link :to="`/product/${product.id}`" class="btn btn-primary w-full">
                View Details
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Home',
  data() {
    return {
      products: [],
      loading: true,
      error: null,
      baseUrl: import.meta.env.VITE_API_URL || ''
    };
  },
  created() {
    document.title = 'Welcome to Our Store';
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
    getImageUrl(path) {
      if (!path) return '';
      if (path.startsWith('http')) return path;
      if (path.startsWith('/uploads/')) {
        const base = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
        return `${base}${path}`;
      }
      if (!path.startsWith('/')) {
        return `${this.baseUrl}/uploads/${path}`;
      }
      return `${this.baseUrl}${path}`;
    }
  }
};
</script>

<style scoped>
.btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  font-weight: 500;
  text-align: center;
  border-radius: 0.25rem;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 