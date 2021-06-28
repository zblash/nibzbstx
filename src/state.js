import { ActionRegistry } from "./actions";
import { CommonHelper } from "./utils";

export function State(storeObj) {
  const actionRegistry = ActionRegistry();
  const storeObjActions = storeObj.actions;
  const initialState = storeObj.state;
  const storeObjAsyncActions = storeObj.asyncActions;

  const namedActions = {};
  const namedAsyncActions = {};

  let currentState;

  const getState = () => {
    return initialState;
  };

  const syncForward = (state, action = {}) => {
    if (namedActions[action.type]) {
      currentState = namedActions[action.type](state, action.payload);
    } else {
      currentState = state || initialState;
    }
    return currentState;
  };

  if (storeObjActions !== null || storeObjAsyncActions !== undefined) {
    Object.keys(storeObjActions).forEach((actionName) => {
      namedActions[actionName] = storeObjActions[actionName];

      const actionMethod = (payload) => {
        return CommonHelper.functionForward({
          type: actionName,
          payload
        });
      };

      actionRegistry.addAction(actionName, actionMethod);
    });
  }
  const asyncForward = ({ state, setAction }, action) => {
    if (typeof namedAsyncActions[action.type] === "function") {
      namedAsyncActions[action.type]({ state, setAction }, action.payload);
    }
  };

  if (storeObjAsyncActions !== null && storeObjAsyncActions !== undefined) {
    Object.keys(storeObjAsyncActions).forEach((actionName) => {
      namedAsyncActions[actionName] = storeObjAsyncActions[actionName];
      const actionMethod = (payload) => {
        return CommonHelper.asyncFunctionForward({
          type: actionName,
          payload
        });
      };

      actionRegistry.addAction(actionName, actionMethod, "Async");
    });
  }
  const actions = actionRegistry.Actions;
  const asyncActions = actionRegistry.AsyncActions;

  return { getState, syncForward, asyncForward, actions, asyncActions };
}
