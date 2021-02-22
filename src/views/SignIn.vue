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
          <a href="/api/auth/google">google</a>
          <b-button expanded rounded type="is-outlined">Continue with Google</b-button>

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

      } finally {
        this.loading = false;
      }
    },
    async googleLogin() {
      this.isloading = true;
    }
  }
}
</script>

<style>

</style>