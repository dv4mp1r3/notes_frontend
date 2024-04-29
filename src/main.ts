import { createApp } from 'vue'
import './style.css'
import * as css from './assets/css/'
import VueSidebarMenu from 'vue-sidebar-menu'
import App from './App.vue'

createApp(App)
.use(VueSidebarMenu)
.mount('#app')
