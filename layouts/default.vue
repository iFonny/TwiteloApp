<template>
  <div>
    <div class="background-image"></div>
    <nav-bar/>
    <nuxt/>
  </div>
</template>

<script>
import NavBar from "~/components/header/NavBar";

export default {
  mounted: function() {
    var socket = this.$socket;

    /* close le websocket avant de quitter la page */
    window.addEventListener("beforeunload", function() {
      console.log("closing socket");
      socket.close();
    });

    /* set auth header for api requests & websockets */
    if (this.$store.state.user.info) {
      this.$axios.setToken(this.$store.state.user.info.twitelo_token);

      if (this.$store.state.socket.isConnected) {
        // send auth
        socket.sendObj({
          type: "AUTH",
          data: { twiteloToken: this.$store.state.user.info.twitelo_token }
        });
      } else {
        setTimeout(() => {
          socket.sendObj({
            type: "AUTH",
            data: { twiteloToken: this.$store.state.user.info.twitelo_token }
          });
        }, 5000);
      }
    }
  },
  components: { NavBar }
};
</script>


<style>

</style>

<style lang="scss">
// Import Bulma's core
@import "~bulma/sass/utilities/_all";

// Set your colors
$primary: #82b9f9;
$primary-invert: findColorInvert($primary);
$twitter: #4099ff;
$twitter-invert: findColorInvert($twitter);
$cyan: #5ed6fa;
$cyan-invert: findColorInvert($cyan);
$red: #e41e1e;
$red-invert: findColorInvert($red);
$lightblue: #82b9f9;
$lightblue-invert: findColorInvert($lightblue);
$lightgreen: #81d29d;
$lightgreen-invert: findColorInvert($lightgreen);
$lightred: #e26a6a;
$lightred-invert: findColorInvert($lightred);

// Setup $colors to use as bulma classes (e.g. 'is-twitter')
$colors: (
  "white": ($white, $black),
  "black": ($black, $white),
  "light": ($light, $light-invert),
  "dark": ($dark, $dark-invert),
  "primary": ($primary, $primary-invert),
  "info": ($info, $info-invert),
  "success": ($success, $success-invert),
  "warning": ($warning, $warning-invert),
  "danger": ($danger, $danger-invert),
  "twitter": ($twitter, $twitter-invert),
  "cyan": ($cyan, $cyan-invert),
  "red": ($red, $red-invert),
  "lightblue": ($lightblue, $lightblue-invert),
  "lightgreen": ($lightgreen, $lightgreen-invert),
  "lightred": ($lightred, $lightred-invert)
);

// Links
$link: $primary;
$link-invert: $primary-invert;
$link-focus-border: $primary;

$text: $white;
$body-background-color: $black;

// Import Bulma and Buefy styles
@import "~bulma";
@import "~buefy/src/scss/buefy";
// Import Bulma-extensions (https://wikiki.github.io/)
@import "~bulma-extensions/bulma-slider/dist/bulma-slider";
@import "~bulma-extensions/bulma-steps/dist/bulma-steps";
@import "~bulma-extensions/bulma-timeline/dist/bulma-timeline";
@import "~bulma-extensions/bulma-badge/dist/bulma-badge";

/* Overwrite bulma */
.background-image {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  display: block;
  background-image: url("/background-blur.jpg");
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
  width: 100%;
  height: 100%;
}

html.has-navbar-fixed-top,
html.has-navbar-fixed-top-desktop {
  padding-top: 4rem;
}

.dropdown-item,
.dropdown .dropdown-menu .has-link a,
.title,
.navbar-item,
.navbar-item:hover,
.modal-card-title {
  color: white !important;
}

.subtitle  {
  color: darkgrey;
}

.label  {
  color: lightgrey;
}

/* Overwrite modal */
.modal-card-head,
.modal-card-foot {
  background-color: #353535;
}
.modal-card-body {
  background-color: #3d3d3d;
}
a:hover {
  color: #81d29d;
}

/* Overwrite card */
.card {
  background: unset;
  box-shadow: unset;
}
.card-content {
  background-color: rgba(54, 54, 54, 0.6313725490196078);
  box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
}
.card-header {
  background-color: #2d2d2d;
  box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
}

/* Font */
body {
  font-family: Rubik;
}

/* Switch green/red */
.switch:hover input[type="checkbox"] + .check {
  background: #df4343 !important;
  box-shadow: none !important;
}

.switch input[type="checkbox"] + .check {
  background: #df4343 !important;
  box-shadow: none !important;
}

.switch:hover input[type="checkbox"]:checked + .check {
  background: #3eca6f !important;
  box-shadow: none !important;
}

.switch input[type="checkbox"]:checked + .check {
  background: #3eca6f !important;
  box-shadow: none !important;
}

/* Perso */

.footer.is-fixed-bottom {
  left: 0;
  position: fixed;
  right: 0;
  z-index: 30;
}
.footer.is-fixed-bottom {
  bottom: 0;
}

.footer.is-fixed-bottom.has-shadow {
  -webkit-box-shadow: 0 -2px 3px rgba(10, 10, 10, 0.1);
  box-shadow: 0 -2px 3px rgba(10, 10, 10, 0.1);
}

@media screen and (max-width: 1023px) {
  .footer.is-fixed-bottom-touch {
    left: 0;
    position: fixed;
    right: 0;
    z-index: 30;
  }
  .footer.is-fixed-bottom-touch {
    bottom: 0;
  }
  .footer.is-fixed-bottom-touch.has-shadow {
    -webkit-box-shadow: 0 -2px 3px rgba(10, 10, 10, 0.1);
    box-shadow: 0 -2px 3px rgba(10, 10, 10, 0.1);
  }
}

.text-overflow-is-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.text-overflow-is-clip {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
}
.align-vertical-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

