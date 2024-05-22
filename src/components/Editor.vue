<template>
    <div class="editor">
        <div>
            <button @click="onBtnSaveClick" id="btnSave">Сохранить</button>
        </div>
        <textarea v-model="data"></textarea>
    </div>
</template>

<script lang="ts">
import { Component, Vue, toNative, Prop } from 'vue-facing-decorator'

@Component
class Editor extends Vue {

    @Prop
    minHeight: number = 640;

    get data() : string {
        return this.$store.getters.getActiveResourceData;
    }

    set data(s: string) {
        this.$store.dispatch('setCurrentResourceData', s);
    }

    onBtnSaveClick() {
        this.$store.dispatch('saveResource', this.$store.getters.getActiveResource);  
    }
    
}

export default toNative(Editor)
</script>
<style scoped>
.editor {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
}
</style>