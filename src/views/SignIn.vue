<template>
  <v-container fluid>
    <ErrorAlert :errors="errors"></ErrorAlert>

    <v-row justify="center" align="center" style="margin-bottom: 10px;">
      <v-col cols="3" class="signin-container n-elevation-1">
        <h1> Login </h1>
        <v-card-subtitle> Sign in to continue. </v-card-subtitle>
        <br/>
        
        <v-row justify="center">
          <v-col cols="9">
            <SignInWithGoogle></SignInWithGoogle>
          </v-col>
        </v-row>

        <v-row justify="center">
          <p> or </p>
        </v-row>

        <v-row style="margin-top: 15px" justify="center">
          <v-col cols="9">
            <form>
              <v-text-field @keydown.enter.exact="login()" autofocus outlined dense v-model="email" type="email" label="Email" required></v-text-field>
              <v-text-field @keydown.enter.exact="login()" outlined dense v-model="password" type="password" label="Password" required></v-text-field>
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

<style lang="scss" scoped>
.container {
  padding: 0;
  padding-top: 10px;
  min-height: 100%;

  --bg: rgba(25, 118, 210, 0.18);

  background: linear-gradient(-10deg, var(--bg) 50%, transparent 0%) no-repeat bottom;
}

.signin-container {
  border-top: solid 6px var(--v-primary-base);
  background-color: #ffffff;
  
  margin-top: 3%;

  min-width: 350px; 
  text-align: center;

  animation-name: slide_up;
  animation-duration: 0.3s;
  
  p {
    margin: 0;
  }
}

@keyframes slide_up {
  0% {
    margin-top: 3.5%;
  }

  100% {
    margin-top: 3%;
  }
}
</style>