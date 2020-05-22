// appStateの更新、clinet & server
const postAppState = appState => {
  // TODO その前に差分のappStateにも同期させたい
  window.parent.postMessage({ appState }, document.referrer);
};

// initial state
const state = {
  room: {}, // room information
  users: [], // information of users in the room
  accessUserId: null, // information of user who play in this window
  appState: {}
};

// mutations
const mutations = {
  setRoom(state, room) {
    state.room = room;
  },
  setUsers(state, users) {
    state.users = users;
  },
  setAccessUserId(state, userId) {
    state.accessUserId = userId;
  },
  setAppState(state, appState) {
    state.appState = appState;
  }
};

const actions = {
  assignState({ state }, obj) {
    let appState = state.appState;
    Object.keys(obj).forEach(key => {
      appState[key] = obj[key];
    });
    postAppState(appState);
  },
  replaceState(obj) {
    postAppState(obj);
  },
  deleteState() {
    postAppState({});
  }
};

const getters = {
  room: state => {
    return state.room;
  },
  users: state => {
    return state.users;
  },
  appState: state => {
    return state.appState;
  },
  accessUser: state => {
    return state.users.find(user => user.id === state.accessUserId);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
