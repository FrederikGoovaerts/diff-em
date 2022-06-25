import { getPathKey } from '../utils/jsonPath';
import { isDate, isObject } from '../utils/object';

export function updatedDiff<T extends object, U>(left: T, right: U): string[] {
  return updatedDiffRecursive(left, right, '$');
}

export function updatedDiffRecursive<T extends object, U>(
  left: T,
  right: U,
  path: string,
): string[] {
  if (!isObject(left)) {
    throw new Error('diff called on non-object');
  }

  if (!isObject(right)) {
    return [path];
  }

  if (isDate(left) || isDate(right)) {
    return left.valueOf() == right.valueOf() ? [] : [path];
  }

  const result: string[] = [];

  for (const key of Object.keys(right)) {
    const leftVal = left[key];
    const rightVal = right[key];

    if (isObject(leftVal) && isObject(rightVal)) {
      const nestedPaths = updatedDiffRecursive(
        leftVal,
        rightVal,
        `${path}${getPathKey(key)}`,
      );
      result.push(...nestedPaths);
    } else if (
      leftVal !== undefined &&
      rightVal !== undefined &&
      leftVal !== rightVal
    ) {
      result.push(`${path}${getPathKey(key)}`);
    }
  }

  return result;
}
