<template>
    <div class="editor">
        <textarea>{{ data }}</textarea>
    </div>
</template>

<script lang="ts">
import { Component, Vue, toNative, Prop } from 'vue-facing-decorator'

@Component
class Editor extends Vue {

    @Prop
    data: string = '';

    @Prop
    minHeight: number = 640;

    
}

export default toNative(Editor)
</script>
<style scoped>
.editor {
    height: 100%;
    width: 100%;
}
</style>