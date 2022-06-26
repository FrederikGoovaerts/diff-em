import { Diff } from './types';
import { isDate, isEmptyObject, isObject, hasProperty } from '../utils/object';

type DiffMode = 'all' | 'added' | 'updated' | 'deleted';

function isInMode(mode: DiffMode, desiredMode: DiffMode): boolean {
  return mode === 'all' || mode === desiredMode;
}

function diffBase<T extends object, U>(
  left: T,
  right: U,
  mode: DiffMode,
): Diff<T, U> {
  if (!isObject(left)) {
    throw new Error('diff called on non-object');
  }

  if (!isObject(right)) {
    if (isInMode(mode, 'updated')) {
      return right as Diff<T, U>;
    } else if (isInMode(mode, 'added')) {
      return {} as Diff<T, U>;
    } else {
      return undefined as Diff<T, U>;
    }
  }

  if (isInMode(mode, 'updated') && (isDate(left) || isDate(right))) {
    return (left.valueOf() == right.valueOf() ? {} : right) as Diff<T, U>;
  }

  const result: Record<string, unknown> = {};

  if (isInMode(mode, 'deleted')) {
    Object.keys(left).forEach((key) => {
      if (!hasProperty(right, key)) {
        result[key] = undefined;
      }
    });
  }

  Object.keys(right).forEach((key) =>
    findAddedAndUpdated(result, key, left, right, mode),
  );

  return result as Diff<T, U>;
}

function findAddedAndUpdated(
  acc: Record<string, unknown>,
  key: string,
  left: Record<string, unknown>,
  right: Record<string, unknown>,
  mode: DiffMode,
): Record<string, unknown> {
  if (isInMode(mode, 'added') && !hasProperty(left, key)) {
    // The key is added
    acc[key] = right[key];
  } else {
    const leftVal = left[key];
    const rightVal = right[key];

    if (isObject(leftVal) && isObject(rightVal)) {
      // Find nested different properties
      const difference = diff(leftVal, rightVal);
      if (
        !isEmptyObject(difference) ||
        (isInMode(mode, 'updated') && isDate(difference))
      ) {
        acc[key] = difference;
      }
    } else if (
      isInMode(mode, 'updated') &&
      leftVal !== undefined &&
      rightVal !== undefined &&
      leftVal !== rightVal
    ) {
      // The key is updated
      acc[key] = rightVal;
    }
  }

  return acc;
}

export function diff<T extends object, U>(left: T, right: U): Diff<T, U> {
  return diffBase(left, right, 'all');
}

export function addedDiff<T extends object, U>(left: T, right: U): Diff<T, U> {
  return diffBase(left, right, 'added');
}

export function updatedDiff<T extends object, U>(
  left: T,
  right: U,
): Diff<T, U> {
  return diffBase(left, right, 'updated');
}

export function deletedDiff<T extends object, U>(
  left: T,
  right: U,
): Diff<T, U> {
  return diffBase(left, right, 'deleted');
}
