# Welcome to nibzbstx 👋

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)

Simple and reusable state management system with side effects

## Install

```bash
yarn add nibzbstx
```

or

```bash
npm install nibzbstx
```

## Usage

#### Chainable

```js
import { State, generateStore } from "nibzbstx";

const makeBtnTrue = (state, payload) => {
  return { ...state, btn: true };
};
const makeBtnFalse = (state, payload) => {
  return { ...state, btn: false };
};
const makeBtn2True = (state, payload) => {
  return { ...state, btn2: payload };
};
const makeBtn2False = (state, payload) => {
  return { ...state, btn2: false };
};
const changeBtn3State = (state, payload) => {
  return { ...state, btn3: payload };
};

const btnAction = State({
  state: { btn: false },
  actions: { makeBtnTrue: makeBtnTrue, makeBtnFalse: makeBtnFalse },
});
const btnAction2 = State({
  state: { btn2: false },
  actions: { makeBtn2True: makeBtn2True, makeBtn2False: makeBtn2False },
});
const btnAction3 = State({
  state: { btn3: true },
  actions: { changeBtn3State: changeBtn3State },
});

const store = generateStore(btnAction, btnAction2, btnAction3);

store.manageEffects(
  function () {
    console.log("changed");
  },
  ["btn", "btn3"]
);

console.log(store.getState());
store.actions.makeBtn2True(true);
console.log(store.getState());
```

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/zblash/nibzbstx/issues).
