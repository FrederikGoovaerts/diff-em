export function isDate(d: unknown): d is Date {
  return d instanceof Date;
}

export function isObject(o: unknown): o is Record<string, unknown> {
  return !!o && typeof o === 'object';
}

export function hasProperty<K extends string>(
  o: Record<string, unknown>,
  key: K,
): o is Record<K, unknown> {
  return Object.keys(o).includes(key);
}

export function isEmptyObject(o: unknown): o is Record<string, never> {
  return isObject(o) && Object.keys(o).length === 0;
}
