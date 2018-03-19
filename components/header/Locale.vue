<template>

  <b-dropdown class="dropdown-locale" hoverable>

    <a class="navbar-item navbar-item-no-bg no-select" slot="trigger">
      <img :src="getLocaleImagePath($store.state.locale)">
    </a>

    <b-dropdown-item v-for="locale in getLocalesWithoutCurrent()" :key="locale" @click="setLocale(locale)" :disabled="$store.state.buttons.langDisabled">
      <img :src="getLocaleImagePath(locale)">
    </b-dropdown-item>

  </b-dropdown>

</template>

<script>
import moment from "moment";
import VueNotifications from "vue-notifications";

export default {
  methods: {
    getLocalesWithoutCurrent() {
      return this.$store.state.locales.filter(
        locale => this.$store.state.locale != locale
      );
    },
    getLocaleImagePath(locale) {
      return `/images/locales/${locale}.png`;
    },
    setLocale(locale) {
      moment.locale(locale);
      this.$i18n.locale = locale;
      this.$store.dispatch("setLocale", locale).catch(e => {
        this.$store.dispatch("setError", e);
        this.showNotification({
          title: this.$store.state.error.statusCode.toString(),
          message: this.$store.state.error.message,
          type: "error",
          timeout: 5000
        });
      });
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
.dropdown-locale {
  width: 60px;
}

a.dropdown-item {
  padding-right: 1rem;
  background-color: #363636;
}

a.dropdown-item:hover {
  background-color: #454545;
}

a.dropdown-item:last-child {
  border-radius: 0px 0px 8px 8px;
}
</style>


<style>
.dropdown-locale .dropdown-content {
  border-radius: 0px 0px 8px 8px;
  box-shadow: none;
  padding-bottom: 0px;
  padding-top: 0px;
  background-color: #3d3d3d;
  width: 60px;
}

.dropdown-locale .dropdown-menu {
  padding-top: 0px;
  z-index: 100;
  width: 60px;
}
</style>
