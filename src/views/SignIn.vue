<template>
  <div class="columns">
    <div class="column"></div>
    <div class="column tile is-3 is-ancestoris-vertical box">
        <div class="column">
          <div class="has-text-centered">
            <p class="title"> Login </p>
            <p class="subtitle"> Sign in to continue. </p>
          </div>
          <br/>

          <b-button expanded rounded type="is-outlined" @click="googleLogin()">Sign In with Google</b-button>

          <hr/>

          <b-field label="Email">
              <b-input type="email" v-model="email"></b-input>
          </b-field>

          <b-field label="Password">
              <b-input type="password" v-model="password"></b-input>
          </b-field>

          <b-button expanded type="is-info is-outlined" v-on:click="login()" :loading="loading">Sign In</b-button>
        </div>
    </div>
    <div class="column"></div>
  </div>
</template>

<script>
import { SignInWithGoogle } from '@/utils/auth';

export default {
  data() {
    return {
        email: '',
        password: '',
        loading: false
    }
  },
  methods: {
    async login() {
      this.loading = true;

      try {
        await this.axios.post('/login', { email: this.email, password: this.password });

        // No errors, continue

      } catch (error) {
        // TODO: error handling

      }
      this.$router.push('/');
      this.loading = false;
    },
    googleLogin() {
      SignInWithGoogle();
    }
  }
}
</script>

<style>

</style>