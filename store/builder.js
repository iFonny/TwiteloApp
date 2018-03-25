export const state = () => ({
  selectedGame: null,
  games: []
})

export const mutations = {
  SET_SELECTED_GAME(state, game) {
    state.selectedGame = game;
  },
  SET_GAMES(state, games) {
    state.games = games;
  }
};


export const actions = {
  async fetchBuilderData({
    state,
    commit
  }) {
    const games = (await this.$axios.$get('/api/game')).data;
    commit('SET_GAMES', games);
  },

};
