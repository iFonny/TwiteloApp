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
          <div class="control align-vertical-center">
            <b-tag type="is-twitter">46</b-tag>
            <!-- <b-tag type="is-twitter">{{twitterLimits.name}}</b-tag> -->
          </div>
        </b-field>

        <b-field grouped>
          <b-switch @input="changeSwitch('location')" :value="twiteloData.location.status" type="is-success" size="is-medium" :disabled="!user.switch || switchDisabled.location"></b-switch>
          <b-input expanded @input="updateLocation" :value="twiteloDataInput.location" :placeholder="$t('builder.placeholder.location')" icon-pack="fas" icon="map-marker-alt"></b-input>
          <div class="control align-vertical-center">
            <b-tag type="is-warning">5</b-tag>
            <!-- <b-tag type="is-twitter">{{twitterLimits.location}}</b-tag> -->
          </div>
        </b-field>

        <b-field grouped>
          <b-switch @input="changeSwitch('url')" :value="twiteloData.url.status" type="is-success" size="is-medium" :disabled="!user.switch || switchDisabled.url"></b-switch>
          <b-input expanded @input="updateURL" :value="twiteloDataInput.url" :placeholder="$t('builder.placeholder.url')" icon-pack="fas" icon="link"></b-input>
          <div class="control align-vertical-center">
            <b-tag type="is-red">0</b-tag>
            <!-- <b-tag type="is-twitter">{{twitterLimits.url}}</b-tag> -->
          </div>
        </b-field>

        <b-field grouped>
          <b-switch @input="changeSwitch('description')" :value="twiteloData.description.status" size="is-medium" type="is-success" :disabled="!user.switch || switchDisabled.description"></b-switch>
          <b-input expanded @input="updateDescription" :value="twiteloDataInput.description" type="textarea" :placeholder="$t('builder.placeholder.description')"></b-input>
          <p class="control align-vertical-center">
            <b-tag type="is-red">-5</b-tag>
            <!-- <b-tag type="is-twitter">{{twitterLimits.description}}</b-tag> -->
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
      twiteloDataInput: state => state.builder.twiteloDataInput
    })
  },
  methods: {
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
    updateName: _.debounce(function(e, test) {
      this.$store.commit("builder/SET_TWITELO_DATA_INPUT", {
        name: "name",
        twiteloDataInput: e
      });
      this.$store.dispatch("builder/transformToUUID"); // TODO: remplacer (et include) par updatePreview
    }, 1000),
    updateDescription: _.debounce(function(e) {
      this.$store.commit("builder/SET_TWITELO_DATA_INPUT", {
        name: "description",
        twiteloDataInput: e
      });
      this.$store.dispatch("builder/transformToUUID"); // TODO: remplacer (et include) par updatePreview
    }, 1000),
    updateLocation: _.debounce(function(e) {
      this.$store.commit("builder/SET_TWITELO_DATA_INPUT", {
        name: "location",
        twiteloDataInput: e
      });
      this.$store.dispatch("builder/transformToUUID"); // TODO: remplacer (et include) par updatePreview
    }, 1000),
    updateURL: _.debounce(function(e) {
      this.$store.commit("builder/SET_TWITELO_DATA_INPUT", {
        name: "url",
        twiteloDataInput: e
      });
      this.$store.dispatch("builder/transformToUUID"); // TODO: remplacer (et include) par updatePreview
    }, 1000)
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
input,
textarea,
select {
  background-color: #1f1f1f6e !important;
  color: white !important;
}
</style>

