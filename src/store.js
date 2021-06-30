import { CommonHelper } from "./utils";
import isEqual from "lodash.isequal";
import isPlainObject from "lodash.isplainobject";

export function store(
  initialState,
  forwards,
  generatedActions,
  asyncForwards,
  generatedAsyncActions
) {
  const actions = generatedActions;
  const asyncActions = generatedAsyncActions;

  let state = initialState;

  const forwardArr = forwards;
  const asyncForwardArr = asyncForwards;

  // {callbackFunc, depActionArr}
  const effects = [];

  function getState() {
    return state;
  }

  function setAction(actionName, payload) {
    stateForward({ type: actionName, payload });
  }

  function stateForward(action) {
    const oldState = state;
    forwardArr.forEach((reducer) => {
      const returnedState = reducer(state, action);
      if (isPlainObject(returnedState)) {
        state = Object.assign({ ...state }, returnedState);
      } else {
        throw new Error("You can only set the state with plain object");
      }
    });
    if (!isEqual(state, oldState)) {
      produceEffect(CommonHelper.getDifferencesInGivenObjects(state, oldState));
    }
  }

  function asyncForwardProducer(action) {
    asyncForwardArr.forEach((asyncReducer) => {
      asyncReducer({ state, setAction }, action);
    });
  }

  CommonHelper.applyForwardFunction(stateForward);
  CommonHelper.applyForwardFunction(asyncForwardProducer, "Async");

  function produceEffect(dependency) {
    const changes = Object.keys(dependency);
    effects.forEach((effect) => {
      if (effect.depActionArr.some((r) => changes.indexOf(r) > -1)) {
        const changedKeys = CommonHelper.getChangedKeys(state, changes);
        effect.callbackFunc(changedKeys);
      }
    });
  }

  function manageEffects(callback, depActionArr) {
    effects.push({ callbackFunc: callback, depActionArr: depActionArr });
  }

  return { getState, actions, manageEffects, asyncActions };
}
