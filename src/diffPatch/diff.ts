import {
  AddPatch,
  makePatchPathElement,
  Patch,
  RemovePatch,
  ReplacePatch,
} from './jsonPatch';
import { isDate, isEmptyObject, isObject, hasProperty } from '../utils/object';

export function diff<T extends object, U>(left: T, right: U): Patch[] {
  const patches = diffBase(left, right, []);
  return patches.map((patch) => ({
    ...patch,
    path: patch.path.map(makePatchPathElement).join(''),
  }));
}

type InternalPatch =
  | AddPatch<string[]>
  | ReplacePatch<string[]>
  | RemovePatch<string[]>;

function diffBase<T extends object, U>(
  left: T,
  right: U,
  currentPath: string[],
): InternalPatch[] {
  if (!isObject(left)) {
    throw new Error('diff called on non-object');
  }

  if (!isObject(right)) {
    return [{ op: 'replace', path: currentPath, value: right }];
  }

  if (isDate(left) || isDate(right)) {
    return left.valueOf() == right.valueOf()
      ? []
      : [{ op: 'replace', path: currentPath, value: right }];
  }

  const result: InternalPatch[] = [];

  Object.keys(left).forEach((key) => {
    if (!hasProperty(right, key)) {
      result.push({ op: 'remove', path: [...currentPath, key] });
    }
  });

  Object.keys(right).forEach((key) =>
    findAddedAndUpdated(result, [...currentPath, key], key, left, right),
  );

  return result;
}

function findAddedAndUpdated(
  acc: InternalPatch[],
  path: string[],
  key: string,
  left: Record<string, unknown>,
  right: Record<string, unknown>,
): void {
  if (!hasProperty(left, key)) {
    // The key is added
    acc.push({ op: 'add', path, value: right[key] });
  } else {
    const leftVal = left[key];
    const rightVal = right[key];

    if (isObject(leftVal) && isObject(rightVal)) {
      // Find nested different properties
      const difference = diffBase(leftVal, rightVal, path);
      if (!isEmptyObject(difference)) {
        acc.push(...difference);
      }
    } else if (
      leftVal !== undefined &&
      rightVal !== undefined &&
      leftVal !== rightVal
    ) {
      // The key is updated
      acc.push({ op: 'replace', path, value: rightVal });
    }
  }
}
