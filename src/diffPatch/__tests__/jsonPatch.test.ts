import { makePatchPathElement } from '../jsonPatch';

describe('makePatchPathElement', () => {
  it('should prefix elements with a leading slash', () => {
    expect(makePatchPathElement('a')).toEqual('/a');
    expect(makePatchPathElement('123')).toEqual('/123');
    expect(makePatchPathElement('something_longer')).toEqual(
      '/something_longer',
    );
  });

  it('should escape slashes and tildes', () => {
    expect(makePatchPathElement('/a?')).toEqual('/~1a?');
    expect(makePatchPathElement('~a')).toEqual('/~0a');
    expect(makePatchPathElement('b~/~/a')).toEqual('/b~0~1~0~1a');
  });
});
