<template>
  <v-container>
    <v-img
      contain
      max-width="75%"
      :src="bgImage"
      style="float: right; margin-right: -13%; margin-top: -10px;"
    >
    </v-img>
    <span style="position: absolute; float: right; margin-left: 2%; margin-top: 15%">
      <p class="text-center"
          style="align-items: center;
                 font-size: 70px;
                 font-family: Gill Sans;
                 text-shadow: 2px 2px 5px #9a9b99;">
          Where students
        </p>
        <p class="text-center"
          style="align-items: center;
                 font-size: 70px;
                 font-family: Gill Sans;
                 text-shadow: 2px 2px 5px #9a9b99;
                 margin-top: -50px">
          come together
        </p>
        <h4 class="text-center"
            style="align-items: center;
                   font-size: 17px;
                   font-family: Gill Sans;
                   font-color: #9a9b99;
                   margin-top: -10px;">
          Millions of students working together <br/>
          towards a brighter future &mdash; the most <br/>
          sophisticated platform for e-learning.
        </h4>
    </span>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

export default Vue.extend({
  name: 'Home',
  computed: {
    bgImage() {
      return require('@/media/homepage-bg.jpeg');
    }
  }
});
</script>
