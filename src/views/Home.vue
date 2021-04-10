<template>
  <v-container fluid style="position: relative">
    <img id="bg_image"
    width="60%"
      :src="bgImage"
    />
    <span id="header_content">
      <p id="header_text">
        Where students <br/> come together.
      </p>

      <h4 id="header_sub_text">
        Millions of students working together
        towards a brighter future &mdash; the most
        sophisticated platform for e-learning.
      </h4>
    </span>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Home',
  computed: {
    bgImage() {
      return require('@/media/homepage-bg.jpeg');
    }
  }
});
</script>

<style scoped>
.container {
  /* height: 100%; */
  min-height: 80vh;
}

#header_content {
  position: absolute; 
  top: 22%;
  left: 15%;
}

#header_text {
  font-size: 5em;
  font-family: Gill Sans;

  line-height: 75px;
}

#header_sub_text {
  font-size: 21pt;
  font-weight: 500;

  color: rgba(0, 0, 0, 0.5);
  
  margin-left: 10px;
  max-width: 500px;
}

#bg_image {
  position: absolute;
  opacity: 0.9;
  right: 5%;

  top: 5%;
}

@media screen and (max-width: 800px) {

  #header_content {
    top: 10%;
  }

  #bg_image {
    width: 100%;
    right: 0; bottom: 0; left: 0;

    opacity: 0.5;
  }
}
</style>
