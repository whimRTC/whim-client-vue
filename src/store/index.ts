interface Room {
  id?: string;
}
interface User {
  id: string;
  name: string;
  timestamp: Date;
  positionNumber: number;
}
interface State {
  room: Room;
  users: User[];
  accessUserId: string | null;
  appState: { [s: string]: any };
  targetOrigin: string;
}
type ConnFunc = (prop: string, obj: { [s: string]: any }) => void;

// mutations
const mutations = {
  setRoom(state: State, room: Room) {
    state.room = room;
  },
  setUsers(state: State, users: User[]) {
    state.users = users;
  },
  setAccessUserId(state: State, userId: string) {
    state.accessUserId = userId;
  },
  setAppState(state: State, appState: { [s: string]: any }) {
    state.appState = appState;
  },
  setTargetOrigin(state: State, targetOrigin: string) {
    state.targetOrigin = targetOrigin;
  },
};

const actions = {
  // 削除予定
  assignState({ state, dispatch }: {state: State, dispatch: ConnFunc}, obj: { [s: string]: any }) {
    const appState = state.appState;
    Object.keys(obj).forEach(key => {
      appState[key] = obj[key];
    });
    dispatch("replaceState", appState);
  },
  // 削除予定
  deleteState({ dispatch }: {dispatch: ConnFunc}) {
    dispatch("replaceState", {});
  },
  // 削除予定
  replaceState({ state, commit }: {state: State, commit: ConnFunc}, appState: { [s: string]: any }) {
    commit("setAppState", appState);
    window.parent.postMessage({ appState }, state.targetOrigin);
  },
  setState({ state }: {state: State}, { ref, data }: { ref: string, data: any }) {
    window.parent.postMessage({ state: { ref, operator: "set", data } }, state.targetOrigin);
  },
  updateState({ state }: {state: State},  data: any ) {
    window.parent.postMessage({ state: { operator: "update", data } }, state.targetOrigin);
  },
  removeState({ state }: {state: State}, ref: string) {
    window.parent.postMessage({ state: { ref, operator: "remove" } }, state.targetOrigin);
  },
  resetState({ state }: {state: State}) {
    window.parent.postMessage({ state: { operator: "reset" } }, state.targetOrigin);
  },
};

const getters = {
  room: (state: State) => {
    return state.room;
  },
  users: (state: State) => {
    return state.users;
  },
  appState: (state: State) => {
    return state.appState;
  },
  accessUser: (state: State) => {
    return state.users.find(user => user.id === state.accessUserId) || {};
  },
};
// initial state
const state: State = {
  room: {}, // room information
  users: [], // information of users in the room
  accessUserId: null, // information of user who play in this window
  appState: {},
  targetOrigin: "https://wh.im",
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
