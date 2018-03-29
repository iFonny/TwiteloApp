<template>
  <b-dropdown position="is-bottom-left" class="dropdown-user">
    <nuxt-link :to="''" class="navbar-item navbar-item-line no-select" slot="trigger">
      <img class="round-pp-menu" :src="$store.state.user.info.profile_image_url" :href="profileUrl" onerror="/images/errors/default_profile.png">
    </nuxt-link>

    <nuxt-link :to="''" @click.native="closePopupUser()" id="dropdown-user-button-close" class="button dropdown-user-button is-dark is-hidden-desktop">
      <b-icon pack="fas" icon="times-circle"></b-icon>
      <span class="sub-menu-button">{{$t('navbar.close-popup')}}</span>
    </nuxt-link>
    <div class="card-content">
      <div class="media media-menu">
        <a class="media-left no-select" :href="profileUrl">
          <img class="round-pp-user no-select" :src="$store.state.user.info.profile_image_url" onerror="/images/errors/default_profile.png">
        </a>
        <div class="media-content">
          <p class="is-6 has-text-white text-overflow-is-ellipsis">{{ $store.state.user.info.name }}</p>
          <p class="is-6 has-text-grey-lighter has-text-weight-light is-italic text-overflow-is-ellipsis">@{{ $store.state.user.info.username }}</p>
        </div>

        <div class="media-right media-right-switch">
          <b-switch @input="changeSwitch()" :value="$store.state.user.info.switch" type="is-success" size="is-medium" :disabled="$store.state.switch.disabled"></b-switch>
        </div>
      </div>

      <div class="content has-text-centered">
        <span v-html="formatedDescription"></span>
        <br>
      </div>
    </div>

    <div class="columns is-gapless is-multiline">
      <nuxt-link :to="'/about'" @click.native="closePopupUser()" class="column is-half button is-light dropdown-user-button is-dark">
        <b-icon pack="fas" icon="info-circle"></b-icon>
        <span class="sub-menu-button">{{$t('navbar.user.about')}}</span>
      </nuxt-link>
      <nuxt-link :to="'/contact'" @click.native="closePopupUser()" class="column is-half button is-light dropdown-user-button is-dark">
        <b-icon pack="fas" icon="envelope"></b-icon>
        <span class="sub-menu-button">{{$t('navbar.user.contact')}}</span>
      </nuxt-link>
      <a href="/auth/logout" @click.native="logout()" id="dropdown-user-button-logout" class="column button dropdown-user-button is-red">
        <b-icon pack="fas" icon="sign-out-alt"></b-icon>
        <span class="sub-menu-button">{{$t('navbar.user.logout')}}</span>
      </a>
    </div>

  </b-dropdown>
</template>

<script>
import VueNotifications from "vue-notifications";

export default {
  data() {
    return {
      profileUrl: this.$store.state.user.info
        ? "http://twitter.com/" + this.$store.state.user.info.username
        : null,
      formatedDescription: !this.$store.state.user.info
        ? null
        : this.$store.state.user.info.description
            .replace(
              /((?:http|https):\/\/(?:[\w-]+)(?:\.[\w-]+)+(?:[\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?)/g,
              '<a class="has-text-cyan" target="_blank" href="$1">$1</a>'
            )
            .replace(
              /@(\w+)/g,
              '<a class="has-text-cyan" target="_blank" href="https://twitter.com/$1">@$1</a>'
            )
            .replace(
              /#(\w+)/g,
              '<a class="has-text-cyan" target="_blank" href="https://twitter.com/hashtag/$1?src=hash">#$1</a>'
            )
    };
  },
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
    },
    closePopupUser() {
      if (document.getElementsByClassName("background").length) {
        document.getElementsByClassName("background")[0].click();
      }
    },
    async logout() {
      await this.$store.dispatch("user/logout");
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
.navbar-item img {
  max-height: 2.4rem;
}
.round-pp-menu {
  object-fit: cover;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 100%;
  border: 1px solid white;
  cursor: pointer;
}

.round-pp-user {
  object-fit: cover;
  height: 50px;
  width: 50px;
  border-radius: 100%;
  border: 1px solid white;
  cursor: pointer;
}

.media-menu {
  margin-bottom: 10px;
}
.media-right-switch {
  padding-top: 10px;
}
.dropdown-user-button {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0px;
}
#dropdown-user-button-logout {
  border-radius: 0px 0px 0px 15px;
}

/* mobile */
@media screen and (max-width: 1023px) {
  #dropdown-user-button-logout {
    border-radius: 0px 0px 15px 15px;
  }
  #dropdown-user-button-close {
    border-radius: 15px 15px 0 0;
  }
}
@media screen and (max-width: 370px) {
  .media-right-switch {
    display: none;
  }
}
</style>


<style>
.dropdown-user .dropdown-menu {
  padding-top: 0px;
  z-index: 100;
  width: 33rem;
}

.dropdown-user .dropdown-content {
  padding-top: 0;
  border-radius: 0px 0px 0px 15px;
  box-shadow: none;
  padding-bottom: 0px;
  opacity: 0.98;
  background-color: #3d3d3d;
}

/* mobile */
@media screen and (max-width: 1023px) {
  .dropdown-user .dropdown-content {
    border-radius: 15px 15px 15px 15px;
  }
}
</style>
