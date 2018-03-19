<template>
  <div>
    <div class="columns is-mobile">
      <div class="column is-three-quarters-desktop is-three-quarters-touch settings-name">
        {{$t('settings.pp.switch-profile-picture')}}
      </div>

      <div class="column has-text-right settings-content">
        <b-switch @change.native="changeSwitchPPTrigger('ppTrigger')" :value="$store.state.user.info.settings.ppTrigger" type="is-sucess" size="is-medium" :disabled="!$store.state.user.info.switch || switchDisabled.ppTrigger"></b-switch>
      </div>
    </div>

    <hr class="dropdown-divider divider-settings">

    <ul class="trigger-list">
      <div v-if="Object.keys($store.state.settings.list.pp_trigger).length < 15" class="has-text-centered button-centered">
        <a @click="addNewPPTrigger()" class="button is-outlined is-lightgreen " :class="buttonLoading.addPPTrigger ? 'is-loading' : ''">
          <span class="icon is-small">
            <i class="fas fa-plus"></i>
          </span>
          <span>{{$t('settings.pp.button-add-trigger')}}</span>
        </a>
      </div>
      <hr v-if="Object.keys($store.state.settings.list.pp_trigger).length < 15" class="dropdown-divider divider-settings">

      <div>
        <div v-if="Object.keys($store.state.settings.list.pp_trigger).length <= 0" class="content has-text-grey-lighter align-vertical-center empty-pp-trigger">
          <b-icon icon="emoticon-sad" size="is-large"></b-icon>
          <span class="sub-menu-button">{{$t('settings.pp.no-pp-triggers')}}</span>
        </div>
      </div>

      <div v-for="ppTrigger in orderedPPTriggersDesc" :key="ppTrigger.id" v-if="ppTrigger">
        <li class="trigger-element columns">
          <div class="column trigger-settings is-two-thirds">
            <div class="media media-menu">
              <a v-if="ppTrigger.path" class="media-left no-select">
                <img class="medium-round-pp-user no-select" :class="ppTrigger.path && ppTrigger.trigger_id ? 'image-is-ok' : 'image-is-not-ok'" :src="'/media' + ppTrigger.path">
              </a>
              <a v-else-if="dropFiles[ppTrigger.id]" class="media-left no-select">
                <img class="medium-round-pp-user no-select" :class="ppTrigger.path && ppTrigger.trigger_id ? 'image-is-ok' : 'image-is-not-ok'" :src="readDataAsURL(ppTrigger.id)">
              </a>

              <b-upload v-else v-model="dropFiles[ppTrigger.id]" drag-drop>
                <b-tooltip :label="$t('settings.pp.file-upload-limit')" type="is-light" position="is-right" size="is-small" multilined>

                  <section class="section">
                    <div class="content has-text-centered">
                      <p>
                        <b-icon icon="upload" size="is-medium">
                        </b-icon>
                      </p>
                    </div>
                  </section>
                </b-tooltip>
              </b-upload>

              <div class="media-content">
                <div class="action-select control has-icons-left">
                  <div class="select">
                    <select v-model="select.game[ppTrigger.id]" @change="gameChange(ppTrigger.id)" required>
                      <option value="null" disabled selected>{{$t('settings.pp.game')}}</option>
                      <option v-for="(game, gameIndex) in $store.state.triggers.games" :key="gameIndex" :value="game" :selected="$store.state.settings.list.pp_trigger[ppTrigger.id].game == game">{{game}}</option>
                    </select>
                  </div>
                  <span class="icon is-left">
                    <i class="fas fa-gamepad"></i>
                  </span>
                </div>
                <div class="action-select control has-icons-left">
                  <div class="select">
                    <select v-model="select.trigger[ppTrigger.id]" @change="triggerChange(ppTrigger.id)" required>
                      <option value="null" disabled selected>{{$t('settings.pp.trigger')}}</option>
                      <option v-for="trigger in $store.state.triggers.triggersList" :key="trigger.id" v-if="ppTrigger.game == trigger.game" :value="trigger.id" :selected="ppTrigger.trigger_id == trigger.id">{{trigger.name[$store.state.locale]}}</option>
                    </select>
                  </div>
                  <span class="icon is-left">
                    <i class="fas fa-plug"></i>
                  </span>
                </div>
              </div>
            </div>

          </div>
          <div class="action-buttons column">
            <a @click="savePPTrigger(ppTrigger.id)" class="button action-button is-twitter is-outlined" :class="buttonLoading.ppTrigger[ppTrigger.id] ? 'is-loading' : ''">
              <span>{{$t('settings.pp.save-button')}}</span>
              <span class="icon is-small">
                <i class="far fa-edit"></i>
              </span>
            </a>
            <a @click="deletePPTrigger(ppTrigger.id)" class="button action-button is-red is-outlined" :class="buttonLoading.ppTrigger[ppTrigger.id] ? 'is-loading' : ''">
              <span class="icon is-small">
                <i class="fas fa-trash-alt"></i>
              </span>
            </a>
          </div>
        </li>
        <hr class="dropdown-divider divider-settings">

      </div>
    </ul>

  </div>
