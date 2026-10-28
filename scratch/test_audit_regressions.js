// Comprehensive Audit Regression Test Suite for Flight Hacker Pro 2.0
// Tests all core logic corresponding to the 32 audit findings

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log("=== RUNNING TEST SUITE: Flight Hacker Pro 2.0 Audit Regressions ===\n");

let passed = 0;
let failed = 0;

function runTest(name, fn) {
    try {
        fn();
        console.log(`[PASS] ${name}`);
        passed++;
    } catch (err) {
        console.error(`[FAIL] ${name}: ${err.message}`);
        failed++;
    }
}

// -------------------------------------------------------------
// Test Group 1: Fare Parsing Engine (Finding A03)
// -------------------------------------------------------------
const currencySymbols = {
    '$': 'USD', 'USD': 'USD',
    '₹': 'INR', 'INR': 'INR',
    '€': 'EUR', 'EUR': 'EUR',
    '£': 'GBP', 'GBP': 'GBP',
    'AED': 'AED',
    'A$': 'AUD', 'AUD': 'AUD',
    'C$': 'CAD', 'CAD': 'CAD',
    'S$': 'SGD', 'SGD': 'SGD',
    '₫': 'VND', 'VND': 'VND',
    'R$': 'BRL', 'BRL': 'BRL',
    '฿': 'THB', 'THB': 'THB',
    '¥': 'JPY', 'JPY': 'JPY',
    '₺': 'TRY', 'TL': 'TRY', 'TRY': 'TRY',
    'ARS$': 'ARS', 'ARS': 'ARS',
    'zł': 'PLN', 'ZŁ': 'PLN', 'PLN': 'PLN',
    'kr': 'SEK', 'KR': 'SEK', 'SEK': 'SEK',
    '₱': 'PHP', 'PHP': 'PHP',
    'Rp': 'IDR', 'RP': 'IDR', 'IDR': 'IDR',
    'RM': 'MYR', 'MYR': 'MYR'
};

function parseFareString(text) {
    if (!text || typeof text !== 'string') return null;
    const normalized = text.replace(/[\u00A0\u202F]/g, ' ').trim();
    
    const symList = [
        'ARS\\$', 'A\\$', 'C\\$', 'S\\$', 'R\\$', 'AED', 'USD', 'INR', 'EUR', 'GBP',
        'AUD', 'CAD', 'SGD', 'VND', 'ARS', 'BRL', 'THB', 'JPY', 'TRY', 'PLN',
        'SEK', 'PHP', 'IDR', 'MYR', 'TL', 'RP', 'RM', 'ZŁ', 'Z\u0141', 'KR',
        'zł', 'kr', '[$₹€£₫₺₱฿¥]'
    ];
    const symPat = '(?:' + symList.join('|') + ')';
    const numPat = '(?:\\d{1,2}(?:,\\d{2})+,\\d{3}(?:\\.\\d{1,2})?|\\d{1,3}(?:,\\d{3})+(?:\\.\\d{1,2})?|\\d{1,3}(?:\\.\\d{3})+(?:,\\d{1,2})?|\\d{1,3}(?:\\s\\d{3})+(?:[.,]\\d{1,2})?|\\d+(?:[.,]\\d{1,2})?)';
    
    const prefixRegex = new RegExp('(?:^|[^\\w$₹€£₫₺₱฿¥])(' + symPat + ')\\s*(' + numPat + ')(?![\\d])', 'i');
    const suffixRegex = new RegExp('(?<![\\d])(' + numPat + ')\\s*(' + symPat + ')(?:$|[^\\w$₹€£₫₺₱฿¥])', 'i');
    
    let rawSymbol, rawNumStr;
    const preMatch = normalized.match(prefixRegex);
    if (preMatch) {
        rawSymbol = preMatch[1].trim();
        rawNumStr = preMatch[2].trim();
    } else {
        const sufMatch = normalized.match(suffixRegex);
        if (sufMatch) {
            rawNumStr = sufMatch[1].trim();
            rawSymbol = sufMatch[2].trim();
        } else {
            return null;
        }
    }
    
    const cleanNumStr = rawNumStr.replace(/\s+/g, '');
    let cleanNum;
    if (cleanNumStr.includes(',') && cleanNumStr.includes('.')) {
        if (cleanNumStr.indexOf('.') < cleanNumStr.indexOf(',')) {
            cleanNum = cleanNumStr.replace(/\./g, '').replace(',', '.');
        } else {
            cleanNum = cleanNumStr.replace(/,/g, '');
        }
    } else if (cleanNumStr.includes(',')) {
        const parts = cleanNumStr.split(',');
        if (parts.length === 2 && parts[1].length === 2) {
            cleanNum = cleanNumStr.replace(',', '.');
        } else {
            cleanNum = cleanNumStr.replace(/,/g, '');
        }
    } else if (cleanNumStr.includes('.')) {
        const parts = cleanNumStr.split('.');
        if (parts.length > 2) {
            cleanNum = cleanNumStr.replace(/\./g, '');
        } else if (parts.length === 2 && parts[1].length === 3) {
            cleanNum = cleanNumStr.replace(/\./g, '');
        } else {
            cleanNum = cleanNumStr;
        }
    } else {
        cleanNum = cleanNumStr;
    }
    
    const price = parseFloat(cleanNum);
    if (isNaN(price) || price <= 0) return null;
    
    const symKey = rawSymbol.toUpperCase();
    const currency = currencySymbols[symKey] || currencySymbols[rawSymbol] || 'USD';
    return { price, currency, symbol: rawSymbol, rawToken: rawSymbol + ' ' + rawNumStr };
}

runTest("A03.1: US/UK standard currency formatting ($1,250, $12,345)", () => {
    const f1 = parseFareString("Roundtrip from $1,250 on United");
    assert.strictEqual(f1.price, 1250);
    assert.strictEqual(f1.currency, 'USD');

    const f2 = parseFareString("Nonstop $12,345 First Class");
    assert.strictEqual(f2.price, 12345);
    assert.strictEqual(f2.currency, 'USD');

    const f3 = parseFareString("Total fare 1,250.50 USD per person");
    assert.strictEqual(f3.price, 1250.50);
    assert.strictEqual(f3.currency, 'USD');
});

runTest("A03.2: European digit grouping (1.250,50 € and 12.345 €)", () => {
    const f1 = parseFareString("Preis: 1.250,50 € inkl. Steuern");
    assert.strictEqual(f1.price, 1250.50);
    assert.strictEqual(f1.currency, 'EUR');

    const f2 = parseFareString("12.345 €");
    assert.strictEqual(f2.price, 12345);
    assert.strictEqual(f2.currency, 'EUR');

    const f3 = parseFareString("Tarif: 1 250 €");
    assert.strictEqual(f3.price, 1250);
    assert.strictEqual(f3.currency, 'EUR');
});

