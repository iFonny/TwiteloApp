<template>
  <article class="tile is-child has-text-centered user-tags-list">
    <b-collapse class="card">
      <div slot="trigger" slot-scope="props" class="card-header no-select">
        <div class="card-header-title">
          <h1 class="title is-size-6-mobile is-size-5-desktop is-size-5">{{$t('builder.profile-data')}}</h1>
        </div>
        <a class="card-header-icon">
          <b-icon :icon="props.open ? 'menu-down' : 'menu-up'">
          </b-icon>
        </a>
      </div>
      <div class="card-content">
        <div class="user-tags is-full-height">

          <!-- USER TAGS LIST -->
          <div v-if="!navigation" class="is-full-height">
            <b-field grouped position="is-right">
              <p class="control is-size-7">{{$t('builder.show-unused-tags')}}</p>
              <b-switch size="is-small" v-model="showUnusedTags"></b-switch>
            </b-field>
            <b-field grouped group-multiline class="align-tags">
              <p v-if="!userTags.length" class="is-size-4 has-text-danger">{{$t('builder.no-data')}}</p>
              <div v-else v-for="(userTag, userTagKey) in userTags" :key="userTag.id">
                <b-taglist v-if="showUnusedTags || userTag.included" attached class="animated fadeIn">
                  <b-tag @click.native="editTagPopup(userTag, userTagKey)" class="user-tag user-tag-edit" type="is-twitter">
                    <b-icon pack="far" icon="edit" size="is-small"></b-icon>
                  </b-tag>
                  <b-tag @click.native="editTagPopup(userTag, userTagKey)" class="user-tag user-tag-key">
                    <b>{{userTagKey}}</b>
                  </b-tag>
                  <b-tag @click.native="editTagPopup(userTag, userTagKey)" class="user-tag user-tag-name-category" :type="userTag.included ? 'included' : 'not-included'">{{userTag.info.nameSmall}} - {{userTag.info.categorySmall}}</b-tag>
                  <b-tag @click.native="editTagPopup(userTag, userTagKey)" class="user-tag user-tag-game" :style="`background-color: ${games[userTag.game_id].color}`">{{games[userTag.game_id].small_name}}</b-tag>
                  <b-tag @click.native="deleteTagPopup(userTag, userTagKey)" class="user-tag user-tag-delete" type="is-danger">
                    <b-icon pack="far" icon="trash-alt" size="is-small"></b-icon>
                  </b-tag>
                </b-taglist>
              </div>
            </b-field>
          </div>

          <div v-else class="is-full-height">

            <!-- CANCEL BUTTON -->
            <button @click="cancelEditUserTag()" type="button" class="delete user-tag-edition-cancel"></button>

            <!-- EDIT USER TAGS POPUP -->
            <div v-if="navigation == 'editTag' && tagEdition" class="is-full-height relative-zone">

              <!-- TAG RESUME && ADD BUTTONS -->
              <p class="tag-title has-text-grey-lighter is-size-5 has-text-left">{{tagEdition.info.name}} - {{tagEdition.info.categorySmall}}</p>
              <p class="tag-example is-size-6 has-text-grey-light has-text-left">
                {{$t('builder.add-in')}}
                <b-tag @click.native="addTag(tagEdition, 'name')" type="tag-add-in is-small is-info">{{$t('builder.placeholder.name')}}</b-tag>
                <b-tag @click.native="addTag(tagEdition, 'location')" type="tag-add-in is-small is-info">{{$t('builder.placeholder.location')}}</b-tag>
                <b-tag @click.native="addTag(tagEdition, 'url')" type="tag-add-in is-small is-info">{{$t('builder.placeholder.url')}}</b-tag>
                <b-tag @click.native="addTag(tagEdition, 'description')" type="tag-add-in is-small is-info">{{$t('builder.placeholder.description')}}</b-tag>
              </p>

              <!-- TAG SETTING FIELDS -->
              <section class="user-tag-edition-popup has-text-left animated fadeIn">

                <!-- CHOOSE ACCOUNT -->
                <b-field v-if="tagEdition.info.account" grouped expanded>
                  <p class="control">
                    <label class="label">{{$t('builder.account')}}</label>
                  </p>
                  <b-select v-model="dataForm.account_id" :placeholder="$t('builder.account')" size="is-small" required expanded>
                    <option v-for="account in accounts[tagEdition.info.gameID]" :key="account.id" :value="account.id">
                      {{account.settings.username}} {{account.settings.region ? `(${account.settings.region.toUpperCase()})` : ''}}
                    </option>
                  </b-select>
                </b-field>

                <!-- FORMAT SETTINGS -->
                <b-field v-for="(setting, settingKey) in tagEdition.info.fieldSettings" :key="settingKey" grouped group-multiline expanded>

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
                <b-field v-for="(setting, settingKey) in tagEdition.info.dataSettings" :key="settingKey" grouped group-multiline expanded>

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
                </b-field>

              </section>

              <!-- DELETE/SAVE BUTTON -->
              <div class="nav-buttons columns is-gapless is-mobile">
                <button @click="deleteTagPopup(tagEdition, tagEdition.index)" class="column button is-danger">
                  {{$t('builder.remove')}}
                </button>
                <button @click="updateUserTag(tagEdition)" class="column button is-success" :disabled="!checkInputs()" :class="loadingButtons.save ? 'is-loading' : ''">
                  {{$t('builder.save')}}
                </button>
              </div>

            </div>

            <!-- REMOVE TAG POPUP CONFIRMATION -->
            <div v-if="navigation == 'removeTagConfirm' && tagEdition" class="is-full-height relative-zone">

              <!-- TAG RESUME && EXAMPLE -->
              <p class="tag-title has-text-grey-lighter is-size-5 has-text-left">{{tagEdition.info.name}} - {{tagEdition.info.categorySmall}}</p>

              <div class="confirmation-message align-vertical-center is-full-height animated fadeIn">
                <div>
                  <div class="title is-size-4">{{$t('builder.remove-tag-confirmation-message')}}</div>
                  <b-field grouped group-multiline class="align-tags">
                    <b-taglist attached class="has-text-centered">
                      <b-tag class="user-tag user-tag-key" size="is-medium">
                        <b>{{tagEdition.index}}</b>
                      </b-tag>
                      <b-tag class="user-tag user-tag-name-category" size="is-medium" :type="tagEdition.included ? 'included' : 'not-included'">{{tagEdition.info.nameSmall}} - {{tagEdition.info.categorySmall}}</b-tag>
                      <b-tag class="user-tag user-tag-game" size="is-medium" :style="`background-color: ${games[tagEdition.game_id].color}`">{{games[tagEdition.game_id].small_name}}</b-tag>
                    </b-taglist>
                  </b-field>
                </div>
              </div>

              <!-- CANCEL/DELETE BUTTON -->
              <div class="nav-buttons columns is-gapless is-mobile">
                <button @click="cancelEditUserTag()" class="column button is-light">
                  {{$t('builder.cancel')}}
                </button>
                <button @click="deleteTag(tagEdition)" class="column button is-danger" :class="loadingButtons.remove ? 'is-loading' : ''">
                  {{$t('builder.remove')}}
                </button>
              </div>

            </div>

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
      showUnusedTags: true,
      tagEdition: null,
      loadingButtons: {
        save: false,
        remove: false
      },
      dataForm: {
        settings: {},
        dataSettings: {}
      }
    };
  },
  computed: {
    ...mapState({
      user: state => state.user.info,
      locale: state => state.locale,
      games: state => state.builder.games,
      accounts: state => state.builder.accounts,
      userTags: state => state.builder.userTags,
      selectedGame: state => state.builder.selectedGame,
      twiteloDataInput: state => state.builder.twiteloDataInput
    })
  },
  methods: {
    editTagPopup(tag, key) {
      this.tagEdition = tag;
      this.tagEdition.index = key;
      this.navigation = "editTag";
      this.dataForm = {
        account_id: tag.account_id,
        settings: _.cloneDeep(tag.settings) || {},
        dataSettings: _.cloneDeep(tag.data_settings) || {}
      };
    },
    async deleteTagPopup(tag, key) {
      this.tagEdition = tag;
      this.tagEdition.index = key;
      this.navigation = "removeTagConfirm";
    },
    async deleteTag(tag) {
      this.$store.commit("builder/SET_BUILDER_LOADING", true);
      this.loadingButtons.remove = true;

      await this.$store.dispatch("builder/deleteTagWithIndex", tag).catch(e => {
        this.$store.dispatch("setError", e);
        this.showNotification({
          title: this.$store.state.error.statusCode.toString(),
          message: this.$store.state.error.message,
          type: "error",
          timeout: 5000
        });
      });

      this.cancelEditUserTag();
      this.loadingButtons.remove = false;
      this.$store.commit("builder/SET_BUILDER_LOADING", false);
    },
    cancelEditUserTag() {
      this.navigation = null;
      this.tagEdition = null;
      this.dataForm = {
        settings: {},
        dataSettings: {}
      };
    },
    async addTag(tag, destination) {
      this.$store.commit("builder/SET_BUILDER_LOADING", true);

      await this.$store.commit("builder/SET_TWITELO_DATA_INPUT", {
        name: destination,
        twiteloDataInput: `${this.twiteloDataInput[destination].trim()} <{${
          tag.index
        }}>`
      });

      this.$store.commit("builder/SET_BUILDER_LOADING", false);
    },
    async updateUserTag(tag) {
      this.loadingButtons.save = true;

      await this.$store
        .dispatch("builder/updateTag", {
          tag,
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

      this.cancelEditUserTag();
      this.loadingButtons.save = false;
    },
    checkInputs() {
      if (this.dataForm.account_id != this.tagEdition.account_id) return true;
      for (const input in this.tagEdition.info.fieldSettings) {
        if (!this.dataForm.settings[input]) return false;
        if (this.dataForm.settings[input] != this.tagEdition.settings[input])
          return true;
      }
      for (const input in this.tagEdition.info.dataSettings) {
        if (!this.dataForm.dataSettings[input]) return false;
        if (
          this.dataForm.dataSettings[input] !=
          this.tagEdition.data_settings[input]
        )
          return true;
      }
      return false;
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
  /*height: calc(100% - 30px);*/
}
.align-tags .tags {
  padding-right: 0.25rem;
  padding-left: 0.25rem;
  padding-bottom: 0.75rem;
}
.user-tag,
.tag-add-in {
  cursor: pointer;
}
.user-tags {
  padding-top: 0.5rem;
}
.user-tag-key {
  background-color: #f5f5f5;
  color: #363636;
}
.user-tag-game {
  color: #151515;
}
.tag-add-in {
  height: 1.1rem;
  padding-left: 0.3rem;
  padding-right: 0.3rem;
  margin-right: 0.2rem;
  margin-left: 0.2rem;
}

.user-tag-name-category.included {
  background-color: #81d29d;
  color: #191818; /*rgba(0, 0, 0, 0.7);*/
}

.user-tag-name-category.not-included {
  background-color: #f98989;
  color: #191818;
}
.relative-zone {
  position: relative;
  padding-bottom: 50px;
}
.delete.user-tag-edition-cancel {
  position: absolute;
  right: 0.5rem !important;
  top: 3.5rem !important;
  height: 35px !important;
  width: 35px !important;
  max-height: 35px !important;
  max-width: 35px !important;
  min-height: 35px !important;
  min-width: 35px !important;
  z-index: 1;
}
.tag-title {
  padding: 0 0.7rem 0 0.7rem;
}
.tag-example {
  padding: 0 0.7rem 0.7rem 0.7rem;
}
.user-tags .field.is-grouped > .control {
  margin-right: 0.25rem;
  margin-left: 0.25rem;
}
.user-tag-edition-popup .control .label {
  margin-right: 0.6rem;
}
.user-tag-edition-popup {
  border-radius: 3px;
  padding: 0 0.7rem;
  position: relative;
  width: 100%;
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
.user-tags-list .field.is-grouped.is-grouped-multiline:last-child {
  margin-bottom: 0;
}
.confirmation-message {
  height: calc(100% - 30px);
}
</style>

<style>
.user-tags-list .card {
  height: 100%;
}
.user-tags-list .collapse-content {
  height: calc(100% - 48px);
  min-height: 17rem;
}
@media screen and (max-width: 768px) {
  .user-tags-list .collapse-content {
    min-height: 0;
  }
}
.user-tags-list .card-content {
  height: 100%;
  padding: 0;
}
</style>

