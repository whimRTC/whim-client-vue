import "@/assets/global.scss";
import Vuex from "vuex";
import whimStore from "./store"; // Vuex toasts module

export default {
  install(Vue: any, options?: any): void {
    let store = options?.store;
    if (!store) {
      Vue.use(Vuex);
      store = new Vuex.Store({});
    }

    // Register vuex module
    store.registerModule("whimClient", whimStore);

    // set Environment Variable
    store.commit("whimClient/setEnvironment", options?.environment);

    // wh.imから room / users情報が送られてきたら登録
    window.addEventListener(
      "message",
      (event) => {
        if (event.data.room) {
          store.commit("whimClient/setRoom", event.data.room);
        }
        if (event.data.accessUserId) {
          store.commit(
            "whimClient/setAccessUserId",
            event.data.accessUserId,
          );
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
    let targetOrigin;
    if (options?.environment === "staging") {
      targetOrigin = "https://stg.wh.im";
    } else {
      targetOrigin = "https://wh.im";
    }

    window.parent.postMessage("connect", targetOrigin);

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

            // @ts-ignore because of `this`
            return ["user-window", `${windowRatio}-${this.$whim.users.length}`, `position-${user.positionNumber}`];
          };
        },
      },
    });
  },
};
