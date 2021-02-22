<template>
    <div>
        <h2> Sign up </h2>
        <form>
            <div>
                <label>Email:</label>
                <input type="text" name="email" v-model="email"/>
            </div>
            <div>
                <label>Password:</label>
                <input type="password" name="password" v-model="password"/>
            </div>
            <div>
                <label>Confirm password:</label>
                <input type="password" name="password" v-model="confirmPassword"/>
            </div>
        </form>
        <div>
            <button v-on:click="signup()">Sign Up</button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            email: '',
            password: '',
            confirmPassword: ''
        }
    },
    methods: {
        async signup() {
            let res = await this.axios.post('/signup', { email: this.email, password: this.password, confirmPassword: this.confirmPassword });
            console.log(res.data);
        }
    }
}
</script>

<style>

</style>