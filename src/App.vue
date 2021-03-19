<template>
  <v-app id="app">
    <v-app-bar dark app flat>
      <v-toolbar-title>
        Tutor Bounty
      </v-toolbar-title>

      <v-spacer/>

      <v-btn outlined text to="/"> Home </v-btn>
      <v-btn outlined text to="/postings"> Postings </v-btn>
      <v-btn outlined text v-if="!$currentUser" to="/signin"> Login </v-btn>

      <v-btn outlined text v-if="!$currentUser" to="/signup"> Sign Up </v-btn>

      <v-btn outlined text v-if="$currentUser" to="/dashboard"> Dashboard </v-btn>
      <v-btn icon v-if="$currentUser" to="/new">
        <v-icon small> fa fa-plus </v-icon>
      </v-btn>
      <v-btn outlined text v-if="$currentUser" v-on:click="logout()">Logout</v-btn>

        <!-- <v-btn v-on:click="pingServer()">ping server</v-btn>
        <v-btn v-on:click="test()">test</v-btn> -->
    </v-app-bar>

    <v-content>
      <router-view :key="$route.fullPath"/>
    </v-content>

    <v-footer dark>
      Tutor Bounty © 2021
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return { }
  },
  methods: {
    async pingServer() {
      const result = await this.axios.get('/isAlive');
      console.log(result.data);
    },
    async logout() {
      const result = await this.axios.post('/logout');
      this.$router.push('/signin')
    },
    test() {
      console.log(this.$currentUser);
    }
  }
}
</script>

<style lang="scss">

</style>
