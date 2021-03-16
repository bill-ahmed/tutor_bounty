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


    <v-row>
      <v-row justify="center" style="margin-bottom: 25px;">
        <!-- Filters -->
        <v-col cols="3">
          <v-card
            class="mx-auto"
            max-width="400"
            elevation="3"
            outline
          >
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="headline">
                  Filters
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <!-- Price Filter -->
            <v-list-item>
              <v-list-item-icon>
                <v-icon>fas fa-dollar-sign</v-icon>
              </v-list-item-icon>
              <v-text-field style="width: 30px; margin-left: -30px; margin-right: 10px;" v-model="priceStart"></v-text-field>
              to
              <v-text-field style="width: 30px; margin-left: 10px; margin-right: 50%;" v-model="priceEnd"></v-text-field>
            </v-list-item>

            <!-- Date Range -->
            <v-list-item>
              <v-menu v-model="dateStartMenu" ref="dateStartMenuRef" :close-on-content-click="false" :return-value.sync="dateStart" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field required
                    v-model="dateStart"
                    label="Start"
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
              <p style="margin-left: 10px; margin-right: 10px; margin-top: 15px;">to</p>
              <v-menu v-model="dateEndMenu" ref="dateEndMenuRef" :close-on-content-click="false" :return-value.sync="dateEnd" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field required
                    v-model="dateEnd"
                    label="End"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>

                <v-date-picker v-model="dateEnd">
                  <v-btn
                    text
                    color="primary"
                    @click="dateEndMenu = false"
                  >
                    Cancel
                  </v-btn>

                  <v-btn
                    text
                    color="primary"
                    @click="$refs.dateEndMenuRef.save(dateEnd)"
                  >
                    Save
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-list-item>

            <!-- Duration Filter -->
            <v-list-item>
              <v-select prepend-icon="fa fa-stopwatch" v-model="duration" label="Duration" :items="ALLOWED_MEETING_DURATIONS" required> </v-select>
            </v-list-item>

            <!-- Duration Filter -->
            <v-list-item>
              <v-select prepend-icon="fa fa-graduation-cap" v-model="category" label="Category" :items="ALLOWED_USER_POSTING_CATEGORIES" dense></v-select>
            </v-list-item>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text>
                Apply
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <!-- Search Result Cards -->
        <v-col cols="8">
          <v-card v-for="posting in postings" :key="posting.uid" elevation="6" outlined style="margin-bottom: 15px;">
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
                    {{ posting.category }}
                  </v-chip>
                  <v-chip
                    class="ma-2"
                    :color="getCreditColour(posting.value)"
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
import { ALLOWED_MEETING_DURATIONS, ALLOWED_USER_POSTING_CATEGORIES, SORT_OPTIONS } from '../../shared/shared_constants';

export default {
  name: 'PostingsPage',
  data() {
    return {
      search: '',
      sortBy: 'Recent',
      postings: [],
      priceStart: "",
      priceEnd: "",
      dateStart: '',
      dateStartMenu: false,
      dateEnd: '',
      dateEndMenu: false,
      category: '',
      duration: -1,

      ALLOWED_MEETING_DURATIONS,
      ALLOWED_USER_POSTING_CATEGORIES,
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
    },
    getCreditColour(value) {
      if (value <= 10) {
        return "green";
      } else if (value <= 25) {
        return "orange";
      } else {
        return "red";
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
