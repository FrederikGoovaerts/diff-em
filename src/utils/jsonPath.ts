export function getPathKey(key: string): string {
  return /^[A-Za-z0-9_]+$/.test(key)
    ? `.${key}`
    : `['${key.replace(/'/g, "\\'")}']`;
}
