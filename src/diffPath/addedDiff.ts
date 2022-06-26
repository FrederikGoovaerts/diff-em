import { joinPath, PathOptions } from '../utils/jsonPath';
import { diffBase } from './diff';

export function addedDiff<T extends object>(
  left: T,
  right: unknown,
  options?: PathOptions,
): string[] {
  const paths = diffBase(left, right, [], 'added');
  return paths.map((path) => joinPath(path, options));
}
