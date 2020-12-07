function ActionHOC() {
  const Actions = {};
  const ActionCreators = {};
  function addAction(actionName, action, actionCreator) {
    if (typeof Actions[actionName] === "object") {
      throw new Error(`An action name cannot be object -> "${actionName}"!`);
    }
    if (Actions[actionName]) {
      return true;
    }
    Actions[actionName] = (payload) => action(payload);
    ActionCreators[actionName] = actionCreator;
  }

  return { ActionCreators, Actions, addAction };
}

export const getActionHOC = (function () {
  let instance;

  function create() {
    return ActionHOC();
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = create();
      }
      return instance;
    },
  };
})();
