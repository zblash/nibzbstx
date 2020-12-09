export function ActionHOC() {
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
