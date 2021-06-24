import isEqual from "lodash.isequal";
import transform from "lodash.transform";
import isObject from "lodash.isobject";

export const CommonHelper = (function () {
  const noFunc = () => {
    console.log(
      "There is no forward function instance! Before using the forward function you have to create a store"
    );
  };

  let resForward = noFunc;

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

  let functionForward = (...args) => {
    return resForward(...args);
  };

  function applyForwardFunction(forward) {
    resForward = forward;
  }

  return {
    getDifferencesInGivenObjects,
    functionForward,
    applyForwardFunction,
  };
})();
