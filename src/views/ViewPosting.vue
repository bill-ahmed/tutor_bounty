<template>
  <v-container>
    <v-row v-if="userPost" justify="center" style="margin: 40px 0;">
      <!-- The posting itself -->
      <v-col id="posting-view" cols="7">
        <div class="text-h4 subtitle" style="margin-bottom: 10px;"> {{userPost['title']}} </div>

        <div class="nrow" style="align-items: center">
          <v-chip label :color="getCreditColour(userPost.value)" text-color="white">
            CR {{ userPost.value }}
          </v-chip>

          <v-chip label color="blue" text-color="white">
            {{ userPost.category }}
          </v-chip>
        </div>
        <br/>

        <RichTextEditor :content="userPost['description']" :isEditable="false"></RichTextEditor>
      </v-col>

      <!-- Additional info about the posting -->
      <v-col cols="3" id="posting-more-info-container">
        <div id="posting-more-info" class="n-elevation-1" >
          <div class="text-h6 subtitle" style="margin-bottom: 10px;"> About </div>

          <div class="nrow">
            <v-chip label dark class="large-label">
              <v-avatar left>
                <v-icon> fa fa-user </v-icon>
              </v-avatar>
              {{userPost.user.username}} 
            </v-chip>
          </div>

          <div class="nrow">
            <v-chip label outlined color="black" class="large-label">
              <v-avatar left>
                <v-icon> fa fa-calendar </v-icon>
              </v-avatar>
              {{new Date(userPost.startDate).toLocaleString()}} 
            </v-chip>
          </div>

          <div class="nrow">
            <v-chip label outlined color="black" class="large-label">
              <v-avatar left>
                <v-icon> fa fa-stopwatch </v-icon>
              </v-avatar>
              {{userPost.duration}} 
            </v-chip>
          </div>
          
          <v-spacer/>

          <div class="nrow justify-center">
            <v-btn
              color="primary"
              depressed
              block
              @click="accept()"
              :loading="loading"
            >
              Accept
            </v-btn>
          </div>

          <div class="nrow justify-center" style="margin-bottom: 50px;">
            <v-btn
              block
              text
              outlined
              @click="cancel()"
              :disabled="loading"
            >
              Cancel
            </v-btn>
          </div>

          <div class="nrow">
            <ErrorAlert :fullWidth="true" :errors="errors"></ErrorAlert>
          </div>
        </div>
      </v-col>
    </v-row>
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
          if(!confirm('Are you sure you want to accept?'))
            return;

          this.loading = true;
          this.errors = [];

          try {
            await this.axios.post(`/userPostings/${this.urlId}/accept`);
            this.$router.push('/dashboard');

          } catch (error) {
            this.errors = error.response.data
          }

          this.loading = false;
        },
        getCreditColour(value) {
          if (value <= 10) {
            return "green";
          } else if (value <= 25) {
            return "orange";
          } else {
            return "red";
          }
        },
    },
    mounted() {
        this.viewPosting();
    },

}
</script>

<style lang="scss" scoped>
#posting-view {
  border-radius: 10px;
  border: solid 2px rgba(0, 0, 0, 0.06);
}

#posting-more-info-container {
  padding-top: 30px; 
  position: sticky; 
  top: 0; 
  
  max-height: 500px; 

  padding: 0;
  padding-top: 25px;
}

#posting-more-info {
  border-radius: 10px;
  padding: 15px;
  height: 100%;


  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.grow {
  flex-grow: 1;
}

.v-chip {
  margin: 0 5px;
}

.v-chip.large-label {
  flex-grow: 1;
  margin: 5px 0;
  height: 42px;
}

.row {
  padding: 0 10px;
}

.col {
  margin: 0 15px;
}
</style>
