# Diff 'em

[![npm](https://img.shields.io/npm/v/diff-em)](https://www.npmjs.com/package/diff-em)
[![Build Status](https://github.com/FrederikGoovaerts/diff-em/actions/workflows/ci.yaml/badge.svg)](https://github.com/FrederikGoovaerts/diff-em/actions/workflows/ci.yaml)
[![codecov](https://codecov.io/gh/FrederikGoovaerts/diff-em/branch/main/graph/badge.svg?token=LIP8MHA7HG)](https://codecov.io/gh/FrederikGoovaerts/diff-em)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

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

diffObject({ a: ['b', 'c'] }, { a: ['b', 'd', 'e'] });
// result: { a: { 1: 'd', 2: 'e' }}
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

### `diffPatch`

Calculates the differences between two supplied JavaScript objects and returns an array with [JSON Patch (RFC 6902)](https://datatracker.ietf.org/doc/html/rfc6902/) operation objects.

Like `diffObject`, arrays will be regarded as objects with numeric keys in the resulting paths.

```ts
import { diffPatch } from 'diff-em';

diffPatch({ a: 1, b: { c: 2, d: 3 } }, { a: 2, b: { d: 3 }, e: 4 });
// result:
// [
//  {"op": "replace", "path": "/a", "value": 2},
//  {"op": "remove", "path": "/b/c"},
//  {"op": "add", "path": "/e", "value": 4}
// ]

diffPatch({ a: ['b', 'c'] }, { a: ['b', 'd', 'e'] });
// result:
// [
//  {"op": "replace", "path": "/a/1", "value": "d"},
//  {"op": "add", "path": "/a/2", "value": "e"}
// ]
```

### `diffPath`

Calculates the differences between two supplied JavaScript objects and returns an array with strings in [JSONPath](https://goessner.net/articles/JsonPath/) format. The entries of the array may indicate an added, updated or deleted property between the two objects. For a more granular diff, use `addedDiffPath`, `updatedDiffPath` and `deletedDiffPath`. These will only return paths for added properties, updated properties and deleted properties respectively.

Like `diffObject`, arrays will be regarded as objects with numeric keys in the resulting paths.

```ts
import { diffPath } from 'diff-em';

diffPath({ a: 1, b: { c: 2, d: 3 } }, { a: 2, b: { d: 3 }, e: 4 });
// result: ['$.a', '$.b.c', '$.e']

diffPath({ a: ['b', 'c'] }, { a: ['b', 'd', 'e'] });
// result: ['$.a.1', '$.a.2']
```

```ts
import { addedDiffPath, updatedDiffPath, deletedDiffPath } from 'diff-em';

addedDiffPath({ a: 1, b: { c: 2 } }, { a: 2, b: { c: 2, d: 3 }, e: 4 });
// result: ['$.b.d', '$.e']

updatedDiffPath({ a: 1, b: { c: 2, d: 3 } }, { a: 2, b: { d: 3 }, e: 4 });
// result: ['$.a']

deletedDiffPath({ a: 1, b: { c: 2, d: 3 } }, { a: 2, b: { d: 3 }, e: 4 });
// result: ['$.b.c']
```

## License

Diff 'em is released under the [MIT license](LICENSE).

## Acknowledgement

- Thanks to [Matt Phillips](https://github.com/mattphillips) for the original code and idea this repository was based on.
