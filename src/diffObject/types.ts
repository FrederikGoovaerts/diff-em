export type Diff<T> = T extends string | number | boolean | undefined | null
  ? T | undefined
  : { [P in keyof T]?: Diff<T[P]> };
