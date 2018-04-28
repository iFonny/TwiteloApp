<template>
  <header>

    <nav class="navbar is-dark is-fixed-top has-text-white">

      <div class="navbar-brand">

        <user v-if="$store.state.user.info" class="is-hidden-desktop" />
        <switch-toggle v-if="$store.state.user.info" class="is-hidden-desktop" />
        <notifications v-if="$store.state.user.info" class="is-hidden-desktop" />

        <login v-if="!$store.state.user.info" class="is-hidden-desktop" />

        <logo/>
        <div id="menu-burger-icon" @click="toggleBurger()" class="navbar-burger navbar-item-no-bg">
          <span></span>
          <span></span>
          <span></span>
        </div>

      </div>

      <burger class="is-hidden-desktop" />

      <div class="navbar-menu">

        <div class="navbar-start">

          <about v-if="!$store.state.user.info" />
          <builder v-if="$store.state.user.info" />
          <donate/>
          <contact/>
          <!-- <stats/> -->
          <!-- <faq/> -->

        </div>

        <div class="navbar-end">

          <login v-if="!$store.state.user.info" />

          <switch-toggle v-if="$store.state.user.info" />
          <notifications v-if="$store.state.user.info" />
          <settings v-if="$store.state.user.info" />
          <locale/>
          <user v-if="$store.state.user.info" />

        </div>
      </div>
    </nav>

  </header>
</template>

<script>
import Logo from "~/components/header/Logo";
import Builder from "~/components/header/Builder";
import Stats from "~/components/header/Stats";
import Contact from "~/components/header/Contact";
import About from "~/components/header/About";
import Donate from "~/components/header/Donate";
/* import Faq from "~/components/header/Faq"; */

import Login from "~/components/header/Login";

import Burger from "~/components/header/Burger";

import SwitchToggle from "~/components/header/SwitchToggle";
import Notifications from "~/components/header/Notifications";
import Settings from "~/components/header/Settings";
import Locale from "~/components/header/Locale";
import User from "~/components/header/User";

import VueNotifications from "vue-notifications";

export default {
  components: {
    Logo,
    Builder,
    Stats,
    Contact,
    About,
    Donate,
    /*     Faq, */
    Login,
    Burger,
    SwitchToggle,
    Notifications,
    Settings,
    Locale,
    User
  },
  mounted() {
    /* websocket handler */
    this.$options.sockets.onmessage = ({ data }) => {
      try {
        const message = JSON.parse(data);

        switch (message.type) {
          case "NOTIFICATION":
            this.showNotification({
              title: message.data[this.$store.state.locale].title,
              message: message.data[this.$store.state.locale].content,
              type: message.data.type,
              timeout: 5000
            });
            break;

          default:
            console.error("Websocket on message unknown type: " + message);
            break;
        }
      } catch (error) {
        console.error(
          "Websocket on message error: " + error + "\n data:  " + data
        );
      }
    };
  },
  notifications: {
    showNotification: {
      type: VueNotifications.types.success,
      title: "Default",
      message: "That's the success!"
    }
  },
  methods: {
    toggleBurger() {
      document.getElementById("menu-burger").classList.toggle("is-active");
      document.getElementById("menu-burger-icon").classList.toggle("is-active");
    }
  }
};
</script>

<style scoped>
.navbar {
  height: 4rem !important;
  box-shadow: 0px 2px 10px black;
  padding: 0 0;
}

@media screen and (max-width: 1023px) {
  .navbar,
  .navbar-brand {
    height: 3.25rem !important;
  }
}
</style>

<style>
.navbar-item-no-bg,
.navbar-item-no-bg:hover {
  background: none !important;
}
.no-select {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.navbar-item-line-active,
.navbar-item-line:hover {
  background: none !important;
  box-shadow: 0px -1px white inset;
}
.sub-menu-button {
  margin-left: 5px;
}
.menu-button {
  margin-left: 10px;
}
.navbar-dropdown-menu {
  background-color: #3d3d3d !important;
  border: 0px;
}
.navbar-item-menu:hover {
  background-color: #4d4c4c !important;
}
</style>
