import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
//整体导入element
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//导入路由
import router from "./router"
//导入axios
import axios from "axios"
//导入pinia
import { createPinia } from 'pinia'
//从 pinia-plugin-persistedstate 模块中导入 piniaPluginPersistedstate
import piniaPluginpersistedstate from 'pinia-plugin-persistedstate'

//默认请求端口
axios.defaults.baseURL = 'http://localhost:8081'



const app= createApp(App)
const pinia=createPinia()


//将插件添加到 pinia 实例上
pinia.use(piniaPluginpersistedstate)

app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
