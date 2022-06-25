export type Diff<U, T> = T extends string | number | boolean | undefined | null
  ? T | undefined
  : {
      [P in keyof (U & T)]?: P extends keyof T
        ? P extends keyof U
          ? Diff<U[P], T[P]>
          : T[P]
        : undefined;
    };
