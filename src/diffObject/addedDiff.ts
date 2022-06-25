import { Diff } from './types';
import { isObject, hasProperty, isEmptyObject } from '../utils/object';

export function addedDiff<T extends object, U>(left: T, right: U): Diff<T, U> {
  if (!isObject(left)) {
    throw new Error('diff called on non-object');
  }

  if (!isObject(right)) {
    return right as Diff<T, U>;
  }

  return Object.keys(right).reduce((acc, key) => {
    if (!hasProperty(left, key)) {
      acc[key] = right[key];
      return acc;
    }

    const leftVal = left[key];
    const rightVal = right[key];

    if (isObject(leftVal) && isObject(rightVal)) {
      const difference = addedDiff(leftVal, rightVal);
      if (!isEmptyObject(difference)) {
        acc[key] = difference;
      }
    }

    return acc;
  }, {} as Record<string, unknown>) as Diff<T, U>;
}
