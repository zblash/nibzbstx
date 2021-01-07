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
import {getActionHOC} from "../helpers/nibzbstm/actions";
import {State, generateStore, Actions} from "../helpers/nibzbstm/index";

const makeBtnTrue = (state, payload) => {
    return {...state,btn: true};
};
const makeBtnFalse = (state, payload) => {
    return {...state,btn: false};
};
const makeBtn2True = (state, payload) => {
    return {...state,btn2: true};
};
const makeBtn2False = (state, payload) => {
    return {...state, btn2: false};
};
const changeBtn3State = (state, payload) => {
    return {...state, btn3: payload};
};
$(document).ready(() => {
    const btnAction = State({
        initial: {btn: false},
        makeBtnTrue,
        makeBtnFalse
    });
    const btnAction2 = State({
        initial: {btn2: false},
        makeBtn2True,
        makeBtn2False
    });
    const btnAction3 = State({
        initial: {btn3: false},
        changeBtn3State
    });

    const store = generateStore(btnAction, btnAction2, btnAction3);

    store.manageEffects(function () {
        console.log("changed");
    }, ["btn","btn3"]);

    console.log(store.getState());
    store.actions.makeBtnTrue();
    console.log(store.getState());
    store.actions.makeBtn2True();
    console.log(store.getState());
    store.actions.changeBtn3State(false);
    console.log(store.getState());

```

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/zblash/nibzbstx/issues).
