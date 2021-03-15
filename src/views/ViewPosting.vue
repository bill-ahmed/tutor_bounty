<template>
  <v-container>

<div v-if="$currentUser && userPost">
        
      <v-banner  class="subtitle text-h6 text-center"> Welcome, this is user post {{ urlId }}. </v-banner>
               
  <v-card
    class="mx-auto mt-5"
    max-width="80%"
  >
    <v-card-text>
      <div>post id: {{ urlId}}</div>
      <p class="display-1 text--primary">
          {{userPost['title']}}
      </p>
      <div class="text--primary">
        <div v-html="userPost['description']"> </div>
      </div>
    </v-card-text>
  
      <v-card-actions>
      <v-btn
        color="deep-purple lighten-2"
        text
      >
        More action
      </v-btn>
    </v-card-actions>
  </v-card>

    
</div>


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
            console.log(userPost.data);
            this.userPost = userPost.data;
        },  
    },
    mounted() {
        this.viewPosting();
    },

}
</script>
