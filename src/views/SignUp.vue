<template>
  <v-container fluid>
    <v-row justify="center" class="flex-wrap" style="margin-bottom: 10px;">
      <div class="ncol col-5 signup-promo">
        <div class="text-h2" id="get_started_msg">
          Get started today!
        </div>
        <br/>

        <div class="text-h5 subtitle">
          As the community grows, an increasing number of students are benefiting from online learning.
        </div>

        <br/>
        <br/>

        <div class="text-h6 subtitle" style="margin-bottom: 10px;">
          <i> "This platform had provided me an opporunity like no other...I simply couldn't live without it." </i>
        </div>

        <div class="text-h7"> — John Doe, Arts Major @UofT </div>

        <ErrorAlert :fullWidth="true" style="margin-top: 10px;" :errors="errors"></ErrorAlert>
      </div>

      <v-col cols="3" class="signup-container n-elevation-1">
        <h1> Sign Up </h1>
        <v-card-subtitle> Create an account by filling out below. </v-card-subtitle>
        <br/>
        
        <v-row dense justify="center">
          <v-col cols="9">
            <SignInWithGoogle bodyText="Sign Up With Google"></SignInWithGoogle>
          </v-col>
        </v-row>

        <v-row dense justify="center">
          <p> or </p>
        </v-row>

        <v-row dense style="margin-top: 15px" justify="center">
          <v-col cols="9">
            <form>
              <v-text-field autofocus outlined dense v-model="name" label="Name (Optional)" required></v-text-field>
              <v-text-field outlined dense v-model="username" label="Username*" required></v-text-field>

              <hr/>
              <br/>

              <v-text-field outlined dense v-model="email" label="Email*" required></v-text-field>

              <v-text-field outlined dense v-model="password" type="password" label="Password*" required></v-text-field>
              <v-text-field outlined dense v-model="confirmPassword" type="password" label="Confirm Password*" required></v-text-field>
            </form>
          </v-col>
        </v-row>

        <v-row dense justify="center">
          <v-btn :ripple="false" v-on:click="signup()" :loading="loading" color="secondary" style="width: 70%" dark>Sign Up</v-btn>
        </v-row>

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

        this.$router.push('/dashboard');

      } catch (error) {
        this.handleErrors(error.response.data);

        // Safar needs document.body, chrome and others use documentElement
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;

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

<style lang="scss" scoped>
.container {
  padding: 0;
  padding-top: 10px;
  min-height: 100%;

  --bg: rgba(255, 152, 0, 0.18);

  background: linear-gradient(190deg, var(--bg) 50%, transparent 0%) no-repeat bottom;
}

.signup-promo  {
  margin-right: 25px;
}

.signup-container {
  margin-left: 25px;
  margin-top: 25px;

  animation-name: slide_up;
  animation-duration: 0.5s;
}

.signup-promo {
  min-width: 500px;
  max-width: 600px;

  text-align: center;

  #get_started_msg {
    margin-top: 25%;
  }
}

.signup-container {
  border-top: solid 6px var(--v-secondary-base);
  background-color: #ffffff;

  min-width: 450px; 
  text-align: center;
}

p {
  margin: 0;
}

@media screen and (max-width: 930px) {
  .signup-promo, .signup-container {
    margin: 25px 0;
  }

  .signup-promo {
    #get_started_msg {
      margin: 0;
    }
  }
}

@keyframes slide_up {
  0% {
    margin-top: 55px;
    opacity: 0;
  }

  100% {
    margin-top: 25px;
    opacity: 1;
  }
}

</style>
