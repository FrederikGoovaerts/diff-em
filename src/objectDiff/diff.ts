import { Diff } from './types';
import { isDate, isEmptyObject, isObject, hasProperty } from './utils';

export function diff<T extends object, U>(left: T, right: U): Diff<U> {
  if (!isObject(left)) {
    throw new Error('diff called on non-object');
  }

  if (!isObject(right)) {
    return right as Diff<U>;
  }

  if (isDate(left) || isDate(right)) {
    return (left.valueOf() == right.valueOf() ? {} : right) as Diff<U>;
  }

  const deletedValues = Object.keys(left).reduce((acc, key) => {
    if (!hasProperty(right, key)) {
      acc[key] = undefined;
    }

    return acc;
  }, {} as Record<string, unknown>);

  return Object.keys(right).reduce((acc, key) => {
    if (!hasProperty(left, key)) {
      acc[key] = right[key];
      return acc;
    }

    const leftVal = left[key];
    const rightVal = right[key];

    if (isObject(leftVal) && isObject(rightVal)) {
      const difference = diff(leftVal, rightVal);
      if (!isEmptyObject(difference) || isDate(difference)) {
        acc[key] = difference;
      }
    } else {
      if (leftVal !== rightVal) {
        acc[key] = rightVal;
      }
    }

    return acc;
  }, deletedValues) as Diff<U>;
}
