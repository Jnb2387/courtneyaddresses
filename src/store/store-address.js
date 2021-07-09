const state = {
  addressesData: {
    type: "FeatureCollection",
    features: [], // <--- no features
  },
  zoomTo: [0, 0],
};

const mutations = {
  SET_ADDRESSES(state, payload) {
    state.addressesData = payload;
  },
  SET_ZOOMTO(state, payload) {
    state.zoomTo = payload;
  }
};

const actions = {
  GET_ADDRESSES: async (context, payload) => {
    fetch("http://localhost:3000/addresses")
    // fetch("https://infinite-citadel-26612.herokuapp.com/addresses")
      .then((response) => response.text())
      .then((data) => {
        context.commit("SET_ADDRESSES", JSON.parse(data));
      });
  },
};

const getters = {
  addresses: (state) => {
    return state.addressesData;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
