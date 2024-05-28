<template>
  <div v-if="isAuthorized">
    <sidebar-menu v-model:collapsed="collapsed" :menu="menu" :link-component-name="'sidebar-menu-link'"
      :show-one-child="true" @update:collapsed="onToggleCollapse" @item-click="onItemClick"
      :style="[{ 'max-height': `${sidebarMaxHeight}px` }]" />
    <div v-if="isOnMobile && !collapsed" class="sidebar-overlay" @click="collapsed = true" />
    <div id="demo" :class="[{ collapsed: collapsed }, { onmobile: isOnMobile }]">
      <div class="demo">
        <div class="container">
          <editor />
        </div>
      </div>
    </div>
  </div>
  <login-form v-if="!isAuthorized" />

</template>

<script lang="ts">
import SidebarMenuLink from './components/SidebarMenuLink.vue'
import LoginForm from './components/LoginForm.vue'
import Editor from './components/Editor.vue'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
import { Component, Vue, toNative } from 'vue-facing-decorator'
import axios from 'axios'
import Menu, { MenuElement } from './models/data/menu'

axios.defaults.withCredentials = true;

@Component({ components: { SidebarMenuLink, Editor, LoginForm } })
class App extends Vue {
  collapsed = false;
  isOnMobile = false;

  onToggleCollapse(collapsed: boolean) {
    collapsed = collapsed;
    console.log('onToggleCollapse', collapsed)
  }

  onItemClick(event: PointerEvent, item: MenuElement) {

    this.$store.dispatch('setActiveResource', item.idx);
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

  get menu(): Array<Object> {
    const resources = this.$store.getters.getResources;
    const result = Menu.getDefaultMenu();

    if (resources === undefined) {
      return result;
    }
    const tmp = result.concat(
      resources.map(
        (el: Resource, idx: number) => <MenuElement><unknown>Menu.addMenuElementFromResource(el, idx)
      )
    );
    console.log('menu', tmp);
    return tmp;
  }

  get isAuthorized(): boolean {
    return this.$store.getters.isLoggedIn;
  }

  get sidebarMaxHeight(): number {
    return window.innerHeight;
  }

}

export default toNative(App);
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

.align-flex-start {
  align-items: flex-start !important;
}

.align-center {
  align-items: center;
}

.control-item-last {
  margin-bottom: 24px;
}

.vsm--item {
  cursor: pointer;
}
</style>