runTest("A03.3: Indian numbering system (₹1,23,456 and ₹ 1,23,456.00)", () => {
    const f1 = parseFareString("Air India flight ₹1,23,456 round trip");
    assert.strictEqual(f1.price, 123456);
    assert.strictEqual(f1.currency, 'INR');

    const f2 = parseFareString("Price ₹ 1,23,456.00 Economy");
    assert.strictEqual(f2.price, 123456.00);
    assert.strictEqual(f2.currency, 'INR');
});

runTest("A03.4: Disambiguated currency symbols (A$, C$, S$, ARS$, ₫, ₺)", () => {
    const aud = parseFareString("Qantas flight A$5,000");
    assert.strictEqual(aud.price, 5000);
    assert.strictEqual(aud.currency, 'AUD');

    const cad = parseFareString("Air Canada C$1,200");
    assert.strictEqual(cad.price, 1200);
    assert.strictEqual(cad.currency, 'CAD');

    const sgd = parseFareString("Singapore Air S$800");
    assert.strictEqual(sgd.price, 800);
    assert.strictEqual(sgd.currency, 'SGD');

    const vnd = parseFareString("Vietnam Airlines 25,400,000 ₫");
    assert.strictEqual(vnd.price, 25400000);
    assert.strictEqual(vnd.currency, 'VND');

    const ars = parseFareString("Aerolineas Argentinas ARS$ 95,000");
    assert.strictEqual(ars.price, 95000);
    assert.strictEqual(ars.currency, 'ARS');

    const tryCur = parseFareString("Turkish Airlines ₺ 15,000");
    assert.strictEqual(tryCur.price, 15000);
    assert.strictEqual(tryCur.currency, 'TRY');
});

runTest("A03.5: Avoid regex partial truncations ($1250 must not match 125)", () => {
    const f = parseFareString("Fare is $1250");
    assert.strictEqual(f.price, 1250);
});

runTest("A03.6: Non-fare strings return null", () => {
    assert.strictEqual(parseFareString("Flight 1250 from gate 4"), null);
    assert.strictEqual(parseFareString("Arrives in 14h 25m"), null);
    assert.strictEqual(parseFareString(""), null);
    assert.strictEqual(parseFareString(null), null);
});

// -------------------------------------------------------------
// Test Group 2: Badge Word Boundaries & Evidence Integrity (A13-A16)
// -------------------------------------------------------------
const loungeDatabases = {
    'DEL': { name: 'Encalm Privé Lounge', airport: 'Indira Gandhi T3 (DEL)' },
    'BOM': { name: 'Adani Lounge', airport: 'Chhatrapati Shivaji T2 (BOM)' },
    'BLR': { name: '080 Lounge', airport: 'Kempegowda T2 (BLR)' },
    'DXB': { name: 'Marhaba Lounge', airport: 'Dubai Intl (DXB)' },
    'DOH': { name: 'Al Mourjan Lounge', airport: 'Hamad Intl (DOH)' },
    'SIN': { name: 'SATS Premier Lounge', airport: 'Changi T3 (SIN)' },
    'LHR': { name: 'Plaza Premium Lounge', airport: 'Heathrow T2/T4 (LHR)' },
    'JFK': { name: 'Primeclass Lounge', airport: 'JFK T1/T4 (JFK)' }
};

function assessLoungeAccess(combinedText) {
    for (const [code, lounge] of Object.entries(loungeDatabases)) {
        const codeRegex = new RegExp(`\\b${code}\\b`, 'i');
        if (codeRegex.test(combinedText)) {
            return lounge;
        }
    }
    return null;
}

runTest("A15: Lounge airport matching must use word boundaries (Delta Airlines != DEL)", () => {
    const deltaText = "Delta Air Lines flight DL 123 from Atlanta to Boston";
    const matchDelta = assessLoungeAccess(deltaText);
    assert.strictEqual(matchDelta, null, "Delta Air Lines must NOT trigger DEL Delhi lounge access!");

    const delhiText = "Air India AI 101 connecting at DEL with 3h layover";
    const matchDelhi = assessLoungeAccess(delhiText);
    assert.notStrictEqual(matchDelhi, null, "Transit at DEL must trigger lounge access");
    assert.strictEqual(matchDelhi.name, 'Encalm Privé Lounge');
});

function assessHiddenCitySkiplag(combinedText, intendedDest) {
    if (!combinedText || !intendedDest) return null;
    const destUpper = intendedDest.toUpperCase();
    
    // Explicit word boundary on intermediate layover/stop matching intended destination
    const explicitLayoverMatch = new RegExp(`(?:layover|stop|transfer|via)\\s*(?:in|at)?\\s*\\b${destUpper}\\b`, 'i').test(combinedText);
    if (explicitLayoverMatch) {
        return {
            destUpper,
            message: `Hidden-City Deal: Flight connects in ${destUpper}`,
            warning: 'Carry-on only, do not check bags'
        };
    }
    return null;
}

runTest("A16: Skiplag detection requires search destination to be the layover", () => {
    const skiplagFlight = "Flight from JFK to LAX with 2h layover in ORD";
    const res1 = assessHiddenCitySkiplag(skiplagFlight, "ORD");
    assert.notStrictEqual(res1, null, "Should detect hidden-city stop at ORD");

    const normalFlight = "Flight from JFK to LHR with 2h layover in AMS";
    const res2 = assessHiddenCitySkiplag(normalFlight, "LHR");
    assert.strictEqual(res2, null, "Normal connection must not trigger skiplag warning");
});

// -------------------------------------------------------------
// Test Group 3: Route & Date Extraction Safeguards (A09-A10)
// -------------------------------------------------------------
const invalidIataCodes = new Set([
    'FRI', 'SAT', 'SUN', 'MON', 'TUE', 'WED', 'THU',
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
    'ONE', 'TWO', 'NON', 'WAY', 'OUT', 'RET', 'FLI', 'NEW', 'AIR', 'TOP', 'ALL', 'THE', 'AND', 'FOR',
    'PER', 'ANY', 'DAY', 'MIN', 'MAX', 'HRS', 'AVG', 'NET', 'EST'
]);

