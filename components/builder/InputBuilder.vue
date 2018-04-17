<template>
  <article class="tile is-child has-text-centered builder-inputs">
    <b-collapse class="card">
      <div slot="trigger" slot-scope="props" class="card-header no-select">
        <div class="card-header-title">
          <h1 class="title is-size-6-mobile is-size-5-desktop is-size-5">{{$t('builder.builder')}}</h1>
        </div>
        <a class="card-header-icon">
          <b-icon :icon="props.open ? 'menu-down' : 'menu-up'">
          </b-icon>
        </a>
      </div>
      <div class="card-content">

        <div class="builder-container">
          <div v-if="builderLoading" class="loading-overlay is-full-height is-active">
            <div class="loading-icon"></div>
          </div>

          <b-field grouped>
            <b-switch @click.native="changeSwitch('name')" :value="twiteloData.name.status" type="is-success" size="is-medium" :disabled="!user.switch || switchDisabled.name"></b-switch>

            <b-input expanded @input="updateName" :value="twiteloDataInput.name" :placeholder="$t('builder.placeholder.name')" icon="account"></b-input>
            <div class="text-counter control align-vertical-center">
              <span :class="getCounterColor('name')">{{textCounter.name}}</span>
            </div>
          </b-field>

          <b-field grouped>
            <b-switch @click.native="changeSwitch('location')" :value="twiteloData.location.status" type="is-success" size="is-medium" :disabled="!user.switch || switchDisabled.location"></b-switch>
            <b-input expanded @input="updateLocation" :value="twiteloDataInput.location" :placeholder="$t('builder.placeholder.location')" icon-pack="fas" icon="map-marker-alt"></b-input>
            <div class="text-counter control align-vertical-center">
              <span :class="getCounterColor('location')">{{textCounter.location}}</span>
            </div>
          </b-field>

          <b-field grouped>
            <b-switch @click.native="changeSwitch('description')" :value="twiteloData.description.status" size="is-medium" type="is-success" :disabled="!user.switch || switchDisabled.description"></b-switch>
            <b-input expanded @input="updateDescription" :value="twiteloDataInput.description" type="textarea" :placeholder="$t('builder.placeholder.description')"></b-input>
            <p class="text-counter control align-vertical-center">
              <span :class="getCounterColor('description')">{{textCounter.description}}</span>
            </p>
          </b-field>
        </div>
        <!-- CANCEL/NEXT BUTTON (to destination selection) -->
        <div class="nav-buttons columns is-gapless is-mobile">
          <button @click="saveProfile()" class="column button is-lightgreen align-vertical-center" :disabled="!checkCharacters" :class="loadingButtons.save ? 'is-loading' : ''">
            <b-icon pack="fas" icon="save" size="is-small"></b-icon>
            <span v-if="!checkCharacters" class="is-size-6 is-size-7-mobile">{{$t('builder.too-much-char-save')}}</span>
            <span v-else>{{$t('builder.save')}}</span>
          </button>
        </div>
      </div>
    </b-collapse>
  </article>
</template>

<script>
import _ from "lodash";
import { mapState } from "vuex";
import VueNotifications from "vue-notifications";

