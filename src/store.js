/* eslint no-console:0 */

import { getActionHOC } from "./actions";

const noFunc = () => {
  console.log(
    "There is no forward function instance! Before using the forward function you have to create a store"
  );
};

let resForward = noFunc;

export let forward = (...args) => {
  return resForward(...args);
};

function applyForward(forward) {
  resForward = forward;
}

export function store(initialState, reducers) {
  const actions = getActionHOC.getInstance().Actions;
  let state = initialState;
  let subCount = 0;
  const reducerArr = reducers;
  const subs = [];
  applyForward(stateForward);
  // {comp: Component, args: args[], stateFunc: Function, forwardFunc: Function }
  const comps = [];
  function stateForward(action) {
    reducerArr.forEach((reducer) => {
      state = Object.assign({}, reducer(state, action));
    });
    sendNewStateToSubs();
  }

  function getState() {
    return state;
  }

  function useSelection(selectionFunc) {
    if (selectionFunc !== null && selectionFunc !== undefined) {
      selectionFunc(state);
    }
  }

  function subscribe(cb) {
    subs.push(cb);
    subCount = subCount + 1;
    return function () {
      subs.splice(subCount, 1);
    };
  }

  function subscribeComponent(component, args, stateFunc, forwardFunc) {
    // {comp: Component, args: args[], stateFunc: Function, forwardFunc: Function }
    comps.push({
      comp: component,
      args: args,
      stateFunc: stateFunc,
      forwardFunc: forwardFunc,
    });
  }

  function sendNewStateToSubs() {
    comps.forEach((compO) => {
      compO.comp(
        ...compO.args,
        compO.stateFunc(state),
        compO.forwardFunc(stateForward)
      );
    });
    subs.forEach((cb) => {
      cb();
    });
  }

  function connect(stateFunc, forwardFunc) {
    const connectionArr = [];
    if (stateFunc !== null && stateFunc !== undefined) {
      connectionArr.push(stateFunc);
    }
    if (forwardFunc !== null && forwardFunc !== undefined) {
      connectionArr.push(forwardFunc);
    }
    return (component, ...args) => {
      subscribeComponent(component, [...args], ...connectionArr);
      return component(...args, stateFunc(state), forwardFunc(stateForward));
    };
  }
  return { connect, useSelection, getState, subscribe, actions };
}
