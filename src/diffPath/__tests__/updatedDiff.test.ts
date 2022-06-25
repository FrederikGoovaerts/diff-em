import { updatedDiff } from '../updatedDiff';

describe('updatedDiff', () => {
  it('should return safe JSONPaths', () => {
    expect(updatedDiff({ 'a.b': 1 }, { 'a.b': 2 })).toEqual(["$['a.b']"]);
    expect(updatedDiff({ "a'b": 1 }, { "a'b": 2 })).toEqual(["$['a\\'b']"]);
  });

  describe('for objects', () => {
    it('should return JSONPaths for updated properties', () => {
      expect(updatedDiff({ a: 1 }, { a: 2 })).toEqual(['$.a']);
    });

    it('should not return JSONPaths for added or deleted properties', () => {
      expect(updatedDiff({ a: 1 }, { b: 2 })).toEqual([]);
    });

    it('should apply updatedDiff on nested objects', () => {
      expect(
        updatedDiff(
          { a: { b: 1 }, c: 2, d: { e: 100 } },
          { a: { b: 2 }, c: 3, d: { e: 100 } },
        ),
      ).toEqual(expect.arrayContaining(['$.a.b', '$.c']));
    });
  });

  describe('for arrays', () => {
    it('should return JSONPaths with indices as keys for updated values', () => {
      expect(updatedDiff([1], [2])).toEqual(['$.0']);
    });

    it('should not return JSONPaths for added or deleted values', () => {
      expect(updatedDiff([1], [1, 2])).toEqual([]);
      expect(updatedDiff([1, 2], [1])).toEqual([]);
    });
  });

  describe('for Date objects', () => {
    const left = new Date('2020');
    const right = new Date('2022');

    it('should not return a JSONPath when the dates are equal', () => {
      expect(updatedDiff(left, new Date('2020'))).toEqual([]);
    });

    it('should return a JSONPath for different dates', () => {
      expect(updatedDiff(left, right)).toEqual(['$']);
    });
  });
});
