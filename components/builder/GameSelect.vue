<template>
  <article class="tile is-child has-text-centered game-select">
    <b-collapse class="card">
      <div slot="trigger" slot-scope="props" class="card-header">
        <div class="card-header-title">
          <h1 class="title is-size-6-tablet is-size-5-desktop is-size-5">{{$t('builder.select-game')}}</h1>
        </div>
        <a class="card-header-icon">
          <b-icon :icon="props.open ? 'menu-down' : 'menu-up'">
          </b-icon>
        </a>
      </div>
      <div class="card-content align-vertical-center">
        <div v-if="selectedGame" class="content animated bounceIn">
          <img @click="selectGame(null)" :src="'/api' + selectedGame.image" :alt="selectedGame.name" class="game-list-image no-select">
          <p class="subtitle is-3 has-text-grey-lighter">{{selectedGame.name}}</p>
        </div>
        <div v-else class="game-list">
          <img v-for="game in games" :key="game.id" @click="selectGame(game)" :src="'/api' + game.icon" :alt="game.name" class="game-list-icon no-select">
        </div>
      </div>
    </b-collapse>
  </article>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      selectedGame: state => state.builder.selectedGame,
      games: state => state.builder.games
    })
  },
  methods: {
    selectGame(game) {
      this.$store.commit("builder/SET_SELECTED_GAME", game);
    }
  }
};
</script>


<style scoped>
.game-list-icon {
  height: 50px;
  width: 50px;
  margin: 0.3rem;
  cursor: pointer;
  -webkit-filter: drop-shadow(0px 0px 1px rgb(255, 255, 255));
  filter: drop-shadow(0px 0px 1px rgb(255, 255, 255));
}
.game-list-image {
  max-width: 60%;
  max-height: 110px;
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
.game-select .card {
  height: 85%;
}
.game-select .collapse-content {
  height: 100%;
}
.game-select .card-content {
  height: 100%;
  padding: 0.1rem;
}
</style>