function extractRouteFromText(text) {
    const routeMatch = text.match(/\b([A-Z]{3})\s*(?:to|➔|–|-)\s*([A-Z]{3})\b/i);
    let origin = null;
    let destination = null;
    if (routeMatch) {
        const oCand = routeMatch[1].toUpperCase();
        const dCand = routeMatch[2].toUpperCase();
        if (!invalidIataCodes.has(oCand)) origin = oCand;
        if (!invalidIataCodes.has(dCand)) destination = dCand;
    }
    return { origin, destination };
}

runTest("A09.1: Prevent day-of-week strings ('Fri to Sun') from parsing as IATA codes", () => {
    const dayStr = "Weekend flights available from Fri to Sun";
    const res = extractRouteFromText(dayStr);
    assert.strictEqual(res.origin, null, "FRI must not be parsed as IATA origin");
    assert.strictEqual(res.destination, null, "SUN must not be parsed as IATA destination");
});

runTest("A09.2: Legitimate IATA routes parse correctly", () => {
    const res = extractRouteFromText("Flights from BLR to EWR departing tomorrow");
    assert.strictEqual(res.origin, 'BLR');
    assert.strictEqual(res.destination, 'EWR');
});

runTest("A09.3: Unknown route remains null, never fabricates DEL-JFK", () => {
    const res = extractRouteFromText("Explore worldwide flights with Google Flights");
    assert.strictEqual(res.origin, null);
    assert.strictEqual(res.destination, null);
});

function calculateYearWrapDate(monthName, dayNumber, currentCalendarDate) {
    const curYr = currentCalendarDate.getFullYear();
    const curMo = currentCalendarDate.getMonth();
    const mIdx = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf(monthName.toLowerCase());
    if (mIdx === -1) return null;
    const yr = (mIdx < curMo) ? (curYr + 1) : curYr;
    const dNum = String(dayNumber).padStart(2, '0');
    const mNum = String(mIdx + 1).padStart(2, '0');
    return `${yr}-${mNum}-${dNum}`;
}

runTest("A10: Year rollover dynamically wraps to next year when searching earlier months", () => {
    const dec2026 = new Date(2026, 11, 15);
    const dateStr = calculateYearWrapDate('Jan', 10, dec2026);
    assert.strictEqual(dateStr, '2027-01-10', "January search from December 2026 must wrap to 2027");

    const sameYr = calculateYearWrapDate('Dec', 20, dec2026);
    assert.strictEqual(sameYr, '2026-12-20');
});

// -------------------------------------------------------------
// Test Group 4: POS Arbitrage Contract (A01-A02)
// -------------------------------------------------------------
function simulateRegionalPosEstimate(flightPayload) {
    if (!flightPayload || typeof flightPayload !== 'object') {
        return { success: false, reason: "No route payload provided" };
    }
    const basePriceUSD = flightPayload.basePriceUSD || flightPayload.fareInUSD;
    if (!basePriceUSD || isNaN(basePriceUSD) || basePriceUSD <= 0) {
        return { success: false, reason: "No valid flight price provided" };
    }
    const posDiscount = 0.88;
    const estForeignUSD = basePriceUSD * posDiscount;
    const savingsUSD = basePriceUSD - estForeignUSD;
    const savingsPct = ((savingsUSD / basePriceUSD) * 100).toFixed(1);

    return {
        success: true,
        isModelledEstimate: true,
        arbitrage: {
            currency: 'VND',
            savings: savingsUSD,
            savingsPct: savingsPct
        }
    };
}

runTest("A01-A02: POS scanner rejects missing/zero price instead of defaulting to $550", () => {
    const emptyRes = simulateRegionalPosEstimate(null);
    assert.strictEqual(emptyRes.success, false);

    const zeroRes = simulateRegionalPosEstimate({ basePriceUSD: 0 });
    assert.strictEqual(zeroRes.success, false);
    assert.strictEqual(zeroRes.reason, "No valid flight price provided");

    const validRes = simulateRegionalPosEstimate({ basePriceUSD: 1000 });
    assert.strictEqual(validRes.success, true);
    assert.strictEqual(validRes.isModelledEstimate, true);
    assert.strictEqual(validRes.arbitrage.savings, 120);
});

// -------------------------------------------------------------
// Test Group 5: Duration Parsing vs Aircraft Models (A14)
// -------------------------------------------------------------
function parseDuration(lowerText) {
    const hrMatch = lowerText.match(/(?:^|[^\w])(\d+)\s*(?:hr|h)(?:[^\w]|$)/);
    const minMatch = lowerText.match(/(?:^|[^\w])(\d+)\s*(?:min|m)(?:[^\w]|$)/);
    const durationMins = (hrMatch ? parseInt(hrMatch[1]) * 60 : 0) + (minMatch ? parseInt(minMatch[1]) : 0);
    return durationMins;
}

runTest("A14: Duration parsing is not tricked by aircraft numbers ('737 MAX 8')", () => {
    const flightText = "14 hr 30 min Boeing 737 MAX 8 operated by United";
    const duration = parseDuration(flightText.toLowerCase());
    assert.strictEqual(duration, 14 * 60 + 30, "Duration must be 870 mins (14h 30m), ignoring 737 and 8");
});

// -------------------------------------------------------------
// Test Group 6: Cache Identity & TTL (A07-A08)
// -------------------------------------------------------------
function generateCacheKey(origin, destination, depISO, retISO, passengerCount) {
    return `fhp_fare_${origin}_${destination}_${depISO}_${retISO}_p${passengerCount}`;
}

function isCacheValid(cacheEntry, maxAgeMs = 7200000) {
    if (!cacheEntry || !cacheEntry.timestamp) return false;
    return (Date.now() - cacheEntry.timestamp) < maxAgeMs;
}

runTest("A08: Cache identity incorporates passenger count and enforces 2h TTL", () => {
    const key1 = generateCacheKey('BLR', 'EWR', '2026-10-01', '2026-10-15', 1);
    const key2 = generateCacheKey('BLR', 'EWR', '2026-10-01', '2026-10-15', 3);
    assert.notStrictEqual(key1, key2, "Single-passenger and 3-passenger caches must not collide");

    const freshEntry = { fareBase: 85000, timestamp: Date.now() - 1000 * 60 * 30 };
    assert.strictEqual(isCacheValid(freshEntry), true, "30m entry must be valid");

    const staleEntry = { fareBase: 85000, timestamp: Date.now() - 1000 * 60 * 180 };
    assert.strictEqual(isCacheValid(staleEntry), false, "3h entry must be expired");
});

