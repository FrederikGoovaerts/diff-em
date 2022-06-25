import { getPathKey } from '../utils/jsonPath';
import { isObject, hasProperty } from '../utils/object';

export function addedDiff<T extends object>(left: T, right: unknown): string[] {
  return addedDiffRecursive(left, right, '$');
}

function addedDiffRecursive<T extends object>(
  left: T,
  right: unknown,
  path: string,
): string[] {
  if (!isObject(left)) {
    throw new Error('diff called on non-object');
  }

  if (!isObject(right)) {
    return [path];
  }

  const result: string[] = [];

  for (const key of Object.keys(right)) {
    if (!hasProperty(left, key)) {
      result.push(`${path}${getPathKey(key)}`);
    } else {
      const leftVal = left[key];
      const rightVal = right[key];

      if (isObject(leftVal) && isObject(rightVal)) {
        const nestedPaths = addedDiffRecursive(
          leftVal,
          rightVal,
          `${path}${getPathKey(key)}`,
        );

        result.push(...nestedPaths);
      }
    }
  }

  return result;
}
