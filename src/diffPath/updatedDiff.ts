import { joinPath, PathOptions } from '../utils/jsonPath';
import { isDate, isObject } from '../utils/object';

export function updatedDiff<T extends object, U>(
  left: T,
  right: U,
  options?: PathOptions,
): string[] {
  const paths = updatedDiffRecursive(left, right, []);
  return paths.map((path) => joinPath(path, options));
}

export function updatedDiffRecursive<T extends object, U>(
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

  for (const key of Object.keys(right)) {
    const leftVal = left[key];
    const rightVal = right[key];

    if (isObject(leftVal) && isObject(rightVal)) {
      const nestedPaths = updatedDiffRecursive(leftVal, rightVal, [
        ...currentPath,
        key,
      ]);
      result.push(...nestedPaths);
    } else if (
      leftVal !== undefined &&
      rightVal !== undefined &&
      leftVal !== rightVal
    ) {
      result.push([...currentPath, key]);
    }
  }

  return result;
}
