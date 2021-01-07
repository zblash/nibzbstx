import isEqual from "lodash.isequal";
import transform from "lodash.transform";
import isObject from "lodash.isobject";

export function difference(object, base) {
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
