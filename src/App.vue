<template>
  <div id="app" class="container is-fluid">
    <div class="level navbar">
      <div class="level-left">
        <div class="level-item">
          <p class="title"> Tutor Bounty </p>
        </div>
      </div>

      <div class="level-right">
        <div class="level-item">
          <b-button tag="router-link" to="/"> Home </b-button>
        </div>

        <div class="level-item">
          <b-button tag="router-link" type="is-info is-outlined" to="/signin"> Login </b-button>
        </div>

        <div class="level-item">
          <b-button tag="router-link" type="is-success is-outlined" to="/signup"> Sign Up </b-button>
        </div>

        <div class="level-item">
          <b-button type="is-warning" v-on:click="logout()">Logout</b-button>
        </div>
        <b-button v-on:click="pingServer()">ping server</b-button>
        <b-button v-on:click="test()">test</b-button>
      </div>
    </div>
    <router-view/>

    <div class="footer">
      Tutor Bounty © 2021
    </div>
  </div>
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
