const state = {
  show: false,
  iteration: "false"
};

const mutations = {
  TO_UPDATE: state => {
    state.iteration = true;
  },
  FINISH_UPDATE: state => {
    state.iteration = false;
  },
  TOGGLE_SHOW: state => {
    state.show = !state.show;
  },
  UPDATE_SHOW: (state, val) => {
    state.show = val;
  }
};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
