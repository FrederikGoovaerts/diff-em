import { joinPath, PathOptions } from '../utils/jsonPath';
import { diffBase } from './diff';

export function updatedDiff<T extends object, U>(
  left: T,
  right: U,
  options?: PathOptions,
): string[] {
  const paths = diffBase(left, right, [], 'updated');
  return paths.map((path) => joinPath(path, options));
}
