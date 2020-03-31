const state = {
  auditdrawer: false
};

const mutations = {
  UPDATE_AUDITDRAWER: (state, val) => {
    state.auditdrawer = val;
  },
  TOGGLE_AUDITDRAWER: state => {
    state.auditdrawer = !state.auditdrawer;
  },
  SHOW_AUDITDRAWER: state => {
    state.auditdrawer = true;
  }
};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
