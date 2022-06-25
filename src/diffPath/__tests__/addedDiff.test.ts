import { addedDiff } from '../addedDiff';

describe('addedDiff', () => {
  it('should return safe JSONPaths', () => {
    expect(addedDiff({}, { 'a.b': 2 })).toEqual(["$['a.b']"]);
    expect(addedDiff({}, { "a'b": 2 })).toEqual(["$['a\\'b']"]);
  });

  describe('for objects', () => {
    it('should return JSONPaths for added properties', () => {
      expect(addedDiff({ a: 1 }, { a: 1, b: 2 })).toEqual(['$.b']);
    });

    it('should not return JSONPaths for updated or deleted properties', () => {
      expect(addedDiff({ a: 1, b: 2 }, { a: 2 })).toEqual([]);
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
});
