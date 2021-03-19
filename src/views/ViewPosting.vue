<template>
  <v-container>
    <v-row>
      <ErrorAlert :errors="errors"></ErrorAlert>
    </v-row>
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
            <RichTextEditor :content="userPost['description']" :isEditable="false"></RichTextEditor>
          </div>
        </v-card-text>
      
        <v-card-actions>
          <v-spacer/>

          <v-btn
            text
            @click="cancel()"
            :disabled="loading"
          >
            Cancel
          </v-btn>

          <v-btn
            color="primary"
            outlined
            @click="accept()"
            :loading="loading"
          >
            Accept
          </v-btn>

          <v-spacer/>
        </v-card-actions>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import ErrorAlert from '@/components/shared/ErrorAlert';
import RichTextEditor from '@/components/shared/RichTextEditor';

export default {
    name: 'ViewPosting',
    components: {
      ErrorAlert,
      RichTextEditor
    },
    data() {
      let urlId = this.$route.params['id'];
      return {
          urlId,
          userPost:null,
          loading: false,
          errors: []
      }
    },
    methods: {
        async viewPosting() {
          let userPost = await this.axios.get('/userPostings/' + this.urlId);
          console.log(userPost.data);
          this.userPost = userPost.data;
        },
        
        cancel() {
          this.$router.back();
        },

        async accept() {
          this.loading = true;
          this.errors = [];

          try {
            await this.axios.post(`/userPostings/${this.urlId}/accept`);

          } catch (error) {
            this.errors = error.response.data
          }

          this.loading = false;
        }
    },
    mounted() {
        this.viewPosting();
    },

}
</script>
