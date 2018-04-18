<template>
  <section class="settings-section">
    <b-tabs position="is-centered" class="block has-text-centered">

      <b-tab-item :label="$t('settings.tab.general')" icon-pack="fas" icon="cogs">

        <general />

      </b-tab-item>

      <b-tab-item :label="$t('settings.tab.notifications')" icon-pack="fas" icon="bell">

        <notifications />

      </b-tab-item>

      <b-tab-item :label="$t('settings.tab.tweet-auto')" icon-pack="fab" icon="twitter" disabled>
        WIP
      </b-tab-item>

      <b-tab-item :label="$t('settings.tab.pp')" icon-pack="fas" icon="image" disabled>

        <profile />

      </b-tab-item>

    </b-tabs>
  </section>
</template>

<script>
import General from "~/components/settings/General";
import Profile from "~/components/settings/Profile";
import Notifications from "~/components/settings/Notifications";

export default {
  middleware: "auth",
  components: {
    General,
    Profile,
    Notifications
  },
  fetch({ store, params, error }) {
    return store.dispatch("settings/fetchSettings").catch(e => {
      store.dispatch("setError", e);
      error(state.error);
    });
  },
  data() {
    return {
      activeTab: 0
    };
  },
  methods: {}
};
</script>

<style scoped>
.settings-section {
  margin-top: 0.7rem;
}
.divider-settings {
  background-color: #585858;
}
.settings-section .tab-item {
  margin: 0 5rem;
}
@media screen and (max-width: 1024px) {
  .settings-section {
    margin-top: 0;
  }
}
@media screen and (max-width: 1024px) {
  .settings-section .tab-item {
    margin: 0;
  }
}
</style>


<style>
.settings-section .tabs a:hover {
  border-bottom-color: #82b9f9;
  color: #82b9f9;
}
.settings-section .tabs li.is-active a {
  border-bottom-color: #82b9f9;
  color: #82b9f9;
}
.settings-section .tabs li {
  width: 100%;
}
.settings-section .tab-content {
  background: linear-gradient(to bottom, #363636, transparent);
}

@media screen and (max-width: 768px) {
  .settings-section .tabs ul {
    flex-direction: column;
  }
}
</style>
