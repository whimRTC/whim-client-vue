// eslint-disable-next-line
function mergeDeeply(target: any, source: any): any {
  // eslint-disable-next-line
  const isObject = (obj: any) =>
    obj && typeof obj === "object" && !Array.isArray(obj);
  const result = Object.assign({}, target);
  if (Array.isArray(target) && isObject(source)) {
    const resultArray = JSON.parse(JSON.stringify(target));
    for (const [sourceKey, sourceValue] of Object.entries(source)) {
      // @ts-ignore
      const targetValue = target[sourceKey];

      if (
        isObject(sourceValue) &&
        isObject(targetValue) &&
        Object.prototype.hasOwnProperty.call(target, sourceKey)
      ) {
        resultArray[sourceKey] = mergeDeeply(targetValue, sourceValue);
      } else {
        resultArray[sourceKey] = sourceValue;
      }
    }
    return resultArray;
  }
  if (isObject(target) && isObject(source)) {
    for (const [sourceKey, sourceValue] of Object.entries(source)) {
      const targetValue = target[sourceKey];
      if (
        isObject(sourceValue) &&
        Object.prototype.hasOwnProperty.call(target, sourceKey)
      ) {
        result[sourceKey] = mergeDeeply(targetValue, sourceValue);
      } else {
        Object.assign(result, { [sourceKey]: sourceValue });
      }
    }
  }
  return result;
}

export default mergeDeeply;
