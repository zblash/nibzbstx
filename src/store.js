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
  let actions = generatedActions;
  let asyncActions = generatedAsyncActions;

  let state = initialState;

  let forwardArr = forwards;
  let asyncForwardArr = asyncForwards;

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
    if (depActionArr.every((depAction) => typeof depAction === "string")) {
      effects.push({ callbackFunc: callback, depActionArr: depActionArr });
    } else {
      throw new Error("You can only set dependency array with string");
    }
  }

  function registerState(
    rInitialState,
    rForwards,
    rGeneratedActions,
    rAsyncForwards,
    rGeneratedAsyncActions
  ) {
    state = { ...state, ...rInitialState };
    forwardArr = forwardArr.concat(rForwards);
    actions = { ...actions, ...rGeneratedActions };
    asyncForwardArr = asyncForwardArr.concat(rAsyncForwards);
    asyncActions = { ...asyncActions, rGeneratedAsyncActions };
  }

  return { getState, actions, manageEffects, asyncActions, registerState };
}
