import { addedDiff } from '../addedDiff';

describe('addedDiff', () => {
  describe('for objects', () => {
    it('should return added properties', () => {
      expect(addedDiff({ a: 1 }, { a: 1, b: 2 })).toEqual({ b: 2 });
    });

    it('should not return updated or deleted properties', () => {
      expect(addedDiff({ a: 1, b: 2 }, { a: 2 })).toEqual({});
      expect(addedDiff({ a: 1 }, 2)).toEqual({});
    });

    it('should apply addedDiff on nested objects', () => {
      expect(addedDiff({ a: { b: 1 } }, { a: { b: 1, c: 2 } })).toEqual({
        a: { c: 2 },
      });
    });
  });

  describe('for arrays', () => {
    it('should return an object with indices as keys for added values', () => {
      expect(addedDiff([1, 2], [1, 2, 3])).toEqual({ 2: 3 });
    });

    it('should not return indices for updated or deleted values', () => {
      expect(addedDiff([1, 2], [3])).toEqual({});
    });
  });

  it('should throw when supplying a non-object as original object', () => {
    expect(() => addedDiff(1 as unknown as object, {})).toThrowError();
  });
});