</template>

<script>
import VueNotifications from "vue-notifications";
import _ from "lodash";

export default {
  data() {
    return {
      switchDisabled: {
        ppTrigger: false
      },
      buttonLoading: {
        addPPTrigger: false,
        ppTrigger: this.getTriggersLoading()
      },
      dropFiles: {},
      select: {
        game: this.getGames(),
        trigger: this.getTriggers()
      }
    };
  },
  computed: {
    orderedPPTriggersDesc: function() {
      return _.orderBy(
        _.values(this.$store.state.settings.list.pp_trigger),
        "created",
        "desc"
      );
    }
  },
  methods: {
    getGames() {
      const game = {};

      for (const id in this.$store.state.settings.list.pp_trigger) {
        game[id] = this.$store.state.settings.list.pp_trigger[id].game;
      }

      return game;
    },
    getTriggers() {
      const trigger = {};

      for (const id in this.$store.state.settings.list.pp_trigger) {
        trigger[id] = this.$store.state.settings.list.pp_trigger[id].trigger_id;
      }
      return trigger;
    },
    getTriggersLoading() {
      const trigger = {};

      for (const id in this.$store.state.settings.list.pp_trigger) {
        trigger[id] = false;
      }
      return trigger;
    },
    async addNewPPTrigger() {
      // Set add button as 'in loading'
      this.buttonLoading.addPPTrigger = true;

      try {
        await this.$store.dispatch("settings/addPPTrigger");
      } catch (e) {
        this.$store.dispatch("setError", e);
        this.showNotification({
          title: this.$store.state.error.statusCode.toString(),
          message: this.$store.state.error.message,
          type: "error",
          timeout: 5000
        });
      }

      // Update select et buttonLoading parce qu'il ne s'update pas tout seul apparement (bug?)
      this.select = {
        game: this.getGames(),
        trigger: this.getTriggers()
      };
      this.buttonLoading.ppTrigger = this.getTriggersLoading();

      // Set add button as 'loading done'
      this.buttonLoading.addPPTrigger = false;
    },
    async deletePPTrigger(id) {
      // Set edit buttons as 'in loading'
      this.buttonLoading.ppTrigger[id] = true;

      try {
        await this.$store.dispatch("settings/deletePPTrigger", id);
      } catch (e) {
        this.$store.dispatch("setError", e);
        this.showNotification({
          title: this.$store.state.error.statusCode.toString(),
          message: this.$store.state.error.message,
          type: "error",
          timeout: 5000
        });
      }

      // update select parce qu'il ne s'update pas tout seul apparement (bug?)
      this.select = {
        game: this.getGames(),
        trigger: this.getTriggers()
      };

      // Set edit buttons as 'loading done'
      this.buttonLoading.ppTrigger[id] = true;
    },
    async savePPTrigger(id) {
      const store = this.$store;
      const ppTrigger = store.state.settings.list.pp_trigger[id];

      // Set edit buttons as 'in loading'
      this.buttonLoading.ppTrigger[ppTrigger.id] = true;

      // Catch unknown errors
      try {
        // Check if trigger_id exist, else error
        if (ppTrigger.trigger_id) {
          // Check if ppTrigger already have an image, else if user droped file, else error (need file)
          if (ppTrigger.path) {
            await store.dispatch("settings/updatePPTrigger", ppTrigger);
          } else if (
            this.dropFiles[ppTrigger.id] &&
            this.dropFiles[ppTrigger.id][
              this.dropFiles[ppTrigger.id].length - 1
            ]
          ) {
            const image = this.dropFiles[ppTrigger.id][
              this.dropFiles[ppTrigger.id].length - 1
            ];

            // Check if image respect size/format, else error
            if (
              image.name.match(/.(jpg|jpeg|png|gif)$/i) &&
              image.size / 1024 <= 700 &&
              ["image/jpeg", "image/gif", "image/png"].includes(image.type)
            ) {
              function getBase64(file) {
                return new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onload = () => resolve(reader.result);
                  reader.onerror = error => reject(error);
                });
              }

              ppTrigger.image = await getBase64(image);
              await store.dispatch("settings/updatePPTrigger", ppTrigger);
              this.dropFiles[ppTrigger.id] = null;
            } else {
              this.dropFiles[ppTrigger.id] = null;
              this.showNotification({
                title: "Image",
                message: this.$t("settings.pp.file-upload-error"),
                type: "error",
                timeout: 5000
              });
            }
          } else {
            this.showNotification({
              title: this.$t("settings.pp.image"),
              message: this.$t("settings.pp.trigger-save-error"),
              type: "error",
              timeout: 5000
            });
          }
        } else {
          this.showNotification({
            title: this.$t("settings.pp.trigger"),
            message: this.$t("settings.pp.trigger-save-error"),
            type: "error",
            timeout: 5000
          });
        }
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
        // Set edit buttons as 'loading done'
        this.buttonLoading.ppTrigger[id] = false;
      }, 800);
    },
    async changeSwitchPPTrigger(name) {
      if (!this.switchDisabled[name]) {
        this.switchDisabled[name] = true;

        try {
          await this.$store.dispatch("settings/changePPTriggerSwitch");
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
    gameChange(ppTriggerID) {
      this.$store.commit("settings/SET_PP_TRIGGER_GAME", {
        id: ppTriggerID,
        game: this.select.game[ppTriggerID]
      });
    },
    triggerChange(ppTriggerID) {
      this.$store.commit("settings/SET_PP_TRIGGER_ID", {
        id: ppTriggerID,
        triggerID: this.select.trigger[ppTriggerID]
      });
    },
    readDataAsURL(id) {
      return URL.createObjectURL(
        this.dropFiles[id][this.dropFiles[id].length - 1]
      );
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
.settings-name {
  display: flex;
  text-align: left;
  align-items: center;
  font-weight: 500;
  font-size: 1.1rem;
}
.settings-content {
  display: flex;
  text-align: right;
  align-items: center;
  justify-content: flex-end;
}
.settings-name .icon {
  margin-left: 0.5rem;
}
.button-centered {
  display: flex;
  align-items: center;
  text-align: right;
  justify-content: center;
}
.trigger-element {
  margin-top: 1rem;
}
.medium-round-pp-user {
  object-fit: cover;
  width: 65px;
  height: 65px;
  border-radius: 100%;
  cursor: pointer;
  margin-left: 1rem;
  margin-right: 1rem;
}
.image-is-ok {
  border: 1px solid rgb(69, 202, 69);
}
.image-is-not-ok {
  border: 1px solid #e41e1e;
}
.media-menu,
.action-buttons {
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
}
.action-button,
.action-select {
  margin: 0.2rem;
}
/*
.trigger-settings {
  display: flex;
  justify-content: center;
}*/

.action-select {
  display: inline-block;
}
.upload {
  margin-right: 1rem;
  margin-left: 1rem;
}
.empty-pp-trigger {
  margin-top: 1rem;
}

@media screen and (max-width: 768px) {
  .trigger-element .column {
    padding: 0;
  }
  .media-menu {
    padding-bottom: 1rem;
  }
}
</style>


<style>
.select select {
  background-color: #252525 !important;
  color: white;
}
.select.is-empty select {
  color: rgba(228, 228, 228, 0.7);
}
</style>
