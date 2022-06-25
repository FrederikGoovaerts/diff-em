import { deletedDiff } from '../deletedDiff';

describe('deletedDiff', () => {
  it('should return safe JSONPaths', () => {
    expect(deletedDiff({ 'a.b': 1 }, {})).toEqual(["$['a.b']"]);
    expect(deletedDiff({ "a'b": 1 }, {})).toEqual(["$['a\\'b']"]);
  });

  describe('for objects', () => {
    it('should return deleted properties as undefined', () => {
      expect(deletedDiff({ a: 1, b: 2 }, { a: 1 })).toEqual(['$.b']);
    });

    it('should not return added or updated properties', () => {
      expect(deletedDiff({ a: 1 }, { a: 2, b: 2 })).toEqual([]);
      expect(deletedDiff({ a: { b: 2 } }, { a: 2 })).toEqual([]);
      expect(deletedDiff({ a: 2 }, 2)).toEqual([]);
    });

    it('should apply deletedDiff on nested objects', () => {
      expect(
        deletedDiff(
          { a: { b: 1 }, c: 2, d: { e: 100 } },
          { a: { b: 1 }, c: 2, d: {} },
        ),
      ).toEqual(['$.d.e']);
    });
  });

  describe('for arrays', () => {
    it('should return an object with indices as keys for deleted values and undefined as value', () => {
      expect(deletedDiff([1, 2, 3, 4], [1, 2])).toEqual(['$.2', '$.3']);
    });

    it('should not return indices for added or updated values', () => {
      expect(deletedDiff([1], [2, 3])).toEqual([]);
    });
  });
});
