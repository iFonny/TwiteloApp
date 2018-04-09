import Vue from 'vue';
import _ from 'lodash';

export const state = () => ({
  list: []
})

export const mutations = {
  /* GLOBAL */
  SET_SETTINGS(state, settings) {
    state.list = settings;
  },

  /* PP TRIGGER */
  SET_PP_TRIGGER_GAME(state, {
    id,
    game
  }) {
    state.list.pp_trigger[id].game = game;
  },
  SET_PP_TRIGGER_ID(state, {
    id,
    triggerID
  }) {
    state.list.pp_trigger[id].trigger_id = triggerID;
  },
  SET_PP_TRIGGER(state, ppTrigger) {
    state.list.pp_trigger[ppTrigger.id] = ppTrigger;
  },
  DELETE_PP_TRIGGER(state, id) {
    state.list.pp_trigger[id] = undefined;
    delete state.list.pp_trigger[id];
  },
  ADD_PP_TRIGGER(state, newTrigger) {
    Vue.set(state.list.pp_trigger, newTrigger.id, newTrigger)
  },
};


export const actions = {

  /* GLOBAL */
  async fetchSettings({
    rootState,
    commit,
    error
  }) {
    const userSettings = rootState.user.info.settings;
    const twiteloData = rootState.user.info.twitelo;

    const settings = (await this.$axios.$get('/api/setting/me/all')).data;
    let staticTriggers = (await this.$axios.$get('/api/trigger')).data;
    staticTriggers = _.orderBy(staticTriggers, 'id');
    let games = (await this.$axios.$get('/api/game')).data;
    games = _.map(games, 'small_name');

    commit('user/SET_USER_SETTINGS', userSettings, {
      root: true
    });
    commit('SET_SETTINGS', settings);
    commit('user/SET_TWITELO_DATA', twiteloData, {
      root: true
    });
    commit('triggers/SET_TRIGGERS', {
      games,
      triggersList: staticTriggers
    }, {
      root: true
    });

  },

  /* GENERAL */
  async changeTwiteloSettingSwitch({
    commit,
    rootState
  }, name) {
    await this.$axios.$post(`/api/setting/me/switch/twitelo/${name}/${+!rootState.user.info.twitelo[name].status}`);
    commit('user/TOGGLE_TWITELO_SWITCH', name, {
      root: true
    });
  },

  async deleteAccount({
    state,
    commit,
    rootState
  }) {
    const token = rootState.user.info.twitelo_token;
    await this.$axios.$delete('/api/user/me/delete');
    await this.$axios.$get('/auth/logout');
    commit('user/SET_USER', null, {
      root: true
    });
  },

  /* PP TRIGGER */
  async changePPTriggerSwitch({
    commit,
    rootState
  }) {
    await this.$axios.$post(`/api/setting/me/switch/pp_trigger/${+!rootState.user.info.settings.pp_trigger}`)
    commit('user/TOGGLE_SETTINGS_PP_TRIGGER_SWITCH', null, {
      root: true
    });
  },

  async addPPTrigger({
    commit
  }) {
    const emptyPPTrigger = (await this.$axios.$put('/api/setting/me/pp_trigger/empty')).data;
    commit('ADD_PP_TRIGGER', emptyPPTrigger);
  },

  async updatePPTrigger({
    commit
  }, ppTrigger) {
    let updatedPPTrigger = (await this.$axios.$post('/api/setting/me/pp_trigger/edit', {
      id: ppTrigger.id,
      triggerID: ppTrigger.trigger_id,
      image: ppTrigger.image
    })).data;

    if (updatedPPTrigger) {
      updatedPPTrigger.game = ppTrigger.game;
      commit('SET_PP_TRIGGER', updatedPPTrigger);
    }
  },

  async deletePPTrigger({
    commit
  }, id) {
    await this.$axios.$delete('/api/setting/me/pp_trigger/delete', {
      data: [id]
    });
    commit('DELETE_PP_TRIGGER', id)
  },


  /* NOTIFICATION */
  async changeNotificationsSwitch({
    commit,
    rootState
  }, name) {
    await this.$axios.$post(`/api/setting/me/switch/notification/${name}/${+!rootState.user.info.settings.notifications[name]}`);
    commit('user/TOGGLE_SETTINGS_NOTIFICATIONS_SWITCH', name, {
      root: true
    });
  },

};
