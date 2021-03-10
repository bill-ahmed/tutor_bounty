<template>
  <v-container>
    <div v-if="$currentUser">
      <p class="subtitle"> Welcome, {{ urlId }}. </p>
            <p class="subtitle" v-if="userPost"> Welcome, {{ userPost['description'] }}. </p>

    </div>
    
    <br/>

    <p>Home page.</p>

  </v-container>
</template>

<script lang="ts">

export default {
    name: 'ViewPosting',
    data() {
        console.log(this.$route.params);
        let urlId = this.$route.params['id'];
        return {
            urlId,
            userPost:null,
        }
    },
    methods: {
        async viewPosting() {
            
            let userPost = await this.axios.get('/userPostings/' + this.urlId);
            console.log(userPost);
            this.userPost = userPost.data;
        },  
    },
    mounted() {
        this.viewPosting();
    },

}
</script>
