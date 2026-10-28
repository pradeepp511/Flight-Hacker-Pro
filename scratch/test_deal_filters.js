const fs = require('fs');
const path = require('path');

// Read content.js and evaluate findOptimalFilteredDeal
const contentSrc = fs.readFileSync(path.join(__dirname, '../content.js'), 'utf8');

// Extract findOptimalFilteredDeal
const match = contentSrc.match(/function findOptimalFilteredDeal[\s\S]*?\n\}/);
if (!match) {
  console.error("Could not find findOptimalFilteredDeal function in content.js!");
  process.exit(1);
}

eval(match[0]);

// Mock Matrix Data using real content.js cellObj schema
const mockMatrixData = {
  userCurr: 'INR',
  avgPrice: 20000,
  allCells: [
    // 2026-10-02 (Fri) to 2026-10-09 (Fri) - 7 days, fareBase: 25000
    { depDateISO: '2026-10-02', retDateISO: '2026-10-09', depDayOfWeek: 'Fri', retDayOfWeek: 'Fri', len: 7, fareBase: 25000, depFullStr: 'Fri, Oct 2', retFullStr: 'Fri, Oct 9' },
    // 2026-10-02 (Fri) to 2026-10-04 (Sun) - 2 days, fareBase: 18000
    { depDateISO: '2026-10-02', retDateISO: '2026-10-04', depDayOfWeek: 'Fri', retDayOfWeek: 'Sun', len: 2, fareBase: 18000, depFullStr: 'Fri, Oct 2', retFullStr: 'Sun, Oct 4' },
    // 2026-10-02 (Fri) to 2026-10-16 (Fri) - 14 days, fareBase: 22000
    { depDateISO: '2026-10-02', retDateISO: '2026-10-16', depDayOfWeek: 'Fri', retDayOfWeek: 'Fri', len: 14, fareBase: 22000, depFullStr: 'Fri, Oct 2', retFullStr: 'Fri, Oct 16' },
    // 2026-10-03 (Sat) to 2026-10-10 (Sat) - 7 days, fareBase: 15000
    { depDateISO: '2026-10-03', retDateISO: '2026-10-10', depDayOfWeek: 'Sat', retDayOfWeek: 'Sat', len: 7, fareBase: 15000, depFullStr: 'Sat, Oct 3', retFullStr: 'Sat, Oct 10' },
    // 2026-10-05 (Mon) to 2026-10-12 (Mon) - 7 days, fareBase: 12000
    { depDateISO: '2026-10-05', retDateISO: '2026-10-12', depDayOfWeek: 'Mon', retDayOfWeek: 'Mon', len: 7, fareBase: 12000, depFullStr: 'Mon, Oct 5', retFullStr: 'Mon, Oct 12' },
    // 2026-10-05 (Mon) to 2026-10-19 (Mon) - 14 days, fareBase: 19000
    { depDateISO: '2026-10-05', retDateISO: '2026-10-19', depDayOfWeek: 'Mon', retDayOfWeek: 'Mon', len: 14, fareBase: 19000, depFullStr: 'Mon, Oct 5', retFullStr: 'Mon, Oct 19' }
  ]
};

console.log("=== RUNNING TEST SUITE: Deal Filter Engine ===");

let passed = 0;
let total = 0;

function assertEqual(testName, actual, expected) {
  total++;
  if (JSON.stringify(actual) === JSON.stringify(expected)) {
    console.log(`[PASS] ${testName}`);
    passed++;
  } else {
    console.error(`[FAIL] ${testName}`);
    console.error(`       Actual:   ${JSON.stringify(actual)}`);
    console.error(`       Expected: ${JSON.stringify(expected)}`);
  }
}

// Test 1: No filters (ANY / ANY / ANY) -> Should return lowest price overall (12000, Mon Oct 05 -> Mon Oct 12)
const deal1 = findOptimalFilteredDeal(mockMatrixData, 'ANY', 'ANY', 'ANY');
assertEqual('Test 1: ANY / ANY / ANY', { price: deal1.fareBase, depDate: deal1.depDateISO }, { price: 12000, depDate: '2026-10-05' });

// Test 2: Outbound Day = Fri only -> Lowest price Fri out is 18000 (Fri Oct 02 -> Sun Oct 04)
const deal2 = findOptimalFilteredDeal(mockMatrixData, 'Fri', 'ANY', 'ANY');
assertEqual('Test 2: Outbound = Fri', { price: deal2.fareBase, depDate: deal2.depDateISO, retDate: deal2.retDateISO }, { price: 18000, depDate: '2026-10-02', retDate: '2026-10-04' });

// Test 3: Return Day = Sat only -> Lowest price Sat ret is 15000 (Sat Oct 03 -> Sat Oct 10)
const deal3 = findOptimalFilteredDeal(mockMatrixData, 'ANY', 'Sat', 'ANY');
assertEqual('Test 3: Return = Sat', { price: deal3.fareBase, depDate: deal3.depDateISO, retDate: deal3.retDateISO }, { price: 15000, depDate: '2026-10-03', retDate: '2026-10-10' });

// Test 4: Exact Duration = 14 days -> Lowest 14-day trip is 19000 (Mon Oct 05 -> Mon Oct 19)
const deal4 = findOptimalFilteredDeal(mockMatrixData, 'ANY', 'ANY', '14');
assertEqual('Test 4: Duration = 14 Days', { price: deal4.fareBase, depDate: deal4.depDateISO, retDate: deal4.retDateISO }, { price: 19000, depDate: '2026-10-05', retDate: '2026-10-19' });

// Test 5: Outbound Fri + Exact Duration 14 days -> 22000 (Fri Oct 02 -> Fri Oct 16)
const deal5 = findOptimalFilteredDeal(mockMatrixData, 'Fri', 'ANY', '14');
assertEqual('Test 5: Outbound Fri + 14 Days', { price: deal5.fareBase, depDate: deal5.depDateISO, retDate: deal5.retDateISO }, { price: 22000, depDate: '2026-10-02', retDate: '2026-10-16' });

// Test 6: Outbound Fri + Return Sun -> 18000 (Fri Oct 02 -> Sun Oct 04)
const deal6 = findOptimalFilteredDeal(mockMatrixData, 'Fri', 'Sun', 'ANY');
assertEqual('Test 6: Outbound Fri + Return Sun', { price: deal6.fareBase, depDate: deal6.depDateISO, retDate: deal6.retDateISO }, { price: 18000, depDate: '2026-10-02', retDate: '2026-10-04' });

// Test 7: Outbound Fri + Return Fri + Exact Duration 7 days -> 25000 (Fri Oct 02 -> Fri Oct 09)
const deal7 = findOptimalFilteredDeal(mockMatrixData, 'Fri', 'Fri', '7');
assertEqual('Test 7: Outbound Fri + Return Fri + 7 Days', { price: deal7.fareBase, depDate: deal7.depDateISO, retDate: deal7.retDateISO }, { price: 25000, depDate: '2026-10-02', retDate: '2026-10-09' });

// Test 8: No match (e.g. Outbound Wed + 7 Days) -> null
const deal8 = findOptimalFilteredDeal(mockMatrixData, 'Wed', 'ANY', '7');
assertEqual('Test 8: No Matching Deal', deal8, null);

console.log(`\nResults: ${passed}/${total} tests passed.`);
if (passed === total) {
  console.log("SUCCESS: All deal filter tests passed perfectly!");
} else {
  process.exit(1);
}
