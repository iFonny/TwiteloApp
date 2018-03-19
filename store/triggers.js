export const state = () => ({
  games: [],
  triggersList: []
})

export const mutations = {
  SET_TRIGGERS(state, {
    games,
    triggersList
  }) {
    state.games = games;
    state.triggersList = triggersList;
  },
};


export const actions = {


};
