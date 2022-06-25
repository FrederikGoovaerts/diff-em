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

  for (const key of Object.keys(left)) {
    if (!hasProperty(right, key)) {
      result.push([...currentPath, key]);
    }
  }

  for (const key of Object.keys(right)) {
    if (!hasProperty(left, key)) {
      result.push([...currentPath, key]);
    } else {
      const leftVal = left[key];
      const rightVal = right[key];

      if (isObject(leftVal) && isObject(rightVal)) {
        const nestedPaths = diffRecursive(leftVal, rightVal, [
          ...currentPath,
          key,
        ]);
        result.push(...nestedPaths);
      } else if (leftVal !== rightVal) {
        result.push([...currentPath, key]);
      }
    }
  }

  return result;
}
