<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
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
      const result = await this.axios.get('http://127.0.0.1:3000/isAlive');
      console.log(result.data);
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
