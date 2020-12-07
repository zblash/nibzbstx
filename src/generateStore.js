import { store } from "./store";

export function generateStore(...reducerWithActions) {
  let _initialState = {};
  const forwards = [];
  reducerWithActions.forEach((reducerWithAction) => {
    _initialState = Object.assign(_initialState, reducerWithAction.getState());
    forwards.push(reducerWithAction);
  });

  return store(_initialState, forwards);
}
