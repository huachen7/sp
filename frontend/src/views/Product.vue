<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Product information -->
      <div v-if="product" class="bg-white rounded-lg shadow-lg overflow-hidden">
        <!-- Main image -->
        <div class="product-image-container">
          <img 
            :src="getImageUrl(product.image)" 
            :alt="product.name"
            class="product-image"
          >
          <!-- Promotion tag -->
          <div class="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
            HOT SALE
          </div>
        </div>
        
        <!-- Product info -->
        <div class="p-6">
          <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ product.name }}</h1>
          
          <!-- Price area -->
          <div class="flex items-end mb-6">
            <p class="text-3xl font-semibold text-red-600">${{ product.price }}</p>
            <p class="ml-2 text-lg line-through text-gray-400">${{ (product.price * 1.2).toFixed(2) }}</p>
            <p class="ml-2 bg-red-100 text-red-800 px-2 py-1 rounded text-sm">LIMITED OFFER</p>
          </div>
          
          <!-- Improved Countdown timer -->
          <div class="mb-6 relative overflow-hidden">
            <div class="bg-gradient-to-r from-red-500 to-orange-500 rounded-lg p-5 text-white shadow-lg">
              <div class="flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                </svg>
                <span class="font-bold text-lg">Flash Sale Ends In:</span>
              </div>
              <div class="flex justify-between">
                <div class="text-center w-1/3">
                  <div class="bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-lg p-2">
                    <div class="text-3xl font-bold">{{ countdown.hours }}</div>
                    <div class="text-xs uppercase tracking-wider mt-1">Hours</div>
                  </div>
                </div>
                <div class="text-center w-1/3 mx-2">
                  <div class="bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-lg p-2">
                    <div class="text-3xl font-bold">{{ countdown.minutes }}</div>
                    <div class="text-xs uppercase tracking-wider mt-1">Minutes</div>
                  </div>
                </div>
                <div class="text-center w-1/3">
                  <div class="bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-lg p-2">
                    <div class="text-3xl font-bold">{{ countdown.seconds }}</div>
                    <div class="text-xs uppercase tracking-wider mt-1">Seconds</div>
                  </div>
                </div>
              </div>
              <!-- Decorative elements -->
              <div class="absolute -top-6 -right-6 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>
              <div class="absolute -bottom-8 -left-8 w-24 h-24 bg-white bg-opacity-10 rounded-full"></div>
            </div>
          </div>
          
          <!-- Product features -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="flex items-center bg-blue-50 p-3 rounded-lg">
              <div class="bg-blue-100 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900">Quality Guaranteed</div>
                <div class="text-xs text-gray-500">100% Authentic Products</div>
              </div>
            </div>
            <div class="flex items-center bg-green-50 p-3 rounded-lg">
              <div class="bg-green-100 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900">Cash on Delivery</div>
                <div class="text-xs text-gray-500">Pay After Inspection</div>
              </div>
            </div>
            <div class="flex items-center bg-purple-50 p-3 rounded-lg">
              <div class="bg-purple-100 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900">Fast Shipping</div>
                <div class="text-xs text-gray-500">Delivery Within 24h</div>
              </div>
            </div>
            <div class="flex items-center bg-red-50 p-3 rounded-lg">
              <div class="bg-red-100 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                </svg>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900">15-Day Returns</div>
                <div class="text-xs text-gray-500">No Questions Asked</div>
              </div>
            </div>
          </div>
          
          <!-- Recent purchases -->
          <div class="mb-6 bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Recent Purchases</h3>
            <div class="space-y-3">
              <div v-for="(buyer, index) in recentBuyers" :key="index" class="flex items-center">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  {{ buyer.name.charAt(0) }}
                </div>
                <div class="ml-3">
                  <div class="text-sm font-medium text-gray-900">{{ buyer.name }} purchased this item</div>
                  <div class="text-xs text-gray-500">{{ buyer.time }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="mb-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-2">Product Details</h2>
            <p class="text-gray-700 whitespace-pre-wrap">{{ product.description }}</p>
          </div>
          
          <!-- Description images -->
          <div v-if="descriptionImages.length > 0" class="mb-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Product Gallery</h2>
            <div class="space-y-6">
              <div 
                v-for="(image, index) in descriptionImages" 
                :key="index"
                class="product-image-container"
              >
                <img 
                  :src="getImageUrl(image)" 
                  :alt="`${product.name} - Image ${index + 1}`"
                  class="product-image"
                >
              </div>
            </div>
          </div>
          
          <!-- Order form -->
          <div id="order-form" ref="orderForm" class="mt-8 border-t pt-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Place Your Order</h2>
            
            <!-- Product Attributes Selection (NEW) -->
            <div v-if="product.attributes && product.attributes.length > 0" class="mb-6">
              <div v-for="(attribute, index) in product.attributes" :key="index" class="mb-4">
                <label :for="`attr_${index}`" class="block text-sm font-medium text-gray-700 mb-2">
                  {{ attribute.name }}
                </label>
                <select 
                  :id="`attr_${index}`" 
                  v-model="selectedAttributes[attribute.name]"
                  class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  @change="updateAvailableStock"
                >
                  <option value="" disabled>Select {{ attribute.name }}</option>
                  <option v-for="value in attribute.values" :key="value" :value="value">
                    {{ value }}
                  </option>
                </select>
              </div>
            </div>
            
            <!-- Quantity Selection (NEW) -->
            <div class="mb-6">
              <label for="quantity" class="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div class="flex items-center">
                <button 
                  type="button" 
                  @click="decrementQuantity" 
                  class="px-3 py-1 border border-gray-300 rounded-l-md bg-gray-100 text-gray-600 hover:bg-gray-200"
                  :disabled="quantity <= 1"
                >
                  -
                </button>
                <input 
                  type="number" 
                  id="quantity" 
                  v-model.number="quantity" 
                  min="1" 
                  :max="availableStock"
                  class="w-16 text-center border-t border-b border-gray-300 py-1 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                <button 
                  type="button" 
                  @click="incrementQuantity" 
                  class="px-3 py-1 border border-gray-300 rounded-r-md bg-gray-100 text-gray-600 hover:bg-gray-200"
                  :disabled="quantity >= availableStock"
                >
                  +
                </button>
                <span class="ml-3 text-sm text-gray-500" v-if="availableStock > 0">
                  {{ availableStock }} available
                </span>
                <span class="ml-3 text-sm text-red-500" v-else>
                  Out of stock
                </span>
              </div>
            </div>
            
            <!-- Inventory and sales info -->
            <div class="flex justify-between text-sm text-gray-500 mb-4">
              <span>In Stock: Only {{ stock }} left</span>
              <span>Sold: {{ soldCount }} units</span>
            </div>
            
            <form @submit.prevent="submitOrder" class="space-y-4">
              <div>
                <label for="customer_name" class="block text-sm font-medium text-gray-700">Your Name</label>
                <input 
                  type="text" 
                  id="customer_name" 
                  v-model="form.customer_name" 
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
              </div>
              
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  v-model="form.phone" 
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
              </div>
              
              <div>
                <label for="address" class="block text-sm font-medium text-gray-700">Shipping Address</label>
                <textarea 
                  id="address" 
                  v-model="form.address" 
                  required
                  rows="3"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              
              <div>
                <button 
                  type="submit" 
                  class="w-full bg-red-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 animate-pulse"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  Order Now ({{ todayOrders }} orders today)
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <!-- Loading state -->
      <div v-else-if="loading" class="text-center py-12">
        <p class="text-lg text-gray-600">Loading product information...</p>
      </div>
      
      <!-- Error state -->
      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{{ error }}</p>
        <button @click="fetchProduct" class="mt-2 text-blue-600 hover:underline">Try Again</button>
      </div>
    </div>
    
    <!-- Fixed Buy Now button -->
    <div 
      v-if="showBuyNowButton" 
      class="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 z-50 transition-all duration-300"
      :class="{'translate-y-0': showBuyNowButton, 'translate-y-full': !showBuyNowButton}"
    >
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <div>
          <p class="font-bold text-gray-900">{{ product ? product.name : 'Product' }}</p>
          <p class="text-red-600 font-semibold">${{ product ? product.price : '0.00' }}</p>
        </div>
        <button 
          @click="scrollToOrderForm" 
          class="bg-red-600 text-white px-6 py-3 rounded-md font-bold shadow-md hover:bg-red-700 transition-colors duration-200 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
          </svg>
          BUY NOW
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Product',
  data() {
    return {
      product: null,
      loading: true,
      error: null,
      descriptionImages: [],
      baseUrl: import.meta.env.VITE_API_URL || '',
      form: {
        customer_name: '',
        phone: '',
        address: ''
      },
      countdown: {
        hours: Math.floor(Math.random() * 5) + 1,
        minutes: Math.floor(Math.random() * 60),
        seconds: Math.floor(Math.random() * 60)
      },
      countdownInterval: null,
      stock: Math.floor(Math.random() * 15) + 5, // Random stock between 5-20
      soldCount: Math.floor(Math.random() * 100) + 50, // Random sold count between 50-150
      todayOrders: Math.floor(Math.random() * 30) + 10, // Random today's orders between 10-40
      recentBuyers: [
        { name: "John D.", time: "10 minutes ago" },
        { name: "Sarah M.", time: "25 minutes ago" },
        { name: "Robert K.", time: "40 minutes ago" },
        { name: "Emily W.", time: "1 hour ago" },
        { name: "Michael B.", time: "1.5 hours ago" },
        { name: "Jessica T.", time: "2 hours ago" },
        { name: "David L.", time: "3 hours ago" },
        { name: "Amanda S.", time: "4 hours ago" },
        { name: "Thomas R.", time: "5 hours ago" },
        { name: "Jennifer P.", time: "6 hours ago" },
        { name: "Christopher J.", time: "7 hours ago" },
        { name: "Elizabeth H.", time: "8 hours ago" },
        { name: "Daniel G.", time: "9 hours ago" },
        { name: "Melissa F.", time: "10 hours ago" },
        { name: "Matthew E.", time: "11 hours ago" },
        { name: "Laura D.", time: "12 hours ago" },
        { name: "James C.", time: "yesterday" },
        { name: "Nicole B.", time: "yesterday" },
        { name: "Andrew A.", time: "yesterday" },
        { name: "Stephanie Z.", time: "yesterday" }
      ],
      showBuyNowButton: true,
      scrollListener: null,
      selectedAttributes: {},
      quantity: 1,
      availableStock: 0
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
    // Shuffle and take only first 5-8 buyers randomly
    this.shuffleRecentBuyers();
    
    this.fetchProduct();
    this.startCountdown();
    
    // Add scroll event listener
    this.scrollListener = this.handleScroll;
    window.addEventListener('scroll', this.scrollListener);
  },
  mounted() {
    this.handleScroll();
  },
  beforeUnmount() {
    // Clear countdown interval
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    // Remove scroll event listener
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  },
  methods: {
    shuffleRecentBuyers() {
      // Fisher-Yates shuffle algorithm
      for (let i = this.recentBuyers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.recentBuyers[i], this.recentBuyers[j]] = [this.recentBuyers[j], this.recentBuyers[i]];
      }
      
      // Take only 3 buyers
      this.recentBuyers = this.recentBuyers.slice(0, 3);
      
      // Randomize times a bit more
      const timeUnits = ['minutes', 'hours'];
      const timeAgo = ['just now', 'a few moments ago', 'recently'];
      
      // Make first buyer very recent
      this.recentBuyers[0].time = timeAgo[Math.floor(Math.random() * timeAgo.length)];
      
      // Randomize other times
      for (let i = 1; i < this.recentBuyers.length; i++) {
        const unit = timeUnits[Math.floor(Math.random() * timeUnits.length)];
        let value;
        
        if (unit === 'minutes') {
          value = Math.floor(Math.random() * 55) + 5; // 5-60 minutes
        } else {
          value = Math.floor(Math.random() * 12) + 1; // 1-12 hours
        }
        
        this.recentBuyers[i].time = `${value} ${unit} ago`;
      }
    },
    async fetchProduct() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get(`/api/product/${this.$route.params.id}`);
        this.product = response.data;
        
        console.log('Product data:', this.product);
        
        // Set page title
        document.title = this.product.name;
        
        // Extract description images
        if (this.product.description_images && Array.isArray(this.product.description_images)) {
          this.descriptionImages = this.product.description_images;
        }
        
        // Initialize selected attributes and available stock
        if (this.product.attributes && Array.isArray(this.product.attributes) && this.product.attributes.length > 0) {
          console.log('Product has attributes:', this.product.attributes);
          
          this.product.attributes.forEach(attr => {
            if (attr.values && attr.values.length > 0) {
              this.selectedAttributes[attr.name] = attr.values[0];
            }
          });
          
          console.log('Selected attributes:', this.selectedAttributes);
          this.updateAvailableStock();
        } else {
          console.log('No attributes found, using default stock');
          this.availableStock = this.stock;
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        this.error = 'Failed to load product information. Please try again.';
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
    },
    async submitOrder() {
      try {
        // Add selected attributes and quantity to the order
        const orderData = {
          ...this.form,
          quantity: this.quantity,
          attributes: this.selectedAttributes
        };
        
        const response = await axios.post(`/api/order/${this.product.id}`, orderData);
        alert('Order submitted successfully! We will ship your item soon.');
        this.form = {
          customer_name: '',
          phone: '',
          address: ''
        };
        
        // Update stock and sales
        this.stock -= this.quantity;
        this.soldCount += this.quantity;
        this.todayOrders += 1;
        
        // Update available stock
        this.availableStock -= this.quantity;
        this.quantity = 1;
        
        // Add to recent purchases
        this.recentBuyers.unshift({
          name: orderData.customer_name,
          time: 'just now'
        });
        
        // Keep only 3 recent buyers
        if (this.recentBuyers.length > 3) {
          this.recentBuyers = this.recentBuyers.slice(0, 3);
        }
      } catch (err) {
        console.error('Error placing order:', err);
        alert('Failed to submit order. Please try again.');
      }
    },
    startCountdown() {
      this.countdownInterval = setInterval(() => {
        if (this.countdown.seconds > 0) {
          this.countdown.seconds--;
        } else {
          if (this.countdown.minutes > 0) {
            this.countdown.minutes--;
            this.countdown.seconds = 59;
          } else {
            if (this.countdown.hours > 0) {
              this.countdown.hours--;
              this.countdown.minutes = 59;
              this.countdown.seconds = 59;
            } else {
              // Countdown ended, reset to a new random time
              this.countdown.hours = Math.floor(Math.random() * 5) + 1;
              this.countdown.minutes = Math.floor(Math.random() * 60);
              this.countdown.seconds = Math.floor(Math.random() * 60);
            }
          }
        }
      }, 1000);
    },
    scrollToOrderForm() {
      const orderForm = this.$refs.orderForm;
      if (orderForm) {
        orderForm.scrollIntoView({ behavior: 'smooth' });
      }
    },
    handleScroll() {
      if (!this.$refs.orderForm) return;
      
      const orderFormPosition = this.$refs.orderForm.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      // Hide button when order form is visible (300px before it comes into view)
      this.showBuyNowButton = orderFormPosition > windowHeight - 300;
    },
    updateAvailableStock() {
      console.log('Updating available stock');
      console.log('Product inventory:', this.product.inventory);
      
      if (!this.product.inventory || this.product.inventory.length === 0) {
        console.log('No inventory data, using default stock:', this.stock);
        this.availableStock = this.stock;
        return;
      }
      
      // Check if all attributes are selected
      const allSelected = this.product.attributes.every(attr => 
        this.selectedAttributes[attr.name] !== undefined && 
        this.selectedAttributes[attr.name] !== ''
      );
      
      console.log('All attributes selected:', allSelected);
      
      if (!allSelected) {
        this.availableStock = 0;
        return;
      }
      
      // Find matching inventory item
      const selectedValues = this.product.attributes.map(attr => this.selectedAttributes[attr.name]);
      console.log('Selected values:', selectedValues);
      
      const inventoryItem = this.product.inventory.find(item => 
        JSON.stringify(item.attributes) === JSON.stringify(selectedValues)
      );
      
      console.log('Matching inventory item:', inventoryItem);
      
      this.availableStock = inventoryItem ? inventoryItem.stock : 0;
      console.log('Available stock set to:', this.availableStock);
      
      // Adjust quantity if needed
      if (this.quantity > this.availableStock) {
        this.quantity = Math.max(1, this.availableStock);
      }
    },
    incrementQuantity() {
      if (this.quantity < this.availableStock) {
        this.quantity++;
      }
    },
    decrementQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    }
  }
};
</script>

<style scoped>
.product-image-container {
  width: 100%;
  height: auto;
  min-height: 300px;
  max-height: 500px;
  background-color: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  border-radius: 0.375rem;
  overflow: hidden;
  position: relative;
}

.product-image {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
}

@media (max-width: 640px) {
  .product-image-container {
    min-height: 250px;
    max-height: 400px;
  }
  
  h1 {
    font-size: 1.5rem;
  }
  
  h2 {
    font-size: 1.25rem;
  }
  
  .countdown-container {
    flex-direction: column;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.duration-300 {
  transition-duration: 300ms;
}

/* Gradient animation for countdown */
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradient 5s ease infinite;
}
</style> 