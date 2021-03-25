<template>
  <v-btn  block outlined rounded text @click="googleLogin()">
    <v-icon left small color="blue"> fab fa-google </v-icon>
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

<style scoped>
.v-btn {
  margin-left: 0;
  margin-right: 0;
}
</style>