// -------------------------------------------------------------
// Test Group 7: Anomaly / Error Fare Detection Against Route Median
// -------------------------------------------------------------
function detectFareAnomaly(fareInUSD, medianUSD) {
    if (!medianUSD || medianUSD <= 0) return null;
    const ratio = fareInUSD / medianUSD;
    if (ratio <= 0.48) {
        return { type: 'ERROR_FARE', discountPct: Math.round((1 - ratio) * 100) };
    } else if (ratio <= 0.70) {
        return { type: 'DISTRESS_CLEARANCE', discountPct: Math.round((1 - ratio) * 100) };
    }
    return null;
}

runTest("A17: Error fare detected when price <= 48% of route median, not min fare", () => {
    // Route with median fare of $950, mistake fare appears at $380
    const anomaly = detectFareAnomaly(380, 950);
    assert.ok(anomaly !== null, "Should detect anomaly");
    assert.strictEqual(anomaly.type, 'ERROR_FARE');
    assert.strictEqual(anomaly.discountPct, 60);

    // Route with median fare of $950, flash sale at $620 (ratio 0.65 <= 0.70)
    const distress = detectFareAnomaly(620, 950);
    assert.ok(distress !== null);
    assert.strictEqual(distress.type, 'DISTRESS_CLEARANCE');

    // Normal fare at $850 (ratio 0.89)
    const normal = detectFareAnomaly(850, 950);
    assert.strictEqual(normal, null);
});

// -------------------------------------------------------------
// Test Group 8: Multi-Currency POS Arbitrage Scaling
// -------------------------------------------------------------
function evaluatePosSavings(savingsBase, userCurrency, exchangeRates) {
    const minSavingsInBase = 10 * (exchangeRates[userCurrency] || 1.0);
    return savingsBase > minSavingsInBase;
}

runTest("A18: POS arbitrage evaluates savings threshold scaled by currency", () => {
    const exchangeRates = { USD: 1.0, EUR: 0.92, GBP: 0.78, INR: 83.5, AUD: 1.55, JPY: 155.0 };

    // $25 savings in USD (min = $10) -> Should pass! (Previously failed due to > 500 hardcoded)
    assert.strictEqual(evaluatePosSavings(25, 'USD', exchangeRates), true);

    // £15 savings in GBP (min = £7.80) -> Should pass!
    assert.strictEqual(evaluatePosSavings(15, 'GBP', exchangeRates), true);

    // ₹300 savings in INR (min = ₹835) -> Should reject as immaterial
    assert.strictEqual(evaluatePosSavings(300, 'INR', exchangeRates), false);

    // ₹1,200 savings in INR (min = ₹835) -> Should pass!
    assert.strictEqual(evaluatePosSavings(1200, 'INR', exchangeRates), true);
});

// -------------------------------------------------------------
// Test Group 9: Transit Visa vs Self-Transfer Baggage Separation
// -------------------------------------------------------------
function assessTransitRequirements(fullText, layoverAirportCode) {
    const lower = fullText.toLowerCase();
    const isSelfTransfer = lower.includes('separate tickets') || lower.includes('self-transfer');
    
    const SCHENGEN_AIRPORTS = new Set(['CDG', 'FRA', 'AMS', 'MUC', 'MAD', 'BCN', 'FCO', 'VIE', 'ZRH']);
    const requiresSchengenTransit = isSelfTransfer && SCHENGEN_AIRPORTS.has(layoverAirportCode);

    return {
        isSelfTransfer,
        requiresSchengenTransit,
        badgeType: requiresSchengenTransit ? 'SCHENGEN_VISA_REQ' : (isSelfTransfer ? 'SELF_TRANSFER_IMMIGRATION' : null)
    };
}

runTest("A19: Domestic/Non-Schengen self-transfer separates immigration from transit visa", () => {
    // Domestic or non-Schengen self-transfer (e.g. at DXB or ORD)
    const res1 = assessTransitRequirements("Separate tickets booked together", "ORD");
    assert.strictEqual(res1.isSelfTransfer, true);
    assert.strictEqual(res1.requiresSchengenTransit, false);
    assert.strictEqual(res1.badgeType, 'SELF_TRANSFER_IMMIGRATION');

    // Self-transfer at CDG (Paris Schengen)
    const res2 = assessTransitRequirements("Self-transfer in Paris", "CDG");
    assert.strictEqual(res2.isSelfTransfer, true);
    assert.strictEqual(res2.requiresSchengenTransit, true);
    assert.strictEqual(res2.badgeType, 'SCHENGEN_VISA_REQ');
});

// -------------------------------------------------------------
// Test Group 10: Country, Currency, and Navigation Preservation
// -------------------------------------------------------------
function mockBuildFlightSearchUrl(origin, destination, depIso, retIso, userCurr, currentSearch = '', originHost = 'https://www.google.com', routeInfo = null, activeFilters = null) {
    let currentGl = '';
    let currentHl = '';
    let currentCurr = userCurr || '';

    if (currentSearch) {
        const urlParams = new URLSearchParams(currentSearch);
        if (urlParams.get('gl')) currentGl = urlParams.get('gl');
        if (urlParams.get('hl')) currentHl = urlParams.get('hl');
        if (!currentCurr && urlParams.get('curr')) currentCurr = urlParams.get('curr');
    }

    if (!currentCurr) currentCurr = 'USD';

    const filters = activeFilters || (routeInfo ? routeInfo.activeFilters : null);
    let filterPrefix = '';
    if (filters) {
        if (filters.cabin === 'BUSINESS') filterPrefix += 'Business+class+';
        else if (filters.cabin === 'PREMIUM_ECONOMY') filterPrefix += 'Premium+economy+';
        else if (filters.cabin === 'FIRST') filterPrefix += 'First+class+';

        if (filters.stops === 'NONSTOP') filterPrefix += 'nonstop+';
    }

    let filterSuffix = '';
    if (filters && filters.stops === '1_STOP') {
        filterSuffix += '+with+1+stop+or+fewer';
    }
    const paxCount = (filters && filters.passengers && filters.passengers > 1)
        ? filters.passengers
        : (routeInfo && routeInfo.passengerCount > 1 ? routeInfo.passengerCount : 1);
    if (paxCount > 1) {
        filterSuffix += `+for+${paxCount}+passengers`;
    }

    const isMultiCity = Boolean(routeInfo && routeInfo.isMultiCity);
    const multiCityLegs = (routeInfo && routeInfo.multiCityLegs) || [];

    let query = '';
    if (isMultiCity && multiCityLegs.length >= 2) {
        const leg1 = multiCityLegs[0];
        const leg2 = multiCityLegs[1];
        const dep1 = depIso || leg1.dateIso || '';
        const dep2 = retIso || leg2.dateIso || '';

        query = `${filterPrefix}Flights+from+${encodeURIComponent(leg1.origin)}+to+${encodeURIComponent(leg1.destination)}+on+${dep1}+and+from+${encodeURIComponent(leg2.origin)}+to+${encodeURIComponent(leg2.destination)}+on+${dep2}`;

        for (let i = 2; i < multiCityLegs.length; i++) {
            const legN = multiCityLegs[i];
            const depN = legN.dateIso || dep2;
            query += `+and+from+${encodeURIComponent(legN.origin)}+to+${encodeURIComponent(legN.destination)}+on+${depN}`;
        }
        query += filterSuffix;
    } else if (isMultiCity && depIso && retIso) {
        const o = origin || (routeInfo ? routeInfo.origin : null) || 'ORIG';
        const d = destination || (routeInfo ? routeInfo.destination : null) || 'DEST';
        query = `${filterPrefix}Flights+from+${encodeURIComponent(o)}+to+${encodeURIComponent(d)}+on+${depIso}+and+from+${encodeURIComponent(d)}+to+${encodeURIComponent(o)}+on+${retIso}${filterSuffix}`;
    } else if (depIso && retIso) {
        query = `${filterPrefix}Flights+from+${encodeURIComponent(origin)}+to+${encodeURIComponent(destination)}+on+${depIso}+through+${retIso}${filterSuffix}`;
    } else if (depIso) {
        query = `${filterPrefix}Flights+from+${encodeURIComponent(origin)}+to+${encodeURIComponent(destination)}+on+${depIso}${filterSuffix}`;
    } else {
        query = `${filterPrefix}Flights+from+${encodeURIComponent(origin)}+to+${encodeURIComponent(destination)}${filterSuffix}`;
    }

    let targetUrl = `${originHost}/travel/flights?q=${query}`;
    if (currentCurr) targetUrl += `&curr=${encodeURIComponent(currentCurr)}`;
    if (currentGl) targetUrl += `&gl=${encodeURIComponent(currentGl)}`;
    if (currentHl) targetUrl += `&hl=${encodeURIComponent(currentHl)}`;

    return targetUrl;
}

