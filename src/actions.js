export function ActionRegistry() {
  const Actions = {};
  function addAction(actionName, action) {
    if (typeof Actions[actionName] === "object") {
      throw new Error(`An action name cannot be object -> "${actionName}"!`);
    }
    if (Actions[actionName]) {
      return true;
    }
    Actions[actionName] = (payload) => action(payload);
  }

  return { Actions, addAction };
}
