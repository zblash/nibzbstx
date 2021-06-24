import { CommonHelper } from "./utils";
import isEqual from "lodash.isequal";
import isPlainObject from "lodash.isplainobject";

export function store(initialState, forwards, generatedActions) {
  const actions = generatedActions;

  let state = initialState;

  const forwardArr = forwards;

  // {callbackFunc, depActionArr}
  const effects = [];

  function stateForward(action) {
    const oldState = state;
    forwardArr.forEach((reducer) => {
      const returnedState = reducer(state, action);
      if (isPlainObject(returnedState)) {
        state = Object.assign({}, returnedState);
      } else {
        throw new Error("You can only set the state with plain object");
      }
    });
    if (!isEqual(state, oldState)) {
      produceEffect(CommonHelper.getDifferencesInGivenObjects(state, oldState));
    }
  }

  CommonHelper.applyForwardFunction(stateForward);

  function getState() {
    return state;
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

  return { getState, actions, manageEffects };
}
