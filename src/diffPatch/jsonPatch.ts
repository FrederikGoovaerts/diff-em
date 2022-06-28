export type Patch =
  | AddPatch<string>
  | ReplacePatch<string>
  | RemovePatch<string>;

export type AddPatch<P> = { op: 'add'; path: P; value: unknown };
export type ReplacePatch<P> = { op: 'replace'; path: P; value: unknown };
export type RemovePatch<P> = { op: 'remove'; path: P };

export function makePatchPathElement(input: string): string {
  const escapedChar = input.replace(/~/g, '~0').replace(/\//g, '~1');
  return `/${escapedChar}`;
}
