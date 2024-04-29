<template>
    <div class="counter">
      <button @click="decrement()">-</button>
      <span>{{ count }}</span>
      <button @click="increment()">+</button>
    </div>
</template>
  
<script lang="ts">
import { Component, Vue, toNative } from 'vue-facing-decorator'

@Component
class Counter extends Vue {
    count = 0;

    increment() {
        this.count++;
    }

    decrement() {
        this.count--;
    }
};

export default toNative(Counter)
</script>
  
<style scoped>
.counter {
display: flex;
justify-content: center;
align-items: center;
}

.counter button {
padding: 8px 16px;
font-size: 16px;
border: none;
background-color: #007bff;
color: #fff;
cursor: pointer;
}

.counter button:hover {
background-color: #0056b3;
}

.counter span {
margin: 0 10px;
font-size: 18px;
}
</style>