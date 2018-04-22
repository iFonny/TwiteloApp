<template>

  <div id="menu-burger" class="menu-burger">

    <hr v-if="$store.state.user.info" class="dropdown-divider divider-burger">
    <nuxt-link v-if="$store.state.user.info" @click.native="closePopupBurger()" :to="'/builder/step-by-step'" class="button button-burger is-dark">
      <b-icon pack="fas" icon="paint-brush"></b-icon>
      <span class="sub-menu-button burger-menu-button has-text-grey-light">{{$t('navbar.builder.builder')}}</span>
      -
      <span class="sub-menu-button has-text-grey-lighter">{{$t('navbar.builder.step-by-step')}}</span>
    </nuxt-link>

    <nuxt-link v-if="$store.state.user.info" @click.native="closePopupBurger()" :to="'/builder/classic'" class="button button-burger is-dark">
      <b-icon pack="fas" icon="paint-brush"></b-icon>
      <span class="sub-menu-button burger-menu-button has-text-grey-light">{{$t('navbar.builder.builder')}}</span>
      -
      <span class="sub-menu-button has-text-grey-lighter">{{$t('navbar.builder.classic')}}</span>
    </nuxt-link>

    <hr class="dropdown-divider divider-burger">
    <nuxt-link @click.native="closePopupBurger()" :to="'/stats'" class="button button-burger is-dark">
      <b-icon icon="finance"></b-icon>
      <span class="sub-menu-button has-text-grey-lighter">{{$t('navbar.statistics')}}</span>
    </nuxt-link>

    <hr class="dropdown-divider divider-burger">
    <nuxt-link @click.native="closePopupBurger()" :to="'/donate'" class="button button-burger is-dark">
      <b-icon pack="fab" icon="bitcoin" type="is-warning"></b-icon>
      <span class="sub-menu-button has-text-grey-lighter">{{$t('navbar.donate')}}</span>
    </nuxt-link>

    <!-- <hr class="dropdown-divider divider-burger">
    <nuxt-link @click.native="closePopupBurger()" :to="'/faq'" class="button button-burger is-dark">
      <b-icon pack="far" icon="question-circle" type="is-lightblue"></b-icon>
      <span class="sub-menu-button has-text-grey-lighter">{{$t('navbar.faq')}}</span>
    </nuxt-link> -->

    <hr class="dropdown-divider divider-burger">
    <nuxt-link @click.native="closePopupBurger()" :to="'/about'" class="button button-burger is-dark">
      <b-icon pack="fas" icon="info-circle"></b-icon>
      <span class="sub-menu-button has-text-grey-lighter">{{$t('navbar.user.about')}}</span>
    </nuxt-link>

    <hr class="dropdown-divider divider-burger">
    <nuxt-link @click.native="closePopupBurger()" :to="'/contact'" class="button button-burger is-dark">
      <b-icon pack="fas" icon="envelope"></b-icon>
      <span class="sub-menu-button has-text-grey-lighter">{{$t('navbar.user.contact')}}</span>
    </nuxt-link>

    <hr v-if="$store.state.user.info" class="dropdown-divider divider-burger">
    <nuxt-link v-if="$store.state.user.info" @click.native="closePopupBurger()" :to="'/settings'" class="button button-burger is-dark">
      <b-icon pack="fas" icon="cog"></b-icon>
      <span class="sub-menu-button has-text-grey-lighter">{{$t('navbar.settings')}}</span>
    </nuxt-link>

    <hr class="dropdown-divider divider-burger">
    <div class="locale-links">
      <a class="locale-link" v-for="locale in $store.state.locales" :key="locale" @click="setLocale(locale)">
        <img class="locale-img" :src="getLocaleImagePath(locale)">
      </a>
    </div>

    <hr class="dropdown-divider divider-burger">

  </div>

</template>

<script>
import moment from "moment";
import VueNotifications from "vue-notifications";

export default {
  methods: {
    closePopupBurger() {
      document.getElementById("menu-burger").classList.toggle("is-active");
      document.getElementById("menu-burger-icon").classList.toggle("is-active");
    },
    getLocaleImagePath(locale) {
      return `/images/locales/${locale}.png`;
    },
    setLocale(locale) {
      this.closePopupBurger();
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
.menu-burger {
  width: 100%;
  background-color: #363636;
  display: none;
}
.button-burger {
  width: 100%;
}
.menu-burger.is-active {
  display: block;
}
.burger-menu-button {
  margin-right: 5px;
}
.locale-links {
  margin: 0rem 0.6rem;
  text-align: center;
}
.locale-img {
  margin-top: 0.4rem;
  margin-left: 1rem;
  margin-right: 1rem;
  height: 2.5rem;
}
.divider-burger {
  margin: 0;
}
</style>

<style>

</style>
