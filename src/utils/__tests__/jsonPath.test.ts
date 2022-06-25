import { getPathKey } from '../jsonPath';

describe('getPathKey', () => {
  it('should not escape values that conform to the regex /A-Za-z_/', () => {
    expect(getPathKey('a')).toEqual('.a');
    expect(getPathKey('down')).toEqual('.down');
    expect(getPathKey('Right_Left')).toEqual('.Right_Left');
    expect(getPathKey('abc123')).toEqual('.abc123');
  });

  it('should escape values that do not conform to the regex /A-Za-z_/', () => {
    expect(getPathKey('a.b')).toEqual("['a.b']");
    expect(getPathKey('5%207')).toEqual("['5%207']");
    expect(getPathKey("'seven'")).toEqual("['\\'seven\\'']");
    expect(getPathKey('$.^&')).toEqual("['$.^&']");
  });
});
