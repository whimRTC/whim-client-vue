import "@/assets/global.scss";
import Vuex from "vuex";
import whimStore from "./store"; // Vuex toasts module

const positionClass = {
  landscape: {
    1: {
      1: ["top", "bottom", "left", "right"],
    },
    2: {
      1: ["top", "bottom", "left"],
      2: ["top", "bottom", "right"],
    },
    3: {
      1: ["top", "bottom", "left"],
      2: ["top", "bottom"],
      3: ["top", "bottom", "right"],
    },
    4: {
      1: ["v-center", "left"],
      2: ["v-center", "left"],
      3: ["v-center", "right"],
      4: ["v-center", "right"],
    },
    5: {
      1: ["top", "left"],
      2: ["top", "h-center"],
      3: ["top", "right"],
      4: ["bottom", "left"],
      5: ["bottom", "h-center"],
    },
    6: {
      1: ["top", "left"],
      2: ["top", "h-center"],
      3: ["top", "right"],
      4: ["bottom", "left"],
      5: ["bottom", "h-center"],
      6: ["bottom", "right"],
    },
    7: {
      1: ["top", "left"],
      2: ["top", "left"],
      3: ["top", "right"],
      4: ["bottom", "right"],
      5: ["bottom", "left"],
      6: ["bottom", "left"],
      7: ["bottom", "right"],
    },
    8: {
      1: ["top", "left"],
      2: ["top", "left"],
      3: ["top", "right"],
      4: ["bottom", "right"],
      5: ["bottom", "left"],
      6: ["bottom", "left"],
      7: ["bottom", "right"],
      8: ["bottom", "right"],
    },
  },
  portrait: {
    1: {
      1: ["top", "bottom", "left", "right"],
    },
    2: {
      1: ["top", "left", "right"],
      2: ["bottom", "left", "right"],
    },
    3: {
      1: ["top", "left"],
      2: ["top", "right"],
      3: ["bottom", "left"],
    },
    4: {
      1: ["top", "left"],
      2: ["top", "right"],
      3: ["bottom", "left"],
      4: ["bottom", "right"],
    },
    5: {
      1: ["top", "left"],
      2: ["top", "right"],
      3: ["v-center", "left"],
      4: ["v-center", "right"],
      5: ["bottom", "left"],
    },
    6: {
      1: ["top", "left"],
      2: ["top", "right"],
      3: ["v-center", "left"],
      4: ["v-center", "right"],
      5: ["bottom", "left"],
      6: ["bottom", "right"],
    },
    7: {
      1: ["top", "left"],
      2: ["top", "right"],
      3: ["top", "left"],
      4: ["top", "right"],
      5: ["bottom", "left"],
      6: ["bottom", "right"],
      7: ["bottom", "left"],
    },
    8: {
      1: ["top", "left"],
      2: ["top", "right"],
      3: ["top", "left"],
      4: ["top", "right"],
      5: ["bottom", "left"],
      6: ["bottom", "right"],
      7: ["bottom", "left"],
      8: ["bottom", "right"],
    },
  },
};

export default {
  // eslint-disable-next-line
  install(Vue: Vue, options?: { [key: string]: any }): void {
    let store = options?.store;
    if (!store) {
      // @ts-ignore
      Vue.use(Vuex);
      store = new Vuex.Store({});
    }

    // Register vuex module
    store.registerModule("whimClient", whimStore);

    if (window.innerWidth / window.innerHeight < 1) {
      store.commit("whimClient/setOrientation", "portrait");
    } else {
      store.commit("whimClient/setOrientation", "landscape");
    }

    // eslint-disable-next-line
    const setOrientation = function (e: any) {
      setTimeout(() => {
        if (window.innerWidth / window.innerHeight < 1) {
          store.commit("whimClient/setOrientation", "portrait");
        } else {
          store.commit("whimClient/setOrientation", "landscape");
        }
      }, 50);
    };

    window.addEventListener("resize", setOrientation);

    // set Target Origin
    if (options?.targetOrigin) {
      store.commit("whimClient/setTargetOrigin", options?.targetOrigin);
    }

    // wh.imから room / users情報が送られてきたら登録
    window.addEventListener(
      "message",
      (event) => {
        if (event.data.room) {
          store.commit("whimClient/setRoom", event.data.room);
        }
        if (event.data.accessUserId) {
          store.commit("whimClient/setAccessUserId", event.data.accessUserId);
        }
        if (event.data.users) {
          store.commit("whimClient/setUsers", event.data.users);
        }
        if (event.data.appState) {
          store.commit("whimClient/setAppState", event.data.appState);
        }
      },
      false
    );

    // wh.im本体との通信を開始
    window.parent.postMessage(
      "connect",
      options?.targetOrigin || "https://wh.im"
    );

    const prototypeWhim = {
      // eslint-disable-next-line
      assignState(obj: { [s: string]: any }) {
        return store.dispatch("whimClient/assignState", obj);
      },

      // eslint-disable-next-line
      replaceState(obj: { [s: string]: any }) {
        return store.dispatch("whimClient/replaceState", obj);
      },

      deleteState() {
        return store.dispatch("whimClient/deleteState");
      },

      // eslint-disable-next-line
      setState(ref: string, data: any) {
        return store.dispatch("whimClient/setState", { ref, data });
      },

      // eslint-disable-next-line
      updateState(data: any) {
        return store.dispatch("whimClient/updateState", data);
      },

      removeState(ref: string) {
        return store.dispatch("whimClient/removeState", ref);
      },

      // eslint-disable-next-line
      resetState(data: any = {}) {
        return store.dispatch("whimClient/resetState", data);
      },
    };

    Object.defineProperty(prototypeWhim, "users", {
      enumerable: true,
      get: () => {
        return store.getters["whimClient/users"];
      },
    });

    Object.defineProperty(prototypeWhim, "accessUser", {
      enumerable: true,
      get: () => {
        return store.getters["whimClient/accessUser"];
      },
    });

    Object.defineProperty(prototypeWhim, "room", {
      enumerable: true,
      get: () => {
        return store.getters["whimClient/room"];
      },
    });

    Object.defineProperty(prototypeWhim, "state", {
      enumerable: true,
      get: () => {
        return store.getters["whimClient/appState"];
      },
    });

    Object.defineProperty(prototypeWhim, "orientation", {
      enumerable: true,
      get: () => {
        return store.state.whimClient.orientation;
      },
    });

    // @ts-ignore
    Vue.prototype.$whim = prototypeWhim;

    // @ts-ignore
    Vue.mixin({
      computed: {
        whimUserWindowClass() {
          // @ts-ignore because of `this`
          const orientation = this.$whim.orientation;
          // eslint-disable-next-line
          return (user: any): string[] => {
            return [
              "user-window",
              // @ts-ignore because of `this`
              `${orientation}-${this.$whim.users.length}`,
              `position-${user.positionNumber}`,
            ];
          };
        },
        whimPositionClass() {
          // @ts-ignore because of `this`
          const orientation = this.$whim.orientation;
          // eslint-disable-next-line
          return (user: any): string[] => {
            // @ts-ignore because of `this`
            return positionClass[orientation][
              // @ts-ignore because of `this`
              this.$whim.users.length
            ][user.positionNumber];
          };
        },
      },
    });
  },
};
