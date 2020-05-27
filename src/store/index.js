"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// initial state
const state = {
    room: {},
    users: [],
    accessUserId: null,
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
    assignState({ state, dispatch }, obj) {
        let appState = state.appState;
        Object.keys(obj).forEach(key => {
            appState[key] = obj[key];
        });
        dispatch("replaceState", appState);
    },
    deleteState({ dispatch }) {
        dispatch("replaceState", {});
    },
    replaceState({ commit }, appState) {
        commit("setAppState", appState);
        window.parent.postMessage({ appState }, document.referrer);
    }
};
const getters = {
    room: (state) => {
        return state.room;
    },
    users: (state) => {
        return state.users;
    },
    appState: (state) => {
        return state.appState;
    },
    accessUser: (state) => {
        return state.users.find(user => user.id === state.accessUserId);
    }
};
exports.default = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};
