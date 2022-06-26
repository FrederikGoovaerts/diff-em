import { updatedDiff } from '../diff';

describe('updatedDiff', () => {
  describe('for objects', () => {
    it('should return updated properties', () => {
      expect(updatedDiff({ a: 1 }, { a: 2 })).toEqual({ a: 2 });
      expect(updatedDiff({ a: 1 }, { a: undefined })).toEqual({ a: undefined });
      expect(updatedDiff({ a: 1 }, 2)).toEqual(2);
      expect(
        updatedDiff({ a: new Date('2020') }, { a: new Date('2022') }),
      ).toEqual({
        a: new Date('2022'),
      });
    });

    it('should not return added or deleted properties', () => {
      expect(updatedDiff({ a: 1 }, { b: 2 })).toEqual({});
    });

    it('should apply updatedDiff on nested objects', () => {
      expect(
        updatedDiff(
          { a: { b: 1 }, c: 2, d: { e: 100 } },
          { a: { b: 2 }, c: 3, d: { e: 100 } },
        ),
      ).toEqual({ a: { b: 2 }, c: 3 });
    });
  });

  describe('for arrays', () => {
    it('should return an object with indices as keys for updated values', () => {
      expect(updatedDiff([1], [2])).toEqual({ 0: 2 });
    });

    it('should not return indices for added or deleted values', () => {
      expect(updatedDiff([1], [1, 2])).toEqual({});
      expect(updatedDiff([1, 2], [1])).toEqual({});
    });
  });

  describe('for Date objects', () => {
    it('should return empty object when dates are equal', () => {
      expect(updatedDiff(new Date('2022'), new Date('2022'))).toEqual({});
    });
  });

  it('should throw when supplying a non-object as original object', () => {
    expect(() => updatedDiff(1 as unknown as object, {})).toThrowError();
  });
});
