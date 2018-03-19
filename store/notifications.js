export const state = () => ({
  list: []
})

export const mutations = {
  SET_NOTIFICATIONS(state, notifications) {
    state.list = notifications;
  }
};


export const actions = {

  async clearNotifications({
    commit,
    state
  }) {
    const unarchived = state.list.filter(notif => !notif.archived).map(notif => notif.id);
    await this.$axios.$post('/api/notification/me/archive', unarchived)
    commit('SET_NOTIFICATIONS', []);
  },

  async fetchNotifications({
    state,
    commit
  }) {
    const notifications = (await this.$axios.$get('/api/notification/me/unarchived/limit/100')).data;
    commit('SET_NOTIFICATIONS', notifications)
  },

  async getAllNotifications({
    commit
  }) {
    const notifications = (await this.$axios.$get('/api/notification/me/all/limit/100')).data;
    commit('SET_NOTIFICATIONS', notifications)
  },

};
