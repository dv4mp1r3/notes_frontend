<template>
    <div class="editor">
        <textarea v-model="data"></textarea>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-facing-decorator'

@Component
export default class EncryptionKeyEditor extends Vue {

    @Prop
    minHeight: number = 640;

    @Prop({ required: false, default: true })
    alignFlexStart?: boolean;

    get data(): string {
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

</script>
<style scoped>
.editor {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
}
</style>