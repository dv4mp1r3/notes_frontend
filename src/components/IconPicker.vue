<template>
    <div class="icon-picker">
      <div class="icon-grid">
        <div v-for="icons in rows" class="icons-row">
          <div v-for="icon in icons"
            class="icon-item"
            @click="selectIcon(icon)"
          >
          <i :class="icon.class"></i>
          </div>
          
        </div>
      </div>
    </div>
  </template>
  
<script lang="ts">

import { Component, Vue, toNative } from 'vue-facing-decorator';
  
  interface Icon {
    name: string;
    class: string;
  }

  @Component
  class IconPicker extends Vue {
    rows = [
      [
        { name: 'icon1', class: 'fa fa-star' },
        { name: 'icon2', class: 'fa fa-heart' },
        { name: 'icon3', class: 'fa fa-moon' },
      ],
      [
        { name: 'icon4', class: 'fa fa-sun' },
        { name: 'icon5', class: 'fa fa-cloud' },
        { name: 'icon6', class: 'fa fa-snowflake' },
      ],
      [
        { name: 'icon7', class: 'fa fa-bell' },
        { name: 'icon8', class: 'fa fa-envelope' },
        { name: 'icon9', class: 'fa fa-comments' },
      ],
      [
        { name: 'icon7', class: 'fa fa-bell' },
        { name: 'icon8', class: 'fa fa-envelope' },
        { name: 'icon9', class: 'fa fa-comments' },
      ],
      [
        { name: 'icon7', class: 'fa fa-bell' },
        { name: 'icon8', class: 'fa fa-envelope' },
        { name: 'icon9', class: 'fa fa-comments' },
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
  