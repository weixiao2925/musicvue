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

//默认请求端口
axios.defaults.baseURL = 'http://localhost:8081'



const app= createApp(App)



app.use(router)
app.use(ElementPlus)
app.mount('#app')
