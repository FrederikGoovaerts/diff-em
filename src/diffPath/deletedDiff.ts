import { joinPath, PathOptions } from '../utils/jsonPath';
import { isObject, hasProperty } from '../utils/object';

export function deletedDiff<T extends object, U>(
  left: T,
  right: U,
  options?: PathOptions,
): string[] {
  const paths = deletedDiffRecursive(left, right, []);
  return paths.map((path) => joinPath(path, options));
}

export function deletedDiffRecursive<T extends object, U>(
  left: T,
  right: U,
  currentPath: string[],
): string[][] {
  if (!isObject(left)) {
    throw new Error('diff called on non-object');
  }

  if (!isObject(right)) {
    return [];
  }

  const result: string[][] = [];

  for (const key of Object.keys(left)) {
    if (!hasProperty(right, key)) {
      result.push([...currentPath, key]);
    }
  }

  for (const key of Object.keys(right)) {
    const leftVal = left[key];
    const rightVal = right[key];

    if (isObject(leftVal) && isObject(rightVal)) {
      const nestedPaths = deletedDiffRecursive(leftVal, rightVal, [
        ...currentPath,
        key,
      ]);
      result.push(...nestedPaths);
    }
  }

  return result;
}
