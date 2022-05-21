# Diff 'em

[![Build Status](https://github.com/FrederikGoovaerts/diff-em/actions/workflows/ci.yaml/badge.svg)](https://github.com/FrederikGoovaerts/diff-em/actions/workflows/ci.yaml)
[![License](https://img.shields.io/github/license/FrederikGoovaerts/diff-em)](LICENSE)

A collection of utilities to calculate differences between JavaScript objects.

## Installation

TODO: Publish to npmjs

## Usage

### `diffObject`

Calculates the differences between two supplied JavaScript objects. The first parameter is regarded as the original object, while the second is the new state. Will return an object with added, updated and deleted properties. Added and updated properties will have the value of the new state object, while deleted properties will return `undefined` for their keys.

Arrays will be regarded as objects with numeric keys in the resulting difference object.

```ts
import { diffObject } from 'diff-em';

diffObject({ a: 1, b: { c: 2, d: 3 } }, { a: 2, b: { d: 3 }, e: 4 });
// result: { a: 2, b: { c: undefined }, e: 4 }

diffObject({ a: [1, 2] }, { a: [1, 3, 4] });
// result: { a: { 1: 3, 2: 4 }}
```

### `addedDiffObject`:

Like [diffObject](#diffobject), but only returns properties that have been added.

```ts
import { addedDiffObject } from 'diff-em';

addedDiffObject({ a: 1, b: { c: 2 } }, { a: 2, b: { c: 2, d: 3 }, e: 4 });
// result: { b: { d: 3 }, e: 4 }

addedDiffObject({ a: [1, 2] }, { a: [1, 3, 4] });
// result: { a: { 2: 4 }}
```

### `updatedDiffObject`:

Like [diffObject](#diffobject), but only returns properties that have been updated.

```ts
import { updatedDiffObject } from 'diff-em';

updatedDiffObject({ a: 1, b: { c: 2, d: 3 } }, { a: 2, b: { d: 3 }, e: 4 });
// result: { a: 2 }

updatedDiffObject({ a: [1, 2] }, { a: [1, 3, 4] });
// result: { a: { 1: 3 }}
```

### `deletedDiffObject`:

Like [diffObject](#diffobject), but only returns properties that have been deleted, with undefined as value.

```ts
import { deletedDiffObject } from 'diff-em';

deletedDiffObject({ a: 1, b: { c: 2, d: 3 } }, { a: 2, b: { d: 3 }, e: 4 });
// result: { b: { c: undefined } }

deletedDiffObject({ a: [1, 2, 3] }, { a: [1, 2] });
// result: { a: { 2: undefined }}
```

## License

Diff 'em is released under the [MIT license](LICENSE).

## Acknowledgement

- Thanks [Matt Phillips](https://github.com/mattphillips) for the original code and idea this repository was based on.
