import { Diff } from './types';
import { isObject, hasProperty, isDate, isEmptyObject } from './utils';

export function deletedDiff<T extends object, U>(left: T, right: U): Diff<U> {
  if (!isObject(left)) {
    throw new Error('diff called on non-object');
  }

  if (!isObject(right)) {
    return right as Diff<U>;
  }

  const deletedValues = Object.keys(left).reduce((acc, key) => {
    if (!hasProperty(right, key)) {
      acc[key] = undefined;
    }

    return acc;
  }, {} as Record<string, unknown>);

  return Object.keys(right).reduce((acc, key) => {
    const leftVal = left[key];
    const rightVal = right[key];

    if (isObject(leftVal) && isObject(rightVal)) {
      const difference = deletedDiff(leftVal, rightVal);
      if (!isEmptyObject(difference) || isDate(difference)) {
        acc[key] = difference;
      }
    } else {
      if (rightVal === undefined) {
        acc[key] = rightVal;
      }
    }

    return acc;
  }, deletedValues) as Diff<U>;
}
