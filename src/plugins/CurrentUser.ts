import Vue from 'vue'

/** A plugin to populate the currentUser context. */
export const CurrentUserPlugin = {
  install(Vue, options) {
    Vue.prototype.$currentUser = null;
  }
}

Vue.use(CurrentUserPlugin);