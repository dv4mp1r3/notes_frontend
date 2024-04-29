<template>
  <div v-if="isAuthorized">
    <sidebar-menu
  v-model:collapsed="collapsed"
  :menu="menu"
  :link-component-name="'sidebar-menu-link'"
  :show-one-child="true"
  @update:collapsed="onToggleCollapse"
  @item-click="onItemClick"
  :style="[{'max-height': `${sidebarMaxHeight}px`}]"
/>
<div
  v-if="isOnMobile && !collapsed"
  class="sidebar-overlay"
  @click="collapsed = true"
/>
<div id="demo" :class="[{ collapsed: collapsed }, { onmobile: isOnMobile }]">
  <div class="demo">
    <div class="container">
      <button @click="onBtnSaveClick" id="btnSave">Сохранить</button>
      <editor :data="'kjdfgj'"/>
    </div>
  </div>
</div>
  </div>
  <div v-if="!isAuthorized" class="login-form">
    <input class="login-form-element" type="text" placeholder="login" v-model="login"/>
    <input class="login-form-element" type="text" placeholder="password" v-model="password"/>
    <button class="login-form-element" @click="onBtnLoginClick">Login</button>
    <p class="login-form-element" v-if="loginError">Login error</p>
  </div>
  

  
</template>

<script lang="ts">
import SidebarMenuLink from './components/SidebarMenuLink.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Editor from './components/Editor.vue'
import {h} from 'vue'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
import { Component, Vue, toNative } from 'vue-facing-decorator'
import { library } from '@fortawesome/fontawesome-svg-core'
import Auth from './models/auth'
import axios from 'axios'

axios.defaults.withCredentials = true;

import {
  faDownload,
  faCode,
  faCogs,
  faBell,
  faPalette,
  faCubes,
  faLock,
  faCog,
  faListUl,
  faFileAlt,
  faListAlt,
  faBullseye,
} from '@fortawesome/free-solid-svg-icons'
import { height } from '@fortawesome/free-solid-svg-icons/fa0'

library.add(
  faDownload,
  faCode,
  faCogs,
  faBell,
  faPalette,
  faCubes,
  faLock,
  faCog,
  faListUl,
  faFileAlt,
  faListAlt
)

@Component({components: {SidebarMenuLink, Editor}})
class App extends Vue {
  collapsed = false;
  isOnMobile = false;

  auth = new Auth();

  login: string|undefined;
  password: string|undefined;
  loginError = false;

  menu = [
    {
      hiddenOnCollapse: true,
    },
    {
      title: 'Installation',
      customId: '34',
      icon: faIcon({ icon: 'fa-solid fa-download' }),
      data: 'test1'
    },
    {
      title: 'Basic Usage',
      customId: '12',
      data: 'test2'
    },
  ];

  onToggleCollapse(collapsed: boolean) {
    collapsed = collapsed;
      console.log('onToggleCollapse', collapsed)
  }

  onItemClick(event: any, item: any) {
      console.log('onItemClick', event, item)
  }

  onBtnSaveClick() {
    console.log('onBtnSaveClick');
  }

  onResize() {
    if (window.innerWidth <= 767) {
      this.isOnMobile = true
      this.collapsed = true
    } else {
      this.isOnMobile = false
      this.collapsed = false
    }
  }

  get isAuthorized() : boolean {
    return this.auth.isAuthorized();
  }

  get sidebarMaxHeight(): number {
    return window.innerHeight;
  }

  async onBtnLoginClick() {
    const authenticated = await this.auth.authenticate(this.login as string, this.password as string);
    if (!authenticated) {
      this.loginError = true;
    } else {
      axios.get("http://localhost:8080/resources").then(response => console.log(response.data));
    }

    console.log('onBtnLoginClick');
  }
}

const faIcon = (props: any) => {
  return {
    element: h('div', [h(FontAwesomeIcon, { size: 'lg', ...props })]),
  }
}

export default toNative(App)
</script>



<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600');

body,
html {
  margin: 0;
  height: 100%;

}

body {
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 18px;
  background-color: #f2f4f7;
  color: #262626;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

#btnSave {
  margin-bottom: 8px;
}

#demo {
  padding-left: 290px;
  transition: 0.3s ease;
}
#demo.collapsed {
  padding-left: 65px;
}
#demo.onmobile {
  padding-left: 65px;
}

.login-form {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
}

.login-form-element {
  margin-top: 8px;
}

.sidebar-overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: #000;
  opacity: 0.5;
  z-index: 900;
}

.demo {
  width: 100%;
  height: 100%;
}

.container {
  max-width: 900px;
}

</style>
