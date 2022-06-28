import { diff } from '../diff';

describe('diff', () => {
  it('should return added properties', () => {
    expect(diff({ ['/abc']: 1, ['~1']: 'a' }, { ['/abc']: 2 })).toEqual([
      { op: 'remove', path: '/~01' },
      { op: 'replace', path: '/~1abc', value: 2 },
    ]);
  });

  describe('for objects', () => {
    it('should return added properties', () => {
      expect(diff({ a: 1 }, { a: 1, b: 2 })).toEqual([
        { op: 'add', path: '/b', value: 2 },
      ]);
    });

    it('should return updated properties', () => {
      expect(diff({ a: 1, b: 1, c: 1 }, { a: 2, b: {}, c: null })).toEqual([
        { op: 'replace', path: '/a', value: 2 },
        { op: 'replace', path: '/b', value: {} },
        { op: 'replace', path: '/c', value: null },
      ]);
      expect(diff({ a: 1 }, 2)).toEqual([
        { op: 'replace', path: '', value: 2 },
      ]);
      expect(diff({ a: new Date('2020') }, { a: new Date('2022') })).toEqual([
        { op: 'replace', path: '/a', value: new Date('2022') },
      ]);
    });

    it('should return undefined for removed properties', () => {
      expect(diff({ a: 1 }, {})).toEqual([{ op: 'remove', path: '/a' }]);
    });

    it('should not add keys for unchanged properties', () => {
      expect(diff({ a: 1, c: 2 }, { a: 1, c: 3 })).toEqual([
        { op: 'replace', path: '/c', value: 3 },
      ]);
    });

    it('should apply diff on nested objects', () => {
      expect(diff({ a: { b: 1, c: 2 } }, { a: { b: 1, c: 3 } })).toEqual([
        { op: 'replace', path: '/a/c', value: 3 },
      ]);
      expect(diff({ a: 1, b: { c: 100 } }, { a: 1, b: {} })).toEqual([
        { op: 'remove', path: '/b/c' },
      ]);
    });

    it('should return changed properties on all nested levels', () => {
      expect(
        diff(
          { a: { b: 1 }, c: 2, d: { e: 1, f: undefined }, g: 'a' },
          { a: { b: 2 }, c: 3, d: { e: 1 }, g: 'a' },
        ),
      ).toEqual([
        { op: 'replace', path: '/a/b', value: 2 },
        { op: 'replace', path: '/c', value: 3 },
        { op: 'remove', path: '/d/f' },
      ]);
    });
  });

  describe('for arrays', () => {
    it('should return an object with indices as keys for different values', () => {
      expect(diff([{ a: 1, b: 2 }], [{ a: {}, b: 2 }])).toEqual([
        { op: 'replace', path: '/0/a', value: {} },
      ]);
      expect(diff([1], [2])).toEqual([{ op: 'replace', path: '/0', value: 2 }]);
    });

    it('should return indices for updated values', () => {
      expect(diff([1, 2, 3], [9, 8, 3])).toEqual([
        { op: 'replace', path: '/0', value: 9 },
        { op: 'replace', path: '/1', value: 8 },
      ]);
    });

    it('should return indices for added values', () => {
      expect(diff([1, 2], [1, 2, 3])).toEqual([
        { op: 'add', path: '/2', value: 3 },
      ]);
    });

    it('should return undefined for indices that no longer have a value', () => {
      expect(diff([1, 2, 3], [1, 3])).toEqual([
        { op: 'remove', path: '/2' },
        { op: 'replace', path: '/1', value: 3 },
      ]);
    });
  });

  describe('for Date objects', () => {
    const left = new Date('2020');
    const right = new Date('2022');

    it('should return an empty object when the dates are equal', () => {
      expect(diff(left, new Date('2020'))).toEqual([]);
    });

    it('should return the updated value for different dates', () => {
      expect(diff(left, right)).toEqual([
        { op: 'replace', path: '', value: right },
      ]);
    });
  });

  it('should throw when supplying a non-object as original object', () => {
    expect(() => diff(1 as unknown as object, {})).toThrowError();
  });
});
