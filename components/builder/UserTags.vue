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
              <div v-else v-for="(userTag, userTagKey) in userTags" :key="userTag.id" class="control">
                <b-taglist v-if="showUnusedTags || userTag.included" attached closable class="animated fadeIn">
                  <b-tag @click.native="editTagPopup(userTag, userTagKey)" class="user-tag user-tag-edit" type="is-twitter">
                    <b-icon pack="far" icon="edit" size="is-small"></b-icon>
                  </b-tag>
                  <b-tag @click.native="editTagPopup(userTag, userTagKey)" class="user-tag user-tag-key">
                    <b>{{userTagKey}}</b>
                  </b-tag>
                  <b-tag @click.native="editTagPopup(userTag, userTagKey)" class="user-tag user-tag-name-category" :type="userTag.included ? 'included' : 'not-included'">{{userTag.info.nameSmall}} - {{userTag.info.categorySmall}}</b-tag>
                  <b-tag @click.native="editTagPopup(userTag, userTagKey)" class="user-tag user-tag-game" type="is-warning">{{userTag.game.small_name}}</b-tag>
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

              <!-- TAG RESUME && EXAMPLE -->
              <p class="tag-title has-text-grey-lighter is-size-5 has-text-left">{{tagEdition.info.name}} - {{tagEdition.info.categorySmall}}</p>
              <p class="tag-example is-size-6 has-text-grey-light has-text-left">
                <b-tag @click.native="addTag(tagEdition, 'name')" type="tag-add-in is-small is-info">{{$t('builder.placeholder.name')}}</b-tag>
                <b-tag @click.native="addTag(tagEdition, 'location')" type="tag-add-in is-small is-info">{{$t('builder.placeholder.location')}}</b-tag>
                <b-tag @click.native="addTag(tagEdition, 'url')" type="tag-add-in is-small is-info">{{$t('builder.placeholder.url')}}</b-tag>
                <b-tag @click.native="addTag(tagEdition, 'description')" type="tag-add-in is-small is-info">{{$t('builder.placeholder.description')}}</b-tag>
              </p>

              <!-- TAG SETTING FIELDS -->
              <section class="user-tag-edition-popup has-text-left animated fadeIn">

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

                  <!-- INPUT TYPE: size -->
                  <b-select v-if="setting.type == 'size'" v-model="dataForm[settingKey]" :placeholder="setting.label[locale]" size="is-small" required expanded>
                    <option v-for="(optionSize, optionKey) in tagEdition.info.size" :key="optionKey" :value="optionKey">
                      {{ optionSize }} {{$t('builder.characters')}} ({{optionKey}})
                    </option>
                  </b-select>
                  <!-- INPUT TYPE: account -->
                  <b-select v-else-if="setting.type == 'account'" v-model="dataForm[settingKey]" :placeholder="setting.label[locale]" size="is-small" required expanded>
                    <option v-for="(account, accountIndex) in accounts[tagEdition.info.gameID]" :key="account.id" :value="account.id">
                      {{accountIndex}} - {{account.username}} {{account.region ? `(${account.region})` : ''}}
                    </option>
                  </b-select>
                  <!-- INPUT TYPE: select -->
                  <b-select v-else-if="setting.type == 'select'" v-model="dataForm[settingKey]" :placeholder="setting.label[locale]" size="is-small" required expanded>
                    <option v-for="(input, inputKey) in setting.input" :key="inputKey" :value="inputKey">
                      {{input[locale]}}
                    </option>
                  </b-select>
                </b-field>

              </section>

              <!-- CANCEL/NEXT BUTTON (to destination selection) -->
              <div class="nav-buttons columns is-gapless is-mobile">
                <button @click="deleteTagPopup(tagEdition)" class="column button is-danger">
                  {{$t('builder.remove')}}
                </button>
                <button @click="updateUserTag(tagEdition)" class="column button is-success" :disabled="!checkInputs()" :class="loadingButtons.save ? 'is-loading' : ''">
                  {{$t('builder.save')}}
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
      tagExample: "TODO",
      navigation: null,
      showUnusedTags: true,
      tagEdition: null,
      loadingButtons: {
        save: false
      },
      dataForm: {}
    };
  },
  computed: {
    ...mapState({
      user: state => state.user.info,
      locale: state => state.locale,
      games: state => state.builder.games,
      accounts: state => state.builder.accounts,
      selectedGame: state => state.builder.selectedGame,
      userTags: state => state.builder.userTags
    })
  },
  methods: {
    editTagPopup(tag, key) {
      this.tagEdition = tag;
      this.tagEdition.index = key;
      this.navigation = "editTag";
      this.dataForm = _.cloneDeep(tag.settings);
    },
    deleteTagPopup(tag) {
      console.log("TODO: delete");
      console.log(tag.id);
    },
    cancelEditUserTag() {
      this.navigation = null;
      this.tagEdition = null;
      this.dataForm = {};
    },
    async addTag(tag, destination) {
      this.$store.commit("builder/SET_BUILDER_LOADING", true);

      await this.$store.dispatch("builder/transformToUUID");
      await this.$store.commit("user/SET_TWITELO_DATA_CONTENT", {
        name: destination,
        content: `${this.user.twitelo[destination].content.trim()} <{${
          tag.id
        }}>`
      });
      await this.$store.dispatch("builder/transformFromUUID");

      this.$store.commit("builder/SET_BUILDER_LOADING", false);
    },
    async updateUserTag(tag) {
      this.loadingButtons.save = true;

      await this.$store
        .dispatch("builder/updateTag", {
          tag,
          settings: this.dataForm
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
      for (const input in this.tagEdition.info.fieldSettings) {
        if (!this.dataForm[input]) return false;
        if (this.dataForm[input] != this.tagEdition.settings[input])
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
</style>

<style>
.user-tags-list .card {
  height: 100%;
}
.user-tags-list .collapse-content {
  height: calc(100% - 48px);
  min-height: 15rem;
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
