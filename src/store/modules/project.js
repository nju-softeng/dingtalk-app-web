const state = {
  show: false,
  iteration: false,
  finishdrawer: false
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
  },
  UPDATE_DRAWER: (state, val) => {
    state.finishdrawer = val;
  },
  TOGGLE_DRAWER: state => {
    state.finishdrawer = !state.finishdrawer;
  }
};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
