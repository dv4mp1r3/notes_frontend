<template>
    <div class="editor">
        <div>
            <button @click="onBtnSaveClick" id="btnSave">Сохранить</button>
        </div>
        <div>
            <label>Name:</label>
            <input type="text" v-model="name"/>
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

    get name(): string {
        return this.$store.getters.getActiveResourceName;
    }

    set name(n: string) {
        this.$store.dispatch('setCurrentResourceName', n);
    }

    onBtnSaveClick() {
        this.$store.dispatch('saveCurrentResource', this.$store.getters.getActiveResource);  
    }

    mounted() {
        document.body.classList.add('align-flex-start');
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