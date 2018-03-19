import Vue from 'vue';
import _ from 'lodash';

export const state = () => ({
  switch: {
    disabled: false
  },
  buttons: {
    langDisabled: false
  },
  socket: {
    isConnected: false,
    reconnectError: false,
  },
  locales: ['en', 'fr'],
  locale: 'en'
})

export const mutations = {
  SET_LANG(state, {
    locale,
    status
  }) {
    state.buttons.langDisabled = status;
    if (state.locales.indexOf(locale) !== -1) {
      state.locale = locale;
    }
  },
  SET_SWITCH_DISABLED(state, status) {
    state.switch.disabled = status;
  },
  ENABLE_LANG_BUTTON(state) {
    state.buttons.langDisabled = false;
  },
  SET_ERROR(state, err) {
    state.error = err;
  },


  /* WebSockets */
  SOCKET_ONOPEN(state, event) {
    state.socket.isConnected = true
  },
  SOCKET_ONCLOSE(state, event) {
    console.log('Socket closed');
    state.socket.isConnected = false
  },
  SOCKET_ONERROR(state, event) {
    console.error(state, event)
  },
  // default handler called for all methods
  SOCKET_ONMESSAGE(state, message) {
    switch (message.type) {
      case 'NOTIFICATION':
        if (!message.data.archived)
          state.notifications.list.unshift(message.data);
        break;

      default:
        console.error('Websocket on message unknown type: ' + message)
        break;
    }
  },
  // mutations for reconnect methods
  SOCKET_RECONNECT(state, count) {
    console.info('Socket reconnected - ' + count)
  },
  SOCKET_RECONNECT_ERROR(state) {
    state.socket.reconnectError = true;
  }
}

export const actions = {
  // nuxtServerInit is called by Nuxt.js before server-rendering every page
  async nuxtServerInit({
    state,
    commit,
    dispatch
  }, {
    app,
    req,
    error
  }) {
    if (req.isAuthenticated()) {
      // Auth requests
      app.$axios.setToken(req.user.twitelo_token);

      try {
        const user = (await this.$axios.$get('/api/user/me/update')).data;

        commit('user/SET_USER', user);
        await dispatch("notifications/fetchNotifications");
        commit('SET_LANG', {
          locale: user.settings.locale,
          status: false
        });
        app.i18n.locale = user.settings.locale;
      } catch (e) {
        dispatch('setError', e);
        error(state.error);
      }

    }
  },

  setError({
    commit
  }, e) {
    let errFormat = {};

    if (e.response && e.response.data && e.response.data.status && e.response.data.data) {
      errFormat = {
        statusCode: e.response.data.status,
        message: e.response.data.data
      };
    } else if (e.response) {
      const code = parseInt(e.response && e.response.status);
      errFormat = {
        statusCode: code,
        message: e.response.statusText
      };
    } else {
      console.error(e);
      errFormat = {
        statusCode: 520,
        message: 'Unknown Error'
      };
    }
    commit('SET_ERROR', errFormat);
  },

  async setLocale({
    commit,
    state
  }, locale) {
    commit('SET_LANG', {
      locale,
      status: true
    });
    if (state.user.info) {
      await this.$axios.$post(`/api/setting/me/user/locale/${locale}`);
      commit('user/SET_USER_LOCALE', locale);
    }
    setTimeout(() => commit('ENABLE_LANG_BUTTON'), 1000);
  },

  async changeSwitch({
    state,
    commit
  }, status) {
    await this.$axios.$post(`/api/setting/me/switch/global/${+status}`);
    commit('SET_SWITCH_DISABLED', true);
    commit('user/TOGGLE_USER_SWITCH');
    setTimeout(() => commit('SET_SWITCH_DISABLED', false), 1000);
  },

}
