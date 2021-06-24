import { ActionRegistry } from "./actions";
import { CommonHelper } from "./utils";

export function State(storeObj) {
  const actionRegistry = ActionRegistry();
  const actions = storeObj.actions;
  const initialState = storeObj.state;

  const namedActions = {};

  let currentState;

  const reducerWithActions = (state, action = {}) => {
    if (namedActions[action.type]) {
      currentState = namedActions[action.type](state, action.payload);
    } else {
      currentState = state || initialState;
    }
    return currentState;
  };

  reducerWithActions.getState = () => {
    return initialState;
  };

  reducerWithActions.forwardFuncs = {};
  Object.keys(actions).forEach((actionName) => {
    namedActions[actionName] = actions[actionName];

    const actionMethod = (payload) => {
      return CommonHelper.functionForward({
        type: actionName,
        payload,
      });
    };

    reducerWithActions[actionName] = actionMethod;

    actionRegistry.addAction(actionName, actionMethod);
  });
  reducerWithActions.actions = actionRegistry.Actions;
  return reducerWithActions;
}
