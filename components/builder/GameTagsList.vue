<template>
  <article class="tile is-child has-text-centered game-tags-list">
    <b-collapse class="card">
      <div slot="trigger" slot-scope="props" class="card-header no-select">
        <div class="card-header-title">
          <h1 class="title is-size-6-mobile is-size-5-desktop is-size-5">{{$t('builder.select-game-tag')}}</h1>
        </div>
        <a class="card-header-icon">
          <b-icon :icon="props.open ? 'menu-down' : 'menu-up'">
          </b-icon>
        </a>
      </div>
      <div class="card-content">

        <!-- LOADING TAGS -->
        <div v-if="selectedGame && gameTagsCategory == null" class="is-full-height">
          <div class="loading-overlay is-full-height is-active">
            <div class="loading-icon"></div>
          </div>
        </div>

        <!-- TAG SELECTION BOX -->
        <div v-else-if="selectedGame && Object.keys(gameTagsCategory).length > 0" class="is-full-height">

          <!-- TAG SELECTION -->
          <div v-if="!navigation" class="is-full-height tag-selection-list animated fadeIn">

            <div v-for="gameCategoryKey in gameTagsCategoryPages[page.current - 1]" :key="gameCategoryKey" class="category-tags">
              <p>{{gameCategoryKey}}</p>
              <b-field grouped group-multiline class="align-tags no-select">
                <div v-for="gameTag in gameTagsCategory[gameCategoryKey]" :key="gameTag.id" class="control">
                  <b-taglist attached @click.native="addGameTag(gameTag)" class="game-tag">
                    <b-tag class="game-tag-name" type="is-twitter">{{gameTag.name}}</b-tag>
                    <b-tag class="game-tag-add">
                      <b-icon icon="plus" size="is-small"></b-icon>
                    </b-tag>
                  </b-taglist>
                </div>
              </b-field>
            </div>

            <b-pagination :total="Object.keys(gameTagsCategory).length" :per-page="gameTagsCategoryPages[0].length" :current.sync="page.current" order="is-centered" size="id-small" :rounded="true" class="pagination-bottom">
            </b-pagination>

          </div>

          <!-- POPUP CREATE TAG -->
          <div v-else class="is-full-height">

            <!-- CANCEL BUTTON -->
            <button @click="cancelAddGameTag()" type="button" class="delete tag-creation-cancel"></button>

            <div v-if="navigation == 'createTag' && tagCreation" class="is-full-height relative-zone">

              <!-- TAG RESUME && EXAMPLE -->
              <p class="tag-title has-text-grey-lighter is-size-4 has-text-left">{{tagCreation.name}} - {{tagCreation.categorySmall}}</p>
              <p class="tag-example is-size-6 has-text-grey-light has-text-left">{{$t('builder.example')}} : {{tagExample}}</p>

              <div class="">

                <!-- TAG SETTING FIELDS -->
                <section class="tag-creation-popup has-text-left animated fadeIn">

                  <!-- CHOOSE ACCOUNT -->
                  <b-field v-if="tagCreation.account" grouped expanded>
                    <p class="control">
                      <label class="label">{{$t('builder.account')}}</label>
                    </p>
                    <b-select v-model="dataForm.account_id" :placeholder="$t('builder.account')" size="is-small" required expanded>
                      <option v-for="account in accounts[tagCreation.gameID]" :key="account.id" :value="account.id">
                        {{account.settings.username}} {{account.settings.region ? `(${account.settings.region.toUpperCase()})` : ''}}
                      </option>
                    </b-select>
                  </b-field>

                  <!-- FORMAT SETTINGS -->
                  <b-field v-for="(setting, settingKey) in tagCreation.fieldSettings" :key="settingKey" grouped group-multiline expanded>
                    <!-- FIELD LABEL -->
                    <p class="control">
                      <label class="label">
                        {{setting.label[locale]}}
                        <b-tooltip v-if="setting.tooltip" :label="setting.tooltip[locale]" type="is-light" position="is-right" size="is-small" multilined>
                          <b-icon pack="far" icon="question-circle" size="is-small" class="has-text-grey-light">
                          </b-icon>
                        </b-tooltip>
                      </label>
                    </p>

                    <!-- INPUT TYPE: select -->
                    <b-select v-if="setting.type == 'select'" v-model="dataForm.settings[settingKey]" :placeholder="setting.label[locale]" size="is-small" required expanded>
                      <option v-for="(input, inputKey) in setting.input" :key="inputKey" :value="inputKey">
                        {{input[locale]}} {{input.value != 0 ? `(${input.value > 0 ? '+' : '-'} ${Math.abs(input.value)} ${$t('builder.characters')})` : ''}}
                      </option>
                    </b-select>
                  </b-field>

                  <!-- DATA GAME SETTING -->
                  <b-field v-for="(setting, settingKey) in tagCreation.dataSettings" :key="settingKey" grouped group-multiline expanded>
                    <!-- FIELD LABEL -->
                    <p class="control">
                      <label class="label">
                        {{setting.label[locale]}}
                        <b-tooltip v-if="setting.tooltip" :label="setting.tooltip[locale]" type="is-light" position="is-right" size="is-small" multilined>
                          <b-icon pack="far" icon="question-circle" size="is-small" class="has-text-grey-light">
                          </b-icon>
                        </b-tooltip>
                      </label>
                    </p>

                    <!-- INPUT TYPE: string -->
                    <b-input v-if="setting.type == 'string'" v-model="dataForm.dataSettings[settingKey]" :placeholder="setting.label[locale]" size="is-small" required expanded></b-input>
                    <!-- INPUT TYPE: select -->
                    <b-select v-if="setting.type == 'select'" v-model="dataForm.dataSettings[settingKey]" :placeholder="setting.label[locale]" size="is-small" required expanded>
                      <option v-for="(input, inputKey) in setting.input" :key="inputKey" :value="inputKey">
                        {{input[locale]}}
                      </option>
                    </b-select>
                    <!-- INPUT TYPE: speedrun_game -->
                    <b-autocomplete v-if="setting.type == 'speedrun_game'" v-model="dynamicSettings.speedrun.game.name" :placeholder="setting.label[locale]" size="is-small" required expanded :data="dynamicSettings.speedrun.game.data" field="names.international" :loading="dynamicSettings.speedrun.game.isFetching" icon="magnify" @input="getSpeedrunGames" @select="selectSpeedrunGame">
                    </b-autocomplete>
                    <!-- INPUT TYPE: speedrun_category -->
                    <b-select v-if="setting.type == 'speedrun_category'" v-model="dataForm.dataSettings[settingKey]" :placeholder="setting.label[locale]" size="is-small" required expanded>
                      <option v-for="input in getSpeedrunCategories" :key="input.id" :value="input.id">
                        {{input.name}}
                      </option>
                    </b-select>

                  </b-field>
                </section>
              </div>

              <!-- CANCEL/NEXT BUTTON (to destination selection) -->
              <div class="nav-buttons columns is-gapless is-mobile">
                <button @click="cancelAddGameTag()" class="column button is-danger">
                  {{$t('builder.cancel')}}
                </button>
                <button @click="goToDestinationSelection()" class="column button is-success" :disabled="!checkInputs()">
                  {{$t('builder.next')}}
                </button>
              </div>
            </div>

            <!-- POPUP SELECT DESTINATION -->
            <div v-else-if="navigation == 'selectDestination'" class="is-full-height relative-zone">

              <!-- TAG RESUME && EXAMPLE -->
              <p class="tag-title has-text-grey-lighter is-size-4 has-text-left">{{tagCreation.name}} - {{tagCreation.categorySmall}}</p>
              <p class="tag-example is-size-6 has-text-grey-light has-text-left">{{$t('builder.example')}} : {{tagExample}}</p>

              <div class="columns is-multiline is-mobile tag-destination-buttons animated fadeIn">
                <div class="column is-half">
                  <a @click="createTag('name')" class="button is-info is-outlined">{{$t('builder.placeholder.name')}}</a>
                </div>
                <div class="column is-half">
                  <a @click="createTag('location')" class="button is-info is-outlined">{{$t('builder.placeholder.location')}}</a>
                </div>
                <div class="column is-half">
                  <a @click="createTag('description')" class="button is-info is-outlined">{{$t('builder.placeholder.description')}}</a>
                </div>
              </div>

              <p class="is-size-7 has-text-grey-light has-text-centered">{{$t('builder.can-move-anywhere')}}</p>

              <!-- PREVIOUS BUTTON (to destination selection) -->
              <div class="nav-buttons columns is-gapless is-mobile">
                <button @click="backToTagSettings()" class="column button is-danger">
                  {{$t('builder.previous')}}
                </button>
              </div>
            </div>

            <div v-else-if="navigation == 'accountRequired'" class="is-full-height no-selected-game animated fadeIn">
              <p class="is-size-4 has-text-danger">{{$t('builder.no-accounts')}}</p>
            </div>

          </div>

        </div>

        <!-- ELSE: No tags -->
        <div v-else-if="selectedGame && Object.keys(gameTagsCategory).length <= 0" class="is-full-height no-selected-game">
          <p class="is-size-4 has-text-danger">{{$t('builder.no-tags-game')}}</p>
        </div>

        <!-- ELSE: No selected game -->
        <div v-else class="is-full-height no-selected-game">
          <div class="game-list">
            <img v-for="game in games" :key="game.id" @click="selectGame(game)" :src="'/api' + game.icon" :alt="game.name" class="game-list-icon no-select">
          </div>
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
      navigation: null,
      tagCreation: null,
      dataForm: {
        settings: {},
        dataSettings: {}
      },
      dynamicSettings: {
        speedrun: {
          game: {
            data: [],
            name: "",
            selected: null,
            isFetching: false
          }
        }
      },
      page: {
        current: 1
      }
    };
  },
  computed: {
    ...mapState({
      locale: state => state.locale,
      games: state => state.builder.games,
      accounts: state => state.builder.accounts,
      selectedGame: state => state.builder.selectedGame,
      builderLoading: state => state.builder.builderLoading,
      gameTagsCategory: state => state.builder.gameTagsCategory,
      gameTagsCategoryPages: state => state.builder.gameTagsCategoryPages
    }),
    getSpeedrunCategories() {
      let selected = this.dynamicSettings.speedrun.game.selected;
      if (selected && selected.categories) return selected.categories.data;
      else return null;
    },
    tagExample() {
      if (
        this.tagCreation &&
        this.tagCreation.example &&
        this.dataForm.settings
      ) {
        let result = this.tagCreation.example;
        let size = this.tagCreation.size;

        while (typeof result == "object") {
          for (const key in result) {
            if (
              this.tagCreation.fieldSettings[key].input[
                this.dataForm.settings[key]
              ]
            )
              size += this.tagCreation.fieldSettings[key].input[
                this.dataForm.settings[key]
              ].value;
            result = result[key][this.dataForm.settings[key]];
          }
        }
        return (
          (result ? `${result}` : "...") +
          ` (${size} ${this.$t("builder.characters")})`
        );
      } else return "...";
    }
  },
  watch: {
    selectedGame() {
      this.page.current = 1;
      this.navigation = null;
    }
  },
  methods: {
    addGameTag(gameTag) {
      if (
        gameTag.account &&
        (!this.accounts[this.selectedGame.id] ||
          this.accounts[this.selectedGame.id].length <= 0)
      ) {
        this.navigation = "accountRequired";
        setTimeout(() => {
          if (this.navigation == "accountRequired") this.navigation = null;
        }, 3000);
      } else {
        this.tagCreation = gameTag;
        this.navigation = "createTag";
      }
    },
    cancelAddGameTag(gameTag) {
      this.navigation = null;
      this.tagCreation = null;
      this.dataForm = {
        settings: {},
        dataSettings: {}
      };
      this.dynamicSettings = {
        speedrun: {
          game: {
            data: [],
            name: "",
            selected: null,
            isFetching: false
          }
        }
      };
    },
    checkInputs() {
      if (this.tagCreation.account && !this.dataForm.account_id) return false;
      for (const input in this.tagCreation.fieldSettings) {
        if (!this.dataForm.settings[input]) return false;
      }
      for (const input in this.tagCreation.dataSettings) {
        if (!this.dataForm.dataSettings[input]) return false;
      }
      return true;
    },
    goToDestinationSelection() {
      this.navigation = "selectDestination";
    },
    async createTag(destination) {
      this.$store.commit("builder/SET_BUILDER_LOADING", true);

      await this.$store
        .dispatch("builder/createTagAndUpdate", {
          destination,
          tagInfo: this.tagCreation,
          account_id: this.dataForm.account_id,
          settings: this.dataForm.settings,
          data_settings: this.dataForm.dataSettings
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

      this.cancelAddGameTag();
      this.$store.commit("builder/SET_BUILDER_LOADING", false);
    },
    backToTagSettings() {
      this.navigation = "createTag";
    },
    async selectGame(game) {
      this.$store.commit("builder/SET_SELECTED_GAME", game);
      await this.$store.dispatch("builder/fetchTags", game).catch(e => {
        this.$store.dispatch("setError", e);
        this.showNotification({
          title: this.$store.state.error.statusCode.toString(),
          message: this.$store.state.error.message,
          type: "error",
          timeout: 5000
        });
      });
    },
    getSpeedrunGames: _.debounce(function() {
      this.dynamicSettings.speedrun.game.data = [];
      this.dynamicSettings.speedrun.game.isFetching = true;
      this.$axios
        .get(
          `https://www.speedrun.com/api/v1/games?name=${
            this.dynamicSettings.speedrun.game.name
          }&embed=categories`
        )
        .then(({ data }) => {
          data.data.forEach(item =>
            this.dynamicSettings.speedrun.game.data.push(item)
          );
          this.dynamicSettings.speedrun.game.isFetching = false;
        })
        .catch(e => {
          this.dynamicSettings.speedrun.game.isFetching = false;
          this.$store.dispatch("setError", e);
          this.showNotification({
            title: this.$store.state.error.statusCode.toString(),
            message: this.$store.state.error.message,
            type: "error",
            timeout: 5000
          });
        });
    }, 1000),
    selectSpeedrunGame(option) {
      delete this.dataForm.dataSettings.category;
      if (option) this.dataForm.dataSettings.game = option.id;
      else delete this.dataForm.dataSettings.game;
      return (this.dynamicSettings.speedrun.game.selected = option);
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
.align-tags {
  display: flex;
  justify-content: center !important;
}
.game-list-icon {
  height: 50px;
  width: 50px;
  margin: 0.3rem;
  cursor: pointer;
  -webkit-filter: drop-shadow(0px 0px 1px rgb(255, 255, 255));
  filter: drop-shadow(0px 0px 1px rgb(255, 255, 255));
}
.game-list-image {
  max-width: 80%;
  max-height: 80px;
  margin: 0.5rem;
  cursor: pointer;
}
.game-list-icon:hover {
  -webkit-filter: drop-shadow(0px 0px 1px #ecde5d);
  filter: drop-shadow(0px 0px 1px #ecde5d);
}
.game-list-image:hover {
  -webkit-filter: drop-shadow(0px 0px 1px #ecde5d);
  filter: drop-shadow(0px 0px 1px #ecde5d);
}
.game-tags-list .loading-overlay {
  position: relative !important;
}
.game-tag-add {
  background-color: #77e49c;
  color: #363636;
}
.game-tag-name,
.game-tag-add {
  cursor: pointer;
  margin: 0;
}
.category-tags {
  padding-top: 0.2rem;
  padding-bottom: 0.5rem;
}
.no-selected-game {
  display: flex;
  justify-content: center;
  align-items: center;
}
.relative-zone {
  position: relative;
  padding-bottom: 50px;
}
.tag-creation-popup {
  border-radius: 3px;
  padding: 0 0.7rem;
  position: relative;
  width: 100%;
  z-index: 2;
}
.delete.tag-creation-cancel {
  position: absolute;
  right: 0.5rem !important;
  top: 3.5rem !important;
  height: 35px !important;
  width: 35px !important;
  max-height: 35px !important;
  max-width: 35px !important;
  min-height: 35px !important;
  min-width: 35px !important;
  border: 1px solid rgb(119, 116, 116);
  z-index: 1;
}
.game-tag:hover {
  -webkit-filter: drop-shadow(0px 0px 1px #ecde5d);
  filter: drop-shadow(0px 0px 1px #ecde5d);
}
.tag-title {
  padding: 0.4rem 0.7rem 0 0.7rem;
}
.tag-example {
  padding: 0 0.7rem 0.7rem 0.7rem;
}
.nav-buttons {
  position: absolute;
  bottom: 0;
  width: 100%;
}
.nav-buttons .button {
  border: unset;
  border-radius: 0;
}

.tag-selection-list {
  padding-bottom: 50px;
}

@media screen and (max-width: 325px) {
  .tag-selection-list {
    padding-bottom: 93px;
  }
}
.tag-destination-buttons {
  margin: 0;
  height: calc(100% - 110px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.tag-destination-buttons .column {
  padding: 0;
}
.tag-destination-buttons .column .button {
  height: 100%;
  width: 80%;
}

@media screen and (max-width: 768px) {
  .tag-destination-buttons .column {
    padding: 0.3rem;
  }
}

/* pagination */
.game-tags-list .pagination-bottom {
  position: absolute;
  bottom: 0;
  width: 100%;
  margin: 0;
  padding-bottom: 2px;
}
</style>

<style>
.game-tags-list .card {
  height: 100%;
}
.game-tags-list .collapse-content {
  height: calc(100% - 48px);
}
.game-tags-list .card-content {
  height: 100%;
  padding: 0;
}
</style>