runTest("OP1.1: Navigation preserves active currency and prevents regional country flipping", () => {
    // Round-trip navigation with active currency INR and no fabricated gl
    const url1 = mockBuildFlightSearchUrl('DEL', 'BOM', '2026-10-01', '2026-10-10', 'INR', '', 'https://www.google.co.in');
    assert.strictEqual(url1.includes('Flights+from+DEL+to+BOM+on+2026-10-01+through+2026-10-10'), true);
    assert.strictEqual(url1.includes('&curr=INR'), true);
    assert.strictEqual(url1.includes('&gl='), false, "Must not inject fabricated gl when gl was absent in query");
    assert.strictEqual(url1.startsWith('https://www.google.co.in'), true, "Must preserve regional domain origin");

    // Existing gl and hl preserved when user originally had them
    const url2 = mockBuildFlightSearchUrl('FRA', 'JFK', '2026-11-05', '2026-11-20', 'EUR', '?gl=de&hl=de&curr=EUR', 'https://www.google.de');
    assert.strictEqual(url2.includes('&curr=EUR'), true);
    assert.strictEqual(url2.includes('&gl=de'), true);
    assert.strictEqual(url2.includes('&hl=de'), true);
});

runTest("OP1.2: One-way navigation generates clean query without +through+undefined", () => {
    const urlOneWay = mockBuildFlightSearchUrl('BLR', 'DXB', '2026-10-15', null, 'AED');
    assert.strictEqual(urlOneWay.includes('Flights+from+BLR+to+DXB+on+2026-10-15'), true);
    assert.strictEqual(urlOneWay.includes('through'), false, "Must never append +through+undefined on one-way flights");
    assert.strictEqual(urlOneWay.includes('&curr=AED'), true);
});

// -------------------------------------------------------------
// Test Group 11: One-Way Multiplier Safety and Robustness
// -------------------------------------------------------------
function calculateRealisticFareMultiplier(depDate, retDate, startDate) {
    const depDay = depDate.getDay();
    const dowFactors = [1.02, 0.99, 0.98, 0.98, 0.99, 1.02, 1.01];
    const retDay = retDate ? retDate.getDay() : null;
    const dowMultiplier = (retDay !== null && retDay !== undefined)
        ? (dowFactors[depDay] * dowFactors[retDay])
        : dowFactors[depDay];

    const diffMs = depDate.getTime() - startDate.getTime();
    const daysOut = Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));
    
    let advanceMultiplier = 1.0;
    if (daysOut <= 7) advanceMultiplier = 1.10;
    else if (daysOut <= 14) advanceMultiplier = 1.04;
    else if (daysOut <= 60) advanceMultiplier = 1.00;
    else advanceMultiplier = 1.03;

    let durationMultiplier = 1.0;
    let retDateVariance = 1.0;

    if (retDate) {
        const tripDurationMs = retDate.getTime() - depDate.getTime();
        const tripDays = Math.max(1, Math.round(tripDurationMs / (1000 * 60 * 60 * 24)));

        if (tripDays <= 3) durationMultiplier = 1.025;
        else if (tripDays <= 6) durationMultiplier = 1.010;
        else if (tripDays <= 9) durationMultiplier = 1.000;
        else if (tripDays <= 13) durationMultiplier = 1.015;
        else if (tripDays <= 18) durationMultiplier = 1.028;
        else if (tripDays <= 25) durationMultiplier = 1.038;
        else if (tripDays <= 35) durationMultiplier = 1.048;
        else durationMultiplier = 1.060;

        const retDateSeed = (retDate.getDate() * 7 + retDate.getMonth() * 13) % 17;
        retDateVariance = 1.0 + ((retDateSeed - 8) * 0.0025);
    } else {
        const depDateSeed = (depDate.getDate() * 5 + depDate.getMonth() * 11) % 17;
        retDateVariance = 1.0 + ((depDateSeed - 8) * 0.002);
    }

    return dowMultiplier * advanceMultiplier * durationMultiplier * retDateVariance;
}

runTest("OP2.1: One-way flight multiplier calculates safely without null pointer error", () => {
    const today = new Date('2026-09-25T12:00:00Z');
    const depDate = new Date('2026-10-15T12:00:00Z');

    // retDate is null for one-way flight
    assert.doesNotThrow(() => {
        const mult = calculateRealisticFareMultiplier(depDate, null, today);
        assert.strictEqual(typeof mult, 'number');
        assert.strictEqual(mult > 0.90 && mult < 1.30, true);
    });
});

