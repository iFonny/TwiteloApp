<template>
  <article class="tile is-child has-text-centered desc-preview">

    <div class="profile-preview-title">
      <p class="title is-4 has-text-white text-overflow-is-ellipsis">{{$t('home.preview')}}</p>
    </div>
    <div class="profile-preview-container">

      <div v-if="!navigation">
        <div v-if="preview.loading" class="loading-overlay is-full-height is-active">
          <div class="loading-icon"></div>
        </div>
        <div v-else-if="preview.needUpdate" @click="refreshPreview()" class="loading-overlay is-full-height is-active need-update">
          <div>
            <b-icon size="is-large" pack="fas" icon="sync-alt" custom-class="fa-spin">
            </b-icon><br>
            <p class="is-size-5 has-text-weight-semibold">{{$t('builder.refresh-preview')}}</p>
          </div>
        </div>
      </div>

      <div class="profile-preview-banner">
        <img class="round-pp-preview no-select" :src="$store.state.user.info ? $store.state.user.info.profile_image_url : '/images/iFonny.jpg'" onerror="/images/errors/default_profile.png">
      </div>
      <div v-if="!navigation" class="profile-preview-desc">
        <p class="is-size-4 is-size-5-touch has-text-white has-text-weight-bold text-overflow-is-ellipsis" v-html="preview.name"></p>
        <p class="is-size-5 is-size-6-touch has-text-white-ter has-text-weight-light is-italic" v-html="preview.description"></p>
        <p class="is-size-6 has-text-grey-lighter has-text-weight-light text-overflow-is-ellipsis">
          <b-icon icon="map-marker" size="is-small" class="icon-bio-example"></b-icon>
          <span v-html="preview.location"></span>
        </p>
        <p class="is-size-6 has-text-weight-light has-text-info text-overflow-is-ellipsis">
          <b-icon pack="fas" icon="link" size="is-small" class="icon-bio-example"></b-icon>
          <span v-html="preview.url"></span>
        </p>
      </div>
      <div v-else-if="navigation == 'info'" class="profile-save-info">
        <p class="is-size-6 has-text-white-ter has-text-weight-light animated fadeIn" v-html="$t('builder.profil-warn-data-example')"></p>
        <p class="is-size-6 has-text-white-ter has-text-weight-light animated fadeIn" v-html="$t('builder.profil-warn-data-update')"></p>
      </div>
    </div>
    <!-- CANCEL/NEXT BUTTON (to destination selection) -->
    <div class="nav-buttons columns is-gapless is-mobile">
      <button v-if="!navigation" @click="openInfoPopup()" class="column is-2 button is-light is-medium align-vertical-center">
        <b-icon pack="fas" icon="info-circle"></b-icon>
      </button>
      <button v-else @click="closePopup()" class="column is-3 button is-light is-medium align-vertical-center">
        <b-icon pack="fas" icon="times-circle"></b-icon>
        <span class="is-size-6 is-size-7-mobile">{{$t('builder.close')}}</span>
      </button>
      <button @click="saveProfile()" class="column button is-lightgreen is-medium align-vertical-center" :disabled="!checkCharacters" :class="loadingButtons.save ? 'is-loading' : ''">
        <b-icon pack="fas" icon="save"></b-icon>
        <span v-if="!checkCharacters" class="is-size-6 is-size-7-mobile">Trop de caractères pour sauvegarder</span>
        <span v-else>{{$t('builder.save')}}</span>
      </button>
    </div>
  </article>
</template>

<script>
import { mapState } from "vuex";
import VueNotifications from "vue-notifications";

export default {
  data() {
    return {
      navigation: null,
      loadingButtons: {
        save: false
      }
    };
  },
  computed: {
    ...mapState({
      preview: state => state.builder.preview,
      textCounter: state => state.builder.textCounter,
      profileSaved: state => state.builder.preview.saved
    }),
    checkCharacters() {
      if (this.textCounter.name < 0) return false;
      if (this.textCounter.description < 0) return false;
      if (this.textCounter.location < 0) return false;
      if (this.textCounter.url < 0) return false;
      return true;
    }
  },
  watch: {
    profileSaved(newValue, oldValue) {
      function confirmExit() {
        return "You have attempted to leave this page.  If you have made any changes to the fields without clicking the Save button, your changes will be lost.  Are you sure you want to exit this page?";
      }
      if (!newValue) window.onbeforeunload = confirmExit;
      else window.onbeforeunload = null;
    }
  },
  methods: {
    openInfoPopup() {
      this.navigation = "info";
    },
    closePopup() {
      this.navigation = null;
    },
    async saveProfile() {
      this.loadingButtons.save = true;

      await this.$store.dispatch("builder/saveProfile").catch(e => {
        this.$store.dispatch("setError", e);
        this.showNotification({
          title: this.$store.state.error.statusCode.toString(),
          message: this.$store.state.error.message,
          type: "error",
          timeout: 5000
        });
      });
      setTimeout(() => {
        this.loadingButtons.save = false;
      }, 1000);
    },
    async refreshPreview() {
      await this.$store.dispatch("builder/refreshPreview").catch(e => {
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
.profile-preview-title {
  padding: 0.4rem;
  padding-bottom: 0.5rem;
  background-color: #363636ab;
  box-shadow: 0px 3px 19px rgb(17, 17, 17);
}

.profile-preview-container {
  box-shadow: 0px 4px 16px rgb(17, 17, 17);
  margin: 0;
  padding: 0;
  width: 100%;
}

.profile-preview-banner {
  padding: 0.6rem;
  background-image: url("/banner.jpg");
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
}

.profile-preview-desc {
  background-color: #363636;
  padding-left: 20%;
  padding-right: 20%;
  padding-top: 1rem;
  padding-bottom: 1rem;
}
.profile-preview-desc p {
  line-height: 1.5rem;
}

.profile-save-info {
  background-color: #363636;
  padding: 1.5rem 0.5rem;
}
.profile-save-info p {
  line-height: 2.3rem;
}

@media screen and (max-width: 900px) {
  .profile-preview-desc {
    padding-left: 10%;
    padding-right: 10%;
  }
}
@media screen and (max-width: 600px) {
  .profile-preview-desc {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}

.icon-bio-example {
  margin-right: 0.2rem;
}

.round-pp-preview {
  object-fit: cover;
  height: 80px;
  width: 80px;
  border-radius: 100%;
  border: 1px solid rgb(26, 26, 26);
  cursor: pointer;
}

.round-pp-preview-mobile {
  object-fit: cover;
  height: 50px;
  width: 50px;
  border-radius: 100%;
  border: 1px solid white;
  cursor: pointer;
}

.nav-buttons {
  width: 100%;
}
.nav-buttons .button {
  border: unset;
  border-radius: 0;
}
.need-update {
  cursor: pointer;
}
</style>

<style>
.profile-preview-desc .tag {
  margin: 0 0.1rem;
  vertical-align: middle;
  height: 1.3rem;
}
.profile-preview-container {
  position: relative;
}
.desc-preview .loading-overlay {
  background-color: rgba(20, 20, 20, 0.8) !important;
}
/* .game-select .card {
  height: 86%;
}
.game-select .collapse-content {
  height: 100%;
}
.game-select .card-content {
  height: 100%;
  padding: 0.1rem;
} */
</style>

