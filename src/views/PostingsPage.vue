<template>
  <v-container>
    <br/>
    <v-row>
      <v-row justify="end" style="margin-bottom: 25px;">
        <v-col cols="9">
          <v-text-field outlined dense single-line v-model="search" type="text" label="Search..." append-icon="fa fa-search"></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-select v-model="sortBy" style="margin-top: -1%;" label="Sort By" :items="SORT_OPTIONS"> </v-select>
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
      sortBy: '',
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
    async viewPostings() {
            // The query from the backend API to get all postings.
            let postings = await this.axios.get('/userPostings/');
            console.log(postings);
            console.log(userPostings);
    },
  },
  mounted() {
    this.viewPostings();
  }
}
</script>

<style scoped>

</style>
