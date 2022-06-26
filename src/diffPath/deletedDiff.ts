import { joinPath, PathOptions } from '../utils/jsonPath';
import { diffBase } from './diff';

export function deletedDiff<T extends object, U>(
  left: T,
  right: U,
  options?: PathOptions,
): string[] {
  const paths = diffBase(left, right, [], 'deleted');
  return paths.map((path) => joinPath(path, options));
}
