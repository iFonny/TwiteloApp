<template>
  <div class="has-footer">
    <section class="hero">

      <site-description />

      <examples />

      <games-list :games-list="gamesList" />

    </section>

    <footer-home :latest-users="latestUsers" />

  </div>
</template>

<script>
import VueNotifications from "vue-notifications";

import Examples from "~/components/home/Examples";
import GamesList from "~/components/home/GamesList";
import SiteDescription from "~/components/home/SiteDescription";
import FooterHome from "~/components/home/FooterHome";

export default {
  components: {
    Examples,
    GamesList,
    SiteDescription,
    FooterHome
  },
  async asyncData({ app }) {
    let gamesList = [];
    let latestUsers = [];
    try {
      gamesList = (await app.$axios.$get("/api/game/min")).data;
      latestUsers = [
        {
          username: "iFonny_",
          pp:
            "http://pbs.twimg.com/profile_images/963649016004272129/VhbWWXT__normal.jpg" // TODO: remplacer '_400x400' par '_normal' server-side
        }
      ]; // TODO: REQUEST LATEST USERS
    } catch (e) {
      gamesList = [];
      latestUsers = [];
    }

    return { gamesList, latestUsers };
  },
  methods: {
    async logout() {
      await this.$store.dispatch("logout");
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
.has-footer {
  padding-bottom: 6rem;
}
</style>
