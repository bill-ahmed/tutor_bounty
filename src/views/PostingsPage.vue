<template>
  <v-container>
    <br/>

    <!-- Search Bar -->
    <v-row>
      <v-row justify="center" style="margin-bottom: 25px;">
        <v-col cols="9">
          <v-text-field outlined dense single-line v-model="search" v-on:keyup.enter="searchPosts" type="text" label="Search..." append-icon="fa fa-search"></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-select v-model="sortBy" style="margin-top: -1%;" label="Sort By" :items="SORT_OPTIONS" v-on:change="changeSortOrder"> </v-select>
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
              <v-text-field style="width: 50px; margin-left: -30px; margin-right: 10px;" v-model="priceStart" type="number" min="0"></v-text-field>
              to
              <v-text-field style="width: 50px; margin-left: 10px; margin-right: 10%;" v-model="priceEnd" type="number" min="0"></v-text-field>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-list-item-icon>
                    <v-icon v-if="invalidPrice" v-bind="attrs" v-on="on" style="color: red;">fas fa-exclamation-triangle</v-icon>
                  </v-list-item-icon>
                </template>
                <span>Max price must be greater than min price.</span>
              </v-tooltip>
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
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-list-item-icon>
                    <v-icon v-if="invalidDate" v-bind="attrs" v-on="on" style="color: red;">fas fa-exclamation-triangle</v-icon>
                  </v-list-item-icon>
                </template>
                <span>Start date must be before end date.</span>
              </v-tooltip>
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
              <v-btn v-if="!emptyFilter" text @click="clearFilters">
                Clear
              </v-btn>
              <v-btn :disabled="!filteredResults && ( emptyFilter || invalidDate || invalidPrice)" text @click="filterPosts">
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
                <v-list-item-subtitle style="margin-bottom: 1%;">By {{ posting.user }}</v-list-item-subtitle>
                <v-card-text>{{ getShortDescription(posting.description) }}</v-card-text>
              </v-list-item-content>
              <!-- Right Side of the Card -->
              <div>
                <h3>Value: CR {{ posting.value }}</h3>
                <h3>Date: {{ posting.startDate.getDate() }}/{{ posting.startDate.getMonth() }}/{{ posting.startDate.getFullYear() }}</h3>
                <h3>Time: {{ posting.startTime.toLocaleTimeString() }}</h3>
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
      duration: "",
      results: 0,
      bottom: false,
      filteredResults: false,

      ALLOWED_MEETING_DURATIONS,
      ALLOWED_USER_POSTING_CATEGORIES,
      SORT_OPTIONS,
    }
  },
  methods: {
    async getPostings() {
      this.results = 0;
      this.postings = [];
      let params = {page: this.results, sort: this.sortBy};
      // The query from the backend API to get all postings.
      let res = await this.axios.get('/userPostings/', {params});
      let postings = res.data;
      for (const i in postings) {
        // Convert the start date and time to Date type.
        postings[i].startDate = new Date(postings[i].startDate);
        postings[i].startTime = new Date(postings[i].startTime);
        this.postings.push(postings[i]);
      }
      this.results++;
    },
    getShortDescription(description) {
      if (description.length <= 800) {
        return description;
      } else {
        return description.substring(0, 797) + '...';
      }
    },
    getShortTitle(title) {
      if (title.length <= 35) {
        return title;
      } else {
        return title.substring(0, 35) + '...';
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
    },
    bottomVisible() {
      // Check if the user is at the bottom of the results.
      const scrollY = window.scrollY
      const visible = document.documentElement.clientHeight
      const pageHeight = document.documentElement.scrollHeight
      const bottomOfPage = visible + scrollY >= pageHeight
      return bottomOfPage || pageHeight < visible
    },
    async getMorePostings() {
      // Load 10 more postings.
      // Append to results every time more results are loaded.
      let params = this.getFilters();
      let res = await this.axios.get('/userPostings/', {params});
      let postings = res.data;
      for (const i in postings) {
        this.postings.push(postings[i]);
      }
      this.results++;
    },
    async searchPosts() {
      // Search the posts and return the search results.
      this.postings = [];
      this.results = 0;
      // Reset the filters upon a new search.
      this.clearFilters();
      let params = {page: this.results, search: this.search, sort: this.sortBy};
      // The query from the backend API to get the searched postings.
      let res = await this.axios.get('/userPostings/', {params});
      let postings = res.data;
      for (const i in postings) {
        // Convert the start date and time to Date type.
        postings[i].startDate = new Date(postings[i].startDate);
        postings[i].startTime = new Date(postings[i].startTime);
        this.postings.push(postings[i]);
      }
      this.results++;
    },
    async filterPosts() {
      this.postings = [];
      this.results = 0;
      // Filter the search results according to the filters.
      let params = this.getFilters();
      // The query from the backend API to get the searched and filtered postings.
      let res = await this.axios.get('/userPostings/', {params});
      let postings = res.data;
      for (const i in postings) {
        // Convert the start date and time to Date type.
        postings[i].startDate = new Date(postings[i].startDate);
        postings[i].startTime = new Date(postings[i].startTime);
        this.postings.push(postings[i]);
      }
      this.results++;
      this.checkIfFiltered();
    },
    changeSortOrder() {
      this.getPostings();
    },
    getFilters() {
      let params = {page: this.results, sort: this.sortBy};
      if (this.search) params.search = this.search;
      if (this.dateStart) params.dateStart = this.dateStart;
      if (this.dateEnd) params.dateEnd = this.dateEnd;
      if (this.priceStart) params.priceStart = this.priceStart;
      if (this.priceEnd) params.priceEnd = this.priceEnd;
      if (this.duration) params.duration = this.duration;
      if (this.category) params.category = this.category;
      return params;
    },
    checkIfFiltered() {
      this.filteredResults = false;
      if (this.dateStart) this.filteredResults = true;
      if (this.dateEnd) this.filteredResults = true;
      if (this.priceStart) this.filteredResults = true;
      if (this.priceEnd) this.filteredResults = true;
      if (this.duration) this.filteredResults = true;
      if (this.category) this.filteredResults = true;
    },
    clearFilters() {
      this.dateStart = "";
      this.dateEnd = "";
      this.priceStart = "";
      this.priceEnd = "";
      this.duration = "";
      this.category = "";
    }
  },
  watch: {
    bottom(bottom) {
      if (bottom) {
        // If the user gets to the bottom.
        this.getMorePostings();
      }
    }
  },
  computed: {
    emptyFilter: function () {
      return (this.dateStart + this.dateEnd + this.priceStart + this.priceEnd + this.duration + this.category) ? false : true;
    },
    invalidPrice: function() {
      if (this.priceStart && this.priceEnd) {
        return (Number(this.priceStart) >= Number(this.priceEnd)) ? true : false;
      } else {
        return false;
      }
    },
    invalidDate: function() {
      if (this.dateStart && this.dateEnd) {
        return (Date.parse(this.dateStart) >= Date.parse(this.dateEnd)) ? true : false;
      } else {
        return false;
      }
    }
  },
  created() {
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
  },
  beforeMount() {
    this.getPostings();
  }
}
</script>
