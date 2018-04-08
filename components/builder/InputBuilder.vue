<template>
  <article class="tile is-child card has-text-centered builder-inputs">

    <b-tabs v-model="activeTab" position="is-centered" class="card-content">

      <div v-if="builderLoading" class="loading-overlay is-full-height is-active">
        <div class="loading-icon"></div>
      </div>

      <!-- <p class="subtitle is-6">Please don't use unauthorized twitter characters</p> -->
      <b-tab-item :label="$t('builder.builder')" disabled>
      </b-tab-item>
      <b-tab-item :label="$t('builder.advanced')" class="advanced">

        <b-field grouped>
          <b-switch @input="changeSwitch('name')" :value="twiteloData.name.status" type="is-success" size="is-medium" :disabled="!user.switch || switchDisabled.name"></b-switch>

          <b-input expanded @input="updateName" :value="twiteloDataInput.name" :placeholder="$t('builder.placeholder.name')" icon="account"></b-input>
          <div class="text-counter control align-vertical-center">
            <span :class="getCounterColor('name')">{{textCounter.name}}</span>
          </div>
        </b-field>

        <b-field grouped>
          <b-switch @input="changeSwitch('location')" :value="twiteloData.location.status" type="is-success" size="is-medium" :disabled="!user.switch || switchDisabled.location"></b-switch>
          <b-input expanded @input="updateLocation" :value="twiteloDataInput.location" :placeholder="$t('builder.placeholder.location')" icon-pack="fas" icon="map-marker-alt"></b-input>
          <div class="text-counter control align-vertical-center">
            <span :class="getCounterColor('location')">{{textCounter.location}}</span>
          </div>
        </b-field>

        <b-field grouped>
          <b-switch @input="changeSwitch('url')" :value="twiteloData.url.status" type="is-success" size="is-medium" :disabled="!user.switch || switchDisabled.url"></b-switch>
          <b-input expanded @input="updateURL" :value="twiteloDataInput.url" :placeholder="$t('builder.placeholder.url')" icon-pack="fas" icon="link"></b-input>
          <div class="text-counter control align-vertical-center">
            <span :class="getCounterColor('url')">{{textCounter.url}}</span>
          </div>
        </b-field>

        <b-field grouped>
          <b-switch @input="changeSwitch('description')" :value="twiteloData.description.status" size="is-medium" type="is-success" :disabled="!user.switch || switchDisabled.description"></b-switch>
          <b-input expanded @input="updateDescription" :value="twiteloDataInput.description" type="textarea" :placeholder="$t('builder.placeholder.description')"></b-input>
          <p class="text-counter control align-vertical-center">
            <span :class="getCounterColor('description')">{{textCounter.description}}</span>
          </p>
        </b-field>

      </b-tab-item>
    </b-tabs>
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
        url: false,
        location: false
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
    })
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
    }, 500),
    updateURL: _.debounce(async function(e) {
      this.$store.commit("builder/SET_TWITELO_DATA_INPUT", {
        name: "url",
        twiteloDataInput: e
      });
      await this.$store.dispatch("builder/transformToUUID");
      await this.$store.dispatch("builder/updateTextCounters", "url");
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
</style>

<style>
.builder-inputs .card-content {
  background-color: #2d2d2d;
  padding: 0 0 0 0;
  height: 100%;
}
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
}
.builder-inputs .control.has-icons-left .icon,
.control.has-icons-right .icon {
  color: #bbbaba;
}
.builder-inputs .control.has-icons-left .input:focus ~ .icon,
.builder-inputs .control.has-icons-right .input:focus ~ .icon {
  color: white;
}
</style>

