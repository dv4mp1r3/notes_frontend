<template>
    <div class="random">
        <p>12345</p>
        <p>{{ randomString() }}</p>
    </div>
</template>

<script setup lang="ts">
defineProps<{ maxLen: number }>()


import Random from "../models/random";

const rnd = new Random();

function randomString(): string { return rnd.string(this.maxLen); }

</script>
