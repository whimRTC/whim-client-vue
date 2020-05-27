import store from "./store"; // Vuex toasts module

export default {
  install(Vue: any, options: any) {
    if (!options.store) {
      throw new Error("Please provide vuex store.");
    }

    // Register vuex module
    options.store.registerModule("whimClient", store);

    // wh.im本体との通信を開始
    window.parent.postMessage("connect", document.referrer);

    // wh.imから room / users情報が送られてきたら登録
    window.addEventListener(
      "message",
      event => {
        if (event.data.room) {
          options.store.commit("whimClient/setRoom", event.data.room);
        }
        if (event.data.accessUserId) {
          options.store.commit(
            "whimClient/setAccessUserId",
            event.data.accessUserId
          );
        }
        if (event.data.users) {
          options.store.commit("whimClient/setUsers", event.data.users);
        }
        if (event.data.appState) {
          options.store.commit("whimClient/setAppState", event.data.appState);
        }
      },
      false
    );

    let prototypeWhim = {
      assignState(obj: { [s: string]: any }) {
        return options.store.dispatch("whimClient/assignState", obj);
      },

      replaceState(obj: { [s: string]: any }) {
        return options.store.dispatch("whimClient/replaceState", obj);
      },

      deleteState() {
        return options.store.dispatch("whimClient/deleteState");
      }
    };

    Object.defineProperty(prototypeWhim, "users", {
      enumerable: true,
      get: function() {
        return options.store.getters["whimClient/users"];
      }
    });

    Object.defineProperty(prototypeWhim, "accessUser", {
      enumerable: true,
      get: function() {
        return options.store.getters["whimClient/accessUser"];
      }
    });

    Object.defineProperty(prototypeWhim, "room", {
      enumerable: true,
      get: function() {
        return options.store.getters["whimClient/room"];
      }
    });

    Object.defineProperty(prototypeWhim, "state", {
      enumerable: true,
      get: function() {
        return options.store.getters["whimClient/appState"];
      }
    });

    Vue.prototype.$whim = prototypeWhim;
  }
};
