<template>
  <v-container>
    <ErrorAlert :errors="errors"></ErrorAlert>

    <v-row justify="center" style="margin-bottom: 10px;">
      <v-col style="min-width: 350px; text-align: center;" cols="4" class="signin-container elevation-10">
        <h1> Login </h1>
        <v-card-subtitle> Sign in to continue. </v-card-subtitle>
        <br/>
        
        <SignInWithGoogle></SignInWithGoogle>

        <v-row style="margin-top: 15px" justify="center">
          <v-col cols="9">
            <form>
              <v-text-field outlined dense v-model="email" type="email" label="Email" required></v-text-field>
              <v-text-field outlined dense v-model="password" type="password" label="Password" required></v-text-field>
            </form>
          </v-col>
        </v-row>

        <v-btn v-on:click="login()" :loading="loading" color="primary" outlined text>Sign In</v-btn>

        <v-card-subtitle style="margin-top: 20px;"> <i> Need an account? </i> <v-btn small dense text to="/signup"> Sign Up </v-btn> </v-card-subtitle>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SignInWithGoogle from '@/components/auth/SignInWithGoogle';
import ErrorAlert from '@/components/shared/ErrorAlert';

export default {
  data() {
    return {
        email: '',
        password: '',
        loading: false,
        errors: []
    }
  },
  methods: {
    async login() {
      this.loading = true;
      this.errors = [];

      try {
        await this.axios.post('/login', { email: this.email, password: this.password });
        this.$router.push('/dashboard');

      } catch (error) {
        let errors = error.response.data;
        this.errors = Array.isArray(errors) ? errors : [errors];
      }
      
      this.loading = false;
    }
  },
  components: {
    SignInWithGoogle,
    ErrorAlert
  }
}
</script>

<style>
.signin-container {
  border-top: solid 6px var(--v-primary-base);
}
</style>