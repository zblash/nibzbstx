# Welcome to nibzbstx 👋

![Version](https://img.shields.io/badge/version-1.0.1-blue.svg?cacheSeconds=2592000)
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
import { State, StoreRegistry } from "../src/index";

const btnAction = State({
  state: { btn: false },
  actions: {
    makeBtnTrue: (state, payload) => {
      return { btn: true };
    },
    makeBtnFalse: (state, payload) => {
      return { btn2: false };
    }
  }
});
const btnAction2 = State({
  state: { btn2: false },
  actions: {
    makeBtn2True: (state, payload) => {
      return { btn2: payload };
    },
    makeBtn2False: (state, payload) => {
      return { btn2: payload };
    }
  },
  asyncActions: {
    makeBtn2TrueAsync: ({ state, setAction }, payload) => {
      setTimeout(() => {
        setAction("makeBtn2False", 123);
      }, 1000);
    }
  }
});

const store = StoreRegistry.register(btnAction2);

const store2 = StoreRegistry.register(btnAction);
store.manageEffects(
  function (changed) {
    console.log("changed states", changed);
  },
  ["btn", "btn2"]
);

console.log("s", store.getState(), store2.getState());
store.actions.makeBtn2True(true);
console.log(store.getState());
store.asyncActions.makeBtn2TrueAsync();
setTimeout(() => {
  console.log(store.getState());
}, 1200);
```

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/zblash/nibzbstx/issues).
