<template>
  <v-menu bottom rounded offset-y min-width="200px">
    <template v-slot:activator="{ on }">
      <v-btn dark icon x-large v-on="on" :ripple="false">
        <v-avatar color="primary" size="48">
          <img v-if="$currentUser.profileImageURL" :src="$currentUser.profileImageURL"/>
          <span v-else> {{ usernameInitials }} </span>
        </v-avatar>
      </v-btn>
    </template>
    <v-card>
      <v-list-item-content class="justify-center">
        <v-col>
          <p class="text-h7" style="font-weight: 500;"> Signed in as </p>
          <p class="text-h7 subtitle"> {{ $currentUser.username }} </p>

          <v-divider/>

          <v-row justify="center">
            <v-btn block :ripple="false" text color="primary" to="/new">
              <v-icon small left> fa fa-plus </v-icon>
              Create Posting
            </v-btn>
          </v-row>

          <v-divider/>

          <v-row justify="center">
            <v-btn block text color="error" @click="logout()">
              <v-icon small left> fa fa-sign-out-alt </v-icon>
              Logout
            </v-btn>
          </v-row>
        </v-col>
      </v-list-item-content>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: 'Avatar',
  props: ['logout'],
  data() {
    return { };
  },
  computed: {
    usernameInitials: function() {
      let { name, username } = this.$currentUser;
      return (name || username).slice(0, 1).toUpperCase();
    }
  }
}
</script>

<style scoped>
.v-divider {
  margin: 20px 0;
}

.v-menu {
  z-index: 200;
}
</style>