<template>
  <v-container>
    <div v-if="$currentUser">
      <p class="subtitle"> Welcome, {{ $currentUser.name }}. </p>
      <p> Your email: {{ $currentUser.email }} </p>
      <p> Link to your profile picture: <u> {{ $currentUser.profileImageURL }} </u> </p>
    </div>
    
    <br/>

    <p>Home page.</p>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

export default Vue.extend({
  name: 'Home',
});
</script>
