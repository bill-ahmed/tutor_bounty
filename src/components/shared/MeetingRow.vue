<template>
  <v-container @click="goToMeeting()" :class="isHost() ? 'host_container' : 'tutor_container'" fluid>
      <v-row>
        <v-col>
            <!-- Top info -->
        <v-row>
          <v-col>
            <p> {{ userPosting.title }} </p>
            
            <div v-if="!isHost()" class="nrow">
              <v-icon x-small style="margin-right: 7px"> fa fa-user </v-icon>
              <p class="subtitle"> {{ meeting.host.username }} </p>
            </div>
          </v-col>
        </v-row>

        <!-- Bottom info -->
        <v-row>
          <v-col>
            <v-chip label small color="primary"> {{ userPosting.category }} </v-chip>

            <v-chip v-if="isHost()" label small color="teal" dark> Host </v-chip>
            <v-chip v-if="!isHost()" label small color="purple" dark> Tutor </v-chip>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="3" class="text-end" align-self="center">
        <p class="subtitle"> {{ userPosting.duration }} </p>
        <p class="subtitle"> {{ new Date(userPosting.startDate).toLocaleString().split(', ')[0] }} </p>
        <p class="subtitle"> {{ new Date(userPosting.startDate).toLocaleString().split(', ')[1] }} </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: ['meeting'],
  data() {
    return {
      userPosting: this.meeting.user_posting,
    }
  },

  methods: {
    goToMeeting() {
      this.$router.push('/meetings/' + this.meeting._id);
    },

    isHost() {
      return this.$currentUser._id === this.meeting.host._id;
    }
  }
}
</script>

<style scoped>
.host_container, .tutor_container {
  border-radius: 8px;
  box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.05), 0 3px 10px 0 rgba(0, 0, 0, 0.1);

  margin: 20px 0;
  cursor: pointer;
}

.host_container {
  border-left: solid 5px #009688;
}

.tutor_container {
  border-left: solid 5px #9c27b0;
}

.v-chip {
  margin: 0 5px;
}

p {
  margin: 0;
}
</style>