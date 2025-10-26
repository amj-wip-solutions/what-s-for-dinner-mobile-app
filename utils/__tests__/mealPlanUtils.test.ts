/**
 * Tests for mealPlanUtils - especially timezone handling
 */

import { getDayOfWeekNumber, formatMealPlanDateRange, formatMealPlanItemDate } from '../mealPlanUtils';

describe('mealPlanUtils', () => {
  describe('getDayOfWeekNumber', () => {
    it('should correctly identify Monday as day 1', () => {
      // Oct 27, 2025 is a Monday
      expect(getDayOfWeekNumber('2025-10-27')).toBe(1);
    });

    it('should correctly identify Sunday as day 7', () => {
      // Oct 26, 2025 is a Sunday
      expect(getDayOfWeekNumber('2025-10-26')).toBe(7);
    });

    it('should correctly identify Tuesday as day 2', () => {
      // Oct 28, 2025 is a Tuesday
      expect(getDayOfWeekNumber('2025-10-28')).toBe(2);
    });

    it('should handle dates without timezone shifts', () => {
      // This test would fail with the old implementation in PST/PDT timezone
      // Oct 27, 2025 is Monday, should not shift to Sunday
      const dayNum = getDayOfWeekNumber('2025-10-27');
      expect(dayNum).toBe(1); // Monday
    });
  });

  describe('formatMealPlanDateRange', () => {
    it('should format date range correctly without timezone shifts', () => {
      const result = formatMealPlanDateRange('2025-10-27', '2025-11-02');
      expect(result).toBe('Oct 27 - Nov 2');
    });

    it('should handle single day range', () => {
      const result = formatMealPlanDateRange('2025-10-27', '2025-10-27');
      expect(result).toBe('Oct 27 - Oct 27');
    });

    it('should handle year boundaries', () => {
      const result = formatMealPlanDateRange('2025-12-29', '2026-01-04');
      expect(result).toBe('Dec 29 - Jan 4');
    });
  });

  describe('formatMealPlanItemDate', () => {
    it('should format date with weekday correctly', () => {
      // Oct 27, 2025 is a Monday
      const result = formatMealPlanItemDate('2025-10-27');
      expect(result).toContain('Monday');
      expect(result).toContain('Oct');
      expect(result).toContain('27');
    });

    it('should not shift dates due to timezone (regression test)', () => {
      // This would show as Sunday in PST/PDT with the old implementation
      const result = formatMealPlanItemDate('2025-10-27');
      expect(result).toContain('Monday'); // Should be Monday, not Sunday
    });
  });
});

