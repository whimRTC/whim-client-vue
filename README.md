# whim-client-vue
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

## 概要
wh.im 上でゲームの開発が簡単にできます。Vue.js用です。

## インストール
以下のコマンドでvue.jsのプロジェクトに追加します。

```bash
$ npm install --save whim-client-vue
or
$ yarn add whim-client-vue
```

## 使い方
1. whim-client-vueを読み込みます。

```js
import whimClientVue from "whim-client-vue";
```

2. Vue.use でライブラリを読み込みます。このとき`Store`オブジェクトを渡してください。
whimClientVueはwhimClientというネームスペースでデータを保存します。

```js
Vue.use(whimClientVue, { store })
```

3. `this.$whim`でvue上からwhimのデータの読み出し/書き込みができるようになります。
```js
this.$whim.users;
```

## props

型に関する情報は下部に記載しています。

| コード           | 型     | 説明                           |
| ---------------- | ------ | ------------------------------ |
| $whim.users      | [User] | ルームに入っているユーザー一覧 |
| $whim.room       | Room   | Room Object                    |
| $whim.accessUser | User   | 現在アクセスしているUser       |
| $whim.state      | State  | ゲームの状態                   |

### Room型

| key  | 型                                           | 詳細                                         |
| ---- | -------------------------------------------- | -------------------------------------------- |
| id   | そのroomのユニークなid。英数字で構成される。 | そのroomのユニークなid。英数字で構成される。 |

### User型

| key           | 型      | 詳細                                                         |
| ------------- | ------- | ------------------------------------------------------------ |
| id            | String  | ユーザーのユニークなID。                                     |
| name          | String  | ユーザーが設定した名前。                                     |
| timestamp     | Date    | ユーザがルームに参加した時間                                 |
| postionNumber | Integer | ユーザーが画面上で位置している場所。左上からZ字上に1,2,3,4と割り振られる |

### State型

この型はゲームに必要な情報に応じて任意に使用可能です。

この型は、そのroomに参加しているユーザーに対して常に同期されます。

## functions

ここでは ゲーム情報を変更し、そのルームに入っている各ユーザーに同期するためのAPIを提供しています。

| コード                     | 引数   | 説明                                                         |
| -------------------------- | ------ | ------------------------------------------------------------ |
| $whim.assignState(Object)  | Object | ゲーム情報を追記更新、  <br />存在しないキーの場合：追記 <br />存在するキーの場合：更新 |
| $whim.replaceState(Object) | Object | ゲーム情報を渡されたObjectにすべて変える                     |
| $whim.deleteState          |        | ゲーム情報を空にする                                         |

## サンプルアプリ
こちらに簡単なサンプルアプリを用意したので、参考に開発してください。

- [じゃんけん](https://github.com/whimRTC/whim-janken)

# 開発の仕方
1. リポジトリをクローン
2. 本リポジトリで`yarn link`
3. appsで`yarn link whim-client-vue`
4. 初回&ソースコード変更のたびにyarn build
- これを自動watchする方法はありそう。
