import { store } from "./store";

export function generateStore(...reducerWithActions) {
  let _initialState = {};
  const forwards = [];
  let generatedActions = {};
  reducerWithActions.forEach((reducerWithAction) => {
    _initialState = Object.assign(_initialState, reducerWithAction.getState());
    forwards.push(reducerWithAction);
    Object.assign(generatedActions, reducerWithAction.actions.Actions);
  });
  return store(_initialState, forwards, generatedActions);
}