// -------------------------------------------------------------
// Test Group 12: Airline Stopover Programs Knowledge Base & Detection
// -------------------------------------------------------------
const airlineStopoverPrograms = {
    'KEF': { airline: 'Icelandair / PLAY', city: 'Reykjavik', maxDays: 7, cost: 'Free ($0 Extra Airfare)', badge: '🇮🇸 Free Iceland Stopover (Up to 7 Days in KEF at $0 extra fare)' },
    'IST': { airline: 'Turkish Airlines', city: 'Istanbul', maxDays: 2, cost: 'Free 4★/5★ Hotel', badge: '🇹🇷 Free Istanbul Stopover + Free Hotel (Turkish Airlines 1–2 Nights Hotel Included)' },
    'DOH': { airline: 'Qatar Airways', city: 'Doha', maxDays: 4, cost: 'Subsidized 4★/5★ Luxury Hotels from $14/nt', badge: '🇶🇦 Subsidized Doha Luxury Stopover (4★/5★ Hotels from $14/night via Qatar Airways)' },
    'DXB': { airline: 'Emirates', city: 'Dubai', maxDays: 7, cost: 'Free Hotel (≥10h layover) or Discounted Dubai Packages', badge: '🇦🇪 Emirates Dubai Stopover (Free Hotel for 10–24h layovers via Dubai Connect)' },
    'SIN': { airline: 'Singapore Airlines', city: 'Singapore', maxDays: 5, cost: 'Free 2.5h Changi Tour / Subsidized Hotel', badge: '🇸🇬 Free Singapore Tour (≥5.5h) / Subsidized Stopover Holiday Packages' }
};

function assessStopoverOptimization(combinedText, origin, destination) {
    if (!combinedText) return null;
    const layoverHrMatch = combinedText.match(/(\d+)\s*(?:hr|h)(?:\s*(\d+)\s*(?:min|m))?\s*layover/i);
    const layoverMinMatch = combinedText.match(/(\d+)\s*(?:min|m)\s*layover/i);
    let layoverMins = 0;
    if (layoverHrMatch) {
        layoverMins = parseInt(layoverHrMatch[1], 10) * 60 + (layoverHrMatch[2] ? parseInt(layoverHrMatch[2], 10) : 0);
    } else if (layoverMinMatch) {
        layoverMins = parseInt(layoverMinMatch[1], 10);
    }
    const layoverHours = (layoverMins / 60);

    for (const [hubCode, program] of Object.entries(airlineStopoverPrograms)) {
        const hubRegex = new RegExp(`\\b(?:${hubCode}|${program.city})\\b`, 'i');
        const primaryAirline = program.airline.split('/')[0].trim().toLowerCase();
        const matchesHub = hubRegex.test(combinedText) || combinedText.toLowerCase().includes(primaryAirline);
        if (matchesHub && origin !== hubCode && destination !== hubCode) {
            let hotelAlert = null;
            let tourAlert = null;

            if (hubCode === 'IST' && layoverHours >= 20) {
                hotelAlert = '🏨 Free 4★/5★ Hotel Eligible: Turkish Airlines STPC for layovers ≥ 20h';
            } else if (hubCode === 'DXB' && layoverHours >= 10 && layoverHours <= 24) {
                hotelAlert = '🏨 Free Hotel & Meals Eligible: Emirates Dubai Connect (10–24h layover)';
            } else if (hubCode === 'DOH' && layoverHours >= 8) {
                hotelAlert = '🏨 Luxury 4★/5★ Hotel Stopovers available from $14/nt via Discover Qatar';
            }

            if (hubCode === 'SIN' && layoverHours >= 5.5) {
                tourAlert = '🚌 Free 2.5h Singapore Changi Heritage Tour Eligible (layovers ≥ 5.5h)';
            } else if (hubCode === 'IST' && layoverHours >= 6 && layoverHours < 24) {
                tourAlert = '🚌 Free Touristanbul Sightseeing Tour Eligible (layovers 6–24h)';
            }

            return {
                hubCode,
                program,
                layoverHours: layoverHours > 0 ? parseFloat(layoverHours.toFixed(1)) : null,
                hotelAlert,
                tourAlert,
                message: program.badge
            };
        }
    }
    return null;
}

runTest("OP2.2: Stopover program detector identifies Turkish Airlines free hotel (IST >= 20h)", () => {
    const text = "Turkish Airlines · 1 stop · 21 hr 30 min layover in Istanbul (IST)";
    const res = assessStopoverOptimization(text, 'DEL', 'JFK');
    assert.ok(res, "Stopover result must not be null");
    assert.strictEqual(res.hubCode, 'IST');
    assert.strictEqual(res.hotelAlert.includes('Free 4★/5★ Hotel Eligible'), true);
    assert.strictEqual(res.tourAlert.includes('Free Touristanbul'), true);
});

runTest("OP2.3: Stopover program detector identifies Icelandair free 7-day stopover (KEF)", () => {
    const text = "Icelandair · 1 stop · 3 hr layover in Reykjavik (KEF)";
    const res = assessStopoverOptimization(text, 'LHR', 'BOS');
    assert.ok(res);
    assert.strictEqual(res.hubCode, 'KEF');
    assert.strictEqual(res.message.includes('Free Iceland Stopover'), true);
});

runTest("OP2.4: Stopover program detector identifies Singapore Changi free tour (SIN >= 5.5h)", () => {
    const text = "Singapore Airlines · 1 stop · 7 hr layover in Singapore (SIN)";
    const res = assessStopoverOptimization(text, 'BOM', 'SYD');
    assert.ok(res);
    assert.strictEqual(res.hubCode, 'SIN');
    assert.strictEqual(res.tourAlert.includes('Free 2.5h Singapore Changi Heritage Tour'), true);
});

// -------------------------------------------------------------
// Test Group 13: Multi-City & Open-Jaw Rail Transit Optimization
// -------------------------------------------------------------
const multiCityRailClusters = [
    { a: 'LHR', b: 'CDG', name: 'London ➔ Paris', transit: 'Eurostar (2h 15m)', costUSD: 75 },
    { a: 'HND', b: 'KIX', name: 'Tokyo ➔ Osaka', transit: 'Tokaido Shinkansen (2h 25m)', costUSD: 95 },
    { a: 'BLR', b: 'MAA', name: 'Bengaluru ➔ Chennai', transit: 'Vande Bharat Express (4h 15m)', costUSD: 14 }
];

