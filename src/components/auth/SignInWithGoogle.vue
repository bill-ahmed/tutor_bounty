<template>
  <v-btn rounded outlined text @click="googleLogin()">
    <v-icon left color="blue"> fab fa-google </v-icon>
    {{ bodyText || 'Sign In with Google' }}
  </v-btn>
</template>

<script>
import Vue from 'vue';
import { TriggerGoogleAuth } from '@/utils/auth';

export default Vue.extend({
  name: 'SignInWithGoogle',
  props: {
    bodyText: String
  },
  data() {
    return { };
  },
  methods: {
    googleLogin() {
      TriggerGoogleAuth();
    }
  }
})
</script>

<style>

</style>