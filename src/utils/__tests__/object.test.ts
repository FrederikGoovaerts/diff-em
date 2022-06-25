import { hasProperty, isDate, isEmptyObject, isObject } from '../object';

describe('isDate', () => {
  it('should return true for a Date object', () => {
    expect(isDate(new Date())).toBe(true);
    expect(isDate(new Date('2022'))).toBe(true);
  });

  it('should return false for non-Date values', () => {
    expect(isDate(true)).toBe(false);
    expect(isDate(1)).toBe(false);
    expect(isDate('word')).toBe(false);
    expect(isDate(null)).toBe(false);
    expect(isDate(undefined)).toBe(false);
    expect(isDate({})).toBe(false);
    expect(isDate(() => undefined)).toBe(false);
  });
});

describe('isObject', () => {
  it('should return true for an objectlike value', () => {
    expect(isObject({})).toBe(true);
    expect(isObject([])).toBe(true);
    expect(isObject(new Date())).toBe(true);
  });

  it('should return false for non-objectlike values', () => {
    expect(isObject(true)).toBe(false);
    expect(isObject(1)).toBe(false);
    expect(isObject('word')).toBe(false);
    expect(isObject(null)).toBe(false);
    expect(isObject(undefined)).toBe(false);
    expect(isObject(() => undefined)).toBe(false);
  });
});

describe('hasProperty', () => {
  it('should return true for a valid key on an object', () => {
    const obj: Record<string, unknown> = { a: 2 };
    obj.b = undefined;

    expect(hasProperty(obj, 'a')).toBe(true);
    expect(hasProperty(obj, 'b')).toBe(true);
  });

  it('should return false for a key not on an object', () => {
    const obj: Record<string, unknown> = { a: 2 };

    expect(hasProperty(obj, 'b')).toBe(false);
  });
});

describe('isEmptyObject', () => {
  it('should return true for an empty object', () => {
    expect(isEmptyObject({})).toBe(true);
  });

  it('should return false for an non-empty object', () => {
    expect(isEmptyObject({ a: 2 })).toBe(false);
  });

  it('should return false for non-object values', () => {
    expect(isEmptyObject(true)).toBe(false);
    expect(isEmptyObject(1)).toBe(false);
    expect(isEmptyObject('word')).toBe(false);
    expect(isEmptyObject(null)).toBe(false);
    expect(isEmptyObject(undefined)).toBe(false);
    expect(isEmptyObject(() => undefined)).toBe(false);
  });
});
