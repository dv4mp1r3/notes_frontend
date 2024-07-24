import { createApp } from 'vue'
import './style.css'
import VueSidebarMenu from 'vue-sidebar-menu'
import appStore, { State } from './store';
import App from './App.vue'

//@ts-ignore
import { ComponentCustomProperties } from "vue";
//@ts-ignore
import { Store } from "vuex";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}

createApp(App)
//@ts-ignore
.use(VueSidebarMenu)
.use(appStore)
.mount('#app')
