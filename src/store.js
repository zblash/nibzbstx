/* eslint no-console:0 */
import { difference } from "./utils";
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

export function store(initialState, forwards, generatedActions) {
  const actions = generatedActions;
  let state = initialState;
  let subCount = 0;
  const forwardArr = forwards;
  const subs = [];
  // {callbackFunc, depActionArr}
  const effects = [];
  applyForward(stateForward);
  // {comp: Component, args: args[], stateFunc: Function, forwardFunc: Function }
  const comps = [];
  function stateForward(action) {
    const oldState = state;
    forwardArr.forEach((reducer) => {
      state = Object.assign({}, reducer(state, action));
    });
    if (difference(state, oldState) !== null) {
      produceEffect(difference(state, oldState));
      sendNewStateToSubs();
    }
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
  function produceEffect(dependency) {
    const changes = Object.keys(dependency);
    effects.forEach((effect) => {
      if (effect.depActionArr.some((r) => changes.indexOf(r) > -1)) {
        effect.callbackFunc();
      }
    });
  }
  function manageEffects(callback, depActionArr) {
    effects.push({ callbackFunc: callback, depActionArr: depActionArr });
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
  return { connect, useSelection, getState, subscribe, actions, manageEffects };
}
