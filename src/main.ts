import { createApp } from 'vue'
import './style.css'
import VueSidebarMenu from 'vue-sidebar-menu'
import Store from './store';
import App from './App.vue'

createApp(App)
.use(VueSidebarMenu)
.use(Store)
.mount('#app')
