<template>
  <div class="min-h-screen bg-gray-100">
    <!-- 管理员头部 -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">Orders Management</h1>
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
          <h2 class="text-xl font-semibold text-gray-800">All Orders</h2>
          <div class="flex space-x-2">
            <button @click="fetchOrders" class="btn btn-primary">
              Refresh
            </button>
          </div>
        </div>
        
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
                  {{ order.product_name }} (${{ order.product_price }})
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{{ order.customer_name }}</div>
                  <div>{{ order.phone }}</div>
                  <div class="truncate max-w-xs">{{ order.address }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(order.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ order.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(order.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <select 
                    v-model="order.status" 
                    @change="updateOrderStatus(order)"
                    class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="待处理">待处理</option>
                    <option value="已确认">已确认</option>
                    <option value="已发货">已发货</option>
                    <option value="已完成">已完成</option>
                    <option value="已取消">已取消</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'OrdersManagement',
  data() {
    return {
      orders: [],
      loading: true,
      error: null
    };
  },
  created() {
    document.title = 'Orders Management';
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
      try {
        await axios.put(`/api/order/${order.id}`, { status: order.status });
      } catch (err) {
        console.error('Error updating order status:', err);
        alert('Failed to update order status. Please try again.');
        // 恢复原状态
        this.fetchOrders();
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString();
    },
    getStatusClass(status) {
      switch (status) {
        case '待处理':
          return 'bg-yellow-100 text-yellow-800';
        case '已确认':
          return 'bg-blue-100 text-blue-800';
        case '已发货':
          return 'bg-purple-100 text-purple-800';
        case '已完成':
          return 'bg-green-100 text-green-800';
        case '已取消':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
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