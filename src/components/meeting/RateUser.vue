<template>
  <v-row justify="center">
    <v-dialog v-model="open" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <div class="text-h4">Rating</div>
        </v-card-title>

        <v-card-text>
          <div class="text-h6"> How would you rate <b>{{ratingFor}}</b>? </div>
          <br/>
          <br/>

          <v-row justify="center" align="center">
            <v-rating v-model="rating" hover length="5" size="30" color="warning" background-color="grey lighten-1"/>
          </v-row>
          <v-row justify="center">
            <p style="margin: 10px 0; font-size: 14pt;"> {{ getRatingMessage() }} </p>
          </v-row>
        </v-card-text>

        <v-card-actions class="justify-center">
          <v-btn outlined text block>
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: ['open', 'ratingFor', 'onSubmit'],
  data() {
    return {
      rating: 4,
      ratingMessages: [
        'Terrible',
        'Bad',
        'Average',
        'Good',
        'Very Good'
      ]
    }
  },
  methods: {
    getRatingMessage() {
      return this.ratingMessages[this.rating - 1];
    }
  }
}
</script>

<style scoped>
p {
  margin: 0;
}
</style>