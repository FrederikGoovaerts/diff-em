export type DiffMode = 'all' | 'added' | 'updated' | 'deleted';

export function isInMode(mode: DiffMode, desiredMode: DiffMode): boolean {
  return mode === 'all' || mode === desiredMode;
}
