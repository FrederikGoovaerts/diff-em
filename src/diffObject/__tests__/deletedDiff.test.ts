import { deletedDiff } from '../deletedDiff';

describe('deletedDiff', () => {
  describe('for objects', () => {
    it('should return deleted properties as undefined', () => {
      expect(deletedDiff({ a: 1, b: 2 }, { a: 1 })).toEqual({ b: undefined });
      expect(deletedDiff({ a: 2 }, 2)).toEqual(undefined);
    });

    it('should not return added or updated properties', () => {
      expect(deletedDiff({ a: 1 }, { a: 2, b: 2 })).toEqual({});
      expect(deletedDiff({ a: { b: 2 } }, { a: 2 })).toEqual({});
      expect(deletedDiff({ a: 1, b: 2 }, { a: 1, b: undefined })).toEqual({});
      expect(
        deletedDiff({ a: new Date('2020') }, { a: new Date('2022') }),
      ).toEqual({});
    });

    it('should apply deletedDiff on nested objects', () => {
      expect(
        deletedDiff(
          { a: { b: 1 }, c: 2, d: { e: 100 } },
          { a: { b: 1 }, c: 2, d: {} },
        ),
      ).toEqual({ d: { e: undefined } });
    });
  });

  describe('for arrays', () => {
    it('should return an object with indices as keys for deleted values and undefined as value', () => {
      expect(deletedDiff([1, 2, 3, 4], [1, 2])).toEqual({
        2: undefined,
        3: undefined,
      });
    });

    it('should not return indices for added or updated values', () => {
      expect(deletedDiff([1], [2, 3])).toEqual({});
    });
  });

  it('should throw when supplying a non-object as original object', () => {
    expect(() => deletedDiff(1 as unknown as object, {})).toThrowError();
  });
});
