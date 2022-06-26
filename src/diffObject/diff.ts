import { Diff } from './types';
import { isDate, isEmptyObject, isObject, hasProperty } from '../utils/object';

export function diff<T extends object, U>(left: T, right: U): Diff<T, U> {
  if (!isObject(left)) {
    throw new Error('diff called on non-object');
  }

  if (!isObject(right)) {
    return right as Diff<T, U>;
  }

  if (isDate(left) || isDate(right)) {
    return (left.valueOf() == right.valueOf() ? {} : right) as Diff<T, U>;
  }

  const result: Record<string, unknown> = {};

  Object.keys(left).forEach((key) => {
    if (!hasProperty(right, key)) {
      result[key] = undefined;
    }
  });

  Object.keys(right).forEach((key) =>
    findAddedAndUpdated(result, key, left, right),
  );

  return result as Diff<T, U>;
}

function findAddedAndUpdated(
  acc: Record<string, unknown>,
  key: string,
  left: Record<string, unknown>,
  right: Record<string, unknown>,
): Record<string, unknown> {
  if (!hasProperty(left, key)) {
    // The key is added
    acc[key] = right[key];
  } else {
    const leftVal = left[key];
    const rightVal = right[key];

    if (isObject(leftVal) && isObject(rightVal)) {
      // Find nested different properties
      const difference = diff(leftVal, rightVal);
      if (!isEmptyObject(difference) || isDate(difference)) {
        acc[key] = difference;
      }
    } else if (leftVal !== rightVal) {
      // The key is updated
      acc[key] = rightVal;
    }
  }

  return acc;
}
