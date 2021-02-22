<template>
  <div class="columns">
    <div class="column"></div>
    <div class="column tile is-3 is-ancestoris-vertical box">
        <div class="column">
          <div class="has-text-centered">
            <p class="title"> Sign Up </p>
            <p class="subtitle"> Create an account by filling out below. </p>
          </div>
          <br/>
          
          <b-field label="Name">
            <b-input type="text" v-model="name"></b-input>
          </b-field>

          <b-field label="Email">
            <b-input type="email" v-model="email"></b-input>
          </b-field>

          <b-field label="Password">
            <b-input type="password" v-model="password"></b-input>
          </b-field>
          
          <b-field label="Confirm Password">
            <b-input type="password" v-model="confirmPassword"></b-input>
          </b-field>

          <b-button expanded type="is-success is-outlined" v-on:click="signup()" :loading="loading">Sign Up</b-button>
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
            confirmPassword: '',
            name: '',
            loading: false
        }
    },
    methods: {
        async signup() {
          this.loading = true;

          try {
            await this.axios.post('/signup', { 
              email: this.email, 
              password: this.password, 
              confirmPassword: this.confirmPassword,
              name: this.name
            });
          } catch (error) {
            // TODO: Error handling
          } finally {
            this.loading = false; 
          }
        }
    }
}
</script>

<style>

</style>