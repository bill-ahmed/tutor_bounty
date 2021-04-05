<template>
  <v-container>
    <br/>
    <v-row>
      <v-row justify="center" style="margin-bottom: 25px;">
        <v-col cols="7">
          <div class="text-h4 subtitle" style="font-weight: 400;"> Create a new posting </div>
        </v-col>
        <v-col cols="4"></v-col>
      </v-row>
    </v-row>

    <v-row justify="center" style="margin-bottom: 10px;">
      <v-col cols="7">
        <v-row>
          <v-text-field autofocus outlined dense v-model="title" type="text" label="Title*" required></v-text-field>
        </v-row>

        <v-row class="text-editor-container">
          <!-- <v-textarea outlined v-model="description" label="Description*" required rows="15"></v-textarea> -->
          <RichTextEditor v-model="description" :restrictHeight="true"></RichTextEditor>
        </v-row>

        <v-row>
          <ErrorAlert :errors="errors" :fullWidth="true"></ErrorAlert>
        </v-row>
      </v-col>

      <v-col cols="4" class="d-elevation-1 border-10">
        <v-row>
          <!-- Choose start date  -->
          <v-col>
            <v-menu v-model="dateStartMenu" ref="dateStartMenuRef" :close-on-content-click="false" :return-value.sync="dateStart" offset-y min-width="auto">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field required
                  v-model="dateStart"
                  label="Choose start date*"
                  prepend-icon="fa fa-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>

              <v-date-picker v-model="dateStart">
                <v-btn
                  text
                  color="primary"
                  @click="dateStartMenu = false"
                >
                  Cancel
                </v-btn>

                <v-btn
                  text
                  color="primary"
                  @click="$refs.dateStartMenuRef.save(dateStart)"
                >
                  Save
                </v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>

          <!-- Choose start time -->
          <v-col>
            <v-menu
              ref="timeStartMenuRef"
              v-model="timeStartMenu"
              :close-on-content-click="false"
              :return-value.sync="timeStart"
              offset-y
              min-width="300px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field required
                  v-model="timeStart"
                  label="Choose a start time*"
                  prepend-icon="fa fa-clock"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="timeStartMenu"
                v-model="timeStart"
                full-width
                @click:minute="$refs.timeStartMenuRef.save(timeStart)"
              ></v-time-picker>
            </v-menu>
          </v-col>
        </v-row>

        <!-- Choose duration -->
        <v-row justify="center">
          <v-col>
            <v-select prepend-icon="fa fa-stopwatch" v-model="duration" label="Duration*" :items="ALLOWED_MEETING_DURATIONS" required> </v-select>
          </v-col>
        </v-row>

        <!-- Choose category -->
        <v-row justify="center">
          <v-col>
            <v-select prepend-icon="fa fa-graduation-cap" v-model="category" label="Choose category*" :items="ALLOWED_USER_POSTING_CATEGORIES" dense></v-select>
          </v-col>
        </v-row>

        <!-- Choose monetary valuew -->
        <v-row>
          <v-col>
            <v-text-field prepend-icon="fa fa-dollar-sign" v-model="value" type="number" label="Monetary Value*" hint="A value of zero implies volunteer request!" required></v-text-field>
          </v-col>
        </v-row>

        <v-row justify="end" style="margin-right: 5px;">
          <v-btn @click="cancel()" :disabled="loading" text> Cancel </v-btn>
          <v-btn @click="submit()" :loading="loading" outlined color="primary"> Submit </v-btn>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ErrorAlert from '@/components/shared/ErrorAlert';
import RichTextEditor from '@/components/shared/RichTextEditor';

import { ALLOWED_MEETING_DURATIONS, ALLOWED_USER_POSTING_CATEGORIES } from '../../shared/shared_constants';

export default {
  name: 'NewPosting',
  data() {
    return {
      loading: false,
      errors: [],

      title: '',
      description: '',
      duration: 'Select one',
      category: 'Select a category',
      value: 0,

      dateStartMenu: false,
      dateStart: new Date().toISOString().substr(0, 10),

      timeStartMenu: false,
      timeStart: null,

      ALLOWED_MEETING_DURATIONS,
      ALLOWED_USER_POSTING_CATEGORIES,
    }
  },
  methods: {
    async submit() {
      this.loading = true;
      this.errors = [];

      try {
        // Convert time to usable date object
        let d = new Date(this.dateStart);
        let segments = this.timeStart.split(':');
        
        // Need to offset by 1 day because of how it's parsed
        d.setDate(d.getDate() + 1);
        d.setHours(parseInt(segments[0]), parseInt(segments[1]));

        await this.axios.post('/userPostings/new', {
          title: this.title,
          description: this.description,
          duration: this.duration,
          category: this.category,
          startDate: d,
          startTime: d,
          value: parseInt(this.value)
        });
        
        this.$router.push('/postings')

      } catch (error) {
        console.error('Error creating a new positng!');
        console.error(error);

        this.errors = Array.isArray(error.response?.data) ? error.response.data : ['Server error!'];
        
      } finally {
        this.loading = false;
      }
    },
    cancel() {
      this.$router.push('/dashboard');
    }
  },
  components: {
    ErrorAlert,
    RichTextEditor
  }
}
</script>

<style scoped>
.col {
  margin: 0 10px;
}

.text-editor-container {
  border: solid 2px rgba(0, 0, 0, 0.06);
  border-radius: 10px;
}
</style>
