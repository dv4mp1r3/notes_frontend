<template>
    <div @click="modalWrapperClick" className="modal__wrapper">
        <div className="modal" :style="{'top': `${y}px`, 'left': `${x}px`}">
            <slot/>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, toNative } from 'vue-facing-decorator'

@Component
class Modal extends Vue {
    @Prop
    x = 0;

    @Prop
    y = 0;

    modalWrapperClick() {
        console.log('modalWrapperClick', this.x, this.y);
        this.$store.dispatch('setIconPickerVisible', false);
    }
}
export default toNative(Modal);
</script>
<style lang="scss" scoped>
.modal{
    width: 300px;
    height: 100px;
    border-radius: 10px;
    background-color: white;
    padding: 20px 20px;
    z-index: 1200;
    position: absolute;
    
    &__wrapper{
    background-color: rgba(0,0,0,0.4);
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    position: absolute;
    top: 0;
    left: 0;
    }
}

</style>