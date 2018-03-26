export const state = () => ({
  selectedGame: null,
  games: [],
  gameTagsCategory: [],
  accounts: []
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
    // TODO: request get tags for a game (await this.$axios.$get('/api/game/{GAMEXD}')).data; doivent etre bien trié
    const tags = {
      "Ranked Solo Summoner's Rift": [{
        id: 'GAME__RANKED_SOLO_SR__TIER',
        gameID: 'lol',
        category: "Ranked Solo Summoner's Rift",
        categorySmall: "Ranked Solo SR",
        name: 'Tier',
        nameSmall: 'Tier',
        size: {
          long: 10,
          short: 6
        },
        fieldSettings: {
          account: {
            type: 'account', // select
            tooltip: false,
            input: false,
            label: {
              en: 'Account',
              fr: 'Compte'
            }
          },
          size: {
            type: 'select', // select
            tooltip: {
              en: 'Text size',
              fr: 'Taille du texte'
            },
            label: {
              en: 'Size',
              fr: 'Taille'
            },
            input: {
              long: {
                en: 'Long (10 characters)',
                fr: 'Long (10 caractères)'
              },
              short: {
                en: 'Short (6 characters)',
                fr: 'Court (6 caractères)'
              }
            }
          }
        }
      }],
      "Ranked Flex Summoner's Rift": [],
      "Ranked Flex Twisted Treeline": [],
    };

    commit('SET_GAME_TAGS_CATEGORY', tags);
  },

};