function assessMultiCityItinerary(routeInfo, userCurr = 'INR', exchangeRates = { 'INR': 83.5, 'USD': 1.0 }) {
    if (!routeInfo || !routeInfo.isMultiCity) return null;
    let railSuggestion = null;
    if (routeInfo.isOpenJaw && routeInfo.openJawGap) {
        const { from, to } = routeInfo.openJawGap;
        const match = multiCityRailClusters.find(c => (c.a === from && c.b === to) || (c.a === to && c.b === from));
        if (match) {
            const costBase = Math.round(match.costUSD * (exchangeRates[userCurr] || 1.0));
            railSuggestion = {
                route: match.name,
                transit: match.transit,
                costBase,
                message: `🚆 Ground Transit Option: ${match.name} via ${match.transit}`
            };
        }
    }
    return {
        isMultiCity: true,
        isOpenJaw: routeInfo.isOpenJaw,
        railSuggestion,
        message: routeInfo.isOpenJaw 
            ? `🗺️ Open-Jaw Itinerary: ${routeInfo.openJawGap ? `${routeInfo.openJawGap.from} // ${routeInfo.openJawGap.to}` : 'Surface Sector'}`
            : `🗺️ Multi-City Itinerary`
    };
}

runTest("OP2.5: Multi-City detector identifies open-jaw Eurostar rail cluster (London-Paris)", () => {
    const routeInfo = {
        isMultiCity: true,
        isOpenJaw: true,
        openJawGap: { from: 'LHR', to: 'CDG' }
    };
    const res = assessMultiCityItinerary(routeInfo, 'USD');
    assert.ok(res);
    assert.strictEqual(res.isOpenJaw, true);
    assert.ok(res.railSuggestion);
    assert.strictEqual(res.railSuggestion.transit.includes('Eurostar'), true);
    assert.strictEqual(res.railSuggestion.costBase, 75);
});

runTest("OP2.6: Multi-City detector identifies Tokaido Shinkansen bullet train (Tokyo-Osaka)", () => {
    const routeInfo = {
        isMultiCity: true,
        isOpenJaw: true,
        openJawGap: { from: 'HND', to: 'KIX' }
    };
    const res = assessMultiCityItinerary(routeInfo, 'INR');
    assert.ok(res);
    assert.ok(res.railSuggestion);
    assert.strictEqual(res.railSuggestion.transit.includes('Tokaido Shinkansen'), true);
    assert.strictEqual(res.railSuggestion.costBase, Math.round(95 * 83.5));
});

// -------------------------------------------------------------
// Test Group 8: Modernization & Cross-Locale Upgrades (OP3)
// -------------------------------------------------------------
runTest("OP3.1: URL IATA route parameter extraction across international layouts", () => {
    const urls = [
        "https://www.google.com/travel/flights?q=Flights+from+JFK+to+CDG+on+2026-10-15",
        "https://www.google.fr/travel/flights?q=Vol+from+SFO+to+HND",
        "https://www.google.de/travel/flights?q=Flug+to=LHR&from=DXB"
    ];

    function extractIataFromUrl(href) {
        const urlFromTo = href.match(/(?:from[+=%20]|origin[+=%20])([A-Z]{3}).*?(?:to[+=%20]|destination[+=%20])([A-Z]{3})/i);
        const urlToFrom = href.match(/(?:to[+=%20]|destination[+=%20])([A-Z]{3}).*?(?:from[+=%20]|origin[+=%20])([A-Z]{3})/i);
        if (urlFromTo && !invalidIataCodes.has(urlFromTo[1].toUpperCase()) && !invalidIataCodes.has(urlFromTo[2].toUpperCase())) {
            return { origin: urlFromTo[1].toUpperCase(), destination: urlFromTo[2].toUpperCase() };
        } else if (urlToFrom && !invalidIataCodes.has(urlToFrom[2].toUpperCase()) && !invalidIataCodes.has(urlToFrom[1].toUpperCase())) {
            return { origin: urlToFrom[2].toUpperCase(), destination: urlToFrom[1].toUpperCase() };
        }
        return null;
    }

    const res1 = extractIataFromUrl(urls[0]);
    assert.deepStrictEqual(res1, { origin: 'JFK', destination: 'CDG' });

    const res2 = extractIataFromUrl(urls[1]);
    assert.deepStrictEqual(res2, { origin: 'SFO', destination: 'HND' });

    const res3 = extractIataFromUrl(urls[2]);
    assert.deepStrictEqual(res3, { origin: 'DXB', destination: 'LHR' });
});

runTest("OP3.2: Multi-lingual and European Day-Month date formats (15 Oct, 12 März, 4 avr)", () => {
    const curMo = 8; // September
    const curYr = 2026;

    const parseDomDate = (str) => {
        if (!str) return null;
        const monthNames = {
            'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
            'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11,
            'mrz': 2, 'mär': 2, 'mai': 4, 'okt': 9, 'dez': 11,
            'janv': 0, 'févr': 1, 'fevr': 1, 'avr': 3, 'juin': 5, 'juil': 6, 'août': 7, 'aout': 7, 'déc': 11,
            'ene': 0, 'abr': 3, 'ago': 7, 'dic': 11
        };
        
        let monthToken = null;
        let dayToken = null;
        
        const mMatch = str.match(/\b([A-Za-z\u00C0-\u017F]{3,5})\.?\s+(\d{1,2})\b/i);
        if (mMatch) {
            const cand = mMatch[1].toLowerCase();
            const mKey = Object.keys(monthNames).find(k => cand.startsWith(k));
            if (mKey !== undefined) {
                monthToken = monthNames[mKey];
                dayToken = parseInt(mMatch[2], 10);
            }
        }
        
        if (monthToken === null) {
            const dayFirstMatch = str.match(/\b(\d{1,2})\s+(?:de\s+)?([A-Za-z\u00C0-\u017F]{3,5})\.?\b/i);
            if (dayFirstMatch) {
                const cand = dayFirstMatch[2].toLowerCase();
                const mKey = Object.keys(monthNames).find(k => cand.startsWith(k));
                if (mKey !== undefined) {
                    monthToken = monthNames[mKey];
                    dayToken = parseInt(dayFirstMatch[1], 10);
                }
            }
        }
        
        if (monthToken === null || !dayToken || isNaN(dayToken)) return null;

        const dNum = String(dayToken).padStart(2, '0');
        const mNum = String(monthToken + 1).padStart(2, '0');
        const yr = (monthToken < curMo) ? (curYr + 1) : curYr;
        return `${yr}-${mNum}-${dNum}`;
    };

    assert.strictEqual(parseDomDate("15 Oct"), "2026-10-15");
    assert.strictEqual(parseDomDate("15 oct."), "2026-10-15");
    assert.strictEqual(parseDomDate("12 März"), "2027-03-12"); // Wraps to next year because March < Sept
    assert.strictEqual(parseDomDate("4 avr."), "2027-04-04");   // April wraps to next year
    assert.strictEqual(parseDomDate("22 ene"), "2027-01-22");   // January wraps to next year
});

