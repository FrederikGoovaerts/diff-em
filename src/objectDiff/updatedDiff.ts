import { Diff } from './types';
import { isDate, isEmptyObject, isObject } from './utils';

export function updatedDiff<T extends object, U>(left: T, right: U): Diff<U> {
  if (!isObject(left)) {
    throw new Error('diff called on non-object');
  }

  if (!isObject(right)) {
    return right as Diff<U>;
  }

  if (isDate(left) || isDate(right)) {
    return (left.valueOf() == right.valueOf() ? {} : right) as Diff<U>;
  }

  return Object.keys(right).reduce((acc, key) => {
    const leftVal = left[key];
    const rightVal = right[key];

    if (isObject(leftVal) && isObject(rightVal)) {
      const difference = updatedDiff(leftVal, rightVal);
      if (!isEmptyObject(difference) || isDate(difference)) {
        acc[key] = difference;
      }
    } else if (
      leftVal !== undefined &&
      rightVal !== undefined &&
      leftVal !== rightVal
    ) {
      acc[key] = rightVal;
    }

    return acc;
  }, {} as Record<string, unknown>) as Diff<U>;
}
