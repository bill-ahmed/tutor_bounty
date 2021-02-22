<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/signup">Sign Up</router-link> |
      <router-link to="/signin">Sign In</router-link> |
      <button v-on:click="logout()">Logout</button> |
      <button v-on:click="pingServer()">ping server</button>
    </div>
    <router-view/>
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
      console.log('Logged out!', result.data);
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
