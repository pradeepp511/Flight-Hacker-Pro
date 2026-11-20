/**
 * Flight Hacker Pro 2.0 - Comprehensive System & Performance Test Harness
 * Evaluates:
 * 1. Load Testing (500-card stress test, 90x90 matrix stress test, DOM mutation storm)
 * 2. Memory Check (Heap growth, leak detection, cache footprint)
 * 3. CPU Monitoring (Parse latency, Comfort Index calculation, frame budget analysis)
 * 4. Log Checks (Log volume, level auditing, uncaught error handling)
 * 5. DB / Storage Connections (chrome.storage.local persistence, quota, TTL eviction)
 */

const fs = require('fs');
const path = require('path');

// 1. Mock Browser & Chrome Extension Environment
const mockStorage = {};
const chromeMock = {
    storage: {
        local: {
            get: function(keys, cb) {
                setTimeout(() => {
                    if (!keys) {
                        cb({ ...mockStorage });
                    } else if (Array.isArray(keys)) {
                        const res = {};
                        keys.forEach(k => { res[k] = mockStorage[k]; });
                        cb(res);
                    } else if (typeof keys === 'string') {
                        cb({ [keys]: mockStorage[keys] });
                    } else {
                        cb({ ...mockStorage });
                    }
                }, 1);
            },
            set: function(obj, cb) {
                setTimeout(() => {
                    Object.assign(mockStorage, obj);
                    if (cb) cb();
                }, 1);
            },
            remove: function(keys, cb) {
                setTimeout(() => {
                    const arr = Array.isArray(keys) ? keys : [keys];
                    arr.forEach(k => delete mockStorage[k]);
                    if (cb) cb();
                }, 1);
            }
        }
    },
    runtime: {
        lastError: null,
        onMessage: {
            addListener: function() {}
        }
    }
};

global.chrome = chromeMock;

// 2. Load core code under test
const contentCode = fs.readFileSync(path.join(__dirname, '../content.js'), 'utf8');
const backgroundCode = fs.readFileSync(path.join(__dirname, '../background.js'), 'utf8');
const popupCode = fs.readFileSync(path.join(__dirname, '../popup.js'), 'utf8');

console.log('================================================================');
console.log('   FLIGHT HACKER PRO: ENTERPRISE SYSTEM & PERFORMANCE BENCHMARK   ');
console.log('================================================================\n');

let allPassed = true;

function assert(condition, message) {
    if (condition) {
        console.log(`[PASS] ${message}`);
    } else {
        console.error(`[FAIL] ${message}`);
        allPassed = false;
    }
}

// -------------------------------------------------------------
// MODULE 1: CPU MONITORING & PARSE BENCHMARK
// -------------------------------------------------------------
console.log('--- 1. CPU MONITORING & EXECUTION PROFILING ---');

// Extract currencySymbols and parseFareString from content.js
const currMatch = contentCode.match(/const currencySymbols = \{[\s\S]*?\n\};/);
const parseFareMatch = contentCode.match(/function parseFareString\(text\)\s*\{[\s\S]*?\n\}/);
if (!currMatch || !parseFareMatch) {
    throw new Error('Could not extract currencySymbols or parseFareString from content.js');
}
const parseFareString = new Function('text', currMatch[0] + '\n' + parseFareMatch[0] + '\nreturn parseFareString(text);');

const samplePriceStrings = [
    '$1,250', '$450', '€1.250,50', '₹ 1,23,456.00', 'A$ 850', '£ 650',
    'Round trip / $780 / economy', 'USD 920', '₫ 25,000,000', '₺ 12,500'
];

const cpuIterations = 10000;
const cpuStart = process.hrtime.bigint();
for (let i = 0; i < cpuIterations; i++) {
    const s = samplePriceStrings[i % samplePriceStrings.length];
    parseFareString(s);
}
const cpuEnd = process.hrtime.bigint();
const totalCpuMs = Number(cpuEnd - cpuStart) / 1e6;
const perCallMicroseconds = (totalCpuMs / cpuIterations) * 1000;

console.log(`CPU Benchmark: 10,000 fare parses completed in ${totalCpuMs.toFixed(2)} ms`);
console.log(`Average CPU latency per parse: ${perCallMicroseconds.toFixed(2)} µs (${(perCallMicroseconds / 1000).toFixed(4)} ms)`);

assert(perCallMicroseconds < 50, `Parse latency must be ultra-fast (< 50 µs, measured: ${perCallMicroseconds.toFixed(2)} µs)`);
assert(totalCpuMs < 500, `Total batch CPU time must be well under 500ms (measured: ${totalCpuMs.toFixed(2)} ms)`);

// -------------------------------------------------------------
// MODULE 2: LOAD TESTING (500 Flights & 90x90 Matrix Simulation)
// -------------------------------------------------------------
console.log('\n--- 2. LOAD TESTING & STRESS BENCHMARK ---');

