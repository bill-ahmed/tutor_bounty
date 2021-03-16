<template>
  <v-container>
    <br/>

    <!-- Search Bar -->
    <v-row>
      <v-row justify="center" style="margin-bottom: 25px;">
        <v-col cols="9">
          <v-text-field outlined dense single-line v-model="search" type="text" label="Search..." append-icon="fa fa-search"></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-select v-model="sortBy" style="margin-top: -1%;" label="Sort By" :items="SORT_OPTIONS"> </v-select>
        </v-col>
      </v-row>
    </v-row>

    <!-- Search Results -->
    <v-row>
      <v-row justify="end" style="margin-bottom: 25px;">
        <v-col cols="10">
          <v-card v-for="posting in postings" :key="posting.uid" elevation="6" outlined style="margin-top: 15px;">
            <v-list-item three-line>
              <!-- Left Side of the Card -->
              <v-list-item-content>
                <v-list-item-title class="headline mb-1">
                  {{ getShortTitle(posting.title) }}
                  <v-chip
                    class="ma-2"
                    color="blue"
                    text-color="white"
                  >
                    {{ posting.subject }}
                  </v-chip>
                  <v-chip
                    class="ma-2"
                    color="green"
                    text-color="white"
                  >
                    CR {{ posting.value }}
                  </v-chip>
                </v-list-item-title>
                <v-list-item-subtitle style="margin-bottom: 1%;">By {{ posting.author }}</v-list-item-subtitle>
                <v-card-text>{{ getShortDescription(posting.description) }}</v-card-text>
              </v-list-item-content>
              <!-- Right Side of the Card -->
              <div>
                <h3>Value: CR {{ posting.value }}</h3>
                <h3>Date: {{ posting.start_data.getDate() }}/{{ posting.start_data.getMonth() }}/{{ posting.start_data.getFullYear() }}</h3>
                <h3>Duration: {{ posting.duration }}</h3>
              </div>
            </v-list-item>

            <v-card-actions>
              <v-btn
                outlined
                rounded
                text
              >
                View More
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-row>
    
  </v-container>
</template>

<script>
import {userPostings} from '@/utils/mock_data'
import { SORT_OPTIONS } from '../../shared/shared_constants';

export default {
  name: 'PostingsPage',
  data() {
    return {
      search: '',
      sortBy: 'Recent',
      postings: [],
      price: -1,
      dateStart: '',
      dateEnd: '',
      subject: '',
      duration: -1,

      SORT_OPTIONS,
    }
  },
  methods: {
    async getPostings() {
      this.postings = [];
      // The query from the backend API to get all postings.
      // let postings = await this.axios.get('/userPostings/');
      let postings = userPostings;
      for (const i in postings) {
        this.postings.push(postings[i]);
      }
      console.log(this.postings);
    },
    getShortDescription(description) {
      if (description.length <= 800) {
        return description;
      } else {
        return description.substring(0, 797) + '...';
      }
    },
    getShortTitle(title) {
      if (title.length <= 50) {
        return title;
      } else {
        return title.substring(0, 50) + '...';
      }
    }
  },
  beforeMount() {
    this.getPostings();
  }
}
</script>

<style scoped>

</style>
