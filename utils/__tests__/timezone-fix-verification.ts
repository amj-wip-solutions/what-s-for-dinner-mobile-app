/**
 * Manual verification script for timezone fix
 * Run this to verify dates are parsed correctly in local timezone
 */

import { getDayOfWeekNumber, formatMealPlanDateRange, formatMealPlanItemDate } from '../mealPlanUtils';

console.log('=== Timezone Fix Verification ===\n');

// Test 1: Monday Oct 27, 2025 should be day 1 (Monday)
const mondayDate = '2025-10-27';
const mondayDayNum = getDayOfWeekNumber(mondayDate);
console.log(`Test 1: getDayOfWeekNumber('${mondayDate}')`);
console.log(`  Expected: 1 (Monday)`);
console.log(`  Actual: ${mondayDayNum}`);
console.log(`  Status: ${mondayDayNum === 1 ? '✅ PASS' : '❌ FAIL'}\n`);

// Test 2: Sunday Oct 26, 2025 should be day 7 (Sunday)
const sundayDate = '2025-10-26';
const sundayDayNum = getDayOfWeekNumber(sundayDate);
console.log(`Test 2: getDayOfWeekNumber('${sundayDate}')`);
console.log(`  Expected: 7 (Sunday)`);
console.log(`  Actual: ${sundayDayNum}`);
console.log(`  Status: ${sundayDayNum === 7 ? '✅ PASS' : '❌ FAIL'}\n`);

// Test 3: Date range formatting
const rangeStart = '2025-10-27';
const rangeEnd = '2025-11-02';
const formattedRange = formatMealPlanDateRange(rangeStart, rangeEnd);
console.log(`Test 3: formatMealPlanDateRange('${rangeStart}', '${rangeEnd}')`);
console.log(`  Expected: "Oct 27 - Nov 2"`);
console.log(`  Actual: "${formattedRange}"`);
console.log(`  Status: ${formattedRange === 'Oct 27 - Nov 2' ? '✅ PASS' : '❌ FAIL'}\n`);

// Test 4: Individual date formatting (Monday)
const formattedMonday = formatMealPlanItemDate(mondayDate);
console.log(`Test 4: formatMealPlanItemDate('${mondayDate}')`);
console.log(`  Expected: Should contain "Monday", "Oct", and "27"`);
console.log(`  Actual: "${formattedMonday}"`);
const containsAll = formattedMonday.includes('Monday') &&
                    formattedMonday.includes('Oct') &&
                    formattedMonday.includes('27');
console.log(`  Status: ${containsAll ? '✅ PASS' : '❌ FAIL'}\n`);

// Test 5: Verify it should NOT be Sunday (the bug we fixed)
console.log(`Test 5: Regression test - Monday should NOT be parsed as Sunday`);
console.log(`  Date: '${mondayDate}' (Monday Oct 27, 2025)`);
console.log(`  Should NOT contain: "Sunday"`);
console.log(`  Actual: "${formattedMonday}"`);
console.log(`  Status: ${!formattedMonday.includes('Sunday') ? '✅ PASS' : '❌ FAIL (timezone bug still present!)'}\n`);

console.log('=== End Verification ===');

