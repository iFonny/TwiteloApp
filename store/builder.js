export const state = () => ({
  twitterLimits: {
    description: 160,
    url: 100,
    location: 30,
    name: 50
  },
  selectedGame: null,
  games: [],
  gameTagsCategory: null,
  accounts: {
    lol: [{
      id: '1ac3456b7890',
      accountID: '98765434567', // id du compte dans le jeu
      gameID: 'lol',
      username: 'iFonny',
      region: 'EUW'
    }]
  }
})

export const mutations = {
  SET_SELECTED_GAME(state, game) {
    state.selectedGame = game;
  },
  SET_GAMES(state, games) {
    state.games = games;
  },
  SET_GAME_TAGS_CATEGORY(state, tags) {
    state.gameTagsCategory = tags;
  },
};


export const actions = {
  async fetchBuilderData({
    state,
    commit
  }) {
    const games = (await this.$axios.$get('/api/game')).data;

    commit('SET_GAMES', games);
  },

  async fetchTags({
    state,
    commit
  }, game) {
    if (game) {
      let tags = (await this.$axios.$get(`/api/game/tags/${game.id}`)).data;
      tags = _.groupBy(tags, 'category');
      commit('SET_GAME_TAGS_CATEGORY', tags);
    } else commit('SET_GAME_TAGS_CATEGORY', null);
  },

};
