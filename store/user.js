export const state = () => ({
  info: null
})

export const mutations = {
  SET_USER(state, user) {
    state.info = user;
  },
  TOGGLE_USER_SWITCH(state) {
    state.info.switch = !state.info.switch;
  },
  TOGGLE_TWITELO_SWITCH(state, name) {
    state.info.twitelo[name].status = !state.info.twitelo[name].status;
  },
  TOGGLE_SETTINGS_NOTIFICATIONS_SWITCH(state, name) {
    state.info.settings.notifications[name] = !state.info.settings.notifications[name];
  },
  TOGGLE_SETTINGS_PP_TRIGGER_SWITCH(state) {
    state.info.settings.pp_trigger = !state.info.settings.pp_trigger;
  },
  SET_USER_SETTINGS(state, settings) {
    state.info.settings = settings;
  },
  SET_TWITELO_DATA(state, twiteloData) {
    state.info.twitelo = twiteloData;
  },
  SET_USER_LOCALE(state, locale) {
    state.info.settings.locale = locale;
  }
};


export const actions = {
  logout({
    commit
  }) {
    commit('SET_USER', null);
  },

};
