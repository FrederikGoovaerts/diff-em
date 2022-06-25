import { getPathKey } from '../utils/jsonPath';
import { isDate, isObject, hasProperty } from '../utils/object';

export function diff<T extends object, U>(left: T, right: U): string[] {
  return diffRecursive(left, right, '$');
}

export function diffRecursive<T extends object, U>(
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

  for (const key of Object.keys(left)) {
    if (!hasProperty(right, key)) {
      result.push(`${path}${getPathKey(key)}`);
    }
  }

  for (const key of Object.keys(right)) {
    if (!hasProperty(left, key)) {
      result.push(`${path}${getPathKey(key)}`);
    } else {
      const leftVal = left[key];
      const rightVal = right[key];

      if (isObject(leftVal) && isObject(rightVal)) {
        const nestedPaths = diffRecursive(leftVal, rightVal, `${path}.${key}`);
        result.push(...nestedPaths);
      } else if (leftVal !== rightVal) {
        result.push(`${path}${getPathKey(key)}`);
      }
    }
  }

  return result;
}
