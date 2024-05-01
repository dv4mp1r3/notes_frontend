<template>
  <div v-if="isAuthorized">
    <sidebar-menu v-model:collapsed="collapsed" :menu="menu" :link-component-name="'sidebar-menu-link'"
      :show-one-child="true" @update:collapsed="onToggleCollapse" @item-click="onItemClick"
      :style="[{ 'max-height': `${sidebarMaxHeight}px` }]" />
    <div v-if="isOnMobile && !collapsed" class="sidebar-overlay" @click="collapsed = true" />
    <div id="demo" :class="[{ collapsed: collapsed }, { onmobile: isOnMobile }]">
      <div class="demo">
        <div class="container">
          <button @click="onBtnSaveClick" id="btnSave">Сохранить</button>
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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Editor from './components/Editor.vue'
import { h } from 'vue'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
import { Component, Vue, toNative } from 'vue-facing-decorator'
import { library } from '@fortawesome/fontawesome-svg-core'
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
} from '@fortawesome/free-solid-svg-icons'

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

type MenuElement = {
  data: string,
  title: string,
  icon: string,
  idx: number
};

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

  get menu(): Array<Object> {
    const resources = this.$store.getters.getResources;
    const result = [{
      hiddenOnCollapse: true,
    }];
    console.log(resources);
    if (resources === undefined) {
      return result;
    }
    return result.concat(resources.map((el: Resource, idx: number) => <MenuElement><unknown>{
      data: el.data,
      title: el.name,
      icon: faIcon({ icon: 'fa-solid fa-download' }),
      idx: idx
    }));
  }

  get isAuthorized(): boolean {
    return this.$store.getters.isLoggedIn;
  }

  get sidebarMaxHeight(): number {
    return window.innerHeight;
  }


}

const faIcon = (props: any) => {
  return {
    element: h('div', [h(FontAwesomeIcon, { size: 'lg', ...props })]),
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
