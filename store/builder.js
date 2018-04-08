import _ from 'lodash';
import Vue from 'vue';

export const state = () => ({
  builderLoading: false,
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
  gameTagsCategoryPages: [],
  userTags: [],
  accountSettings: null,
  allAccounts: {},
  accounts: {},
  preview: {
    loading: false,
    needUpdate: true,
    name: 'Name',
    description: 'Description',
    location: 'Location',
    url: 'http://url.fr',
  }
})

export const mutations = {
  SET_BUILDER_LOADING(state, status) {
    state.builderLoading = status;
  },
  SET_SELECTED_GAME(state, game) {
    state.selectedGame = game;
  },
  SET_GAMES(state, games) {
    state.games = games;
  },
  SET_USER_TAGS(state, userTags) {
    state.userTags = userTags;
  },
  SET_ACCOUNT_SETTINGS(state, accountSettings) {
    state.accountSettings = accountSettings;
  },
  SET_ALL_ACCOUNTS(state, accounts) {
    state.allAccounts = accounts;
    state.accounts = _.groupBy(state.allAccounts, 'game_id');
  },
  SET_USER_TAG_INCLUDED(state, key) {
    state.userTags[key].included = true;
  },
  SET_USER_TAG_NOT_INCLUDED(state, key) {
    state.userTags[key].included = false;
  },
  SET_GAME_TAGS_CATEGORY(state, tags) {
    state.gameTagsCategory = tags;
  },
  SET_GAME_TAGS_CATEGORY_PAGES(state, pages) {
    state.gameTagsCategoryPages = pages;
  },
  SET_TWITELO_DATA_INPUT_ALL(state, twiteloDataInput) {
    state.twiteloDataInput = twiteloDataInput;
  },
  SET_TWITELO_DATA_INPUT(state, {
    name,
    twiteloDataInput
  }) {
    Vue.set(state.twiteloDataInput, name, twiteloDataInput);
  },
  ADD_USER_TAG(state, tag) {
    state.userTags.push(tag);
  },
  DELETE_USER_TAG(state, id) {
    state.userTags.splice(id, 1);
  },
  DELETE_USER_TAGS(state, tagIDs) {
    state.userTags = _.filter(state.userTags, (o) => !tagIDs.includes(o.id));
  },
  UPDATE_USER_TAG(state, tag) {
    Vue.set(state.userTags, tag.index, tag);
  },
  UPDATE_ACCOUNT(state, account) {
    Vue.set(state.allAccounts, account.id, account);
    state.accounts = _.groupBy(state.allAccounts, 'game_id');
  },
  DELETE_ACCOUNT(state, id) {
    delete state.allAccounts[id];
    state.accounts = _.groupBy(state.allAccounts, 'game_id');
  }
};


