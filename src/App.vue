<script lang="ts">
import SidebarMenuLink from './components/SidebarMenuLink.vue'
import LoginForm from './components/LoginForm.vue'
import Modal from './components/Modal.vue'
import IconPicker from './components/IconPicker.vue'
import ResourceEditor from './components/ResourceEditor.vue'
import CategoryEditor  from './components/CategoryEditor.vue'
import EncryptionKeyEditor from './components/EncryptionKeyEditor.vue'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
import {Component, Vue} from 'vue-facing-decorator'
import axios from 'axios'
import Menu, {MENU_INDEX_ENCRYPTION_KEY, MENU_INDEX_NEW_ITEM, MenuElement, MenuType} from './models/data/menu'
import {Category} from "./models/data/resource.ts";
import {ResourceIndexes} from "./store.ts";

axios.defaults.withCredentials = true;

const LINK_ACTIVE_CLASS = 'link-active';

@Component({ components: {CategoryEditor, SidebarMenuLink, ResourceEditor, LoginForm, EncryptionKeyEditor, Modal, IconPicker } })
export default class App extends Vue {
  collapsed = false;
  isOnMobile = false;
  showEcryptionKey = false;

  modalX = 0;
  modalY = 0;

  onToggleCollapse(collapsed: boolean) {
    this.collapsed = collapsed;
    console.log('onToggleCollapse', collapsed)
  }

  get isModalVisible(): boolean {
    return this.$store.getters.isIconPickerVisible;
  }

  get showResourceEditor(): boolean {
    return !this.showEcryptionKey && this.$store.getters.isActiveElementResource;
  }

  get showCategoryEditor(): boolean {
    return !this.showEcryptionKey && !this.$store.getters.isActiveElementResource;
  }

  onItemClick(event: PointerEvent, item: MenuElement) {
    console.log('onItemClick called', event, item );
    this.$store.dispatch('setActiveResource',  item);
    //@ts-ignore
    if (this.isIconClick(event)) {
      console.log('onItemClick target->svg', event.x, event.y);
      this.$store.dispatch('setIconPickerVisible', true);
      this.modalX = event.x;
      this.modalY = event.y;
      this.$store.dispatch('setIconPickerIndex', <ResourceIndexes>{resourceId: item.resourceId, categoryId: item.categoryId});
      return;
    }
    if (this.isIconDeleteCkick(event)) {
      this.$store.dispatch(item.type as MenuType === MenuType.CATEGORY ? 'deleteCategory' : 'deleteResource', item.resourceId);
      return;
    }
    this.$store.dispatch('setIconPickerVisible', false);
    if (item.resourceId === MENU_INDEX_NEW_ITEM) {
      this.showEcryptionKey = false;
      this.$store.dispatch(item.type as MenuType === MenuType.CATEGORY ? 'addCategory' : 'addResource');
      setTimeout(() => document.querySelector('ul.vsm--menu li.vsm--item:last-child')?.classList.add(LINK_ACTIVE_CLASS), 100);
      return;
    }
    document.querySelector('.link-active')?.classList.remove(LINK_ACTIVE_CLASS);
    if (item.resourceId === MENU_INDEX_ENCRYPTION_KEY) {
      console.log('onItemClick', item.resourceId);
      this.showEcryptionKey = true;
      return;
    }
    const menuLink = (event.target as Element).closest('li.vsm--item');
    if (menuLink && !menuLink.classList.contains(LINK_ACTIVE_CLASS)) {
      menuLink.classList.add(LINK_ACTIVE_CLASS);
    }
    this.showEcryptionKey = false;
    console.log('onItemClick', item);

  }

  isIconDeleteCkick(event: PointerEvent): boolean {
    //@ts-ignore
    return event.srcElement.className === 'vsm--badge';
  }

  isIconClick(event: PointerEvent): boolean {
    //@ts-ignore
    return event.srcElement.className === 'vsm--icon' || event.srcElement.className instanceof SVGAnimatedString;
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
    const categories = new Array<MenuElement>();
    resources.forEach((el: Category) => categories.push(<MenuElement><unknown>Menu.addCategory(el, el.id)));
    const tmp = result.concat(categories);
    return tmp;
  }

  get isAuthorized(): boolean {
    return this.$store.getters.isLoggedIn;
  }

  get sidebarMaxHeight(): number {
    return window.innerHeight;
  }

}

</script>
<template>
    <div v-if="isAuthorized">
        <sidebar-menu v-model:collapsed="collapsed" :menu="menu" :link-component-name="'sidebar-menu-link'"
            :show-one-child="false" @update:collapsed="onToggleCollapse" @item-click="onItemClick"
            :style="[{ 'max-height': `${sidebarMaxHeight}px` }]" />
        <div v-if="isOnMobile && !collapsed" class="sidebar-overlay" @click="collapsed = true" />
        <div id="demo" :class="[{ collapsed: collapsed }, { onmobile: isOnMobile }]">
            <div class="demo">
                <div class="container">
                    <resource-editor v-if="showResourceEditor" />
                    <category-editor v-if="showCategoryEditor" />
                    <encryption-key-editor v-if="showEcryptionKey" />
                </div>
            </div>
        </div>
        <modal :x="modalX" :y="modalY" :width="196" v-if="isModalVisible">
            <icon-picker />
        </modal>
    </div>
    <login-form v-if="!isAuthorized" />

</template>
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

.link-active {
    background: cadetblue;
}
</style>
