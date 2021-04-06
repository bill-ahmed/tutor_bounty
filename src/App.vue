<template>
  <v-app id="app">
    <v-app-bar color="white" app flat style="position: relative;">
      <v-spacer style="max-width: 100px;"/>
      <div @click="goHome()" id="app_heading_text">
        Tutor Bounty
      </div>

      <v-spacer class="mx-auto"/>

      <v-btn :ripple="false" text v-if="!$currentUser" to="/signin"> Login </v-btn>
      <v-btn v-if="!$currentUser" to="/signup" color="secondary" elevation="1"> Sign Up </v-btn>

      <v-btn :ripple="false" text v-if="$currentUser" to="/dashboard"> Dashboard </v-btn>
      <v-btn :ripple="false" text v-if="$currentUser" to="/postings"> Postings </v-btn>
      <Avatar v-if="$currentUser" :logout="logout"/>

      <v-spacer style="max-width: 0px;"/>
      
    </v-app-bar>

    <v-content style="padding: 0;">
      <router-view :key="$route.fullPath"/>
    </v-content>

    <v-footer dark>
      Tutor Bounty © 2021
    </v-footer>
  </v-app>
</template>

<script>
import Avatar from '@/components/shared/Avatar';

export default {
  components: {
    Avatar
  },
  data() {
    return { }
  },
  methods: {
    async logout() {
      await this.axios.post('/logout');
      this.$router.push('/signin')
    },
    goHome() {
      this.$router.push('/');
    }
  }
}
</script>

<style lang="scss">
#app_heading_text {
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  font-size: 1.8rem;

  cursor: pointer;
}
</style>
