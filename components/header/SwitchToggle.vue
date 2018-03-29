<template>
  <nuxt-link :to="''" id="navbar-item-switch" class="navbar-item navbar-item-no-bg">
    <b-tooltip :label="$t('navbar.switch.tooltip')" type="is-light" position="is-left" class="is-hidden-touch">
      <b-switch @click.native="changeSwitch()" :value="$store.state.user.info.switch" type="is-success" size="is-medium" :disabled="$store.state.switch.disabled"></b-switch>
    </b-tooltip>
    <b-tooltip :label="$t('navbar.switch.tooltip')" type="is-light" position="is-bottom" size="is-small" class="is-hidden-desktop" multilined>
      <b-switch @click.native="changeSwitch()" :value="$store.state.user.info.switch" type="is-success" size="is-medium" :disabled="$store.state.switch.disabled"></b-switch>
    </b-tooltip>
  </nuxt-link>
</template>

<script>
import VueNotifications from "vue-notifications";

export default {
  methods: {
    changeSwitch() {
      if (!this.$store.state.switch.disabled) {
        this.$store
          .dispatch("changeSwitch", !this.$store.state.user.info.switch)
          .catch(e => {
            this.$store.dispatch("setError", e);
            this.showNotification({
              title: this.$store.state.error.statusCode.toString(),
              message: this.$store.state.error.message,
              type: "error",
              timeout: 5000
            });
          });
      }
    }
  },
  notifications: {
    showNotification: {
      type: VueNotifications.types.success,
      title: "Default",
      message: "That's the success!"
    }
  }
};
</script>


<style scoped>
#navbar-item-switch {
  padding-right: 0px;
  padding-left: 0px;
}
</style>
