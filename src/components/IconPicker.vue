<template>
    <div class="icon-picker">
      <div class="icon-grid">
        <div v-for="icons in rows" class="icons-row">
          <font-awesome-icon v-for="icon in icons" 
          class="icon-item"  
          @click="selectIcon(icon)" 
          :icon="`fa-solid ${icon.class}`" />
        </div>
      </div>
    </div>
  </template>
  
<script lang="ts">

import { Component, Vue, toNative } from 'vue-facing-decorator';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faUserSecret,
  faStar,
  faHeart,
  faMoon,
  faSun,
  faCloud,
  faSnowflake,
  faBell,
  faEnvelope,
  faComments,
  faTemperatureEmpty, 
} from '@fortawesome/free-solid-svg-icons'
  
library.add(
  faUserSecret,
  faStar,
  faHeart,
  faMoon,
  faSun,
  faCloud,
  faSnowflake,
  faBell,
  faEnvelope,
  faComments, 
);

  interface Icon {
    name: string;
    class: string;
  }

  @Component({components: {FontAwesomeIcon}})
  class IconPicker extends Vue {
    rows = [
      [
        { name: 'icon1', class: 'fa-star' },
        { name: 'icon2', class: 'fa-heart' },
        { name: 'icon3', class: 'fa-moon' },
      ],
      [
        { name: 'icon4', class: 'fa-sun' },
        { name: 'icon5', class: 'fa-cloud' },
        { name: 'icon6', class: 'fa-snowflake' },
      ],
      [
        { name: 'icon7', class: 'fa-bell' },
        { name: 'icon8', class: 'fa-envelope' },
        { name: 'icon9', class: 'fa-comments' },
      ],
      [
        { name: 'icon7', class: 'fa-bell' },
        { name: 'icon8', class: 'fa-envelope' },
        { name: 'icon9', class: 'fa-comments' },
      ],
      [
        { name: 'icon7', class: 'fa-bell' },
        { name: 'icon8', class: 'fa-envelope' },
        { name: 'icon9', class: 'fa-comments' },
      ]
    ];

    selectIcon(icon: Icon) {
      console.log('selectIcon', icon);
        this.$emit('select', icon);
    }
  }
export default toNative(IconPicker);
</script>
  
<style scoped>
.icon-picker {
max-height: 111px;
overflow-y: auto;
}

.icon-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-content: center;
  max-height: 220px;
}

.icon-item {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

.icons-row {
  display: flex;
}

.icon-item:hover {
background-color: #f0f0f0;
}

.icon-item i {
font-size: 24px; /* Adjust the icon size as needed */
}
</style>
  