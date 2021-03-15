<template>
  <v-row justify="center">
    <v-spacer v-if="!fullWidth"/>
    <v-col>
      <v-alert v-for="err in errors" :key="(err.msg || err.message)" dismissible type="error" border="left" min-width="350px" :max-width="fullWidth ? '' : '700px'">
        {{ err.msg || err.message }}
      </v-alert>
    </v-col>
    <v-spacer v-if="!fullWidth"/>
  </v-row>
</template>

<script>
export default {
  name: 'ErrorAlert',
  
  props: {
    errors: {
      type: Array,
      required: true
    },
    fullWidth: {
      type: Boolean,
      required: false,
    }
  },

  data() {
    return {
      errs: Array.isArray(this.errors) ? this.errors : [{ msg: 'Unknown error!' }]
    }
  }
}
</script>

<style>

</style>