import { store } from "./store";

export function generateStore(...reducerWithActions) {
  let _initialState = {};
  const forwards = [];
  const asyncForwards = [];
  let generatedActions = {};
  let generatedAsyncActions = {};
  reducerWithActions.forEach((reducerWithAction) => {
    _initialState = Object.assign(_initialState, reducerWithAction.getState());
    forwards.push(reducerWithAction.syncForward);
    asyncForwards.push(reducerWithAction.asyncForward);
    Object.assign(generatedActions, reducerWithAction.actions);
    Object.assign(generatedAsyncActions, reducerWithAction.asyncActions);
  });
  return store(
    _initialState,
    forwards,
    generatedActions,
    asyncForwards,
    generatedAsyncActions
  );
}