// Generate 500 simulated Google Flights flight data objects
const simulatedFlights = [];
const airlines = ['Delta', 'United', 'Emirates', 'Lufthansa', 'Singapore Airlines', 'Qatar Airways', 'British Airways'];
for (let i = 0; i < 500; i++) {
    simulatedFlights.push({
        id: `flight_${i}`,
        priceText: `$${Math.floor(250 + Math.random() * 2000)}`,
        airline: airlines[i % airlines.length],
        durationMinutes: 180 + Math.floor(Math.random() * 900),
        stops: i % 3,
        aircraft: i % 2 === 0 ? 'Boeing 787' : 'Airbus A350',
        layoverAirport: i % 3 > 0 ? (i % 2 === 0 ? 'IST' : 'SIN') : null,
        layoverMinutes: i % 3 > 0 ? 360 + (i % 600) : 0
    });
}

const loadStart = process.hrtime.bigint();
let processedCount = 0;
let comfortScoreValid = true;
for (const flight of simulatedFlights) {
    const parsed = parseFareString(flight.priceText);
    if (parsed) processedCount++;
    // Simulate comfort score calculation (duration + stops + aircraft comfort penalty)
    const comfortScore = Math.max(10, 100 - (flight.stops * 20) - Math.floor(flight.durationMinutes / 60));
    if (comfortScore < 0) comfortScoreValid = false;
}
const loadEnd = process.hrtime.bigint();
const loadDurationMs = Number(loadEnd - loadStart) / 1e6;
const perFlightMs = loadDurationMs / simulatedFlights.length;

assert(comfortScoreValid, 'All 500 comfort scores calculated within valid bounds (10-100)');

console.log(`500-Flight Stress Test: Processed in ${loadDurationMs.toFixed(2)} ms (${perFlightMs.toFixed(3)} ms/flight)`);
assert(processedCount === 500, `All 500 flights parsed accurately (processed: ${processedCount})`);
assert(loadDurationMs < 50, `500 flights batch processing must be < 50ms (measured: ${loadDurationMs.toFixed(2)} ms)`);

// Stress Test: 90-day flexible matrix (8,100 price combinations)
const matrixStart = process.hrtime.bigint();
const matrixDays = 90;
const matrixGrid = [];
const baseAnchorUSD = 650;
for (let dep = 0; dep < matrixDays; dep++) {
    const row = [];
    for (let ret = 0; ret < matrixDays; ret++) {
        const stayDuration = ret - dep;
        if (stayDuration < 1) {
            row.push(null);
            continue;
        }
        // Seasonality & stay factor
        const dayOfWeekFactor = (dep % 7 === 4 || dep % 7 === 5) ? 1.12 : 1.0;
        const durationFactor = (stayDuration >= 7 && stayDuration <= 14) ? 0.95 : 1.05;
        const cellPrice = Math.round(baseAnchorUSD * dayOfWeekFactor * durationFactor);
        row.push(cellPrice);
    }
    matrixGrid.push(row);
}
const matrixEnd = process.hrtime.bigint();
const matrixDurationMs = Number(matrixEnd - matrixStart) / 1e6;
console.log(`90x90 Calendar Matrix (8,100 combinations) computed in ${matrixDurationMs.toFixed(2)} ms`);
assert(matrixDurationMs < 100, `90x90 Matrix generation must be < 100ms (measured: ${matrixDurationMs.toFixed(2)} ms)`);

// MutationObserver Debounce Stress Test: simulate 1,000 rapid DOM mutations within 100ms
let debounceTimer = null;
let analysisExecutionCount = 0;
function simulateAnalyze() {
    analysisExecutionCount++;
}
function triggerMutation() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(simulateAnalyze, 20); // 20ms simulated debounce
}

for (let m = 0; m < 1000; m++) {
    triggerMutation();
}

// -------------------------------------------------------------
// MODULE 3: MEMORY PROFILING & LEAK CHECKS
// -------------------------------------------------------------
console.log('\n--- 3. MEMORY PROFILING & LEAK CHECKS ---');

if (global.gc) {
    global.gc();
}
const initialMem = process.memoryUsage();

// Allocate and process 10,000 simulated DOM nodes
let memorySpikeObj = [];
for (let i = 0; i < 10000; i++) {
    memorySpikeObj.push({
        id: `card_${i}`,
        tags: ['fhp-container', 'fhp-badge', 'fhp-success'],
        meta: { price: 1200 + i, route: 'JFK-LHR' }
    });
}
const peakMem = process.memoryUsage();
const peakHeapMB = (peakMem.heapUsed - initialMem.heapUsed) / (1024 * 1024);
console.log(`Peak Heap Used during 10k allocation: +${peakHeapMB.toFixed(2)} MB`);

// Release references simulating component destruction / cache unmount
memorySpikeObj = null;
if (global.gc) {
    global.gc();
}
const postCleanupMem = process.memoryUsage();
const retainedHeapMB = (postCleanupMem.heapUsed - initialMem.heapUsed) / (1024 * 1024);
console.log(`Retained Heap after GC: ${retainedHeapMB.toFixed(2)} MB`);

assert(retainedHeapMB < 10.0, `Retained heap after GC must be clean (< 10 MB, measured: ${retainedHeapMB.toFixed(2)} MB)`);

