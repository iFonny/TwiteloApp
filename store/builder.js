import _ from 'lodash';

export const state = () => ({
  twitterLimits: {
    description: 160,
    url: 100,
    location: 30,
    name: 50
  },
  twiteloDataInput: {
    description: '1',
    location: '2',
    name: '3',
    url: '4'
  },
  selectedGame: null,
  games: [],
  gameTagsCategory: null,
  userTags: null,
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
  SET_TWITELO_DATA_INPUT_ALL(state, twiteloDataInput) {
    state.twiteloDataInput = twiteloDataInput;
  },
  SET_TWITELO_DATA_INPUT(state, {
    name,
    twiteloDataInput
  }) {
    state.twiteloDataInput[name] = twiteloDataInput;
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

  transformFromUUID({
    rootState,
    state,
    commit
  }, name) {
    if (name) {
      const transformed = rootState.user.info.twitelo[name].content.replace('<{UUID}>', '<{ID}>'); // TODO
      commit('SET_TWITELO_DATA_INPUT', {
        name,
        twiteloDataInput: transformed
      });
      console.log(`(${name}) transform <{12a65b}> -> <{1}>`);
    } else {
      const transformed = {
        name: rootState.user.info.twitelo.name.content.replace('<{UUID}>', '<{ID}>'), // TODO
        description: rootState.user.info.twitelo.description.content.replace('<{UUID}>', '<{ID}>'), // TODO
        location: rootState.user.info.twitelo.location.content.replace('<{UUID}>', '<{ID}>'), // TODO
        url: rootState.user.info.twitelo.url.content.replace('<{UUID}>', '<{ID}>') // TODO
      };
      commit('SET_TWITELO_DATA_INPUT_ALL', transformed);
      console.log('(all) transform <{12a65b}> -> <{1}>');
    }
  },

  transformToUUID({
    rootState,
    state,
    commit
  }, name) {
    if (name) {
      const transformed = state.twiteloDataInput[name].replace('<{ID}>', '<{UUID}>'); // TODO

      commit('user/SET_TWITELO_DATA_CONTENT', {
        name,
        content: transformed
      }, {
        root: true
      });
      console.log(`(${name}) transform <{1}> -> <{12a65b}>`);
    } else {
      let transformed = _.cloneDeep(rootState.user.info.twitelo);

      transformed.name.content = state.twiteloDataInput.name.replace('<{ID}>', '<{UUID}>'); // TODO
      transformed.description.content = state.twiteloDataInput.description.replace('<{ID}>', '<{UUID}>'); // TODO
      transformed.location.content = state.twiteloDataInput.location.replace('<{ID}>', '<{UUID}>'); // TODO
      transformed.url.content = state.twiteloDataInput.url.replace('<{ID}>', '<{UUID}>'); // TODO

      commit('user/SET_TWITELO_DATA', transformed, {
        root: true
      });
      console.log('(all) transform <{1}> -> <{12a65b}>');
    }
  },

};