export const actions = {
  async fetchBuilderData({
    state,
    commit
  }) {
    let games = (await this.$axios.$get('/api/game')).data;
    games = _.keyBy(games, 'id');
    const userTags = (await this.$axios.$get(`/api/tag/me/all`)).data;
    const accountSettings = (await this.$axios.$get('/api/game/settings/all')).data;
    let allAccounts = (await this.$axios.$get('/api/account/me/all')).data;
    allAccounts = _.keyBy(allAccounts, 'id');

    for (const key in userTags) {
      userTags[key].included = false;
    }

    commit('SET_GAMES', games);
    commit('SET_USER_TAGS', userTags);
    commit('SET_ACCOUNT_SETTINGS', accountSettings);
    commit('SET_ALL_ACCOUNTS', allAccounts);
  },

  async fetchTags({
    state,
    commit
  }, game) {
    if (game) {
      let tags = (await this.$axios.$get(`/api/game/tags/game/${game.id}`)).data;
      tags = _.groupBy(tags, 'category');
      const pages = _.chunk(Object.keys(tags), 4);
      commit('SET_GAME_TAGS_CATEGORY', tags);
      commit('SET_GAME_TAGS_CATEGORY_PAGES', pages);
    } else {
      commit('SET_GAME_TAGS_CATEGORY', null);
      commit('SET_GAME_TAGS_CATEGORY_PAGES', []);
    }
  },

  async createTagAndUpdate({
    state,
    rootState,
    commit,
    dispatch
  }, {
    destination,
    tagInfo,
    account_id,
    settings,
    data_settings
  }) {
    const tag = (await this.$axios.$put(`/api/tag/me/create`, {
      tag_id: tagInfo.id,
      game_id: tagInfo.gameID,
      account_id: account_id,
      settings: settings,
      data_settings: data_settings
    })).data;
    await commit('ADD_USER_TAG', tag);
    await dispatch('transformToUUID');
    await commit('user/SET_TWITELO_DATA_CONTENT', {
      name: destination,
      content: `${rootState.user.info.twitelo[destination].content.trim()} <{${tag.id}}>`
    }, {
      root: true
    });

    await dispatch("transformFromUUID");
  },

  async updateTag({
    commit
  }, {
    tag,
    account_id,
    settings,
    data_settings
  }) {
    const updatedTag = (await this.$axios.$post(`/api/tag/me/${tag.id}/edit`, {
      tag_id: tag.tag_id,
      game_id: tag.game_id,
      account_id: account_id,
      settings: settings,
      data_settings: data_settings
    })).data;

    if (updatedTag) {
      updatedTag.index = tag.index;
      updatedTag.info = tag.info;
      updatedTag.included = tag.included;
      commit('UPDATE_USER_TAG', updatedTag);
    }
  },

  async deleteTagWithIndex({
    state,
    rootState,
    commit,
    dispatch
  }, tag) {
    await this.$axios.$delete(`/api/tag/me/${tag.id}/delete`);
    await dispatch("transformToUUID");

    let transformed = _.cloneDeep(rootState.user.info.twitelo);
    transformed.name.content = transformed.name.content.replace(`<{${tag.id}}>`, '').trim();
    transformed.description.content = transformed.description.content.replace(`<{${tag.id}}>`, '').trim();
    transformed.location.content = transformed.location.content.replace(`<{${tag.id}}>`, '').trim();
    transformed.url.content = transformed.url.content.replace(`<{${tag.id}}>`, '').trim();

    await commit('user/SET_TWITELO_DATA', transformed, {
      root: true
    });
    await commit('DELETE_USER_TAG', tag.index);
    await dispatch("transformFromUUID");
  },

  async deleteAccount({
    state,
    rootState,
    commit,
    dispatch
  }, account) {
    function removeFromProfile(text, ids) {
      const re = new RegExp(ids.join('|'), 'g');
      return text.replace(re, '');
    }

    await this.$axios.$delete(`/api/account/me/${account.id}/delete`);
    await dispatch("transformToUUID");

    let tagsToDelete = _.filter(state.userTags, o => o.account_id == account.id);
    const tagIDsToDelete = tagsToDelete.map(tag => `<{${tag.id}}>`);

    let transformed = _.cloneDeep(rootState.user.info.twitelo);
    transformed.name.content = removeFromProfile(transformed.name.content.trim(), tagIDsToDelete);
    transformed.description.content = removeFromProfile(transformed.description.content.trim(), tagIDsToDelete);
    transformed.location.content = removeFromProfile(transformed.location.content.trim(), tagIDsToDelete);
    transformed.url.content = removeFromProfile(transformed.url.content.trim(), tagIDsToDelete);

    await commit('user/SET_TWITELO_DATA', transformed, {
      root: true
    });

    await commit('DELETE_USER_TAGS', tagsToDelete.map(tag => tag.id));
    await commit('DELETE_ACCOUNT', account.id);
    await dispatch("transformFromUUID");
  },

  transformFromUUID({
    rootState,
    state,
    commit
  }, name) {
    function replaceFromUUID(text, userTags) {
      let mapObj = {};
      var myRegexp = /<{([^<>{} ]+)}>/g;
      let match = myRegexp.exec(text);
      while (match != null) {
        let foundTag = _.findIndex(userTags, ['id', match[1]]);
        if (foundTag >= 0) {
          commit('SET_USER_TAG_INCLUDED', foundTag);
          mapObj[`<{${userTags[foundTag].id}}>`] = `<{${foundTag}}>`;
        }
        match = myRegexp.exec(text);
      }
      if (Object.keys(mapObj).length > 0) {
        var re = new RegExp(Object.keys(mapObj).join("|").replace(/{/g, '\\{'), "g");
        text = text.replace(re, function (matched) {
          return mapObj[matched];
        });
      }
      return text;
    }

    for (const key in state.userTags) {
      commit('SET_USER_TAG_NOT_INCLUDED', key);
    }

    if (name) {
      const transformed = replaceFromUUID(rootState.user.info.twitelo[name].content.trim(), state.userTags)
      commit('SET_TWITELO_DATA_INPUT', {
        name,
        twiteloDataInput: transformed
      });
      console.log(`(${name}) transform <{12a65b}> -> <{1}>`);
    } else {
      const transformed = {
        name: replaceFromUUID(rootState.user.info.twitelo.name.content.trim(), state.userTags),
        description: replaceFromUUID(rootState.user.info.twitelo.description.content.trim(), state.userTags),
        location: replaceFromUUID(rootState.user.info.twitelo.location.content.trim(), state.userTags),
        url: replaceFromUUID(rootState.user.info.twitelo.url.content.trim(), state.userTags),
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
    function replaceToUUID(text, userTags) {
      let mapObj = {};
      var myRegexp = /<{([^<>{} ]+)}>/g;
      let match = myRegexp.exec(text);
      while (match != null) {
        if (userTags[match[1]]) {
          commit('SET_USER_TAG_INCLUDED', match[1]);
          mapObj[`<{${match[1]}}>`] = `<{${userTags[match[1]].id}}>`;
        }
        match = myRegexp.exec(text);
      }
      if (Object.keys(mapObj).length > 0) {
        var re = new RegExp(Object.keys(mapObj).join("|").replace(/{/g, '\\{'), "g");
        text = text.replace(re, function (matched) {
          return mapObj[matched];
        });
      }
      return text;
    }

    for (const key in state.userTags) {
      commit('SET_USER_TAG_NOT_INCLUDED', key);
    }

    if (name) {
      const transformed = replaceToUUID(state.twiteloDataInput[name].trim(), state.userTags);

      commit('user/SET_TWITELO_DATA_CONTENT', {
        name,
        content: transformed
      }, {
        root: true
      });
      console.log(`(${name}) transform <{1}> -> <{12a65b}>`);
    } else {
      let transformed = _.cloneDeep(rootState.user.info.twitelo);

      transformed.name.content = replaceToUUID(state.twiteloDataInput.name.trim(), state.userTags);
      transformed.description.content = replaceToUUID(state.twiteloDataInput.description.trim(), state.userTags);
      transformed.location.content = replaceToUUID(state.twiteloDataInput.location.trim(), state.userTags);
      transformed.url.content = replaceToUUID(state.twiteloDataInput.url.trim(), state.userTags);

      commit('user/SET_TWITELO_DATA', transformed, {
        root: true
      });
      console.log('(all) transform <{1}> -> <{12a65b}>');
    }
  }

};
