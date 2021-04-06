<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="5">
        <div v-if="$currentUser">
          <p class="subtitle text-h4"> Welcome, {{ $currentUser.name || $currentUser.username }}. </p>
        </div>
        
        <br/>

        <!-- Upcoming meetings -->
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
        <br/>

        <!-- Past meetings -->
        <div class="nrow">
          <p class="text-h6"> Previous meetings </p>
        </div>

        <div v-for="meeting in pastMeetings" :key="meeting._id">
          <MeetingRow :meeting="meeting"/>
        </div>

        <div v-if="pastMeetings.length === 0">
          <p class="subtitle">
            <i>
              All previously ended meetings will show up here.
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
      pastMeetings: [],
    }
  },

  methods: {
    /** Get list of all meetings that this user is involved in. */
    async getData() {
      try {
        let { isHost, isTutor, completed } = (await this.axios.get('/meetings/myMeetings')).data;
        this.meetings = [...isHost, ...isTutor];
        this.pastMeetings = [...completed];

        // Sort them
        this.meetings.sort(this.dateSort);
        this.pastMeetings.sort(this.dateSort);

        this.loading = false;

      } catch (error) {
        console.error('Error getting my meetings.', error);
      }
    },
    dateSort(a, b) {
      return new Date(a.user_posting.startDate) > new Date(b.user_posting.startDate) ? 1 : -1
    }
  }
}
</script>

<style scoped>

</style>