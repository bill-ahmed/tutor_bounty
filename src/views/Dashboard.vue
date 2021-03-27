<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="5">
        <div v-if="$currentUser">
          <p class="subtitle text-h4"> Welcome, {{ $currentUser.name || $currentUser.username }}. </p>
        </div>
        
        <br/>

        <div class="nrow">
          <p class="text-h6"> My upcoming meetings </p>
        </div>

        <div v-for="meeting in meetings" :key="meeting._id">
          <MeetingRow :meeting="meeting"/>
        </div>

        <div v-if="meetings.length === 0">
          <p class="subtitle">
            <i>
              Looks like you haven't accepted any posting!
            </i>
          </p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import MeetingRow from '@/components/shared/MeetingRow';

export default {
  name: 'Dashboard',
  components: {
    MeetingRow
  },

  mounted(){ this.getData(); },

  data() {
    return {
      loading: true,
      meetings: [],
    }
  },

  methods: {
    /** Get list of all meetings that this user is involved in. */
    async getData() {
      try {
        let { isHost, isTutor } = (await this.axios.get('/meetings/myMeetings')).data;
        this.meetings = [...isHost, ...isTutor];

        this.loading = false;

      } catch (error) {
        console.error('Error getting my meetings.', error);
      }
    }
  }
}
</script>

<style scoped>

</style>