<script lang="ts">
import {Vue, Component, Prop} from 'vue-facing-decorator';

@Component({})
export default class CategoryEditor extends Vue {
  @Prop
  minHeight: number = 640;

  onBtnSaveClick() {
    this.$store.dispatch('saveCurrentResource', this.$store.getters.getActiveResource);
  }

  mounted() {
    document.body.classList.add('align-flex-start');
  }

  get name(): string {
    return this.$store.getters.getActiveResourceName;
  }

  set name(n: string) {
    this.$store.dispatch('setCurrentResourceName', n);
  }
}
</script>

<template>
  <div class="editor">
    <div>
      <button @click="onBtnSaveClick" id="btnSave">Сохранить</button>
    </div>
    <div>
      <label>
        <input type="text" v-model="name" />
        Name:
      </label>
    </div>
  </div>
</template>
<style scoped>
.editor {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>