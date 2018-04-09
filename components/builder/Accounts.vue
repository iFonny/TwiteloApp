<template>
  <article class="tile is-child has-text-centered account-list">
    <b-collapse class="card">
      <div slot="trigger" slot-scope="props" class="card-header no-select">
        <div class="card-header-title">
          <h1 class="title is-size-6-mobile is-size-5-desktop is-size-5">{{$t('builder.accounts')}}</h1>
        </div>
        <a class="card-header-icon">
          <b-icon :icon="props.open ? 'menu-down' : 'menu-up'">
          </b-icon>
        </a>
      </div>
      <div class="card-content">
        <div class="accounts-container is-full-height">

          <!-- ACCOUNT LIST -->
          <div v-if="!navigation" class="is-full-height relative-zone">
            <b-field type="is-dark">
              <b-select v-model="accountGameSelect" :placeholder="$t('builder.select-game')" class="game-selection" expanded>
                <option value="all-games">{{$t('builder.all-games')}}</option>
                <option v-for="game in games" :key="game.id" :value="game.id">{{game.name}}</option>
              </b-select>
            </b-field>

            <b-field grouped group-multiline class="align-tags animated fadeIn">
              <p v-if="!accountsBySelect || Object.keys(accountsBySelect).length <= 0" class="is-size-4 has-text-danger animated fadeIn">{{$t('builder.no-accounts-list')}}</p>
              <div v-else v-for="account in accountsBySelect" :key="account.id" class="control animated fadeIn">
                <b-taglist attached>
                  <b-tag @click.native="editAccountPopup(account)" size="is-small" class="account-tag account-tag-edit" type="is-twitter">
                    <b-icon pack="far" icon="edit" size="is-small"></b-icon>
                  </b-tag>
                  <b-tag @click.native="editAccountPopup(account)" size="is-small" class="account-tag account-tag-name" :type="checkAccountIncluded(account.id) ? 'included' : 'not-included'">
                    <span>{{account.settings.username}}{{account.settings.region ? ` - ${account.settings.region.toUpperCase()}` : ''}}</span>
                    <b-icon v-if="account.verified" size="is-small" pack="mdi" icon="approval"></b-icon>
                  </b-tag>
                  <b-tag @click.native="editAccountPopup(account)" size="is-small" v-if="accountGameSelect == 'all-games'" class="account-tag account-tag-game" :style="`background-color: ${games[account.game_id].color}`">{{games[account.game_id].small_name}}</b-tag>
                  <b-tag @click.native="deleteAccountPopup(account)" size="is-small" class="account-tag account-tag-delete" type="is-danger">
                    <b-icon pack="far" icon="trash-alt" size="is-small"></b-icon>
                  </b-tag>
                </b-taglist>
              </div>
            </b-field>

            <!-- CANCEL/DELETE BUTTON -->
            <div class="nav-buttons columns is-gapless is-mobile">
              <button @click="addAccountPopup(accountGameSelect)" v-if="accountGameSelect && accountGameSelect != 'all-games'" :disabled="accounts[accountGameSelect] != null && accounts[accountGameSelect].length >= 3 ? true : false" class="column button is-lightgreen">
                {{$t('builder.add-account')}} ({{accounts[accountGameSelect] ? accounts[accountGameSelect].length : 0}}/3)
              </button>
              <button v-else disabled class="column button is-lightgreen">
                {{$t('builder.select-game-to-add-account')}}
              </button>
            </div>

          </div>

          <div v-else class="is-full-height">

            <!-- CANCEL BUTTON -->
            <button @click="cancelAddAccount()" type="button" class="delete account-creation-cancel"></button>

            <!-- ADD ACCOUNT POPUP -->
            <div v-if="navigation == 'addAccount' && accountCreation && accountGameSelect && accountGameSelect != 'all-games'" class="is-full-height relative-zone">

              <!-- ACCOUNT RESUME -->
              <p class="account-title has-text-grey-lighter is-size-5 has-text-left">{{$t('builder.add-account')}}</p>
              <p class="account-subtitle is-size-6 has-text-grey-light has-text-left">{{games[accountGameSelect].name}}</p>

              <!-- ACCOUNT SETTING FIELDS -->
              <section class="account-creation-popup has-text-left animated fadeIn">

                <b-field v-for="(setting, settingKey) in accountCreation" :key="settingKey" grouped group-multiline expanded>

                  <!-- FIELD LABEL -->
                  <p v-if="settingKey != 'verified'" class="control">
                    <label class="label">
                      {{setting.label[locale]}}
                      <b-tooltip v-if="setting.tooltip" :label="setting.tooltip[locale]" type="is-light" position="is-right" size="is-small" multilined>
                        <b-icon pack="far" icon="question-circle" size="is-small" class="has-text-grey-light">
                        </b-icon>
                      </b-tooltip>
                    </label>
                  </p>

                  <!-- INPUT TYPE: string -->
                  <b-input v-if="setting.type == 'string'" v-model="dataForm[settingKey]" :placeholder="setting.label[locale]" size="is-small" required expanded></b-input>
                  <!-- INPUT TYPE: select -->
                  <b-select v-else-if="setting.type == 'select'" v-model="dataForm[settingKey]" :placeholder="setting.label[locale]" size="is-small" required expanded>
                    <option v-for="(input, inputKey) in setting.input" :key="inputKey" :value="inputKey">
                      {{input[locale]}} ({{inputKey}})
                    </option>
                  </b-select>
                </b-field>

              </section>

              <!-- CANCEL/ADD BUTTON -->
              <div class="nav-buttons columns is-gapless is-mobile">
                <button @click="cancelAddAccount()" class="column button is-danger">
                  {{$t('builder.cancel')}}
                </button>
                <button @click="addAccount(accountGameSelect)" class="column button is-success" :disabled="!checkInputsAdd()" :class="loadingButtons.add ? 'is-loading' : ''">
                  {{$t('builder.add')}}
                </button>
              </div>
            </div>

            <!-- EDIT ACCOUNT POPUP -->
            <div v-else-if="navigation == 'editAccount' && accountEdition" class="is-full-height relative-zone">

              <!-- ACCOUNT RESUME -->
              <p class="account-title has-text-grey-lighter is-size-5 has-text-left">{{$t('builder.edit-account')}}</p>
              <p class="account-subtitle is-size-6 has-text-grey-light has-text-left">{{games[accountEdition.game_id].name}}</p>

              <!-- ACCOUNT SETTING FIELDS -->
              <section class="account-creation-popup has-text-left animated fadeIn">

                <b-field v-for="(setting, settingKey) in accountEdition.fieldSettings" :key="settingKey" grouped group-multiline expanded>

                  <!-- FIELD LABEL -->
                  <p v-if="settingKey != 'verified'" class="control">
                    <label class="label">
                      {{setting.label[locale]}}
                      <b-tooltip v-if="setting.tooltip" :label="setting.tooltip[locale]" type="is-light" position="is-right" size="is-small" multilined>
                        <b-icon pack="far" icon="question-circle" size="is-small" class="has-text-grey-light">
                        </b-icon>
                      </b-tooltip>
                    </label>
                  </p>

                  <!-- INPUT TYPE: string -->
                  <b-input v-if="setting.type == 'string'" v-model="dataForm[settingKey]" :placeholder="setting.label[locale]" size="is-small" required expanded></b-input>
                  <!-- INPUT TYPE: select -->
                  <b-select v-else-if="setting.type == 'select'" v-model="dataForm[settingKey]" :placeholder="setting.label[locale]" size="is-small" required expanded>
                    <option v-for="(input, inputKey) in setting.input" :key="inputKey" :value="inputKey">
                      {{input[locale]}} ({{inputKey}})
                    </option>
                  </b-select>
                </b-field>

              </section>

              <!-- REMOVE/SAVE BUTTON -->
              <div class="nav-buttons columns is-gapless is-mobile">
                <button @click="deleteAccountPopup(accountEdition)" class="column button is-danger">
                  {{$t('builder.remove')}}
                </button>
                <button @click="updateAccount(accountEdition)" class="column button is-success" :disabled="!checkInputsEdit()" :class="loadingButtons.save ? 'is-loading' : ''">
                  {{$t('builder.save')}}
                </button>
              </div>
            </div>

            <!-- REMOVE ACCOUNT POPUP CONFIRMATION -->
            <div v-if="navigation == 'deleteAccountConfirm' && accountEdition" class="is-full-height relative-zone">

              <!-- ACCOUNT RESUME-->
              <p class="account-title has-text-grey-lighter is-size-5 has-text-left">{{games[accountEdition.game_id].name}} - {{accountEdition.settings.username}}</p>

              <div class="confirmation-message align-vertical-center is-full-height animated fadeIn">
                <div>
                  <div class="title is-size-5">{{$t('builder.remove-account-confirmation-message')}}</div>
                  <b-field grouped group-multiline class="align-tags">
                    <b-taglist attached class="has-text-centered">
                      <b-tag class="account-tag account-tag-name" size="is-medium" :type="accountEdition.included ? 'included' : 'not-included'">{{accountEdition.settings.username}}{{accountEdition.settings.region ? ` - ${accountEdition.settings.region.toUpperCase()}` : ''}}</b-tag>
                      <b-tag class="account-tag account-tag-game" size="is-medium" :style="`background-color: ${games[accountEdition.game_id].color}`">{{games[accountEdition.game_id].small_name}}</b-tag>
                    </b-taglist>
                  </b-field>
                </div>
              </div>

              <!-- CANCEL/DELETE BUTTON -->
              <div class="nav-buttons columns is-gapless is-mobile">
                <button @click="cancelAddAccount()" class="column button is-light">
                  {{$t('builder.cancel')}}
                </button>
                <button @click="deleteAccount(accountEdition)" class="column button is-danger" :class="loadingButtons.remove ? 'is-loading' : ''">
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
      accountCreation: null,
      accountEdition: null,
      accountGameSelect: "all-games",
      loadingButtons: {
        add: false,
        save: false,
        remove: false
      },
      dataForm: {}
    };
  },
  computed: {
    ...mapState({
      locale: state => state.locale,
      games: state => state.builder.games,
      accounts: state => state.builder.accounts,
      accountSettings: state => state.builder.accountSettings,
      allAccounts: state => state.builder.allAccounts,
      selectedGame: state => state.builder.selectedGame,
      userTags: state => state.builder.userTags
    }),
    accountsBySelect() {
      return !this.accountGameSelect || this.accountGameSelect == "all-games"
        ? this.allAccounts
        : this.accounts[this.accountGameSelect];
    }
  },
  watch: {
    selectedGame(newGame, olgGame) {
      this.navigation = null;
      if (newGame) this.accountGameSelect = newGame.id;
      else this.accountGameSelect = "all-games";
    }
  },
  methods: {
    checkAccountIncluded(id) {
      const index = _.findIndex(this.userTags, function(o) {
        if (o.included && o.account_id == id) return true;
        else return false;
      });
      return index < 0 ? false : true;
    },
    async addAccount(gameSelected) {
      this.loadingButtons.add = true;

      await this.$axios
        .$put("/api/account/me/create", {
          game_id: gameSelected,
          settings: this.dataForm
        })
        .then(data => {
          this.$store.commit("builder/UPDATE_ACCOUNT", data.data);
          this.cancelAddAccount();
          this.loadingButtons.add = false;
        })
        .catch(e => {
          const code = parseInt(e.response && e.response.status);

          if (code == 405) {
            this.showNotification({
              title: this.$t("error.error"),
              message: this.$t("builder.cant-add-more-account"),
              type: "error",
              timeout: 5000
            });
          } else if (code == 429) {
            this.showNotification({
              title: this.$t("error.error"),
              message: this.$t("builder.account-rate-limit"),
              type: "error",
              timeout: 5000
            });
          } else {
            this.$store.dispatch("setError", e);
            this.showNotification({
              title: this.$store.state.error.statusCode.toString(),
              message: this.$store.state.error.message,
              type: "error",
              timeout: 5000
            });
          }

          setTimeout(() => {
            this.loadingButtons.add = false;
          }, 5000);
        });
    },
    addAccountPopup(gameSelected) {
      this.accountCreation = this.accountSettings[gameSelected];
      this.navigation = "addAccount";
    },
    editAccountPopup(account) {
      this.accountEdition = account;
      this.accountEdition.fieldSettings = this.accountSettings[account.game_id];
      this.dataForm = _.cloneDeep(account.settings);
      this.navigation = "editAccount";
    },
    deleteAccountPopup(account) {
      this.accountEdition = account;
      this.navigation = "deleteAccountConfirm";
    },
    async updateAccount(account) {
      this.loadingButtons.save = true;

      await this.$axios
        .$post(`/api/account/me/${account.id}/edit`, {
          game_id: account.game_id,
          settings: this.dataForm
        })
        .then(data => {
          if (data.data)
            this.$store.commit("builder/UPDATE_ACCOUNT", data.data);

          this.cancelAddAccount();
          this.loadingButtons.save = false;
        })
        .catch(e => {
          const code = parseInt(e.response && e.response.status);

          if (code == 429) {
            this.showNotification({
              title: this.$t("error.error"),
              message: this.$t("builder.account-rate-limit"),
              type: "error",
              timeout: 5000
            });
          } else {
            this.$store.dispatch("setError", e);
            this.showNotification({
              title: this.$store.state.error.statusCode.toString(),
              message: this.$store.state.error.message,
              type: "error",
              timeout: 5000
            });
          }

          setTimeout(() => {
            this.loadingButtons.save = false;
          }, 5000);
        });
    },
    async deleteAccount(account) {
      this.$store.commit("builder/SET_BUILDER_LOADING", true);
      this.loadingButtons.remove = true;

      await this.$store.dispatch("builder/deleteAccount", account).catch(e => {
        this.$store.dispatch("setError", e);
        this.showNotification({
          title: this.$store.state.error.statusCode.toString(),
          message: this.$store.state.error.message,
          type: "error",
          timeout: 5000
        });
      });

      this.cancelAddAccount();
      this.loadingButtons.remove = false;
      this.$store.commit("builder/SET_BUILDER_LOADING", false);
    },
    cancelAddAccount() {
      this.navigation = null;
      this.accountCreation = null;
      this.accountEdition = null;
      this.dataForm = {};
    },
    checkInputsAdd() {
      for (const input in this.accountCreation) {
        if (!this.dataForm[input] && input != "verified") return false;
      }
      return true;
    },
    checkInputsEdit() {
      for (const input in this.accountEdition.fieldSettings) {
        if (!this.dataForm[input] && input != "verified") return false;
        if (this.dataForm[input] != this.accountEdition.settings[input])
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
.account-title {
  padding: 0 0.7rem 0 0.7rem;
}
.account-subtitle {
  padding: 0 0.7rem 0.7rem 0.7rem;
}
.account-creation-popup {
  border-radius: 3px;
  padding: 0 0.7rem;
  position: relative;
  width: 100%;
}
.align-tags {
  display: flex;
  justify-content: center !important;
  padding-top: 1rem;
}
.game-selection {
  border-top: 1px solid #c5c5c5;
  border-bottom: 1px solid #c5c5c5;
}
.relative-zone {
  position: relative;
  padding-bottom: 50px;
}
.delete.account-creation-cancel {
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
.nav-buttons {
  position: absolute;
  bottom: 0;
  width: 100%;
}
.nav-buttons .button {
  border: unset;
  border-radius: 0;
}
.account-tag-name.included {
  background-color: #81d29d;
  color: #191818; /*rgba(0, 0, 0, 0.7);*/
}
.accounts-container .field.is-grouped > .control {
  margin-right: 0.25rem;
  margin-left: 0.25rem;
}
.account-tag-name.not-included {
  background-color: #f98989;
  color: #191818;
}
.account-tag {
  cursor: pointer;
}
.account-tag-game {
  color: #151515;
}
.confirmation-message {
  padding-top: 20px;
  height: calc(100% - 40px);
}
</style>

<style>
.account-list .card {
  height: 100%;
}
.account-list .collapse-content {
  height: calc(100% - 48px);
}
.account-list .collapse-content {
  height: calc(100% - 48px);
  min-height: 15rem;
}
@media screen and (max-width: 768px) {
  .account-list .collapse-content {
    min-height: 0;
  }
}
.account-list .card-content {
  height: 100%;
  padding: 0;
}
.accounts-container .game-selection select {
  background-color: #2d2d2d !important;
  color: white !important;
  border: 0 !important;
  border-radius: 0 !important;
}
.accounts-container .game-selection .select.is-empty select {
  color: rgba(255, 255, 255, 0.8) !important;
}
</style>