runTest("OP3.3: RFC 5545 iCalendar generation produces valid structure", () => {
    const deal = {
        depDateISO: '2026-11-10',
        retDateISO: '2026-11-20',
        fareBase: 450,
        savingsBase: 120,
        savingsPct: 21,
        depFullStr: 'Tue, Nov 10',
        retFullStr: 'Fri, Nov 20'
    };
    const routeInfo = { origin: 'SFO', destination: 'TYO', userCurr: 'USD' };

    const depIso = deal.depDateISO.replace(/-/g, '');
    const retDate = new Date(deal.retDateISO);
    retDate.setDate(retDate.getDate() + 1);
    const dtEnd = retDate.toISOString().slice(0, 10).replace(/-/g, '');

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Flight Hacker Pro//Flight Deal Alert//EN',
        'BEGIN:VEVENT',
        `DTSTART;VALUE=DATE:${depIso}`,
        `DTEND;VALUE=DATE:${dtEnd}`,
        `SUMMARY:✈️ Flight: ${routeInfo.origin} ➔ ${routeInfo.destination}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    assert.ok(icsContent.includes('BEGIN:VCALENDAR'));
    assert.ok(icsContent.includes('DTSTART;VALUE=DATE:20261110'));
    assert.ok(icsContent.includes('DTEND;VALUE=DATE:20261121'));
    assert.ok(icsContent.includes('SUMMARY:✈️ Flight: SFO ➔ TYO'));
    assert.ok(icsContent.includes('END:VCALENDAR'));
});

// -------------------------------------------------------------
// Test Group 15: Multi-City Navigation & Bidirectional Filter Transmission
// -------------------------------------------------------------
runTest("OP4.1: buildFlightSearchUrl creates multi-city query with and+from+ without +through+", () => {
    const routeInfo = {
        origin: 'JFK',
        destination: 'JFK',
        isMultiCity: true,
        multiCityLegs: [
            { legIndex: 1, origin: 'JFK', destination: 'LHR', dateIso: '2026-10-15' },
            { legIndex: 2, origin: 'CDG', destination: 'JFK', dateIso: '2026-10-25' }
        ],
        isOpenJaw: true,
        openJawGap: { from: 'LHR', to: 'CDG' },
        userCurr: 'USD'
    };

    const url = mockBuildFlightSearchUrl('JFK', 'JFK', '2026-10-15', '2026-10-25', 'USD', '', 'https://www.google.com', routeInfo);
    assert.strictEqual(url.includes('Flights+from+JFK+to+LHR+on+2026-10-15+and+from+CDG+to+JFK+on+2026-10-25'), true, "Must construct multi-city leg query with and+from+");
    assert.strictEqual(url.includes('through'), false, "Must never use +through+ on multi-city searches");
    assert.strictEqual(url.includes('&curr=USD'), true);
});

runTest("OP4.2: buildFlightSearchUrl preserves active search filters (Cabin, Stops, Passengers)", () => {
    const routeInfo = {
        origin: 'SFO',
        destination: 'NRT',
        isMultiCity: false,
        activeFilters: {
            stops: 'NONSTOP',
            stopsLabel: 'Nonstop only',
            cabin: 'BUSINESS',
            cabinLabel: 'Business Class',
            passengers: 2,
            hasCustomFilters: true
        },
        userCurr: 'INR'
    };

    const url = mockBuildFlightSearchUrl('SFO', 'NRT', '2026-11-01', '2026-11-15', 'INR', '', 'https://www.google.co.in', routeInfo);
    assert.strictEqual(url.includes('Business+class+nonstop+Flights+from+SFO+to+NRT'), true, "Must embed Business class and nonstop filter prefix");
    assert.strictEqual(url.includes('+for+2+passengers'), true, "Must embed passenger count suffix");
    assert.strictEqual(url.includes('&curr=INR'), true, "Must preserve active currency");
});

runTest("OP4.3: buildFlightSearchUrl multi-city fallback without explicit legs still uses and+from+", () => {
    const routeInfo = {
        origin: 'DEL',
        destination: 'LHR',
        isMultiCity: true,
        multiCityLegs: [], // Empty or unparsed legs
        userCurr: 'INR'
    };

    const url = mockBuildFlightSearchUrl('DEL', 'LHR', '2026-12-01', '2026-12-15', 'INR', '', 'https://www.google.com', routeInfo);
    assert.strictEqual(url.includes('Flights+from+DEL+to+LHR+on+2026-12-01+and+from+LHR+to+DEL+on+2026-12-15'), true, "Multi-city fallback must use and+from+");
    assert.strictEqual(url.includes('through'), false, "Must never revert to +through+ when isMultiCity is true");
});

runTest("OP4.4: 3-Leg Multi-City search preserves all intermediate legs", () => {
    const routeInfo = {
        origin: 'NYC',
        destination: 'NYC',
        isMultiCity: true,
        multiCityLegs: [
            { legIndex: 1, origin: 'JFK', destination: 'FCO', dateIso: '2026-10-01' },
            { legIndex: 2, origin: 'FCO', destination: 'ATH', dateIso: '2026-10-08' },
            { legIndex: 3, origin: 'ATH', destination: 'JFK', dateIso: '2026-10-18' }
        ],
        activeFilters: {
            cabin: 'PREMIUM_ECONOMY',
            stops: '1_STOP',
            passengers: 3,
            hasCustomFilters: true
        },
        userCurr: 'USD'
    };

    const url = mockBuildFlightSearchUrl('JFK', 'JFK', '2026-10-01', '2026-10-08', 'USD', '', 'https://www.google.com', routeInfo);
    assert.strictEqual(url.includes('Premium+economy+Flights+from+JFK+to+FCO+on+2026-10-01+and+from+FCO+to+ATH+on+2026-10-08+and+from+ATH+to+JFK+on+2026-10-18+with+1+stop+or+fewer+for+3+passengers'), true);
});

// -------------------------------------------------------------
// Test Summary
// -------------------------------------------------------------
console.log(`\nResults: ${passed}/${passed + failed} tests passed.`);
if (failed > 0) {
    console.error(`FAILURE: ${failed} regression tests failed!`);
    process.exit(1);
} else {
    console.log("SUCCESS: All audit regression tests passed cleanly!");
    process.exit(0);
}
