import isEqual from "lodash.isequal";
import transform from "lodash.transform";
import isObject from "lodash.isobject";

export const CommonHelper = (function () {
  const noFunc = () => {
    console.log(
      "There is no forward function instance! Before using the forward function you have to create a store"
    );
  };

  let syncForward = noFunc;
  let asyncForward = noFunc;

  function getDifferencesInGivenObjects(object, base) {
    function changes(object, base) {
      return transform(object, function (result, value, key) {
        if (!isEqual(value, base[key])) {
          result[key] =
            isObject(value) && isObject(base[key])
              ? changes(value, base[key])
              : value;
        }
      });
    }
    return changes(object, base);
  }

  function getChangedKeys(object, keys) {
    return Object.keys(object)
      .filter((key) => keys.includes(key))
      .reduce((obj, key) => {
        obj[key] = object[key];
        return obj;
      }, {});
  }

  let functionForward = (...args) => {
    return syncForward(...args);
  };

  let asyncFunctionForward = (...args) => {
    return asyncForward(...args);
  };

  function applyForwardFunction(forward, forwardType = "Sync") {
    if (forwardType === "Async") {
      asyncForward = forward;
    } else {
      syncForward = forward;
    }
  }

  return {
    getDifferencesInGivenObjects,
    functionForward,
    asyncFunctionForward,
    applyForwardFunction,
    getChangedKeys
  };
})();
