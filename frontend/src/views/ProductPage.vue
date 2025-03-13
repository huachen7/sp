<template>
  <div class="max-w-4xl mx-auto p-4">
    <div v-if="loading" class="text-center py-10">
      <p class="text-lg">Loading product information...</p>
    </div>
    
    <div v-else-if="error" class="text-center py-10">
      <p class="text-lg text-red-600">{{ error }}</p>
      <button @click="fetchProduct" class="btn btn-primary mt-4">Try Again</button>
    </div>
    
    <div v-else-if="product" class="bg-white rounded-lg shadow-md overflow-hidden">
      <!-- 商品主图 -->
      <div class="w-full">
        <img 
          :src="getImageUrl(product.image)" 
          :alt="product.name" 
          class="w-full h-auto object-cover"
        >
      </div>
      
      <!-- 商品名称和价格 -->
      <div class="p-6 border-b">
        <h1 class="text-2xl font-bold text-gray-900">{{ product.name }}</h1>
        <p class="text-xl text-red-600 font-semibold mt-2">${{ product.price.toFixed(2) }}</p>
        
        <!-- 商品特点 -->
        <div class="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="flex flex-col items-center text-center p-2 border rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-sm mt-1">Quality Guaranteed</span>
          </div>
          <div class="flex flex-col items-center text-center p-2 border rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span class="text-sm mt-1">Cash on Delivery</span>
          </div>
          <div class="flex flex-col items-center text-center p-2 border rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-sm mt-1">Fast Shipping</span>
          </div>
          <div class="flex flex-col items-center text-center p-2 border rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span class="text-sm mt-1">15-Day Returns</span>
          </div>
        </div>
      </div>
      
      <!-- 商品详情 -->
      <div class="p-6 border-b">
        <h2 class="text-xl font-semibold mb-4">Product Details</h2>
        <div class="text-gray-700 whitespace-pre-line">
          {{ product.description }}
        </div>
        
        <!-- 描述图片 -->
        <div v-if="descriptionImages.length > 0" class="mt-6">
          <h3 class="text-lg font-semibold mb-3">Product Gallery</h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div 
              v-for="(image, index) in descriptionImages" 
              :key="index"
              class="h-40 border border-gray-200 rounded-md overflow-hidden cursor-pointer"
              @click="openImageModal(image)"
            >
              <img 
                :src="getImageUrl(image)" 
                :alt="`${product.name} image ${index + 1}`" 
                class="w-full h-full object-cover"
              >
            </div>
          </div>
        </div>
      </div>
      
      <!-- 最近订单 -->
      <div class="p-6 border-b bg-gray-50">
        <h2 class="text-lg font-semibold mb-3">Recent Orders</h2>
        <div class="space-y-2">
          <div v-for="i in 3" :key="i" class="flex items-center text-sm text-gray-600">
            <span class="inline-block w-20 text-gray-500">{{ ['Beijing', 'Shanghai', 'Guangzhou'][i-1] }}</span>
            <span class="inline-block w-16 text-gray-500">{{ ['Li', 'Wang', 'Zhang'][i-1] }}</span>
            <span class="text-blue-600">Just ordered this product</span>
          </div>
        </div>
      </div>
      
      <!-- 订单表单 -->
      <div class="p-6">
        <h2 class="text-xl font-semibold mb-4 text-center">Place Your Order Now</h2>
        
        <div v-if="orderSuccess" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p class="font-bold">Order Submitted Successfully!</p>
          <p>Thank you for your order. We will contact you shortly.</p>
        </div>
        
        <form v-else @submit.prevent="submitOrder" class="space-y-4 max-w-md mx-auto">
          <div>
            <label for="name" class="form-label">Full Name</label>
            <input 
              type="text" 
              id="name" 
              v-model="orderForm.customer_name" 
              required
              class="form-input"
              placeholder="Enter your full name"
            >
          </div>
          
          <div>
            <label for="phone" class="form-label">Phone Number</label>
            <input 
              type="tel" 
              id="phone" 
              v-model="orderForm.phone" 
              required
              class="form-input"
              placeholder="Enter your phone number"
            >
          </div>
          
          <div>
            <label for="address" class="form-label">Delivery Address</label>
            <textarea 
              id="address" 
              v-model="orderForm.address" 
              required
              rows="3"
              class="form-input"
              placeholder="Enter your complete delivery address"
            ></textarea>
          </div>
          
          <div class="pt-2">
            <button 
              type="submit" 
              class="btn btn-primary w-full py-3 text-lg"
              :disabled="submitting"
            >
              {{ submitting ? 'Processing...' : 'Place Order Now' }}
            </button>
          </div>
          
          <p class="text-center text-sm text-gray-500 mt-2">
            Cash on delivery - Pay when you receive the product
          </p>
        </form>
      </div>
    </div>
    
    <div v-else class="text-center py-10">
      <p class="text-lg text-red-600">Product not found</p>
    </div>
    
    <!-- Image Modal -->
    <div v-if="showImageModal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" @click="showImageModal = false">
      <div class="max-w-4xl max-h-screen p-4">
        <img 
          :src="getImageUrl(selectedImage)" 
          :alt="product.name" 
          class="max-w-full max-h-[90vh] object-contain"
        >
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ProductPage',
  data() {
    return {
      product: null,
      loading: true,
      error: null,
      baseUrl: import.meta.env.VITE_API_URL || '',
      orderForm: {
        customer_name: '',
        phone: '',
        address: ''
      },
      submitting: false,
      orderSuccess: false,
      showImageModal: false,
      selectedImage: null
    };
  },
  computed: {
    descriptionImages() {
      if (!this.product || !this.product.description_images) return [];
      try {
        return typeof this.product.description_images === 'string' 
          ? JSON.parse(this.product.description_images) 
          : this.product.description_images;
      } catch (e) {
        console.error('Error parsing description images:', e);
        return [];
      }
    }
  },
  created() {
    this.fetchProduct();
  },
  methods: {
    async fetchProduct() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get(`/api/product/${this.$route.params.id}`);
        this.product = response.data;
      } catch (err) {
        console.error('Error fetching product:', err);
        this.error = 'Failed to load product information. Please try again.';
      } finally {
        this.loading = false;
      }
    },
    async submitOrder() {
      if (this.submitting) return;
      
      this.submitting = true;
      
      try {
        await axios.post(`/api/order/${this.product.id}`, this.orderForm);
        this.orderSuccess = true;
        this.resetForm();
      } catch (err) {
        console.error('Error submitting order:', err);
        alert('Failed to submit your order. Please try again.');
      } finally {
        this.submitting = false;
      }
    },
    resetForm() {
      this.orderForm = {
        customer_name: '',
        phone: '',
        address: ''
      };
    },
    openImageModal(image) {
      this.selectedImage = image;
      this.showImageModal = true;
    },
    getImageUrl(path) {
      if (!path) return 'https://via.placeholder.com/800x500?text=No+Image';
      
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
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.form-input {
  @apply block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500;
}

.btn {
  @apply inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500;
}
</style> 