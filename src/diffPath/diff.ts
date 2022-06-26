import { joinPath, PathOptions } from '../utils/jsonPath';
import { isDate, isObject, hasProperty } from '../utils/object';

export function diff<T extends object, U>(
  left: T,
  right: U,
  options?: PathOptions,
): string[] {
  const paths = diffRecursive(left, right, []);
  return paths.map((path) => joinPath(path, options));
}

export function diffRecursive<T extends object, U>(
  left: T,
  right: U,
  currentPath: string[],
): string[][] {
  if (!isObject(left)) {
    throw new Error('diff called on non-object');
  }

  if (!isObject(right)) {
    return [currentPath];
  }

  if (isDate(left) || isDate(right)) {
    return left.valueOf() == right.valueOf() ? [] : [currentPath];
  }

  const result: string[][] = [];

  Object.keys(left).forEach((key) => {
    if (!hasProperty(right, key)) {
      result.push([...currentPath, key]);
    }
  });

  Object.keys(right).forEach((key) =>
    appendAddedAndUpdated(result, [...currentPath, key], key, left, right),
  );

  return result;
}

function appendAddedAndUpdated(
  acc: string[][],
  pathToKey: string[],
  key: string,
  left: Record<string, unknown>,
  right: Record<string, unknown>,
): void {
  if (!hasProperty(left, key)) {
    // The key is added
    acc.push(pathToKey);
  } else {
    const leftVal = left[key];
    const rightVal = right[key];

    if (isObject(leftVal) && isObject(rightVal)) {
      // Find nested different properties
      const nestedPaths = diffRecursive(leftVal, rightVal, pathToKey);
      acc.push(...nestedPaths);
    } else if (leftVal !== rightVal) {
      // The key is updated
      acc.push(pathToKey);
    }
  }
}
