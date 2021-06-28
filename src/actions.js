export function ActionRegistry() {
  const Actions = {};
  const AsyncActions = {};
  function addAction(actionName, action, actionType = "Sync") {
    if (typeof Actions[actionName] === "object") {
      throw new Error(`An action name cannot be object -> "${actionName}"!`);
    }
    if (Actions[actionName] || AsyncActions[actionName]) {
      return true;
    }

    if (actionType === "Async") {
      AsyncActions[actionName] = (payload) => action(payload);
    } else {
      Actions[actionName] = (payload) => action(payload);
    }
  }

  return { Actions, AsyncActions, addAction };
}
