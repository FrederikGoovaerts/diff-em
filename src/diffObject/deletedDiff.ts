import { Diff } from './types';
import { isObject, hasProperty, isEmptyObject } from '../utils/object';

export function deletedDiff<T extends object, U>(
  left: T,
  right: U,
): Diff<T, U> {
  if (!isObject(left)) {
    throw new Error('diff called on non-object');
  }

  if (!isObject(right)) {
    return undefined as Diff<T, U>;
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
      if (!isEmptyObject(difference)) {
        acc[key] = difference;
      }
    }

    return acc;
  }, deletedValues) as Diff<T, U>;
}
