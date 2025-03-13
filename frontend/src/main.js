import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import axios from 'axios'

// 配置 axios 默认值
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '/api'

const app = createApp(App)
app.use(router)
app.mount('#app') 