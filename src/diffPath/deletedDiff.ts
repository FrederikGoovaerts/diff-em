import { getPathKey } from '../utils/jsonPath';
import { isObject, hasProperty } from '../utils/object';

export function deletedDiff<T extends object, U>(left: T, right: U): string[] {
  return deletedDiffRecursive(left, right, '$');
}

export function deletedDiffRecursive<T extends object, U>(
  left: T,
  right: U,
  path: string,
): string[] {
  if (!isObject(left)) {
    throw new Error('diff called on non-object');
  }

  if (!isObject(right)) {
    return [];
  }

  const result: string[] = [];

  for (const key of Object.keys(left)) {
    if (!hasProperty(right, key)) {
      result.push(`${path}${getPathKey(key)}`);
    }
  }

  for (const key of Object.keys(right)) {
    const leftVal = left[key];
    const rightVal = right[key];

    if (isObject(leftVal) && isObject(rightVal)) {
      const nestedPaths = deletedDiffRecursive(
        leftVal,
        rightVal,
        `${path}${getPathKey(key)}`,
      );
      result.push(...nestedPaths);
    } else {
      if (rightVal === undefined) {
        result.push(`${path}${getPathKey(key)}`);
      }
    }
  }

  return result;
}
