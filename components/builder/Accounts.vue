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
                  <b-tag size="is-small" class="account-tag account-tag-edit" type="is-twitter">
                    <b-icon pack="far" icon="edit" size="is-small"></b-icon>
                  </b-tag>
                  <b-tag size="is-small" class="account-tag account-tag-name" :type="checkAccountIncluded(account.id) ? 'included' : 'not-included'">
                    {{account.settings.username}}{{account.settings.region ? ` - ${account.settings.region}` : ''}}
                  </b-tag>
                  <b-tag size="is-small" v-if="accountGameSelect == 'all-games'" class="account-tag account-tag-game" :style="`background-color: ${games[account.game_id].color}`">{{games[account.game_id].small_name}}</b-tag>
                  <b-tag size="is-small" class="account-tag account-tag-delete" type="is-danger">
                    <b-icon pack="far" icon="trash-alt" size="is-small"></b-icon>
                  </b-tag>
                </b-taglist>
              </div>
            </b-field>

            <!-- CANCEL/DELETE BUTTON -->
            <div class="nav-buttons columns is-gapless is-mobile">
              <button @click="addAccount()" class="column button is-lightgreen">
                {{$t('builder.add-account')}}
              </button>
            </div>

          </div>

          <div v-else class="is-full-height">

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
      accountGameSelect: "all-games"
    };
  },
  computed: {
    ...mapState({
      locale: state => state.locale,
      games: state => state.builder.games,
      accounts: state => state.builder.accounts,
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
        if (o.settings&& o.included && o.settings.account == id) return true;
        else return false;
      });
      return index < 0 ? false : true;
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

