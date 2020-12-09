import { ActionHOC } from "./actions";
import { forward } from "./store";

export function State(args) {
  const actionHoc = ActionHOC();
  const actions = args;
  const initialState = actions.initial;
  delete actions.initial;

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

    const actionCreator = (payload, ext = {}) => {
      const meta = { ...ext };
      delete meta.type;
      delete meta.payload;
      return {
        type: actionName,
        payload,
        ...meta,
      };
    };

    const actionMethod = (payload) => {
      const action = actionCreator(payload);
      return forward(action);
    };

    reducerWithActions[actionName] = actionMethod;

    actionHoc.addAction(actionName, actionMethod, actionCreator);
  });
  reducerWithActions.actions = actionHoc;
  return reducerWithActions;
}
