import { addedDiff } from '../diff';

describe('addedDiff', () => {
  it('should return safe JSONPaths', () => {
    expect(addedDiff({}, { 'a.b': 2 })).toEqual(["$['a.b']"]);
    expect(addedDiff({}, { "a'b": 2 })).toEqual(["$['a\\'b']"]);
  });

  it('should respect the pathTruncateLength option', () => {
    expect(
      addedDiff(
        { a: { b: { c: {} } } },
        { a: { b: { c: { d: 2 } } } },
        { pathTruncateLength: 2 },
      ),
    ).toEqual(['$.a.b']);
    expect(
      addedDiff({ a: {} }, { a: { b: 2 } }, { pathTruncateLength: 0 }),
    ).toEqual(['$']);
  });

  it('should respect the includeInitial option', () => {
    expect(
      addedDiff({ a: {} }, { a: { b: 2 } }, { includeInitial: true }),
    ).toEqual(['$.a.b']);
    expect(
      addedDiff({ 'a.': {} }, { 'a.': { b: 2 } }, { includeInitial: true }),
    ).toEqual(["$['a.'].b"]);
    expect(
      addedDiff({ a: {} }, { a: { b: 2 } }, { includeInitial: false }),
    ).toEqual(['a.b']);
    expect(
      addedDiff({ 'a.': {} }, { 'a.': { b: 2 } }, { includeInitial: false }),
    ).toEqual(["['a.'].b"]);
  });

  describe('for objects', () => {
    it('should return JSONPaths for added properties', () => {
      expect(addedDiff({ a: 1 }, { a: 1, b: 2 })).toEqual(['$.b']);
    });

    it('should not return JSONPaths for updated or deleted properties', () => {
      expect(addedDiff({ a: 1, b: 2 }, { a: 2 })).toEqual([]);
      expect(addedDiff({ a: 1 }, 2)).toEqual([]);
      expect(
        addedDiff({ a: new Date('2020') }, { a: new Date('2022') }),
      ).toEqual([]);
    });

    it('should apply addedDiff on nested objects', () => {
      expect(addedDiff({ a: { b: 1 } }, { a: { b: 1, c: 2 } })).toEqual([
        '$.a.c',
      ]);
    });

    it('should return JSONPaths for multiple added properties', () => {
      expect(
        addedDiff({ a: { b: 1 } }, { a: { b: 1, c: 2, d: 3 }, e: 4 }),
      ).toEqual(expect.arrayContaining(['$.a.c', '$.a.d', '$.e']));
    });
  });

  describe('for arrays', () => {
    it('should return JSONPaths with indices as keys for added values', () => {
      expect(addedDiff([1, 2], [1, 2, 3])).toEqual(['$.2']);
    });

    it('should not return JSONPaths for updated or deleted values', () => {
      expect(addedDiff([1, 2], [3])).toEqual([]);
    });
  });

  it('should throw when supplying a non-object as original object', () => {
    expect(() => addedDiff(1 as unknown as object, {})).toThrowError();
  });
});
