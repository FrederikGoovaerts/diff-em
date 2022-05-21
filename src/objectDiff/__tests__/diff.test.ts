import { diff } from '../diff';

describe('diff', () => {
  describe('for objects', () => {
    it('should return updated properties of same types', () => {
      expect(diff({ a: 1 }, { a: 2 })).toEqual({ a: 2 });
    });

    it('should return updated properties of different types', () => {
      expect(diff({ a: 1 }, { a: {} })).toEqual({ a: {} });
      expect(diff({ a: 1 }, { a: null })).toEqual({ a: null });
    });

    it('should return added properties', () => {
      expect(diff({ a: 1 }, { a: 1, b: 2 })).toEqual({ b: 2 });
    });

    it('should return undefined for removed properties', () => {
      expect(diff({ a: 1 }, {})).toEqual({ a: undefined });
    });

    it('should return only updated properties', () => {
      expect(diff({ a: 1, c: 2 }, { a: 1, c: 3 })).toEqual({ c: 3 });
    });

    it('should apply diff on nested objects', () => {
      expect(diff({ a: { b: 1, c: 2 } }, { a: { b: 1, c: 3 } })).toEqual({
        a: { c: 3 },
      });
      expect(diff({ a: 1, b: { c: 100 } }, { a: 1, b: {} })).toEqual({
        b: { c: undefined },
      });
    });

    it('should return updated properties on all nested levels', () => {
      expect(
        diff(
          { a: { b: 1 }, c: 2, d: { e: 1, f: undefined }, g: 'a' },
          { a: { b: 2 }, c: 3, d: { e: 1 }, g: 'a' },
        ),
      ).toEqual({ a: { b: 2 }, c: 3, d: { f: undefined } });
    });
  });

  describe('for arrays', () => {
    it('should return an object with indices as keys for different values', () => {
      expect(diff([{ a: 1, b: 2 }], [{ a: {}, b: 2 }])).toEqual({
        0: { a: {} },
      });
      expect(diff([1], [2])).toEqual({ 0: 2 });
    });

    it('should return indices for updated values', () => {
      expect(diff([1, 2, 3], [9, 8, 3])).toEqual({ 0: 9, 1: 8 });
    });

    it('should return indices for added values', () => {
      expect(diff([1, 2], [1, 2, 3])).toEqual({ 2: 3 });
    });

    it('should return undefined for indices that no longer have a value', () => {
      expect(diff([1, 2, 3], [1, 3])).toEqual({ 1: 3, 2: undefined });
    });
  });

  describe('for dates', () => {
    const left = new Date('2020');
    const right = new Date('2022');

    it('should return an empty object when the dates are equal', () => {
      expect(diff(left, new Date('2020'))).toEqual({});
    });

    it('should return the updated value for different dates', () => {
      expect(diff(left, right)).toEqual(right);
    });
  });
});
