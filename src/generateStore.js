import { store } from "./store";
export const StoreRegistry = (function () {
  let storeInst;

  function register(...reducerWithActions) {
    let _initialState = {};
    const forwards = [];
    const asyncForwards = [];
    let generatedActions = {};
    let generatedAsyncActions = {};
    reducerWithActions.forEach((reducerWithAction) => {
      _initialState = Object.assign(
        _initialState,
        reducerWithAction.getState()
      );
      forwards.push(reducerWithAction.syncForward);
      asyncForwards.push(reducerWithAction.asyncForward);
      Object.assign(generatedActions, reducerWithAction.actions);
      Object.assign(generatedAsyncActions, reducerWithAction.asyncActions);
    });

    if (storeInst) {
      storeInst.registerState(
        _initialState,
        forwards,
        generatedActions,
        asyncForwards,
        generatedAsyncActions
      );
    } else {
      storeInst = store(
        _initialState,
        forwards,
        generatedActions,
        asyncForwards,
        generatedAsyncActions
      );
    }
    return storeInst;
  }

  return { register };
})();
