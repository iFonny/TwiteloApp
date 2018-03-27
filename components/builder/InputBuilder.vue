<template>
  <article class="tile is-child card has-text-centered builder-inputs">

    <b-tabs v-model="activeTab" position="is-centered" class="card-content">
      <!-- <p class="subtitle is-6">Please don't use unauthorized twitter characters</p> -->
      <b-tab-item :label="$t('builder.builder')" disabled>
      </b-tab-item>
      <b-tab-item :label="$t('builder.advanced')" class="advanced">

        <b-field grouped>
          <b-switch @input="changeSwitch('name')" :value="name.status" type="is-success" size="is-medium" :disabled="!user.switch || switchDisabled.name"></b-switch>

          <b-input expanded @input="updateName" :value="getName" :placeholder="$t('builder.placeholder.name')" icon="account"></b-input>
          <div class="control align-vertical-center">
            <b-tag type="is-twitter">50</b-tag>
          </div>
        </b-field>

        <b-field grouped>
          <b-switch @input="changeSwitch('location')" :value="location.status" type="is-success" size="is-medium" :disabled="!user.switch || switchDisabled.location"></b-switch>
          <b-input expanded @input="updateLocation" :value="getLocation" :placeholder="$t('builder.placeholder.location')" icon-pack="fas" icon="map-marker-alt"></b-input>
          <div class="control align-vertical-center">
            <b-tag type="is-warning">5</b-tag>
            <!-- <b-tag type="is-twitter">30</b-tag> -->
          </div>
        </b-field>

        <b-field grouped>
          <b-switch @input="changeSwitch('url')" :value="url.status" type="is-success" size="is-medium" :disabled="!user.switch || switchDisabled.url"></b-switch>
          <b-input expanded @input="updateURL" :value="getURL" :placeholder="$t('builder.placeholder.url')" icon-pack="fas" icon="link"></b-input>
          <div class="control align-vertical-center">
            <b-tag type="is-red">0</b-tag>
            <!-- <b-tag type="is-twitter">100</b-tag> -->
          </div>
        </b-field>

        <b-field grouped>
          <b-switch @input="changeSwitch('description')" :value="description.status" size="is-medium" type="is-success" :disabled="!user.switch || switchDisabled.description"></b-switch>
          <b-input expanded @input="updateDescription" :value="getDescription" type="textarea" :placeholder="$t('builder.placeholder.description')"></b-input>
          <p class="control align-vertical-center">
            <b-tag type="is-red">-5</b-tag>
            <!-- <b-tag type="is-twitter">160</b-tag> -->
          </p>
        </b-field>

      </b-tab-item>
    </b-tabs>
  </article>
</template>

<script>
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
      name: state => state.user.info.twitelo.name,
      description: state => state.user.info.twitelo.description,
      location: state => state.user.info.twitelo.location,
      url: state => state.user.info.twitelo.url
    }),
    getName: function() {
      return this.transformFromUUID(this.name.content);
    },
    getDescription: function() {
      return this.transformFromUUID(this.description.content);
    },
    getLocation: function() {
      return this.transformFromUUID(this.location.content);
    },
    getURL: function() {
      return this.transformFromUUID(this.url.content);
    }
  },
  methods: {
    transformFromUUID(input) {
      console.log("transform <{12a65b}> -> <{1}>");
      // TODO: transformer (<{12a65b}> -> <{1}>)
      return input;
    },
    transformToUUID(input) {
      console.log("transform <{1}> -> <{12a65b}>");
      // TODO: transformer (<{1}> -> <{12a65b}>)
      return input;
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
    updateName(e) {
      this.$store.commit("user/SET_TWITELO_DATA_CONTENT", {
        name: "name",
        content: this.transformToUUID(e)
      });
    },
    updateDescription(e) {
      this.$store.commit("user/SET_TWITELO_DATA_CONTENT", {
        name: "description",
        content: this.transformToUUID(e)
      });
    },
    updateLocation(e) {
      this.$store.commit("user/SET_TWITELO_DATA_CONTENT", {
        name: "location",
        content: this.transformToUUID(e)
      });
    },
    updateURL(e) {
      this.$store.commit("user/SET_TWITELO_DATA_CONTENT", {
        name: "url",
        content: this.transformToUUID(e)
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
</style>

