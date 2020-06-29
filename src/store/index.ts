import mergeDeeply from "../utils/merge_deeply";

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
  // eslint-disable-next-line
  appState: { [s: string]: any };
  targetOrigin: string;
  orientation: string;
}
// eslint-disable-next-line
type ConnFunc = (prop: string, obj: { [s: string]: any }) => void;

interface PathValue {
  // eslint-disable-next-line
  [key: string]: any;
}

// eslint-disable-next-line
function mappingPathValue(source: any) {
  // eslint-disable-next-line
  const isObject = (obj: any) =>
    obj && typeof obj === "object" && !Array.isArray(obj);
  const result: PathValue = {};
  for (const [key, value] of Object.entries(source)) {
    if (isObject(value)) {
      const res = mappingPathValue(value);
      for (const [resKey, resValue] of Object.entries(res)) {
        result[key + "/" + resKey] = resValue;
      }
    } else {
      result[key] = value;
    }
  }

  return result;
}

// mutations
const mutations = {
  setRoom(state: State, room: Room): void {
    state.room = room;
  },
  setUsers(state: State, users: User[]): void {
    state.users = users;
  },
  setAccessUserId(state: State, userId: string): void {
    state.accessUserId = userId;
  },
  // eslint-disable-next-line
  setAppState(state: State, appState: { [s: string]: any }): void {
    state.appState = appState;
  },
  setTargetOrigin(state: State, targetOrigin: string): void {
    state.targetOrigin = targetOrigin;
  },
  setOrientation(state: State, orientation: string): void {
    state.orientation = orientation;
  },
};

const actions = {
  assignState(
    { state, commit }: { state: State; commit: ConnFunc },
    // eslint-disable-next-line
    data: any
  ): void {
    const target = state.appState;
    commit("setAppState", mergeDeeply(target, data));
    const updates = mappingPathValue(data);
    window.parent.postMessage(
      { state: { operator: "update", data: updates } },
      state.targetOrigin
    );
  },
  // 削除予定
  deleteState({ dispatch }: { dispatch: ConnFunc }): void {
    dispatch("replaceState", {});
  },
  // 削除予定
  replaceState(
    { state, commit }: { state: State; commit: ConnFunc },
    // eslint-disable-next-line
    appState: { [s: string]: any }
  ): void {
    commit("setAppState", appState);
    window.parent.postMessage({ appState }, state.targetOrigin);
  },
  // 削除予定
  setState(
    { state }: { state: State },
    // eslint-disable-next-line
    { ref, data }: { ref: string; data: any }
  ): void {
    window.parent.postMessage(
      { state: { ref, operator: "set", data } },
      state.targetOrigin
    );
  },
  // 削除予定
  // eslint-disable-next-line
  updateState({ state }: { state: State }, data: any): void {
    window.parent.postMessage(
      { state: { operator: "update", data } },
      state.targetOrigin
    );
  },
  // 削除予定
  removeState({ state }: { state: State }, ref: string): void {
    window.parent.postMessage(
      { state: { ref, operator: "remove" } },
      state.targetOrigin
    );
  },
  resetState(
    { state, commit }: { state: State; commit: ConnFunc },
    // eslint-disable-next-line
    data: any
  ): void {
    commit("setAppState", data);
    window.parent.postMessage(
      { state: { operator: "reset", data } },
      state.targetOrigin
    );
  },
};

const getters = {
  room: (state: State): Room => {
    return state.room;
  },
  users: (state: State): User[] => {
    return state.users;
  },
  // eslint-disable-next-line
  appState: (state: State): { [key: string]: any } => {
    return state.appState;
  },
  // eslint-disable-next-line
  accessUser: (state: State): User | {} => {
    return state.users.find((user) => user.id === state.accessUserId) || {};
  },
};
// initial state
const state: State = {
  room: {}, // room information
  users: [], // information of users in the room
  accessUserId: null, // information of user who play in this window
  appState: {},
  targetOrigin: "https://wh.im",
  orientation: "landscape",
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
