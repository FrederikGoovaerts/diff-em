import { joinPath, PathOptions } from '../utils/jsonPath';
import { isObject, hasProperty } from '../utils/object';

export function addedDiff<T extends object>(
  left: T,
  right: unknown,
  options?: PathOptions,
): string[] {
  const paths = addedDiffRecursive(left, right, []);
  return paths.map((path) => joinPath(path, options));
}

function addedDiffRecursive<T extends object>(
  left: T,
  right: unknown,
  currentPath: string[],
): string[][] {
  if (!isObject(left)) {
    throw new Error('diff called on non-object');
  }

  if (!isObject(right)) {
    return [currentPath];
  }

  const result: string[][] = [];

  for (const key of Object.keys(right)) {
    if (!hasProperty(left, key)) {
      result.push([...currentPath, key]);
    } else {
      const leftVal = left[key];
      const rightVal = right[key];

      if (isObject(leftVal) && isObject(rightVal)) {
        const nestedPaths = addedDiffRecursive(leftVal, rightVal, [
          ...currentPath,
          key,
        ]);

        result.push(...nestedPaths);
      }
    }
  }

  return result;
}
