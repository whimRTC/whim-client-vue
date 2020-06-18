# whim-client-vue
[![npm version](https://badge.fury.io/js/whim-client-vue.svg)](https://badge.fury.io/js/whim-client-vue)
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

# 概要
wh.im 上でゲームの開発が簡単にできます。Vue.js用です。

# whim-clientのインストール

以下のコマンドでVue.jsのプロジェクトに追加します。

```bash
$ npm install --save whim-client-vue
# or
$ yarn add whim-client-vue
```

# main.jsでのwhim-clientの読み込み

main.jsを以下のような構成にします。

```js
import Vue from "vue";
import App from "./App.vue";
import whimClientVue from "whim-client-vue";
import "whim-client-vue/dist/whim-client-vue.css";

Vue.config.productionTip = false;
Vue.use(whimClientVue);

new Vue({
  render: h => h(App)
}).$mount("#app");
```

## 1. `whim-client-vue`の読み込み
```js
import whimClientVue from "whim-client-vue";
import "whim-client-vue/dist/whim-client-vue.css";
```

## 2. vueにライブラリの登録
```js
Vue.use(whimClientVue);
```

# whim-clientの使用例
`this.$whim`でVue.js上からwhimのデータの読み出し/書き込みができるようになります。

```js
// user一覧の取り出し
this.$whim.users;

// stateの取り出し
this.$whim.state;

// stateの差分更新
this.$whim.assignState({point: 2})

// stateの全更新
this.$whim.resetState({phase: "start"})
```

より詳細には[API一覧](https://docs.wh.im/developer/whim-client-vue-api)をご覧ください。

# サンプルアプリ
サンプルアプリをいくつかご用意しました。参考にしてください。
- [じゃんけん](https://github.com/whimRTC/whim-janken)
- 追加予定

# 開発の仕方
1. リポジトリをクローン
2. 本リポジトリで`yarn link`
3. appsで`yarn link whim-client-vue`
4. 初回&ソースコード変更のたびにyarn build
- これを自動watchする方法はありそう。
