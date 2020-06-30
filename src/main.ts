import "@/assets/global.scss";
import Vuex from "vuex";
import whimStore from "./store"; // Vuex toasts module
import { Howl } from "howler";
import positionClass from "./assets/positionClass";

interface HowlerSound {
  type: string;
  timestamp: number;
  sounded?: {
    [key: string]: boolean;
  };
}

let HOWLER_SOUNDS: {
  // Howlオブジェクトが入る
  // eslint-disable-next-line
  [key: string]: any;
};

function checkSound(store: any) {
  const userId = store.getters["whimClient/accessUser"].id;
  const whimClientSounds =
    store.getters["whimClient/appState"].whimClientSounds || [];
  whimClientSounds.forEach((sound: HowlerSound, i: number) => {
    if (!sound?.sounded || !sound.sounded[userId]) {
      HOWLER_SOUNDS[sound.type].play();
      store.dispatch("whimClient/assignState", {
        whimClientSounds: { [i]: { sounded: { [userId]: true } } },
      });
    }
  });
}

interface InstallOptions {
  // eslint-disable-next-line
  store?: any;
  sound?: {
    [key: string]: {
      src: string;
      volume?: number;
    };
  };
  targetOrigin?: string;
}

export default {
  install(Vue: Vue, options?: InstallOptions): void {
    let store = options?.store;
    if (!store) {
      // @ts-ignore
      Vue.use(Vuex);
      store = new Vuex.Store({});
    }

    // Register vuex module
    store.registerModule("whimClient", whimStore);

    // howler登録

    HOWLER_SOUNDS = Object.fromEntries(
      Object.entries(options?.sound || {}).map((sound) => {
        const howl = new Howl({
          src: sound[1].src,
        });
        howl.volume(sound[1].volume || 1.0);
        return [sound[0], howl];
      })
    );

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
          checkSound(store);
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
      resetState(data: any = {}) {
        return store.dispatch("whimClient/resetState", data);
      },

      sound(soundType: string) {
        const whimClientSounds =
          store.getters["whimClient/appState"].whimClientSounds || [];

        whimClientSounds.push({
          type: soundType,
          timestamp: new Date().getTime(),
        });

        return store.dispatch("whimClient/assignState", {
          whimClientSounds: whimClientSounds,
        });
      },

      // 以下 v1.3で廃止予定
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
