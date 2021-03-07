<template>
  <v-container>
    <ErrorAlert :errors="errors"></ErrorAlert>

    <v-row justify="center" style="margin-bottom: 10px;">
      <v-col style="min-width: 350px; text-align: center;" cols="4" class="signup-container elevation-10">
        <h1> Sign Up </h1>
        <v-card-subtitle> Create an account by filling out below. </v-card-subtitle>
        <br/>
        
        <SignInWithGoogle bodyText="Sign Up With Google"></SignInWithGoogle>

        <v-row style="margin-top: 15px" justify="center">
          <v-col cols="9">
            <form>
              <v-text-field outlined dense v-model="name" label="Name" required></v-text-field>
              <v-text-field outlined dense v-model="username" label="Username*" required></v-text-field>

              <hr/>
              <br/>

              <v-text-field outlined dense v-model="email" label="Email*" required></v-text-field>

              <v-text-field outlined dense v-model="password" type="password" label="Password*" required></v-text-field>
              <v-text-field outlined dense v-model="confirmPassword" type="password" label="Password*" required></v-text-field>
            </form>
          </v-col>
        </v-row>

        <v-btn :ripple="false" v-on:click="signup()" :loading="loading">Sign Up</v-btn>

        <v-card-subtitle style="margin-top: 20px;"> <i> Already have an account? </i> <v-btn small dense text to="/signin"> Sign in </v-btn> </v-card-subtitle>
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
          confirmPassword: '',
          name: '',
          username: '',
          loading: false,
          errors: []
      }
  },
  methods: {
    async signup() {
      this.loading = true;
      this.errors = [];

      try {
        await this.axios.post('/signup', { 
          email: this.email, 
          password: this.password, 
          confirmPassword: this.confirmPassword,
          name: this.name,
          username: this.username
        });

        this.$router.push('/');

      } catch (error) {
        this.handleErrors(error.response.data);

      } finally {
        this.loading = false; 
      }
    },

    handleErrors(errors)
    {
      this.errors = errors;
    }
  },
  components: {
    SignInWithGoogle,
    ErrorAlert
  }
}
</script>

<style>
.signup-container {
  border-top: solid 6px var(--v-accent-darken1);
}
</style>