export default {
  data() {
    return {
      activeTab: 1,
      switchDisabled: {
        name: false,
        description: false,
        location: false
      },
      loadingButtons: {
        save: false
      }
    };
  },
  computed: {
    ...mapState({
      user: state => state.user.info,
      twiteloData: state => state.user.info.twitelo,
      twitterLimits: state => state.builder.twitterLimits,
      builderLoading: state => state.builder.builderLoading,
      twiteloDataInput: state => state.builder.twiteloDataInput,
      textCounter: state => state.builder.textCounter
    }),
    checkCharacters() {
      if (this.textCounter.name < 0) return false;
      if (this.textCounter.description < 0) return false;
      if (this.textCounter.location < 0) return false;
      return true;
    }
  },
  methods: {
    getCounterColor(name) {
      if (this.textCounter[name] > 9) return "has-text-light";
      else {
        if (this.textCounter[name] > 0) return "has-text-warning";
        else if (this.textCounter[name] == 0) return "has-text-lightred";
        else return "has-text-red";
      }
    },
    async saveProfile() {
      this.loadingButtons.save = true;

      await this.$store
        .dispatch("builder/saveProfile")
        .then(() => {
          // If first save
          if (this.user.freshUser) {
            this.$dialog.alert({
              title: this.$t("builder.congratulations"),
              message: `${this.$t("builder.profile-first-save")}<br><br>
        ${this.$t("builder.profile-first-save-info")}<br><br>
        ${this.$t("builder.profil-warn-data-example")}<br>
        ${this.$t("builder.profil-warn-data-update")}`,
              type: "is-success"
            });

            // Activate twitelo switches
            this.$store.commit("user/SET_ALL_TWITELO_SWITCH", true);
            // Set fresh user to false
            this.$store.commit("user/SET_FRESH_USER", false);
          }
        })
        .catch(e => {
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
    async changeSwitch(name) {
      if (!this.switchDisabled[name]) {
        this.switchDisabled[name] = true;

        try {
          await this.$store.dispatch(
            "settings/changeTwiteloSettingSwitch",
            name
          );
        } catch (e) {
          this.$store.dispatch("setError", e);
          this.showNotification({
            title: this.$store.state.error.statusCode.toString(),
            message: this.$store.state.error.message,
            type: "error",
            timeout: 5000
          });
        }

        setTimeout(() => {
          this.switchDisabled[name] = false;
        }, 800);
      }
    },
    updateName: _.debounce(async function(e, test) {
      this.$store.commit("builder/SET_TWITELO_DATA_INPUT", {
        name: "name",
        twiteloDataInput: e
      });
      await this.$store.dispatch("builder/transformToUUID");
      await this.$store.dispatch("builder/updateTextCounters", "name");
      this.$store.commit("builder/SET_PREVIEW_DATA", {
        name: "saved",
        value: false
      });
    }, 500),
    updateDescription: _.debounce(async function(e) {
      this.$store.commit("builder/SET_TWITELO_DATA_INPUT", {
        name: "description",
        twiteloDataInput: e
      });
      await this.$store.dispatch("builder/transformToUUID");
      await this.$store.dispatch("builder/updateTextCounters", "description");
      this.$store.commit("builder/SET_PREVIEW_DATA", {
        name: "saved",
        value: false
      });
    }, 500),
    updateLocation: _.debounce(async function(e) {
      this.$store.commit("builder/SET_TWITELO_DATA_INPUT", {
        name: "location",
        twiteloDataInput: e
      });
      await this.$store.dispatch("builder/transformToUUID");
      await this.$store.dispatch("builder/updateTextCounters", "location");
      this.$store.commit("builder/SET_PREVIEW_DATA", {
        name: "saved",
        value: false
      });
    }, 500)
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
.text-counter {
  min-width: 30px;
}
.builder-inputs .loading-overlay {
  background-color: #1717178c;
}
.builder-inputs .builder-container {
  padding: 0.7rem 0.6rem 0.7rem 0.6rem;
}
.nav-buttons {
  width: 100%;
}
.nav-buttons .button {
  border: unset;
  border-radius: 0;
}
</style>

<style>
.builder-inputs .card-content {
  background-color: #2d2d2d;
  padding: 0;
  height: 100%;
}

/*
.builder-inputs .tab-content {
  height: calc(100% - 49px);
  display: flex;
  justify-content: center;
  align-items: center;
}
.builder-inputs .tab-content .tab-item {
  width: 100%;
}
.builder-inputs .card-content .tabs {
  box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
}
.builder-inputs .card-content .tabs ul {
  padding: 0.5rem;
  padding-bottom: 0;
}*/
.builder-inputs .control.has-icons-left .icon,
.control.has-icons-right .icon {
  color: #bbbaba;
}
.builder-inputs .control.has-icons-left .input:focus ~ .icon,
.builder-inputs .control.has-icons-right .input:focus ~ .icon {
  color: white;
}
</style>

