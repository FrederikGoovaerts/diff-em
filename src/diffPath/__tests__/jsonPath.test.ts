import { getPathKey } from '../jsonPath';

describe('getPathKey', () => {
  it('should not escape values that are safe in a JSONPath', () => {
    expect(getPathKey('a')).toEqual('.a');
    expect(getPathKey('down')).toEqual('.down');
    expect(getPathKey('Right_Left')).toEqual('.Right_Left');
    expect(getPathKey('abc123')).toEqual('.abc123');
  });

  it('should escape values that are unsafe in a JSONPath', () => {
    expect(getPathKey('a.b')).toEqual("['a.b']");
    expect(getPathKey('5%207')).toEqual("['5%207']");
    expect(getPathKey("'seven'")).toEqual("['\\'seven\\'']");
    expect(getPathKey('$.^&')).toEqual("['$.^&']");
  });
});
