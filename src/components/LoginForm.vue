<template>
    <div class="login-form">
        <input class="login-form-element" type="text" placeholder="login" v-model="login" />
        <input class="login-form-element" type="text" placeholder="password" v-model="password" />
        <button class="login-form-element" @click="onBtnLoginClick">Login</button>
        <p class="login-form-element" v-if="loginError">Login error</p>
    </div>
</template>
<script lang="ts">
import { Component, Vue, toNative } from 'vue-facing-decorator'
import Auth from './../models/auth'
import ApiClient from '../models/apiClient';

@Component
class LoginForm extends Vue {

    login: string | undefined;
    password: string | undefined;
    loginError = false;

    auth = new Auth();

    async onBtnLoginClick() {
        const client = new ApiClient();
        const authenticated = await client.login(this.login as string, this.password as string);
        if (!authenticated) {
            this.loginError = true;
        } else {
            this.$store.dispatch('updateUser', { username: this.login, password: this.password });
            const resources = await client.resources();
            this.$store.dispatch('setResources', resources);
            this.$store.dispatch('setActiveResource', resources.length > 0 ? 0 : -1);
        }
        this.$emit('onBtnLoginClick', !this.loginError);
    }
}
export default toNative(LoginForm);
</script>
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