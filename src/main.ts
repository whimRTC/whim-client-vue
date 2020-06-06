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
  install(Vue: any, options?: any): void {
    let store = options?.store;
    if (!store) {
      Vue.use(Vuex);
      store = new Vuex.Store({});
    }

    // Register vuex module
    store.registerModule("whimClient", whimStore);

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
      false,
    );

    // wh.im本体との通信を開始
    window.parent.postMessage("connect", options?.targetOrigin || "https://wh.im");

    const prototypeWhim = {
      assignState(obj: { [s: string]: any }) {
        return store.dispatch("whimClient/assignState", obj);
      },

      replaceState(obj: { [s: string]: any }) {
        return store.dispatch("whimClient/replaceState", obj);
      },

      deleteState() {
        return store.dispatch("whimClient/deleteState");
      },

      setState( ref: string, data: any )  {
        return store.dispatch("whimClient/setState", {ref, data});
      },

      updateState( data: any )  {
        return store.dispatch("whimClient/updateState", data);
      },

      removeState( ref: string )  {
        return store.dispatch("whimClient/removeState", ref);
      },

      resetState()  {
        return store.dispatch("whimClient/resetState");
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

    Vue.prototype.$whim = prototypeWhim;

    Vue.mixin({
      computed: {
        whimUserWindowClass() {
          return (user: any): string[] => {
            let windowRatio;
            if (window.innerWidth / window.innerHeight > 1) {
              windowRatio = "landscape";
            } else {
              windowRatio = "portrait";
            }

            return [
              "user-window",
              // @ts-ignore because of `this`
              `${windowRatio}-${this.$whim.users.length}`,
              `position-${user.positionNumber}`,
            ];
          };
        },
        whimPositionClass() {
          return (user: any): string[] => {
            let windowRatio;
            if (window.innerWidth / window.innerHeight > 1) {
              windowRatio = "landscape";
            } else {
              windowRatio = "portrait";
            }

            // @ts-ignore because of `this`
            return positionClass[windowRatio][this.$whim.users.length][user.positionNumber];
          };
        },
      },
    });
  },
};
