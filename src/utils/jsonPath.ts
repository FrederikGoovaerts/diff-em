export function getPathKey(key: string): string {
  return /^[A-Za-z0-9_]+$/.test(key)
    ? `.${key}`
    : `['${key.replace(/'/g, "\\'")}']`;
}

export function joinPath(path: string[], options?: PathOptions): string {
  const pathParts = path.slice(0, options?.pathTruncateLength);
  const joinedPath = pathParts.map(getPathKey).join('');
  if (options?.includeInitial === false) {
    return joinedPath.startsWith('.')
      ? joinedPath.replace('.', '')
      : joinedPath;
  } else {
    return `$${joinedPath}`;
  }
}

export interface PathOptions {
  /**
   * Max number of path parts in a path. This does not prevent deeper recursion.
   *
   * Default is no truncation.
   */
  pathTruncateLength?: number;
  /**
   * Whether to include the "$" at the beginning of the resulting JSONPaths.
   *
   * Default is true.
   */
  includeInitial?: boolean;
}
