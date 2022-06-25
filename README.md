# Diff 'em

[![Build Status](https://github.com/FrederikGoovaerts/diff-em/actions/workflows/ci.yaml/badge.svg)](https://github.com/FrederikGoovaerts/diff-em/actions/workflows/ci.yaml)
[![Language](https://img.shields.io/github/languages/top/FrederikGoovaerts/diff-em)](#)
[![License](https://img.shields.io/github/license/FrederikGoovaerts/diff-em)](LICENSE)

A collection of utilities to calculate differences between JavaScript objects. Written in TypeScript, zero dependencies and compatible with most recent Node.js and browser environments.

> **Note**
>
> As this package is fairly new, feel free to log an issue when something does not seem to work as intended or is unclear. Feature requests will be considered case-by-case but are also very welcome.

## Installation

```
npm install diff-em
```

## Usage

### `diffObject`

Calculates the differences between two supplied JavaScript objects. The first parameter is regarded as the original object, while the second is the new state. `diffObject` will return an object with added, updated and deleted properties. Added and updated properties will have the value of the new state object, while deleted properties will return `undefined` for their keys.

Arrays will be regarded as objects with numeric keys in the resulting difference object.

`diffObject` has three derivates, which provide a more granular diff. `addedDiffObject`, `updatedDiffObject` and `deletedDiffObject` will only return a resulting object with added properties, updated properties and deleted properties respectively.

```ts
import { diffObject } from 'diff-em';

diffObject({ a: 1, b: { c: 2, d: 3 } }, { a: 2, b: { d: 3 }, e: 4 });
// result: { a: 2, b: { c: undefined }, e: 4 }

diffObject({ a: [1, 2] }, { a: [1, 3, 4] });
// result: { a: { 1: 3, 2: 4 }}
```

```ts
import { addedDiffObject, updatedDiffObject, deletedDiffObject } from 'diff-em';

addedDiffObject({ a: 1, b: { c: 2 } }, { a: 2, b: { c: 2, d: 3 }, e: 4 });
// result: { b: { d: 3 }, e: 4 }

updatedDiffObject({ a: 1, b: { c: 2, d: 3 } }, { a: 2, b: { d: 3 }, e: 4 });
// result: { a: 2 }

deletedDiffObject({ a: 1, b: { c: 2, d: 3 } }, { a: 2, b: { d: 3 }, e: 4 });
// result: { b: { c: undefined } }
```

### `diffPath`

Calculates the differences between two supplied JavaScript objects and returns an array with strings in [JSONPath](https://goessner.net/articles/JsonPath/) format. The entries of the array may indicate an added, updated or deleted property between the two objects. For a more granular diff, use `addedDiffPath`, `updatedDiffPath` and `deletedDiffPath`. These will only return paths for added properties, updated properties and deleted properties respectively.

Like `diffObject`, arrays will be regarded as objects with numeric keys in the resulting paths.

```ts
import { diffObject } from 'diff-em';

diffObject({ a: 1, b: { c: 2, d: 3 } }, { a: 2, b: { d: 3 }, e: 4 });
// result: ['$.a', '$.b.c', '$.e']

diffObject({ a: [1, 2] }, { a: [1, 3, 4] });
// result: ['$.a.1', '$.a.2']
```

```ts
import { addedDiffObject, updatedDiffObject, deletedDiffObject } from 'diff-em';

addedDiffObject({ a: 1, b: { c: 2 } }, { a: 2, b: { c: 2, d: 3 }, e: 4 });
// result: ['$.b.d', '$.e']

updatedDiffObject({ a: 1, b: { c: 2, d: 3 } }, { a: 2, b: { d: 3 }, e: 4 });
// result: ['$.a']

deletedDiffObject({ a: 1, b: { c: 2, d: 3 } }, { a: 2, b: { d: 3 }, e: 4 });
// result: ['$.b.c']
```

## License

Diff 'em is released under the [MIT license](LICENSE).

## Acknowledgement

- Thanks to [Matt Phillips](https://github.com/mattphillips) for the original code and idea this repository was based on.
