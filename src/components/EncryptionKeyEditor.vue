<template>
    <div class="editor">
        <textarea v-model="data"></textarea>
    </div>
</template>

<script lang="ts">
import { Component, Vue, toNative, Prop } from 'vue-facing-decorator'

@Component
class EncryptionKeyEditor extends Vue {

    @Prop
    minHeight: number = 640;

    @Prop({required: false, default: true})
    alignFlexStart? :boolean;

    get data() : string {
        return this.$store.getters.getEncryptionKey;
    }

    set data(s: string) {
        this.$store.dispatch('setEncryptionKey', s);
    }

    mounted() {
        if (this.alignFlexStart) {
            document.body.classList.add('align-flex-start');
        }
    }
    
}

export default toNative(EncryptionKeyEditor)
</script>
<style scoped>
.editor {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
}
</style>