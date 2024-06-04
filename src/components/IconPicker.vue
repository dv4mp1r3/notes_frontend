<template>
    <div class="icon-picker">
      <div class="icon-grid">
        <div
          v-for="icon in icons"
          :key="icon.name"
          class="icon-item"
          @click="selectIcon(icon)"
        >
          <i :class="icon.class"></i>
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
    icons = [
          { name: 'icon1', class: 'fa fa-star' },
          { name: 'icon2', class: 'fa fa-heart' },
          { name: 'icon3', class: 'fa fa-moon' },
          { name: 'icon4', class: 'fa fa-sun' },
          { name: 'icon5', class: 'fa fa-cloud' },
          { name: 'icon6', class: 'fa fa-snowflake' },
          { name: 'icon7', class: 'fa fa-bell' },
          { name: 'icon8', class: 'fa fa-envelope' },
          { name: 'icon9', class: 'fa fa-comments' },
          // Add more icons as needed
        ] as Icon[];

    selectIcon(icon: Icon) {
        this.$emit('select', icon);
    }
  }
export default toNative(IconPicker);
</script>
  
<style scoped>
.icon-picker {
max-height: 200px; /* Adjust the height as needed */
overflow-y: auto;
}

.icon-grid {
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 10px; /* Adjust the gap as needed */
}

.icon-item {
display: flex;
justify-content: center;
align-items: center;
padding: 10px;
border: 1px solid #ccc;
border-radius: 4px;
cursor: pointer;
transition: background-color 0.2s;
}

.icon-item:hover {
background-color: #f0f0f0;
}

.icon-item i {
font-size: 24px; /* Adjust the icon size as needed */
}
</style>
  