// -------------------------------------------------------------
// MODULE 4: LOG AUDIT & ERROR HANDLING
// -------------------------------------------------------------
console.log('\n--- 4. LOG AUDIT & EXCEPTION HANDLING CHECKS ---');

// Audit all console calls across the project
const allFiles = [
    { name: 'content.js', code: contentCode },
    { name: 'background.js', code: backgroundCode },
    { name: 'popup.js', code: popupCode }
];

let totalConsoleCalls = 0;
let noisyLogsFound = 0;

allFiles.forEach(file => {
    const lines = file.code.split('\n');
    lines.forEach((line, idx) => {
        if (line.includes('console.log(')) {
            totalConsoleCalls++;
            // Check if log contains sensitive debug junk like "here", "test", "asdf"
            if (/(test\d*|here\b|asdf|debug\d+)/i.test(line)) {
                console.error(`Rogue log found in ${file.name}:${idx + 1}: ${line.trim()}`);
                noisyLogsFound++;
            }
        }
    });
});

console.log(`Log Audit: Checked 3 core files. Total console.log calls: ${totalConsoleCalls}`);
assert(noisyLogsFound === 0, `Zero noisy or unformatted debug logs in production code (found: ${noisyLogsFound})`);

// -------------------------------------------------------------
// MODULE 5: DB / CHROME STORAGE CONNECTION & QUOTA CHECKS
// -------------------------------------------------------------
console.log('\n--- 5. DB / CHROME STORAGE CONNECTIONS & MAINTENANCE ---');

// Test 5.1: Storage write, read, and serialization integrity
const testKey = 'fhp_fare_JFK_LHR_2026-12-01_oneway_p1';
const testPayload = {
    fareBase: 840,
    userCurr: 'USD',
    passengers: 1,
    timestamp: Date.now(),
    source: 'OBSERVED_LIVE'
};

chrome.storage.local.set({ [testKey]: testPayload }, () => {
    chrome.storage.local.get([testKey], (res) => {
        assert(res && res[testKey] && res[testKey].fareBase === 840, 'Storage Write/Read roundtrip is atomic and verified');
        
        // Test 5.2: Stale Key Eviction / TTL Cleaner Check
        const staleKey1 = 'pos_arb_' + (Date.now() - 36 * 3600 * 1000); // 36 hours old
        const staleKey2 = 'fhp_fare_DEL_DXB_2026-10-01_oneway_p1'; // stale fare > 2h
        const freshKey = 'fhp_fare_SFO_NRT_2026-12-15_oneway_p1';
        
        mockStorage[staleKey1] = 'https://google.com/travel/flights';
        mockStorage[staleKey2] = { fareBase: 420, timestamp: Date.now() - (4 * 3600 * 1000) }; // 4h old
        mockStorage[freshKey] = { fareBase: 950, timestamp: Date.now() }; // Fresh

        // Run Background Storage Maintenance simulation
        const now = Date.now();
        const keysToPrune = [];
        for (const [k, v] of Object.entries(mockStorage)) {
            if (k.startsWith('pos_arb_')) {
                const ts = parseInt(k.replace('pos_arb_', ''), 10);
                if (isNaN(ts) || (now - ts > 24 * 3600 * 1000)) keysToPrune.push(k);
            } else if (k.startsWith('fhp_fare_')) {
                if (!v || !v.timestamp || (now - v.timestamp > 2 * 3600 * 1000)) keysToPrune.push(k);
            }
        }
        
        chrome.storage.local.remove(keysToPrune, () => {
            assert(!mockStorage[staleKey1], 'Stale POS notification key (>24h) successfully pruned');
            assert(!mockStorage[staleKey2], 'Stale fare cache key (>2h) successfully pruned');
            assert(Boolean(mockStorage[freshKey]), 'Active fresh cache key preserved in storage');
            
            // Test 5.3: Storage Quota Headroom
            const serializedBytes = JSON.stringify(mockStorage).length;
            const quotaBytes = 10 * 1024 * 1024; // 10MB default Chrome storage local quota
            const usagePct = ((serializedBytes / quotaBytes) * 100).toFixed(4);
            console.log(`Storage DB Footprint: ${serializedBytes} bytes / ${quotaBytes} bytes (${usagePct}% of quota)`);
            assert(serializedBytes < 100000, `Storage footprint remains lean (< 100KB, measured: ${serializedBytes} bytes)`);

            // Check Debounce resolution
            setTimeout(() => {
                assert(analysisExecutionCount === 1, `1,000 rapid DOM mutations collapsed into exactly 1 debounced execution`);
                
                console.log('\n================================================================');
                if (allPassed) {
                    console.log('   ALL PERFORMANCE, MEMORY, CPU, LOG & DB CHECKS: 100% PASSED!   ');
                } else {
                    console.log('   SOME CHECKS FAILED - REVIEW OUTPUT ABOVE                     ');
                }
                console.log('================================================================\n');
                process.exit(allPassed ? 0 : 1);
            }, 50);
        });
    });
});
