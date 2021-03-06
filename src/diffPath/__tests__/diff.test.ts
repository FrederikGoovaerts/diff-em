import { diff } from '../diff';

describe('diff', () => {
  it('should return safe JSONPaths', () => {
    expect(diff({ 'a.b': 1 }, { 'a.b': 2 })).toEqual(["$['a.b']"]);
    expect(diff({ "a'b": 1 }, { "a'b": 2 })).toEqual(["$['a\\'b']"]);
  });

  it('should respect the pathTruncateLength option', () => {
    expect(
      diff(
        { a: { b: { c: { d: 1 } } } },
        { a: { b: { c: { d: 2 } } } },
        { pathTruncateLength: 2 },
      ),
    ).toEqual(['$.a.b']);
    expect(
      diff({ a: { b: 1 } }, { a: { b: 2 } }, { pathTruncateLength: 0 }),
    ).toEqual(['$']);
  });

  it('should respect the includeInitial option', () => {
    expect(
      diff({ a: { b: 1 } }, { a: { b: 2 } }, { includeInitial: true }),
    ).toEqual(['$.a.b']);
    expect(
      diff({ 'a.': { b: 1 } }, { 'a.': { b: 2 } }, { includeInitial: true }),
    ).toEqual(["$['a.'].b"]);
    expect(
      diff({ a: { b: 1 } }, { a: { b: 2 } }, { includeInitial: false }),
    ).toEqual(['a.b']);
    expect(
      diff({ 'a.': { b: 1 } }, { 'a.': { b: 2 } }, { includeInitial: false }),
    ).toEqual(["['a.'].b"]);
  });

  describe('for objects', () => {
    it('should return JSONPaths for added properties', () => {
      expect(diff({ a: 1 }, { a: 1, b: 2 })).toEqual(['$.b']);
    });

    it('should return JSONPaths for updated properties', () => {
      expect(diff({ a: 1, b: 1, c: 1 }, { a: 2, b: {}, c: 1 })).toEqual([
        '$.a',
        '$.b',
      ]);
      expect(diff({ a: new Date('2020') }, { a: new Date('2022') })).toEqual([
        '$.a',
      ]);
    });

    it('should return JSONPaths for removed properties', () => {
      expect(diff({ a: 1 }, {})).toEqual(['$.a']);
    });

    it('should not return JSONPaths for unchanged properties', () => {
      expect(diff({ a: 1, c: 2 }, { a: 1, c: 3 })).toEqual(['$.c']);
    });

    it('should apply diff on nested objects', () => {
      expect(diff({ a: { b: 1, c: 2 } }, { a: { b: 1, c: 3 } })).toEqual([
        '$.a.c',
      ]);
      expect(diff({ a: 1, b: { c: 100 } }, { a: 1, b: {} })).toEqual(['$.b.c']);
    });

    it('should return JSONPaths for changed properties on all nested levels', () => {
      expect(
        diff(
          { a: { b: 1 }, c: 2, d: { e: 1, f: undefined }, g: 'a' },
          { a: { b: 2 }, c: 3, d: { e: 1 }, g: 'a' },
        ),
      ).toEqual(['$.a.b', '$.c', '$.d.f']);
    });
  });

  describe('for arrays', () => {
    it('should return JSONPaths with indices as path keys for different values', () => {
      expect(diff([{ a: 1, b: 2 }], [{ a: {}, b: 2 }])).toEqual(['$.0.a']);
      expect(diff([1], [2])).toEqual(['$.0']);
    });

    it('should return JSONPaths for updated values', () => {
      expect(diff([1, 2, 3], [9, 8, 3])).toEqual(['$.0', '$.1']);
      expect(diff({ a: 1 }, 2)).toEqual(['$']);
    });

    it('should return JSONPaths for added values', () => {
      expect(diff([1, 2], [1, 2, 3])).toEqual(['$.2']);
    });

    it('should return JSONPaths for deleted values', () => {
      expect(diff([1, 2, 3], [1, 2])).toEqual(['$.2']);
    });
  });

  describe('for dates', () => {
    const left = new Date('2020');
    const right = new Date('2022');

    it('should not return a JSONPath when the dates are equal', () => {
      expect(diff(left, new Date('2020'))).toEqual([]);
    });

    it('should return a JSONPath for different dates', () => {
      expect(diff(left, right)).toEqual(['$']);
    });
  });

  it('should throw when supplying a non-object as original object', () => {
    expect(() => diff(1 as unknown as object, {})).toThrowError();
  });
});
