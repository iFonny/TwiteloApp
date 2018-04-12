<template>
  <article class="tile is-child has-text-centered game-select">
    <b-collapse class="card">
      <div slot="trigger" slot-scope="props" class="card-header no-select">
        <div class="card-header-title">
          <h1 class="title is-size-6-mobile is-size-5-desktop is-size-5">{{$t('builder.select-game')}}</h1>
        </div>
        <a class="card-header-icon">
          <b-icon :icon="props.open ? 'menu-down' : 'menu-up'">
          </b-icon>
        </a>
      </div>
      <div class="card-content align-vertical-center">
        <div>

          <!-- CANCEL BUTTON -->
          <button v-if="selectedGame" @click="selectGame(null)" type="button" class="delete game-selection-cancel"></button>

          <div v-if="selectedGame" class="content align-vertical-center animated bounceIn">
            <img @click="selectGame(null)" :src="'/api' + selectedGame.image" :alt="selectedGame.name" class="game-list-image no-select">
            <!-- <span class="subtitle is-3 has-text-grey-lighter">{{selectedGame.name}}</span> -->
          </div>
          <div v-else class="game-list">
            <img v-for="game in games" :key="game.id" @click="selectGame(game)" :src="'/api' + game.icon" :alt="game.name" class="game-list-icon no-select">
          </div>
        </div>
      </div>
    </b-collapse>
  </article>
</template>

<script>
import { mapState } from "vuex";
import VueNotifications from "vue-notifications";

export default {
  data() {
    return { gameSelectIsLoading: false };
  },
  computed: {
    ...mapState({
      selectedGame: state => state.builder.selectedGame,
      games: state => state.builder.games
    })
  },
  methods: {
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
.delete.game-selection-cancel {
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
.game-select .card-content {
  min-height: 120px;
  padding: 0.3rem;
  padding-bottom: 0;
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
</style>

<style>
.game-select .loading-overlay .loading-background {
  background-color: rgba(45, 45, 45, 0.42) !important;
}
/* .game-select .card {
  height: 86%;
}
.game-select .collapse-content {
  height: 100%;
}
.game-select .card-content {
  height: 100%;
  padding: 0.1rem;
} */
</style>

