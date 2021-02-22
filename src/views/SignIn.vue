<template>
  <div>
      <h3> Sign In </h3>
      <form>
          <div>
              <label>Email:</label>
                <input type="text" name="email" v-model="email"/>
            </div>
            <div>
                <label>Password:</label>
                <input type="password" name="password" v-model="password"/>
            </div>
      </form>
      <div>
				<button v-on:click="login()">Sign In</button>
			</div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            email: '',
            password: ''
        }
    },
    methods: {
        async login() {
					let res = await this.axios.post('/login', { email: this.email, password: this.password });
					console.log(res.data);
        }
    }
}
</script>

<style>

</style>