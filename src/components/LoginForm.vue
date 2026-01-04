<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator'
import ApiClient from '../models/apiClient';
import EncryptionKeyEditor from './EncryptionKeyEditor.vue';

@Component({ components: { EncryptionKeyEditor } })
export default class LoginForm extends Vue {

  login: string | undefined;
  password: string | undefined;
  loginError = false;

  async tryLogin() {
    const client = new ApiClient();
    const authenticated = await client.login(this.login as string, this.password as string);
    if (!authenticated) {
      this.loginError = true;
    } else {
      await this.$store.dispatch('updateUser', {username: this.login, password: this.password});
      const categories = await client.resources();
      await this.$store.dispatch('setResources', {categories, pwd: this.$store.getters.getEncryptionKey});
      //await this.$store.dispatch('setActiveResource', categories.length > 0 ? 0 : -1);
    }
  }

  async onFormSubmit(e: any) {
    e.preventDefault();
    await this.tryLogin();
  }

  async onBtnLoginClick() {
    await this.tryLogin();
    this.$emit('onBtnLoginClick', !this.loginError);
  }
}

</script>
<template>
    <form v-on:submit="onFormSubmit">
        <div class="login-form">
            <input class="login-form-element" type="text" placeholder="login" v-model="login" />
            <input class="login-form-element" type="password" placeholder="password" v-model="password" />
            <div class="login-form-element">
                <EncryptionKeyEditor :align-flex-start="false" />
            </div>
            <button class="login-form-element" @click="onBtnLoginClick">Login</button>
            <p class="login-form-element" v-if="loginError">Login error</p>
        </div>
    </form>
</template>
<style lang="scss">
.login-form {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
}

.login-form-element {
    margin-top: 8px;
}
</style>