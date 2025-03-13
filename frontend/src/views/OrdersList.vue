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
        <h2 class="text-xl font-semibold text-gray-800 mb-6">Orders Management</h2>
        
        <div v-if="loading" class="text-center py-10">
          <p class="text-lg">Loading orders...</p>
        </div>
        
        <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{{ error }}</p>
          <button @click="fetchOrders" class="mt-2 text-blue-600 hover:underline">Try Again</button>
        </div>
        
        <div v-else-if="orders.length === 0" class="bg-white rounded-lg shadow p-6 text-center">
          <p class="text-gray-500">No orders available yet.</p>
        </div>
        
        <div v-else class="bg-white shadow overflow-hidden rounded-lg">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="order in orders" :key="order.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{{ order.id }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{{ order.product_name }}</div>
                    <div class="text-gray-400">${{ order.product_price.toFixed(2) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ order.customer_name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{{ order.phone }}</div>
                    <div class="text-xs text-gray-400 truncate max-w-xs">{{ order.address }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="{
                        'bg-yellow-100 text-yellow-800': order.status === '待处理',
                        'bg-green-100 text-green-800': order.status === '已完成',
                        'bg-blue-100 text-blue-800': order.status === '处理中',
                        'bg-red-100 text-red-800': order.status === '已取消'
                      }"
                    >
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(order.created_at) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <select 
                      v-model="order.status" 
                      @change="updateOrderStatus(order)"
                      class="block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="待处理">待处理</option>
                      <option value="处理中">处理中</option>
                      <option value="已完成">已完成</option>
                      <option value="已取消">已取消</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'OrdersList',
  data() {
    return {
      orders: [],
      loading: true,
      error: null,
      updatingOrder: null
    };
  },
  created() {
    this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get('/api/orders');
        this.orders = response.data;
      } catch (err) {
        console.error('Error fetching orders:', err);
        this.error = 'Failed to load orders. Please try again.';
      } finally {
        this.loading = false;
      }
    },
    async updateOrderStatus(order) {
      if (this.updatingOrder === order.id) return;
      
      this.updatingOrder = order.id;
      
      try {
        await axios.put(`/api/order/${order.id}`, { status: order.status });
      } catch (err) {
        console.error('Error updating order status:', err);
        alert('Failed to update order status. Please try again.');
        // 回滚状态
        this.fetchOrders();
      } finally {
        this.updatingOrder = null;
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString();
    },
    logout() {
      localStorage.removeItem('admin_authenticated');
      this.$router.push('/admin/login');
    }
  }
};
</script> 