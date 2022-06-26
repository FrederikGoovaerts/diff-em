import { DiffMode, isInMode } from '../diffMode';

describe('isInMode', () => {
  describe("when the mode is 'all'", () => {
    it('should return true ', () => {
      expect(isInMode('all', 'all')).toBe(true);
      expect(isInMode('all', 'added')).toBe(true);
      expect(isInMode('all', 'updated')).toBe(true);
      expect(isInMode('all', 'deleted')).toBe(true);
    });
  });

  describe("when the mode is 'added'", () => {
    it("should only return true if the mode is 'added'", () => {
      expect(isInMode('added', 'all')).toBe(false);
      expect(isInMode('added', 'added')).toBe(true);
      expect(isInMode('added', 'updated')).toBe(false);
      expect(isInMode('added', 'deleted')).toBe(false);
    });
  });

  describe("when the mode is 'updated'", () => {
    it("should only return true if the mode is 'updated'", () => {
      expect(isInMode('updated', 'all')).toBe(false);
      expect(isInMode('updated', 'added')).toBe(false);
      expect(isInMode('updated', 'updated')).toBe(true);
      expect(isInMode('updated', 'deleted')).toBe(false);
    });
  });

  describe("when the mode is 'deleted'", () => {
    it("should only return true if the mode is 'updated'", () => {
      expect(isInMode('deleted', 'all')).toBe(false);
      expect(isInMode('deleted', 'added')).toBe(false);
      expect(isInMode('deleted', 'updated')).toBe(false);
      expect(isInMode('deleted', 'deleted')).toBe(true);
    });
  });

  describe('when the mode is a non-diffMode value', () => {
    it('should only return false', () => {
      expect(isInMode('' as DiffMode, 'all')).toBe(false);
      expect(isInMode('' as DiffMode, 'added')).toBe(false);
      expect(isInMode('' as DiffMode, 'updated')).toBe(false);
      expect(isInMode('' as DiffMode, 'deleted')).toBe(false);
      expect(isInMode(undefined as unknown as DiffMode, 'all')).toBe(false);
      expect(isInMode(undefined as unknown as DiffMode, 'added')).toBe(false);
      expect(isInMode(undefined as unknown as DiffMode, 'updated')).toBe(false);
      expect(isInMode(undefined as unknown as DiffMode, 'deleted')).toBe(false);
    });
  });
});
