import { DiffMode, isInMode } from '../utils/diffMode';
import { joinPath, PathOptions } from './jsonPath';
import { isDate, isObject, hasProperty } from '../utils/object';

export function diffBase<T extends object, U>(
  left: T,
  right: U,
  currentPath: string[],
  mode: DiffMode,
): string[][] {
  if (!isObject(left)) {
    throw new Error('diff called on non-object');
  }

  if (!isObject(right)) {
    if (isInMode(mode, 'updated')) {
      return [currentPath];
    } else {
      return [];
    }
  }

  if (isInMode(mode, 'updated') && (isDate(left) || isDate(right))) {
    return left.valueOf() == right.valueOf() ? [] : [currentPath];
  }

  const result: string[][] = [];

  if (isInMode(mode, 'deleted')) {
    Object.keys(left).forEach((key) => {
      if (!hasProperty(right, key)) {
        result.push([...currentPath, key]);
      }
    });
  }

  Object.keys(right).forEach((key) =>
    appendAddedAndUpdated(
      result,
      [...currentPath, key],
      key,
      left,
      right,
      mode,
    ),
  );

  return result;
}

function appendAddedAndUpdated(
  acc: string[][],
  pathToKey: string[],
  key: string,
  left: Record<string, unknown>,
  right: Record<string, unknown>,
  mode: DiffMode,
): void {
  if (isInMode(mode, 'added') && !hasProperty(left, key)) {
    // The key is added
    acc.push(pathToKey);
  } else {
    const leftVal = left[key];
    const rightVal = right[key];

    if (isObject(leftVal) && isObject(rightVal)) {
      // Find nested different properties
      const nestedPaths = diffBase(leftVal, rightVal, pathToKey, mode);
      acc.push(...nestedPaths);
    } else if (
      isInMode(mode, 'updated') &&
      leftVal !== undefined &&
      rightVal !== undefined &&
      leftVal !== rightVal
    ) {
      // The key is updated
      acc.push(pathToKey);
    }
  }
}

export function diff<T extends object, U>(
  left: T,
  right: U,
  options?: PathOptions,
): string[] {
  const paths = diffBase(left, right, [], 'all');
  return paths.map((path) => joinPath(path, options));
}

export function addedDiff<T extends object>(
  left: T,
  right: unknown,
  options?: PathOptions,
): string[] {
  const paths = diffBase(left, right, [], 'added');
  return paths.map((path) => joinPath(path, options));
}

export function updatedDiff<T extends object, U>(
  left: T,
  right: U,
  options?: PathOptions,
): string[] {
  const paths = diffBase(left, right, [], 'updated');
  return paths.map((path) => joinPath(path, options));
}

export function deletedDiff<T extends object, U>(
  left: T,
  right: U,
  options?: PathOptions,
): string[] {
  const paths = diffBase(left, right, [], 'deleted');
  return paths.map((path) => joinPath(path, options));
}
