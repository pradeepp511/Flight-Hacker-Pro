let settings = { 
    extensionEnabled: true,
    baseCurrency: 'INR',
    hasExplicitCurrency: false,
    timeValue: 50, 
    checkedBags: 0, 
    passengerCount: 1,
    rewardCard: 'scapia',
    hideSelfTransfers: true,
    showComfort: true,
    showSplitTickets: true,
    showCPP: true,
    loyaltyProgram: 'aeroplan',
    passportNationality: 'India',
    showLoungeVisa: true,
    showHubHunting: true,
    showStopovers: true,
    customBagFee: null,
    customSeatFee: null,
    customAwardTaxes: null,
    customCardFxPct: null
};

// Exchange Rates (USD base reference)
const exchangeRates = {
    'USD': 1.0,
    'INR': 83.5,
    'EUR': 0.92,
    'GBP': 0.78,
    'AED': 3.67,
    'AUD': 1.52,
    'CAD': 1.36,
    'SGD': 1.35,
    'VND': 25400,
    'ARS': 950,
    'BRL': 5.6,
    'THB': 36.5,
    'JPY': 155.0,
    'TRY': 33.5,
    'PLN': 3.95,
    'SEK': 10.4,
    'PHP': 56.2,
    'IDR': 15800,
    'MYR': 4.45
};

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
    'Z\u0141': 'PLN', 'Z\u0142': 'PLN',
    'kr': 'SEK', 'KR': 'SEK', 'SEK': 'SEK',
    '₱': 'PHP', 'PHP': 'PHP',
    'Rp': 'IDR', 'RP': 'IDR', 'IDR': 'IDR',
    'RM': 'MYR', 'MYR': 'MYR'
};

const currencyFormatters = {
    'INR': { symbol: '₹', locale: 'en-IN' },
    'USD': { symbol: '$', locale: 'en-US' },
    'EUR': { symbol: '€', locale: 'de-DE' },
    'GBP': { symbol: '£', locale: 'en-GB' },
    'AED': { symbol: 'AED ', locale: 'ar-AE' },
    'AUD': { symbol: 'A$', locale: 'en-AU' },
    'CAD': { symbol: 'C$', locale: 'en-CA' },
    'SGD': { symbol: 'S$', locale: 'en-SG' },
    'TRY': { symbol: '₺', locale: 'tr-TR' },
    'ARS': { symbol: 'ARS$ ', locale: 'es-AR' },
    'PLN': { symbol: 'zł ', locale: 'pl-PL' },
    'SEK': { symbol: ' kr', locale: 'sv-SE' },
    'PHP': { symbol: '₱', locale: 'en-PH' },
    'IDR': { symbol: 'Rp ', locale: 'id-ID' },
    'MYR': { symbol: 'RM ', locale: 'ms-MY' }
};

// Loyalty Program Point Valuations (USD cents per point)
const loyaltyValuations = {
    'aeroplan': { name: 'Air Canada Aeroplan', valCentsUSD: 1.5, estPointsReq: 35000 },
    'avios': { name: 'British Airways Avios', valCentsUSD: 1.3, estPointsReq: 30000 },
    'krisflyer': { name: 'Singapore KrisFlyer', valCentsUSD: 1.4, estPointsReq: 42000 },
    'flyingblue': { name: 'Air France/KLM Flying Blue', valCentsUSD: 1.2, estPointsReq: 25000 },
    'skymiles': { name: 'Delta SkyMiles', valCentsUSD: 1.1, estPointsReq: 32000 },
    'mileageplus': { name: 'United MileagePlus', valCentsUSD: 1.2, estPointsReq: 40000 },
    'scapia': { name: 'FedBank Scapia Pts', valCentsUSD: 0.24, estPointsReq: 100000 },
    'magnus': { name: 'Axis Edge Miles', valCentsUSD: 0.60, estPointsReq: 40000 },
    'infinia': { name: 'HDFC Reward Pts', valCentsUSD: 1.20, estPointsReq: 25000 }
};

// Fare Buckets & Elite Qualifying Miles (EQMs)
const fareClassEQMs = {
    'F': { name: 'First Class', eqmPct: 200 },
    'A': { name: 'First Discounted', eqmPct: 150 },
    'J': { name: 'Business Flexible', eqmPct: 175 },
    'C': { name: 'Business Standard', eqmPct: 150 },
    'D': { name: 'Business Discounted', eqmPct: 125 },
    'Z': { name: 'Business Promo', eqmPct: 100 },
    'W': { name: 'Premium Economy', eqmPct: 125 },
    'Y': { name: 'Economy Full', eqmPct: 100 },
    'M': { name: 'Economy Standard', eqmPct: 100 },
    'K': { name: 'Economy Discounted', eqmPct: 50 },
    'V': { name: 'Economy Promo', eqmPct: 50 },
    'E': { name: 'Basic Economy', eqmPct: 25 }
};

// Global Airport Lounges Database
const loungesDb = {
    'SIN': { name: 'Singapore Changi', lounges: ['SATS Premier Lounge', 'Marhaba Lounge', 'Ambassador Transit Lounge'], priorityPass: true },
    'LHR': { name: 'London Heathrow', lounges: ['Plaza Premium Lounge', 'Club Aspire Lounge', 'No1 Lounge'], priorityPass: true },
    'FRA': { name: 'Frankfurt Airport', lounges: ['LuxxLounge', 'Priority Lounge FRA'], priorityPass: true },
    'CDG': { name: 'Paris Charles de Gaulle', lounges: ['Extime Lounge', 'YotelAir Lounge'], priorityPass: true },
    'DOH': { name: 'Doha Hamad Int', lounges: ['Oryx Lounge', 'Al Maha Lounge'], priorityPass: true },
    'DXB': { name: 'Dubai Int', lounges: ['Ahlan Lounge at B', 'Marhaba Lounge'], priorityPass: true },
    'DEL': { name: 'Delhi Indira Gandhi', lounges: ['Encalm Lounge', 'Plaza Premium'], priorityPass: true },
    'BOM': { name: 'Mumbai Chhatrapati Shivaji', lounges: ['Adani Lounge', 'Aviserv Lounge'], priorityPass: true },
    'JFK': { name: 'New York JFK', lounges: ['Primeclass Lounge', 'Centurion Lounge'], priorityPass: true },
    'LAX': { name: 'Los Angeles Int', lounges: ['Star Alliance Lounge', 'Centurion Lounge'], priorityPass: true },
    'HND': { name: 'Tokyo Haneda', lounges: ['TIAT Lounge', 'Sky Lounge Annex'], priorityPass: true }
};

// Aircraft Comfort Database
const aircraftData = {
    "a350": { score: 95, tags: ["High Humidity", "Low Fatigue", "18in width"], color: "#137333", bg: "#e6f4ea" },
    "787": { score: 92, tags: ["Low Fatigue", "Large Windows"], color: "#137333", bg: "#e6f4ea" },
    "a330neo": { score: 85, tags: ["Quiet Cabin"], color: "#137333", bg: "#e6f4ea" },
    "a380": { score: 90, tags: ["Spacious", "Quiet"], color: "#137333", bg: "#e6f4ea" },
    "737 max": { score: 70, tags: ["Standard Pressure", "Noisy"], color: "#b06000", bg: "#fef7e0" },
    "737-": { score: 60, tags: ["Older Cabin", "Dry Air"], color: "#c5221f", bg: "#fce8e6" },
    "a320": { score: 75, tags: ["Standard Cabin"], color: "#1a73e8", bg: "#e8f0fe" },
    "777": { score: 65, tags: ["Potential 3-4-3 (Narrow)", "Dry Air"], color: "#b06000", bg: "#fef7e0" },
    "e175": { score: 80, tags: ["No Middle Seats"], color: "#137333", bg: "#e6f4ea" },
    "crj": { score: 50, tags: ["Cramped", "Small Bins"], color: "#c5221f", bg: "#fce8e6" }
};

// Reward Card Profiles
const cardProfiles = {
    'none': { name: 'Standard Card', fxFeePct: 0.035, rewardPct: 0.00 },
    'scapia': { name: 'FedBank Scapia', fxFeePct: 0.00, rewardPct: 0.02 },
    'magnus': { name: 'Axis Magnus', fxFeePct: 0.02, rewardPct: 0.06 },
    'octane': { name: 'SBI Octane', fxFeePct: 0.035, rewardPct: 0.01 },
    'infinia': { name: 'HDFC Infinia', fxFeePct: 0.02, rewardPct: 0.033 },
    'zero_fx': { name: 'Generic 0% Forex', fxFeePct: 0.00, rewardPct: 0.00 }
};

// 1. Initialize
let isModifyingDom = false;
let debounceTimer;

chrome.storage.local.get([...Object.keys(settings), 'exchangeRates'], (data) => {
    if (data.exchangeRates) {
        Object.assign(exchangeRates, data.exchangeRates);
    }
    settings = { ...settings, ...data };
    setupObserver();
    // Proactive initial analysis for existing DOM results
    if (settings.extensionEnabled !== false) {
        setTimeout(analyzeFlights, 400);
    }
});

// Multi-tab storage sync
chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local') {
        let changed = false;
        for (const [key, change] of Object.entries(changes)) {
            if (key in settings) {
                settings[key] = change.newValue;
                changed = true;
            } else if (key === 'exchangeRates' && change.newValue) {
                Object.assign(exchangeRates, change.newValue);
                changed = true;
            }
        }
        if (changed && settings.extensionEnabled !== false) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(analyzeFlights, 250);
        }
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'recalculate') {
        chrome.storage.local.get([...Object.keys(settings), 'exchangeRates'], (data) => {
            if (data.exchangeRates) {
                Object.assign(exchangeRates, data.exchangeRates);
            }
            settings = { ...settings, ...data };
            // Clear analyzed flags, fingerprints & inline conversion markers
            document.querySelectorAll('[data-fhp-analyzed]').forEach(el => delete el.dataset.fhpAnalyzed);
            document.querySelectorAll('[data-fhp-fingerprint]').forEach(el => delete el.dataset.fhpFingerprint);
            document.querySelectorAll('[data-fhp-inline-converted]').forEach(el => delete el.dataset.fhpInlineConverted);
            document.querySelectorAll('.fhp-container, .fhp-header-banner, .fhp-split-banner, .fhp-inline-converted, .fhp-hidden, .fhp-modal-overlay, .fhp-matrix-overlay').forEach(el => {
                if (el.classList.contains('fhp-hidden')) el.classList.remove('fhp-hidden');
                else el.remove();
            });
            if (settings.extensionEnabled !== false) {
                analyzeFlights();
            }
            if (sendResponse) sendResponse({ success: true });
        });
        return true;
    } else if (request.action === 'startMatrixScan') {
        if (settings.extensionEnabled === false) {
            if (sendResponse) sendResponse({ success: false, reason: 'Extension Disabled in Popup' });
            return;
        }
        const horizon = request.scanHorizon || settings.scanHorizon || 30;
        const bracket = request.tripBracket || settings.tripBracket || '5-21';
        const viewMode = request.viewMode || 'DAYWISE';
        chrome.storage.local.get(null, (allStorage) => {
            try {
                const routeInfo = extractCurrentRouteInfo();
                if (!routeInfo.origin || !routeInfo.destination) {
                    if (sendResponse) sendResponse({ success: false, reason: 'No valid route detected on current Google Flights page.' });
                    return;
                }
                const effectiveViewMode = routeInfo.isOneWay ? 'CALENDAR' : viewMode;
                const matrixData = generateMatrixData(routeInfo, horizon, bracket, null, allStorage);
                showMatrixHeatMapModal(matrixData, routeInfo, 'ANY', 'ANY', null, null, 'ANY', allStorage, effectiveViewMode);
                if (sendResponse) sendResponse({ success: true, routeInfo });
            } catch (err) {
                console.error("Flight Hacker Pro - Matrix Scan Error:", err);
                if (sendResponse) sendResponse({ success: false, reason: err.message });
            }
        });
        return true;
    } else if (request.action === 'getRoutePayload') {
        try {
            const routeInfo = extractCurrentRouteInfo();
            if (sendResponse) sendResponse(routeInfo);
        } catch (e) {
            if (sendResponse) sendResponse({ error: e.message });
        }
    } else if (request.action === 'clearCacheAndAutoTune') {
        window.fhpLastLowestBasePrice = null;
        chrome.storage.local.get(null, (allStorage) => {
            const keysToRemove = Object.keys(allStorage).filter(k => k.startsWith('fhp_fare_') || k.startsWith('fhp_anchor_'));
            chrome.storage.local.remove(keysToRemove, () => {
                document.querySelectorAll('[data-fhp-analyzed]').forEach(el => delete el.dataset.fhpAnalyzed);
                document.querySelectorAll('[data-fhp-fingerprint]').forEach(el => delete el.dataset.fhpFingerprint);
                document.querySelectorAll('[data-fhp-inline-converted]').forEach(el => delete el.dataset.fhpInlineConverted);
                document.querySelectorAll('.fhp-container, .fhp-header-banner, .fhp-split-banner, .fhp-inline-converted, .fhp-hidden, .fhp-modal-overlay, .fhp-matrix-overlay').forEach(el => {
                    if (el.classList.contains('fhp-hidden')) el.classList.remove('fhp-hidden');
                    else el.remove();
                });
                if (settings.extensionEnabled !== false) {
                    analyzeFlights();
                }
                if (sendResponse) sendResponse({ success: true, clearedCount: keysToRemove.length });
            });
        });
        return true;
    }
});

// 2. SPA Observer with Debounce & Extension DOM Isolation
function setupObserver() {
    if (!document.body) {
        window.addEventListener('DOMContentLoaded', setupObserver, { once: true });
        return;
    }
    const observer = new MutationObserver((mutations) => {
        if (settings.extensionEnabled === false || isModifyingDom) return;

        // Check if mutations were solely generated by extension-owned UI elements
        const isInternalMutation = mutations.every(m => {
            const t = m.target;
            if (t) {
                if (t.nodeType === 1 && t.closest && t.closest('.fhp-container, .fhp-header-banner, .fhp-split-banner, .fhp-modal-overlay, .fhp-matrix-overlay, .fhp-inline-converted')) {
                    return true;
                }
                if (t.nodeType === 3 && t.parentElement && t.parentElement.closest && t.parentElement.closest('.fhp-container, .fhp-header-banner, .fhp-split-banner, .fhp-modal-overlay, .fhp-matrix-overlay, .fhp-inline-converted')) {
                    return true;
                }
            }
            const added = Array.from(m.addedNodes);
            const removed = Array.from(m.removedNodes);
            const allNodes = [...added, ...removed];
            if (allNodes.length > 0 && allNodes.every(n => {
                if (n.nodeType === 1) {
                    return n.classList?.contains('fhp-container') || n.classList?.contains('fhp-header-banner') || n.classList?.contains('fhp-split-banner') || n.classList?.contains('fhp-modal-overlay') || n.classList?.contains('fhp-matrix-overlay') || n.classList?.contains('fhp-inline-converted');
                }
                if (n.nodeType === 3 && n.parentElement && n.parentElement.closest && n.parentElement.closest('.fhp-container, .fhp-header-banner, .fhp-split-banner, .fhp-modal-overlay, .fhp-matrix-overlay, .fhp-inline-converted')) {
                    return true;
                }
                return false;
            })) {
                return true;
            }
            return false;
        });

        if (isInternalMutation) return;

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(analyzeFlights, 600); 
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

// 3. International Price Parser (A03 Fix: Full token boundaries & locale grouping)
function parseFareString(text) {
    if (!text || typeof text !== 'string') return null;
    const normalized = text.replace(/[\u00A0\u202F]/g, ' ').trim();
    
    // Ordered symbol matching (longer multi-char prefixes first)
    const symList = [
        'ARS\\$', 'A\\$', 'C\\$', 'S\\$', 'R\\$', 'AED', 'USD', 'INR', 'EUR', 'GBP',
        'AUD', 'CAD', 'SGD', 'VND', 'ARS', 'BRL', 'THB', 'JPY', 'TRY', 'PLN',
        'SEK', 'PHP', 'IDR', 'MYR', 'TL', 'RP', 'RM', 'ZŁ', 'Z\u0141', 'KR',
        'zł', 'kr', '[$₹€£₫₺₱฿¥]'
    ];
    const symPat = '(?:' + symList.join('|') + ')';
    
    // Numbers:
    // 1. Indian: 1,23,456 or 12,34,567
    // 2. Standard thousands: 1,250 or 12,345 or 123,456
    // 3. European thousands: 1.250 or 12.345
    // 4. Space separated: 1 250
    // 5. Plain integer or float: 1250 or 1250.50
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
            // European format: 1.250,50 -> 1250.50
            cleanNum = cleanNumStr.replace(/\./g, '').replace(',', '.');
        } else {
            // US/UK or Indian format: 1,250.50 -> 1250.50
            cleanNum = cleanNumStr.replace(/,/g, '');
        }
    } else if (cleanNumStr.includes(',')) {
        const parts = cleanNumStr.split(',');
        if (parts.length === 2 && parts[1].length === 2) {
            // e.g. 12,50 -> decimal comma
            cleanNum = cleanNumStr.replace(',', '.');
        } else {
            // e.g. 1,250 or 12,345 or 1,23,456
            cleanNum = cleanNumStr.replace(/,/g, '');
        }
    } else if (cleanNumStr.includes('.')) {
        const parts = cleanNumStr.split('.');
        if (parts.length > 2) {
            cleanNum = cleanNumStr.replace(/\./g, '');
        } else if (parts.length === 2 && parts[1].length === 3) {
            // e.g. 1.250 thousands
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

function formatMoney(amount, currencyCode) {
    const fmt = currencyFormatters[currencyCode] || { symbol: currencyCode + ' ', locale: 'en-US' };
    return fmt.symbol + Math.round(amount).toLocaleString(fmt.locale);
}

// Version 2.0 Helpers (Options 1, 2, & 3)
function calculateCPP(cashPriceUSD, programKey) {
    const prog = loyaltyValuations[programKey] || loyaltyValuations['aeroplan'];
    const awardTaxesUSD = (settings.customAwardTaxes !== undefined && settings.customAwardTaxes !== null && !isNaN(settings.customAwardTaxes) && settings.customAwardTaxes >= 0)
        ? parseFloat(settings.customAwardTaxes)
        : 50;
    
    // Scale estimated points requirement based on cash fare tier (short-haul, medium, long-haul)
    let ptsReq = prog.estPointsReq;
    if (cashPriceUSD < 250) {
        ptsReq = Math.max(5000, Math.round(prog.estPointsReq * 0.35));
    } else if (cashPriceUSD < 700) {
        ptsReq = Math.max(12000, Math.round(prog.estPointsReq * 0.70));
    } else if (cashPriceUSD > 1500) {
        ptsReq = Math.round(prog.estPointsReq * 1.6);
    }

    if (cashPriceUSD <= awardTaxesUSD || !ptsReq) return null;
    const cppCentsUSD = ((cashPriceUSD - awardTaxesUSD) / ptsReq) * 100;
    const isGoodVal = cppCentsUSD >= prog.valCentsUSD;
    return {
        cppCentsUSD: parseFloat(cppCentsUSD.toFixed(2)),
        programName: prog.name,
        ptsReq,
        isGoodVal,
        cashPriceUSD: Math.round(cashPriceUSD),
        awardTaxesUSD: Math.round(awardTaxesUSD)
    };
}

function detectBaggageProvision(combinedText, fareClassLetter = null) {
    if (!combinedText) return { includedBags: 0, textMatch: 'No Baggage Detail' };
    const lower = combinedText.toLowerCase();

    // 1. Negative indicators take precedence
    if (lower.includes('no checked bags included') || lower.includes('no checked bag') || lower.includes('no checked bags') || 
        lower.includes('fee for checked bag') || lower.includes('checked bag for a fee') || lower.includes('basic economy') || 
        lower.includes('no carry-on') || lower.includes('carry-on only')) {
        return { includedBags: 0, textMatch: 'No Checked Bags Included' };
    }

    // 2. Explicit 2-bag matches
    if (lower.includes('2 checked bags included') || lower.includes('2 checked bags') || lower.includes('includes 2 checked') || lower.includes('2 bags included')) {
        return { includedBags: 2, textMatch: '2 Checked Bags Included' };
    }

    // 3. Explicit 1-bag matches
    if (lower.includes('1 checked bag included') || lower.includes('checked bag included') || lower.includes('checked bags included') || 
        lower.includes('includes 1 checked') || lower.includes('1 free checked') || lower.includes('free checked bag') || 
        lower.includes('includes checked bag') || lower.includes('baggage included') || lower.includes('1 bag included')) {
        return { includedBags: 1, textMatch: '1 Checked Bag Included' };
    }

    // Class of Service defaults
    if (lower.includes('first') || lower.includes('business') || (fareClassLetter && ['F','A','J','C','D','Z'].includes(String(fareClassLetter).toUpperCase()))) {
        return { includedBags: 2, textMatch: 'Premium Cabin (2 Bags Assumed)' };
    }

    // Default for ultra low-cost carriers
    const isUltraLcc = lower.includes('ryanair') || lower.includes('spirit') || lower.includes('frontier') || lower.includes('allegiant') || lower.includes('wizz') || lower.includes('airasia');
    if (isUltraLcc) {
        return { includedBags: 0, textMatch: 'Ultra Low-Cost Carrier (Fee Required)' };
    }

    return { includedBags: 1, textMatch: 'Standard Economy (1 Bag Assumed)' };
}

function extractFareBucket(text) {
    if (!text) return null;
    const match = text.match(/(?:economy|business|first|premium)\s*\(([a-z])\)/i) || 
                  text.match(/\bclass\s*([a-z])\b/i) || 
                  text.match(/\b([fajcdzwykmve])\s*bucket\b/i);
    if (match) {
        const letter = match[1].toUpperCase();
        if (fareClassEQMs[letter]) {
            return { letter, ...fareClassEQMs[letter] };
        }
    }
    return null;
}

function assessLoungeAccess(text) {
    if (!text) return null;
    for (const [code, info] of Object.entries(loungesDb)) {
        // Enforce word boundaries so DEL does not match DELTA, SIN does not match SINGLE, etc.
        const codeRegex = new RegExp(`\\b${code}\\b`, 'i');
        if (codeRegex.test(text)) {
            return { airport: code, ...info };
        }
    }
    return null;
}

function assessTransitVisa(text, passport = 'India') {
    if (!text) return null;
    const hasFRA = /\bFRA\b/i.test(text);
    const hasCDG = /\bCDG\b/i.test(text);
    const hasAMS = /\bAMS\b/i.test(text);
    const hasMUC = /\bMUC\b/i.test(text);
    const hasORY = /\bORY\b/i.test(text);
    
    const isMultiSchengen = (hasFRA && hasCDG) || (hasAMS && hasFRA) || (hasCDG && hasAMS) || (hasMUC && hasORY);
    
    const lowerText = text.toLowerCase();
    const isSelfTransfer = lowerText.includes('separate tickets') || lowerText.includes('self-transfer');
    
    if (isMultiSchengen && (passport === 'India' || passport === 'China' || passport === 'Pakistan')) {
        return { type: 'SCHENGEN_VISA_REQ', isVisaRequired: true, message: '🛂 Multi-Schengen Layover: Transit Visa Required' };
    }
    if (isSelfTransfer) {
        return { type: 'SELF_TRANSFER_IMMIGRATION', isVisaRequired: false, message: '🧳 Self-Transfer: Must Clear Customs & Re-check Bags' };
    }
    return null;
}

// Hidden-City Ticketing (Skiplagging) Engine
function assessHiddenCitySkiplag(combinedText, intendedDest) {
    if (!combinedText || !intendedDest) return null;
    const destUpper = intendedDest.toUpperCase();
    
    // Explicit word boundary on intermediate layover/stop matching intended destination
    const explicitLayoverMatch = new RegExp(`(?:layover|stop|transfer|via)\\s*(?:in|at)?\\s*\\b${destUpper}\\b`, 'i').test(combinedText);
    if (explicitLayoverMatch) {
        return {
            destUpper,
            message: `🕵️ Hidden-City Skiplagging Opportunity: Exit at ${destUpper} Layover!`,
            warning: `⚠️ TOS WARNING: Carry-on baggage ONLY. Do NOT check bags or add frequent flyer ID.`
        };
    }

    // Secondary match: Connecting flights via popular skiplag transit hubs
    const popularHubs = new Set(['ORD', 'DFW', 'ATL', 'DEN', 'CLT', 'MIA', 'PHX', 'IAH', 'LAX', 'SFO', 'LHR', 'FRA', 'CDG', 'DXB', 'DOH', 'SIN', 'DEL', 'BOM']);
    if (popularHubs.has(destUpper)) {
        const layoverMatch = combinedText.match(/(?:layover|stop|transfer|via)\s*(?:in|at)?\s*([A-Z]{3})\b/i);
        if (layoverMatch && popularHubs.has(layoverMatch[1].toUpperCase()) && layoverMatch[1].toUpperCase() !== destUpper) {
            const hub = layoverMatch[1].toUpperCase();
            return {
                destUpper: hub,
                message: `💡 Connecting Hub: Stopover in ${hub}`,
                warning: `Check beyond-fares to verify hidden-city savings.`
            };
        }
    }
    return null;
}

// Pricing Anomaly Detection Engine
function assessErrorFareAnomaly(fareInUSD, medianRouteFareUSD) {
    if (!fareInUSD || !medianRouteFareUSD || medianRouteFareUSD <= 0) return null;
    const ratio = fareInUSD / medianRouteFareUSD;
    if (ratio <= 0.48 && (medianRouteFareUSD - fareInUSD) >= 150) {
        const discountPct = Math.round((1 - ratio) * 100);
        return {
            isAnomaly: true,
            discountPct,
            message: `⚡ Unusually Low Fare: ~${discountPct}% Below Historical/Route Baseline (Verify fare rules before booking)`
        };
    }
    return null;
}

// Last-Minute Distress Inventory Radar Engine
function assessLastMinuteDistress(activeDepISO, fareInUSD, medianRouteFareUSD) {
    if (!activeDepISO || !fareInUSD || !medianRouteFareUSD || medianRouteFareUSD <= 0) return null;
    const depDay = new Date(activeDepISO + (activeDepISO.includes('T') ? '' : 'T00:00:00'));
    if (isNaN(depDay.getTime())) return null;
    const todayDay = new Date();
    todayDay.setHours(0, 0, 0, 0);
    const diffMs = depDay.getTime() - todayDay.getTime();
    const daysOut = Math.round(diffMs / (1000 * 60 * 60 * 24));
    
    // If flight leaves in 0 to 3 days and price is <= 70% of standard median
    if (daysOut >= 0 && daysOut <= 3 && fareInUSD <= (medianRouteFareUSD * 0.70)) {
        return {
            isDistress: true,
            daysOut,
            message: `⚡ Last-Minute Clearance: ${daysOut === 0 ? 'Departs Today' : daysOut + 'd Out'}!`
        };
    }
    return null;
}

// Multi-City & Open-Jaw Ground Transport Optimization Engine
const openJawClusters = {
    'COK': [{ alt: 'TRV', name: 'Thiruvananthapuram (TRV)', groundCostINR: 800, groundTime: '2.5h Train' }],
    'TRV': [{ alt: 'COK', name: 'Kochi (COK)', groundCostINR: 800, groundTime: '2.5h Train' }],
    'BLR': [{ alt: 'MAA', name: 'Chennai (MAA)', groundCostINR: 1000, groundTime: '3.5h Vande Bharat' }],
    'MAA': [{ alt: 'BLR', name: 'Bengaluru (BLR)', groundCostINR: 1000, groundTime: '3.5h Vande Bharat' }],
    'JFK': [{ alt: 'EWR', name: 'Newark (EWR)', groundCostINR: 1800, groundTime: '1h Transit' }, { alt: 'LGA', name: 'LaGuardia (LGA)', groundCostINR: 1200, groundTime: '45m Transit' }],
    'EWR': [{ alt: 'JFK', name: 'New York JFK', groundCostINR: 1800, groundTime: '1h Transit' }],
    'LHR': [{ alt: 'LGW', name: 'London Gatwick (LGW)', groundCostINR: 2500, groundTime: '1.5h Bus' }],
    'LGW': [{ alt: 'LHR', name: 'London Heathrow (LHR)', groundCostINR: 2500, groundTime: '1.5h Bus' }],
    'HND': [{ alt: 'NRT', name: 'Tokyo Narita (NRT)', groundCostINR: 2000, groundTime: '1.5h Skyliner' }],
    'NRT': [{ alt: 'HND', name: 'Tokyo Haneda (HND)', groundCostINR: 2000, groundTime: '1.5h Skyliner' }]
};

function assessOpenJawAlternateAirports(origin, destination, basePriceInUserCurr, userCurr = 'INR') {
    if (!destination) return null;
    const destUpper = destination.toUpperCase();
    const cluster = openJawClusters[destUpper];
    if (!cluster || cluster.length === 0) return null;

    const targetAlt = cluster[0];
    const estAltSavingsUSD = 75;
    const estAltSavingsBase = estAltSavingsUSD * (exchangeRates[userCurr] || 1.0);
    const groundCostBase = (userCurr === 'INR') 
        ? targetAlt.groundCostINR 
        : (targetAlt.groundCostINR / (exchangeRates['INR'] || 83.5)) * (exchangeRates[userCurr] || 1.0);

    const netSavings = estAltSavingsBase - groundCostBase;
    const minNetSavingsBase = 15 * (exchangeRates[userCurr] || 1.0);
    if (netSavings >= minNetSavingsBase) {
        return {
            altCode: targetAlt.alt,
            altName: targetAlt.name,
            groundTime: targetAlt.groundTime,
            netSavings,
            message: `💡 Open-Jaw Hack: Return via ${targetAlt.name} to save ~${formatMoney(netSavings, userCurr)} (inc. ${targetAlt.groundTime})`
        };
    }
    return null;
}

// Group Booking Fare Splitter Engine
function assessGroupBookingFareSplit(passengerCount, basePriceInUserCurr, combinedText, userCurr = 'INR') {
    if (!passengerCount || passengerCount <= 1) return null;
    
    // Detect multi-passenger bucket jump traps
    const estBucketSavingsBase = Math.round((basePriceInUserCurr * 0.18) * Math.min(2, passengerCount - 1));
    const split1 = Math.floor(passengerCount / 2);
    const split2 = passengerCount - split1;

    return {
        passengerCount,
        split1,
        split2,
        estBucketSavingsBase,
        message: `👨‍👩‍👧‍👦 Group Booking Splitter: Split into 2 bookings (${split1} px + ${split2} px) to save ~${formatMoney(estBucketSavingsBase, userCurr)}!`
    };
}

// Official Airline Stopover Programs Knowledge Base
const airlineStopoverPrograms = {
    'KEF': {
        airline: 'Icelandair / PLAY',
        city: 'Reykjavik',
        maxDays: 7,
        cost: 'Free ($0 Extra Airfare)',
        hotelBenefit: 'Up to 7 nights in Iceland with no added airfare on transatlantic routes.',
        badge: '🇮🇸 Free Iceland Stopover (Up to 7 Days in KEF at $0 extra fare)'
    },
    'IST': {
        airline: 'Turkish Airlines',
        city: 'Istanbul',
        maxDays: 2,
        cost: 'Free 4★/5★ Hotel',
        hotelBenefit: 'Free 4★ hotel (1 night, Economy) or 5★ hotel (2 nights, Business) for stopovers ≥ 20 hrs. Touristanbul provides free tours for layovers 6–24 hrs.',
        badge: '🇹🇷 Free Istanbul Stopover + Free Hotel (Turkish Airlines 1–2 Nights Hotel Included)'
    },
    'DOH': {
        airline: 'Qatar Airways',
        city: 'Doha',
        maxDays: 4,
        cost: 'Subsidized 4★/5★ Luxury Hotels from $14/nt',
        hotelBenefit: 'Discover Qatar stopover packages: 4★/5★ luxury hotel stays from $14–$20/night up to 4 nights.',
        badge: '🇶🇦 Subsidized Doha Luxury Stopover (4★/5★ Hotels from $14/night via Qatar Airways)'
    },
    'DXB': {
        airline: 'Emirates',
        city: 'Dubai',
        maxDays: 7,
        cost: 'Free Hotel (≥10h layover) or Discounted Dubai Packages',
        hotelBenefit: 'Emirates Dubai Connect provides free hotel, meals, & transfers for connections 10–24 hrs. Longer stopovers available at special rates.',
        badge: '🇦🇪 Emirates Dubai Stopover (Free Hotel for 10–24h layovers via Dubai Connect)'
    },
    'AUH': {
        airline: 'Etihad Airways',
        city: 'Abu Dhabi',
        maxDays: 2,
        cost: 'Free Hotel (Up to 2 Nights)',
        hotelBenefit: 'Etihad Stopover Program offers up to 2 complimentary nights at premium 3★/4★ hotels in Abu Dhabi.',
        badge: '🇦🇪 Free Abu Dhabi Stopover (Etihad provides up to 2 Free Nights Hotel in AUH)'
    },
    'LIS': {
        airline: 'TAP Air Portugal',
        city: 'Lisbon',
        maxDays: 10,
        cost: 'Free ($0 Extra Airfare)',
        hotelBenefit: 'Portugal Stopover program allows up to 10 days in Lisbon with 25% hotel discounts and $0 extra fare.',
        badge: '🇵🇹 Free TAP Portugal Stopover (Up to 10 Days in Lisbon at $0 extra fare)'
    },
    'OPO': {
        airline: 'TAP Air Portugal',
        city: 'Porto',
        maxDays: 10,
        cost: 'Free ($0 Extra Airfare)',
        hotelBenefit: 'Portugal Stopover program allows up to 10 days in Porto with 25% hotel discounts and $0 extra fare.',
        badge: '🇵🇹 Free TAP Portugal Stopover (Up to 10 Days in Porto at $0 extra fare)'
    },
    'SIN': {
        airline: 'Singapore Airlines',
        city: 'Singapore',
        maxDays: 5,
        cost: 'Free 2.5h Changi Tour / Subsidized Hotel',
        hotelBenefit: 'Free 2.5-hour Changi Airport Heritage/City Tour for layovers ≥ 5.5h, plus Singapore Stopover Holiday hotel deals.',
        badge: '🇸🇬 Free Singapore Tour (≥5.5h) / Subsidized Stopover Holiday Packages'
    },
    'MAD': {
        airline: 'Iberia',
        city: 'Madrid',
        maxDays: 6,
        cost: 'Free Hola Madrid Stopover',
        hotelBenefit: 'Hola Madrid program: up to 6 nights in Madrid without fare increase, plus 25% discount on Melia hotels.',
        badge: '🇪🇸 Free Hola Madrid Stopover (Up to 6 Nights in Madrid at $0 extra airfare)'
    },
    'PTY': {
        airline: 'Copa Airlines',
        city: 'Panama City',
        maxDays: 7,
        cost: 'Free Panama Stopover',
        hotelBenefit: 'Panama Stopover program allows up to 7 days in Panama on connecting flights with zero extra airfare.',
        badge: '🇵🇦 Free Panama Stopover (Up to 7 Days in Panama City with Copa Airlines at $0 extra)'
    },
    'ADD': {
        airline: 'Ethiopian Airlines',
        city: 'Addis Ababa',
        maxDays: 1,
        cost: 'Free Transit Hotel & Meals',
        hotelBenefit: 'Complimentary transit hotel, food, and transit visa for international connections with layovers between 8 and 24 hours.',
        badge: '🇪🇹 Free Addis Transit Hotel & Meals (Ethiopian Airlines for 8–24h layovers)'
    },
    'AMM': {
        airline: 'Royal Jordanian',
        city: 'Amman',
        maxDays: 1,
        cost: 'Free Transit Hotel for layovers ≥ 8h',
        hotelBenefit: 'Free hotel accommodation for transit passengers with layovers between 8 and 24 hours.',
        badge: '🇯🇴 Free Amman Transit Hotel (Royal Jordanian for ≥8h layovers)'
    }
};

function assessStopoverOptimization(combinedText, origin, destination) {
    if (!combinedText) return null;
    
    // Extract layover duration
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
            } else if (hubCode === 'ADD' && layoverHours >= 8 && layoverHours <= 24) {
                hotelAlert = '🏨 Free Transit Hotel & Visa Eligible: Ethiopian Airlines (8–24h layover)';
            } else if (hubCode === 'AMM' && layoverHours >= 8) {
                hotelAlert = '🏨 Free Transit Hotel Eligible: Royal Jordanian (layovers ≥ 8h)';
            } else if (hubCode === 'DOH' && layoverHours >= 8) {
                hotelAlert = '🏨 Luxury 4★/5★ Hotel Stopovers available from $14/nt via Discover Qatar';
            } else if (hubCode === 'AUH') {
                hotelAlert = '🏨 Up to 2 Free Nights Hotel in Abu Dhabi via Etihad Stopover Program';
            }

            if (hubCode === 'SIN' && layoverHours >= 5.5) {
                tourAlert = '🚌 Free 2.5h Singapore Changi Heritage Tour Eligible (layovers ≥ 5.5h)';
            } else if (hubCode === 'IST' && layoverHours >= 6 && layoverHours < 24) {
                tourAlert = '🚌 Free Touristanbul Sightseeing Tour Eligible (layovers 6–24h)';
            } else if (hubCode === 'DOH' && layoverHours >= 6) {
                tourAlert = '🚌 Transit City Tours available from $20 via Discover Qatar';
            }

            return {
                hubCode,
                program,
                layoverHours: layoverHours > 0 ? parseFloat(layoverHours.toFixed(1)) : null,
                hotelAlert,
                tourAlert,
                message: program.badge,
                tooltip: `🌟 Official Stopover Program: ${program.airline} allows up to ${program.maxDays} days in ${program.city} (${program.cost})! ${program.hotelBenefit} Tip: Search as 'Multi-city' on Google Flights with the same airline to add a multi-day stopover at $0 extra airfare.`
            };
        }
    }

    if (layoverHours >= 8) {
        return {
            hubCode: null,
            layoverHours: parseFloat(layoverHours.toFixed(1)),
            hotelAlert: `🏨 Extended Layover (${layoverHours.toFixed(1)}h): Check airport transit hotel or airline STPC policy`,
            tourAlert: null,
            message: `🕒 Extended Layover (${layoverHours.toFixed(1)}h)`,
            tooltip: `This flight has a ${layoverHours.toFixed(1)}-hour layover. Check with the operating airline whether complimentary hotel accommodation (STPC) or day-room lounge access is provided.`
        };
    }

    return null;
}

// Multi-City Ground Rail & Transit Connections Database
const multiCityRailClusters = [
    { a: 'LHR', b: 'CDG', name: 'London ➔ Paris', transit: 'Eurostar (2h 15m)', costUSD: 75 },
    { a: 'LGW', b: 'ORY', name: 'London ➔ Paris', transit: 'Eurostar (2h 15m)', costUSD: 75 },
    { a: 'HND', b: 'KIX', name: 'Tokyo ➔ Osaka', transit: 'Tokaido Shinkansen (2h 25m)', costUSD: 95 },
    { a: 'NRT', b: 'ITM', name: 'Tokyo ➔ Osaka', transit: 'Tokaido Shinkansen (2h 25m)', costUSD: 95 },
    { a: 'FCO', b: 'MXP', name: 'Rome ➔ Milan', transit: 'Frecciarossa Rail (3h 10m)', costUSD: 55 },
    { a: 'BLR', b: 'MAA', name: 'Bengaluru ➔ Chennai', transit: 'Vande Bharat Express (4h 15m)', costUSD: 14 },
    { a: 'COK', b: 'TRV', name: 'Kochi ➔ Trivandrum', transit: 'Vande Bharat / Rail (3h)', costUSD: 10 },
    { a: 'AMS', b: 'BRU', name: 'Amsterdam ➔ Brussels', transit: 'Eurostar (1h 50m)', costUSD: 40 },
    { a: 'FRA', b: 'MUC', name: 'Frankfurt ➔ Munich', transit: 'ICE High-Speed Train (3h 15m)', costUSD: 60 },
    { a: 'JFK', b: 'BOS', name: 'New York ➔ Boston', transit: 'Amtrak Acela (3h 30m)', costUSD: 70 },
    { a: 'EWR', b: 'BOS', name: 'New York ➔ Boston', transit: 'Amtrak Acela (3h 30m)', costUSD: 70 },
    { a: 'JFK', b: 'IAD', name: 'New York ➔ Washington DC', transit: 'Amtrak Northeast Regional (3h)', costUSD: 50 },
    { a: 'ZRH', b: 'GVA', name: 'Zurich ➔ Geneva', transit: 'SBB Rail (2h 45m)', costUSD: 50 }
];

function assessMultiCityItinerary(routeInfo, combinedText, userCurr = 'INR') {
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
                message: `🚆 Ground Transit Option: ${match.name} via ${match.transit} (~${formatMoney(costBase, userCurr)})`
            };
        }
    }

    return {
        isMultiCity: true,
        isOpenJaw: routeInfo.isOpenJaw,
        railSuggestion,
        message: routeInfo.isOpenJaw 
            ? `🗺️ Open-Jaw Itinerary: ${routeInfo.openJawGap ? `${routeInfo.openJawGap.from} // ${routeInfo.openJawGap.to}` : 'Surface Sector'}`
            : `🗺️ Multi-City Itinerary (${routeInfo.multiCityLegs ? routeInfo.multiCityLegs.length : 2} Legs)`,
        splitHackNotice: `💡 Multi-City Split Check: Cross-check booking legs as separate one-way tickets on airline websites to bypass round-trip through-fare penalties.`
    };
}

// Helper to filter out extension-owned DOM nodes from price scanning
function isExtensionOwnedNode(el) {
    if (!el || !el.closest) return false;
    return Boolean(el.closest('.fhp-container, .fhp-header-banner, .fhp-split-banner, .fhp-modal-overlay, .fhp-matrix-overlay, .fhp-inline-converted'));
}

const invalidIataCodes = new Set([
    'FRI', 'SAT', 'SUN', 'MON', 'TUE', 'WED', 'THU',
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
    'ONE', 'TWO', 'NON', 'WAY', 'OUT', 'RET', 'FLI', 'NEW', 'AIR', 'TOP', 'ALL', 'THE', 'AND', 'FOR',
    'PER', 'ANY', 'DAY', 'MIN', 'MAX', 'HRS', 'AVG', 'NET', 'EST'
]);

// Active Currency Detection & URL Search Generator Engine
function detectActivePageCurrency() {
    if (typeof window !== 'undefined' && window.location && window.location.search) {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const currParam = urlParams.get('curr');
            if (currParam && (currencySymbols[currParam.toUpperCase()] || exchangeRates[currParam.toUpperCase()])) {
                return currParam.toUpperCase();
            }
        } catch (e) {}
    }
    // Check DOM price elements
    const priceNodes = document.querySelectorAll('li, [role="listitem"], .m74Sce, .Z00n4b');
    for (const node of priceNodes) {
        if (isExtensionOwnedNode(node)) continue;
        const text = node.innerText || '';
        const parsed = parseFareString(text);
        if (parsed && parsed.currency) {
            return parsed.currency;
        }
    }
    return null;
}

function extractActiveSearchFilters() {
    const filters = {
        stops: 'ANY',          // 'NONSTOP', '1_STOP', '2_STOPS', 'ANY'
        stopsLabel: 'Any stops',
        cabin: 'ECONOMY',      // 'ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST'
        cabinLabel: 'Economy',
        airlines: null,
        passengers: 1,
        hasCustomFilters: false
    };

    try {
        const allBtns = Array.from(document.querySelectorAll('button, div[role="button"], div[role="combobox"], [data-soi]')).filter(el => !isExtensionOwnedNode(el));
        
        for (const btn of allBtns) {
            const aria = (btn.getAttribute('aria-label') || '').toLowerCase();
            const txt = (btn.innerText || btn.textContent || '').trim().toLowerCase();
            const combined = aria + ' ' + txt;

            // 1. Stops filter
            if (combined.includes('stops') || combined.includes('stop') || combined.includes('escale') || combined.includes('zwischenstopp') || combined.includes('paradas')) {
                if (combined.includes('nonstop') || combined.includes('direct') || combined.includes('sans escale') || combined.includes('direktflug') || combined.includes('sin escalas')) {
                    filters.stops = 'NONSTOP';
                    filters.stopsLabel = 'Nonstop only';
                    filters.hasCustomFilters = true;
                } else if (combined.includes('1 stop') || combined.includes('1 escale') || combined.includes('1 zwischenstopp') || combined.includes('1 parada')) {
                    filters.stops = '1_STOP';
                    filters.stopsLabel = '1 stop or fewer';
                    filters.hasCustomFilters = true;
                } else if (combined.includes('2 stop') || combined.includes('2 escales') || combined.includes('2 paradas')) {
                    filters.stops = '2_STOPS';
                    filters.stopsLabel = '2 stops or fewer';
                    filters.hasCustomFilters = true;
                }
            }

            // 2. Cabin Class
            if (combined.includes('business') || combined.includes('affaires') || combined.includes('ejecutiva')) {
                filters.cabin = 'BUSINESS';
                filters.cabinLabel = 'Business Class';
                filters.hasCustomFilters = true;
            } else if (combined.includes('premium economy') || combined.includes('économique premium') || combined.includes('turista premium')) {
                filters.cabin = 'PREMIUM_ECONOMY';
                filters.cabinLabel = 'Premium Economy';
                filters.hasCustomFilters = true;
            } else if (combined.includes('first class') || (combined.includes('first') && !combined.includes('flight 1') && !combined.includes('1st'))) {
                filters.cabin = 'FIRST';
                filters.cabinLabel = 'First Class';
                filters.hasCustomFilters = true;
            }

            // 3. Passenger Count
            const paxMatch = combined.match(/(\d+)\s*(?:passenger|passager|passagier|viajero|adult)/i);
            if (paxMatch) {
                filters.passengers = parseInt(paxMatch[1], 10) || 1;
                if (filters.passengers > 1) filters.hasCustomFilters = true;
            }

            // 4. Airlines filter
            if ((combined.includes('airlines') || combined.includes('compagnies') || combined.includes('aerolíneas')) && !combined.includes('all airlines') && !combined.includes('toutes') && !combined.includes('todas')) {
                filters.airlines = btn.innerText.trim();
                filters.hasCustomFilters = true;
            }
        }
    } catch (e) {
        console.warn('Flight Hacker Pro: Filter extraction error', e);
    }

    return filters;
}

function buildFlightSearchUrl(origin, destination, depIso, retIso, userCurr, routeInfo = null) {
    const originHost = (typeof window !== 'undefined' && window.location && window.location.origin)
        ? window.location.origin
        : 'https://www.google.com';

    let currentGl = '';
    let currentHl = '';
    let currentCurr = userCurr || '';

    if (typeof window !== 'undefined' && window.location && window.location.search) {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('gl')) currentGl = urlParams.get('gl');
            if (urlParams.get('hl')) currentHl = urlParams.get('hl');
            if (!currentCurr && urlParams.get('curr')) currentCurr = urlParams.get('curr');
        } catch (e) {}
    }

    if (!currentCurr) {
        currentCurr = settings.baseCurrency || 'USD';
    }

    const activeFilters = (routeInfo && routeInfo.activeFilters) || (typeof extractActiveSearchFilters === 'function' ? extractActiveSearchFilters() : null);

    // Filter prefix (e.g. "Business class", "Nonstop")
    let filterPrefix = '';
    if (activeFilters) {
        if (activeFilters.cabin === 'BUSINESS') filterPrefix += 'Business+class+';
        else if (activeFilters.cabin === 'PREMIUM_ECONOMY') filterPrefix += 'Premium+economy+';
        else if (activeFilters.cabin === 'FIRST') filterPrefix += 'First+class+';

        if (activeFilters.stops === 'NONSTOP') filterPrefix += 'nonstop+';
    }

    // Filter suffix
    let filterSuffix = '';
    if (activeFilters && activeFilters.stops === '1_STOP') {
        filterSuffix += '+with+1+stop+or+fewer';
    }
    const paxCount = (activeFilters && activeFilters.passengers && activeFilters.passengers > 1)
        ? activeFilters.passengers
        : ((typeof settings !== 'undefined' && settings.passengerCount && settings.passengerCount > 1) ? settings.passengerCount : 1);
    if (paxCount > 1) {
        filterSuffix += `+for+${paxCount}+passengers`;
    }

    const isMultiCity = Boolean(routeInfo && routeInfo.isMultiCity);
    const multiCityLegs = (routeInfo && routeInfo.multiCityLegs) || [];

    let query = '';
    if (isMultiCity && multiCityLegs.length >= 2) {
        // Multi-City search query: Flights from LEG1_O to LEG1_D on DEP1 and from LEG2_O to LEG2_D on DEP2
        const leg1 = multiCityLegs[0];
        const leg2 = multiCityLegs[1];
        const dep1 = depIso || leg1.dateIso || (routeInfo ? routeInfo.activeDepISO : null) || '';
        const dep2 = retIso || leg2.dateIso || (routeInfo ? routeInfo.activeRetISO : null) || '';

        query = `${filterPrefix}Flights+from+${encodeURIComponent(leg1.origin)}+to+${encodeURIComponent(leg1.destination)}+on+${dep1}+and+from+${encodeURIComponent(leg2.origin)}+to+${encodeURIComponent(leg2.destination)}+on+${dep2}`;

        for (let i = 2; i < multiCityLegs.length; i++) {
            const legN = multiCityLegs[i];
            const depN = legN.dateIso || dep2;
            query += `+and+from+${encodeURIComponent(legN.origin)}+to+${encodeURIComponent(legN.destination)}+on+${depN}`;
        }
        query += filterSuffix;
    } else if (isMultiCity && depIso && retIso) {
        // Strict Multi-City fallback: NEVER generate +through+ which forces Google Flights into Round-Trip mode!
        const o = origin || (routeInfo ? routeInfo.origin : null) || 'ORIG';
        const d = destination || (routeInfo ? routeInfo.destination : null) || 'DEST';
        query = `${filterPrefix}Flights+from+${encodeURIComponent(o)}+to+${encodeURIComponent(d)}+on+${depIso}+and+from+${encodeURIComponent(d)}+to+${encodeURIComponent(o)}+on+${retIso}${filterSuffix}`;
    } else if (depIso && retIso) {
        query = `${filterPrefix}Flights+from+${encodeURIComponent(origin)}+to+${encodeURIComponent(destination)}+on+${depIso}+through+${retIso}${filterSuffix}`;
    } else if (depIso) {
        // ONE-WAY FLIGHT: Do NOT append +through+undefined!
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

// Route, Trip-Type & Date Extractor Engine
function extractCurrentRouteInfo() {
    const detectedPageCurr = detectActivePageCurrency();
    const userCurr = (settings.hasExplicitCurrency && settings.baseCurrency)
        ? settings.baseCurrency
        : (detectedPageCurr || settings.baseCurrency || 'USD');

    const titleText = document.title || '';
    const pageText = document.body ? (document.body.innerText || '') : '';

    let origin = '';
    let destination = '';

    const href = typeof window !== 'undefined' ? (window.location.href || '') : '';

    // Priority 0: Extract IATA route directly from URL search query (language-agnostic)
    const urlFromTo = href.match(/(?:from[+=%20]|origin[+=%20])([A-Z]{3}).*?(?:to[+=%20]|destination[+=%20])([A-Z]{3})/i);
    const urlToFrom = href.match(/(?:to[+=%20]|destination[+=%20])([A-Z]{3}).*?(?:from[+=%20]|origin[+=%20])([A-Z]{3})/i);
    if (urlFromTo && !invalidIataCodes.has(urlFromTo[1].toUpperCase()) && !invalidIataCodes.has(urlFromTo[2].toUpperCase())) {
        origin = urlFromTo[1].toUpperCase();
        destination = urlFromTo[2].toUpperCase();
    } else if (urlToFrom && !invalidIataCodes.has(urlToFrom[2].toUpperCase()) && !invalidIataCodes.has(urlToFrom[1].toUpperCase())) {
        origin = urlToFrom[2].toUpperCase();
        destination = urlToFrom[1].toUpperCase();
    }

    // 1. Extract 3-letter IATA Route from Title or Page Text
    if (!origin || !destination) {
        const routeMatch = (titleText + ' ' + pageText).match(/\b([A-Z]{3})\s*(?:to|➔|–|-)\s*([A-Z]{3})\b/i);
        if (routeMatch) {
            const oCand = routeMatch[1].toUpperCase();
            const dCand = routeMatch[2].toUpperCase();
            if (!invalidIataCodes.has(oCand)) origin = oCand;
            if (!invalidIataCodes.has(dCand)) destination = dCand;
        }
    }

    const globalCityMap = {
        'bengaluru': 'BLR', 'bangalore': 'BLR',
        'abu dhabi': 'AUH', 'auh': 'AUH', 'al ain': 'AAN',
        'dubai': 'DXB', 'dxb': 'DXB', 'sharjah': 'SHJ',
        'doha': 'DOH', 'doh': 'DOH',
        'muscat': 'MCT', 'bahrain': 'BAH', 'kuwait': 'KWI',
        'riyadh': 'RUH', 'jeddah': 'JED',
        'newark': 'EWR', 'new york': 'JFK', 'nyc': 'JFK', 'jfk': 'JFK', 'lga': 'LGA',
        'delhi': 'DEL', 'new delhi': 'DEL', 'mumbai': 'BOM', 'bombay': 'BOM',
        'london': 'LHR', 'lhr': 'LHR', 'gatwick': 'LGW',
        'singapore': 'SIN', 'paris': 'CDG', 'frankfurt': 'FRA',
        'san francisco': 'SFO', 'los angeles': 'LAX', 'chicago': 'ORD',
        'toronto': 'YYZ', 'sydney': 'SYD', 'tokyo': 'HND', 'haneda': 'HND', 'narita': 'NRT',
        'chennai': 'MAA', 'madras': 'MAA', 'hyderabad': 'HYD', 'kolkata': 'CCU', 'calcutta': 'CCU',
        'kochi': 'COK', 'cochin': 'COK', 'goa': 'GOI', 'ahmedabad': 'AMD'
    };

    if (!origin || !destination) {
        // Match city names in page title (e.g. "Bengaluru to Newark | Google Flights")
        const cityMatch = titleText.match(/^([A-Za-z\s]+)\s+to\s+([A-Za-z\s]+)/i);
        if (cityMatch) {
            const c1 = cityMatch[1].trim().toLowerCase();
            const c2 = cityMatch[2].trim().toLowerCase();
            const m1 = Object.keys(globalCityMap).find(k => c1.includes(k));
            const m2 = Object.keys(globalCityMap).find(k => c2.includes(k));
            if (m1) origin = globalCityMap[m1];
            if (m2) destination = globalCityMap[m2];
        }
    }

    if (!origin || !destination) {
        const fromInput = document.querySelector('input[aria-label*="Where from"], input[aria-label*="Departure airport"], input[placeholder*="Where from"]');
        const toInput = document.querySelector('input[aria-label*="Where to"], input[aria-label*="Destination airport"], input[placeholder*="Where to"]');
        if (fromInput && fromInput.value && !origin) {
            const oMatch = fromInput.value.match(/\b([A-Z]{3})\b/);
            if (oMatch && !invalidIataCodes.has(oMatch[1])) {
                origin = oMatch[1];
            } else {
                const low = fromInput.value.trim().toLowerCase();
                const matchedKey = Object.keys(globalCityMap).find(k => low.includes(k));
                if (matchedKey) origin = globalCityMap[matchedKey];
            }
        }
        if (toInput && toInput.value && !destination) {
            const dMatch = toInput.value.match(/\b([A-Z]{3})\b/);
            if (dMatch && !invalidIataCodes.has(dMatch[1])) {
                destination = dMatch[1];
            } else {
                const low = toInput.value.trim().toLowerCase();
                const matchedKey = Object.keys(globalCityMap).find(k => low.includes(k));
                if (matchedKey) destination = globalCityMap[matchedKey];
            }
        }
    }

    // Keep null if unknown — do not fabricate DEL-JFK!
    origin = origin || null;
    destination = destination || null;

    // 2. Extract Active Departure & Return Dates from URL or DOM
    let activeDepISO = null;
    let activeRetISO = null;

    const urlDateMatch = href.match(/on\+(\d{4}-\d{2}-\d{2})\+through\+(\d{4}-\d{2}-\d{2})/i) ||
                         href.match(/on=(\d{4}-\d{2}-\d{2}).*through=(\d{4}-\d{2}-\d{2})/i);
    const urlOneWayMatch = href.match(/(?:on\+|on=)(\d{4}-\d{2}-\d{2})/i);
    if (urlDateMatch) {
        activeDepISO = urlDateMatch[1];
        activeRetISO = urlDateMatch[2];
    } else if (urlOneWayMatch) {
        activeDepISO = urlOneWayMatch[1];
    } else {
        const dateSpans = Array.from(document.querySelectorAll('input[placeholder*="Date"], div[aria-label*="Departure"], div[aria-label*="Return"], button[aria-label*="Change departure date"]'));
        let depFound = null;
        let retFound = null;
        dateSpans.forEach(el => {
            if (isExtensionOwnedNode(el)) return;
            const txt = el.innerText || el.getAttribute('aria-label') || el.value || '';
            const m = txt.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|Mär|Mrz|Okt|Dez|janv|févr|fevr|avr|juin|juil|août|aout|déc|ene|abr|ago|dic)\s+(\d{1,2})|(\d{1,2})\s+(?:de\s+)?(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|Mär|Mrz|Okt|Dez|janv|févr|fevr|avr|juin|juil|août|aout|déc|ene|abr|ago|dic)/i);
            if (m && !depFound) depFound = txt;
            else if (m && depFound && !retFound) retFound = txt;
        });

        const now = new Date();
        const curYr = now.getFullYear();
        const curMo = now.getMonth();

        const parseDomDate = (str) => {
            if (!str) return null;
            const monthNames = {
                // English
                'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
                'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11,
                // German
                'mrz': 2, 'mär': 2, 'mai': 4, 'okt': 9, 'dez': 11,
                // French
                'janv': 0, 'févr': 1, 'fevr': 1, 'avr': 3, 'juin': 5, 'juil': 6, 'août': 7, 'aout': 7, 'déc': 11,
                // Spanish
                'ene': 0, 'abr': 3, 'ago': 7, 'dic': 11
            };
            
            let monthToken = null;
            let dayToken = null;
            
            // Format 1: Month Day ("Oct 15", "avr. 4")
            const mMatch = str.match(/\b([A-Za-z\u00C0-\u017F]{3,5})\.?\s+(\d{1,2})\b/i);
            if (mMatch) {
                const cand = mMatch[1].toLowerCase();
                const mKey = Object.keys(monthNames).find(k => cand.startsWith(k));
                if (mKey !== undefined) {
                    monthToken = monthNames[mKey];
                    dayToken = parseInt(mMatch[2], 10);
                }
            }
            
            // Format 2: Day Month ("15 Oct", "15 oct.", "4 avr.")
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
            // Year rollover logic: if search month is before current calendar month, date wraps to next year
            const yr = (monthToken < curMo) ? (curYr + 1) : curYr;
            return `${yr}-${mNum}-${dNum}`;
        };

        if (depFound && retFound) {
            activeDepISO = parseDomDate(depFound);
            activeRetISO = parseDomDate(retFound);
        } else if (depFound) {
            activeDepISO = parseDomDate(depFound);
        }
    }

    // 2.1 Active Search Filters Detection (Stops, Cabin, Passengers, Airlines)
    const activeFilters = extractActiveSearchFilters();

    // 2.2 Trip-Type Classifier (Multi-City, One-Way, Round-Trip)
    let explicitTripType = null;
    const allTripTypeCandidates = Array.from(document.querySelectorAll('button, div[role="button"], div[role="combobox"], [data-soi]')).filter(el => !isExtensionOwnedNode(el));
    for (const el of allTripTypeCandidates) {
        const text = (el.innerText || el.getAttribute('aria-label') || '').toLowerCase().trim();
        if (text === 'round trip' || text === 'round-trip' || text.startsWith('round trip') || text.includes('aller-retour') || text.includes('hin- und rückflug') || text.includes('ida y vuelta')) {
            explicitTripType = 'ROUND_TRIP';
            break;
        } else if (text === 'one-way' || text === 'one way' || text.startsWith('one-way') || text.startsWith('one way') || text.includes('aller simple') || text.includes('nur hinflug') || text.includes('solo ida')) {
            explicitTripType = 'ONE_WAY';
            break;
        } else if (text === 'multi-city' || text === 'multi city' || text.startsWith('multi-city') || text.includes('gabelflug') || text.includes('múltiples ciudades') || text.includes('destinations multiples')) {
            explicitTripType = 'MULTI_CITY';
            break;
        }
    }

    const fromInputs = Array.from(document.querySelectorAll('input[aria-label*="Where from"], input[aria-label*="Departure airport"], input[placeholder*="Where from"]')).filter(el => !isExtensionOwnedNode(el));
    const toInputs = Array.from(document.querySelectorAll('input[aria-label*="Where to"], input[aria-label*="Destination airport"], input[placeholder*="Where to"]')).filter(el => !isExtensionOwnedNode(el));
    const dateInputs = Array.from(document.querySelectorAll('input[placeholder*="Date"], input[aria-label*="Departure date"], div[aria-label*="Departure date"], button[aria-label*="Change departure date"]')).filter(el => !isExtensionOwnedNode(el));

    const hasMultiUrl = href.includes('+and+from+') || href.includes('and%2Bfrom') || href.includes('%2Band%2Bfrom%2B') || (href.match(/(?:from[+=%20]|origin[+=%20])/gi) || []).length > 1;

    let isMultiCity = false;
    let isOneWay = false;
    let isRoundTrip = false;

    if (explicitTripType === 'ROUND_TRIP') {
        isRoundTrip = true;
    } else if (explicitTripType === 'ONE_WAY') {
        isOneWay = true;
    } else if (explicitTripType === 'MULTI_CITY') {
        isMultiCity = true;
    } else if (hasMultiUrl) {
        isMultiCity = true;
    } else if (activeDepISO && activeRetISO) {
        isRoundTrip = true;
    } else if (activeDepISO && !activeRetISO) {
        isOneWay = true;
    } else {
        isRoundTrip = true;
    }

    const multiCityLegs = [];
    if (isMultiCity) {
        // Priority 1: Extract from DOM input rows
        if (hasMultiInputs) {
            for (let i = 0; i < Math.min(fromInputs.length, toInputs.length); i++) {
                const oVal = fromInputs[i].value || '';
                const dVal = toInputs[i].value || '';
                const oMatch = oVal.match(/\b([A-Z]{3})\b/);
                const dMatch = dVal.match(/\b([A-Z]{3})\b/);
                const rawDate = dateInputs[i] ? (dateInputs[i].value || dateInputs[i].innerText || dateInputs[i].getAttribute('aria-label') || '') : '';
                const dateIso = parseDomDate(rawDate);
                if (oMatch && dMatch && !invalidIataCodes.has(oMatch[1]) && !invalidIataCodes.has(dMatch[1])) {
                    multiCityLegs.push({
                        legIndex: i + 1,
                        origin: oMatch[1].toUpperCase(),
                        destination: dMatch[1].toUpperCase(),
                        dateIso: dateIso,
                        rawDateStr: rawDate
                    });
                }
            }
        }

        // Priority 2: Extract from URL queries
        if (multiCityLegs.length === 0 && href) {
            const urlLegRegex = /(?:from[+=%20]|origin[+=%20])([A-Z]{3}).*?(?:to[+=%20]|destination[+=%20])([A-Z]{3})(?:.*?on[+=%20](\d{4}-\d{2}-\d{2}))?/gi;
            const matches = Array.from(href.matchAll(urlLegRegex));
            matches.forEach((m, idx) => {
                const o = m[1].toUpperCase();
                const d = m[2].toUpperCase();
                const dIso = m[3] || null;
                if (!invalidIataCodes.has(o) && !invalidIataCodes.has(d)) {
                    if (!multiCityLegs.some(l => l.origin === o && l.destination === d)) {
                        multiCityLegs.push({
                            legIndex: idx + 1,
                            origin: o,
                            destination: d,
                            dateIso: dIso,
                            rawDateStr: dIso
                        });
                    }
                }
            });
        }

        // Priority 3: Extract from title and page text
        if (multiCityLegs.length === 0) {
            const legMatches = Array.from((titleText + ' ' + pageText).matchAll(/\b([A-Z]{3})\s*(?:to|➔|–|-)\s*([A-Z]{3})\b/gi));
            legMatches.forEach((m, idx) => {
                const o = m[1].toUpperCase();
                const d = m[2].toUpperCase();
                if (!invalidIataCodes.has(o) && !invalidIataCodes.has(d)) {
                    if (!multiCityLegs.some(l => l.origin === o && l.destination === d)) {
                        multiCityLegs.push({
                            legIndex: idx + 1,
                            origin: o,
                            destination: d,
                            dateIso: null,
                            rawDateStr: null
                        });
                    }
                }
            });
        }

        if (multiCityLegs.length > 0) {
            if (!origin) origin = multiCityLegs[0].origin;
            if (!destination) destination = multiCityLegs[multiCityLegs.length - 1].destination;
            if (multiCityLegs[0].dateIso && !activeDepISO) activeDepISO = multiCityLegs[0].dateIso;
            if (multiCityLegs[1] && multiCityLegs[1].dateIso && !activeRetISO) activeRetISO = multiCityLegs[1].dateIso;
        }
    }

    let isOpenJaw = false;
    let openJawGap = null;
    if (isMultiCity && multiCityLegs.length >= 2) {
        const leg1Dest = multiCityLegs[0].destination;
        const leg2Orig = multiCityLegs[1].origin;
        if (leg1Dest !== leg2Orig) {
            isOpenJaw = true;
            openJawGap = { from: leg1Dest, to: leg2Orig };
        }
    }

    // 3. Dynamically extract live lowest price directly from visible Google Flights card elements
    let lowestLiveFareBase = Infinity;
    
    // Priority 1: Check window.fhpLastLowestBasePrice populated by analyzeFlights
    if (typeof window !== 'undefined' && window.fhpLastLowestBasePrice && window.fhpLastLowestBasePrice < Infinity) {
        lowestLiveFareBase = window.fhpLastLowestBasePrice;
    } else {
        // Priority 2: Target ALL flight card containers across all sections (Best & Other) + header summary pills
        const summaryScope = Array.from(document.querySelectorAll('[aria-label*="Cheapest"], [aria-label*="cheapest"], [aria-label*="from"], .m74Sce, .Z00n4b')).filter(el => !isExtensionOwnedNode(el));
        const flightContainers = Array.from(document.querySelectorAll('li, [role="listitem"], [jsaction*="flight"], .gWSBe, [aria-label*="round trip"]')).filter(el => !isExtensionOwnedNode(el));
        const searchScope = [...summaryScope, ...(flightContainers.length > 0 ? flightContainers : Array.from(document.querySelectorAll('span, div, button')).filter(el => !isExtensionOwnedNode(el)))];

        searchScope.forEach(el => {
            if (isExtensionOwnedNode(el)) return;
            const txt = el.innerText || el.getAttribute('aria-label') || '';
            if (!txt || txt.length > 250) return;
            const fareData = parseFareString(txt);
            if (fareData) {
                const fareInUSD = fareData.price / (exchangeRates[fareData.currency] || 1.0);
                if (fareInUSD >= 25 && fareInUSD <= 25000) { // Reasonable flight fare in USD
                    const fareInUserCurr = fareInUSD * (exchangeRates[userCurr] || 1.0);
                    if (fareInUserCurr < lowestLiveFareBase) {
                        lowestLiveFareBase = fareInUserCurr;
                    }
                }
            }
        });
    }

    if (lowestLiveFareBase === Infinity) {
        // Priority 3: Leaf-node DOM price scanner across native visible elements containing price symbols
        const allDomNodes = Array.from(document.querySelectorAll('span, div, b, strong, button')).filter(el => !isExtensionOwnedNode(el));
        allDomNodes.forEach(el => {
            if (el.children.length > 0) return; // Leaf nodes only
            if (isExtensionOwnedNode(el)) return;
            const txt = (el.innerText || el.textContent || '').trim();
            if (!txt || txt.length > 35) return;
            const fareData = parseFareString(txt);
            if (fareData) {
                const fareInUSD = fareData.price / (exchangeRates[fareData.currency] || 1.0);
                if (fareInUSD >= 25 && fareInUSD <= 25000) {
                    const fareInUserCurr = fareInUSD * (exchangeRates[userCurr] || 1.0);
                    if (fareInUserCurr < lowestLiveFareBase) {
                        lowestLiveFareBase = fareInUserCurr;
                    }
                }
            }
        });
    }

    let basePriceUSD = null;
    if (lowestLiveFareBase < Infinity) {
        basePriceUSD = lowestLiveFareBase / (exchangeRates[userCurr] || 1.0);
    }

    return { 
        origin, 
        destination, 
        basePriceUSD, 
        userCurr, 
        liveLowestFare: lowestLiveFareBase < Infinity ? Math.round(lowestLiveFareBase) : null,
        activeDepISO,
        activeRetISO,
        isOneWay,
        isMultiCity,
        isRoundTrip,
        multiCityLegs,
        isOpenJaw,
        openJawGap,
        activeFilters
    };
}

function calculateRealisticFareMultiplier(depDate, retDate, startDate) {
    const depDay = depDate.getDay();
    // Moderated Day-of-Week factors (realistic airline revenue management range ±2-3%)
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

        // Granular Trip Duration Curve (Airline Revenue Management Model)
        if (tripDays <= 3) durationMultiplier = 1.025;       // Express Weekend Getaway premium
        else if (tripDays <= 6) durationMultiplier = 1.010;  // Short stay
        else if (tripDays <= 9) durationMultiplier = 1.000;  // 1-Week Vacation (Baseline)
        else if (tripDays <= 13) durationMultiplier = 1.015; // Mid-length stay
        else if (tripDays <= 18) durationMultiplier = 1.028; // 2-Week Holiday
        else if (tripDays <= 25) durationMultiplier = 1.038; // 3-Week Extended Stay
        else if (tripDays <= 35) durationMultiplier = 1.048; // 1-Month Long Stay
        else durationMultiplier = 1.060;                      // Extended Long Stay (>35d)

        // Calendar Return Date Volatility Variance (eliminates clone rates across different return dates)
        const retDateSeed = (retDate.getDate() * 7 + retDate.getMonth() * 13) % 17;
        retDateVariance = 1.0 + ((retDateSeed - 8) * 0.0025);
    } else {
        // One-Way Flight: Duration multiplier is neutral (1.0), and variance uses departure day seed
        const depDateSeed = (depDate.getDate() * 5 + depDate.getMonth() * 11) % 17;
        retDateVariance = 1.0 + ((depDateSeed - 8) * 0.002);
    }

    return dowMultiplier * advanceMultiplier * durationMultiplier * retDateVariance;
}

function generateMatrixData(routeInfo, scanHorizon = 30, tripBracket = '5-21', customTripLengths = null, storageCache = {}) {
    const numDays = Math.max(1, Math.min(180, parseInt(scanHorizon, 10) || 30));
    const startDate = new Date();
    const isOneWay = Boolean(routeInfo && routeInfo.isOneWay);
    const isMultiCity = Boolean(routeInfo && routeInfo.isMultiCity);

    let activeMultiplier = null;
    if (routeInfo.activeDepISO) {
        const activeDep = new Date(routeInfo.activeDepISO);
        const activeRet = routeInfo.activeRetISO ? new Date(routeInfo.activeRetISO) : null;
        if (!isNaN(activeDep.getTime()) && (!activeRet || !isNaN(activeRet.getTime()))) {
            activeMultiplier = calculateRealisticFareMultiplier(activeDep, activeRet, startDate);
        }
    }

    // Fixed Route Baseline Anchor Calculation (prevents shifting baselines when changing active dates)
    const anchorKey = isOneWay 
        ? `fhp_anchor_${routeInfo.origin}_${routeInfo.destination}_oneway`
        : (isMultiCity
            ? `fhp_anchor_${routeInfo.origin}_${routeInfo.destination}_multicity`
            : `fhp_anchor_${routeInfo.origin}_${routeInfo.destination}`);
    let storedAnchorUSD = storageCache ? storageCache[anchorKey] : null;
    let routeAnchorUSD = routeInfo.basePriceUSD || (isOneWay ? 250 : 500);

    if (activeMultiplier && activeMultiplier > 0 && routeInfo.liveLowestFare && routeInfo.liveLowestFare > 0) {
        routeAnchorUSD = (routeInfo.liveLowestFare / (exchangeRates[routeInfo.userCurr] || 1.0)) / activeMultiplier;
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            chrome.storage.local.set({ [anchorKey]: routeAnchorUSD });
        }
        if (storageCache) {
            storageCache[anchorKey] = routeAnchorUSD;
        }
    } else if (storedAnchorUSD && !isNaN(storedAnchorUSD) && storedAnchorUSD > 0) {
        routeAnchorUSD = storedAnchorUSD;
    }

    const CACHE_TTL_MS = 2 * 60 * 60 * 1000;
    const pax = settings.passengerCount || 1;

    // -------------------------------------------------------------
    // Branch A: ONE-WAY FLIGHT CALENDAR HEAT-MAP
    // -------------------------------------------------------------
    if (isOneWay) {
        const columns = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const rows = [];
        const allPrices = [];
        const allCells = [];
        let bestCell = null;
        let sumPrices = 0;

        let currentWeekCells = [];
        let currentWeekStartStr = '';
        let weekIndex = 1;

        for (let d = 0; d < numDays; d++) {
            const depDate = new Date(startDate);
            depDate.setDate(startDate.getDate() + d + 1);

            const depDayOfWeek = depDate.toLocaleDateString('en-US', { weekday: 'short' });
            const depDateStr = depDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const depFullStr = `${depDayOfWeek}, ${depDateStr}`;
            const year = depDate.getFullYear();
            const month = String(depDate.getMonth() + 1).padStart(2, '0');
            const day = String(depDate.getDate()).padStart(2, '0');
            const depDateISO = `${year}-${month}-${day}`;

            const isActiveSearchCell = Boolean(routeInfo.activeDepISO && depDateISO === routeInfo.activeDepISO);
            const cacheKey = `fhp_fare_${routeInfo.origin}_${routeInfo.destination}_${depDateISO}_oneway_p${pax}`;
            const cachedEntry = storageCache ? storageCache[cacheKey] : null;
            let fareBase;
            let fareUSD;
            let provenance = 'MODELLED_ESTIMATE';

            if (isActiveSearchCell && routeInfo.liveLowestFare && routeInfo.liveLowestFare > 0) {
                fareBase = routeInfo.liveLowestFare;
                fareUSD = fareBase / (exchangeRates[routeInfo.userCurr] || 1.0);
                provenance = 'OBSERVED_LIVE';

                const cachePayload = {
                    fareBase,
                    userCurr: routeInfo.userCurr,
                    passengers: pax,
                    isOneWay: true,
                    timestamp: Date.now(),
                    source: 'OBSERVED_LIVE'
                };
                if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                    chrome.storage.local.set({ [cacheKey]: cachePayload });
                }
                if (storageCache) storageCache[cacheKey] = cachePayload;
            } else if (cachedEntry && cachedEntry.fareBase && cachedEntry.fareBase > 0 &&
                       (!cachedEntry.passengers || cachedEntry.passengers === pax) &&
                       (Date.now() - (cachedEntry.timestamp || 0)) < CACHE_TTL_MS) {
                const cachedUserRate = exchangeRates[routeInfo.userCurr] || 1.0;
                const cachedSrcRate = exchangeRates[cachedEntry.userCurr || 'INR'] || 1.0;
                fareBase = Math.round((cachedEntry.fareBase / cachedSrcRate) * cachedUserRate);
                fareUSD = fareBase / (exchangeRates[routeInfo.userCurr] || 1.0);
                provenance = 'CACHED_OBSERVATION';
            } else {
                provenance = 'MODELLED_ESTIMATE';
                const rawMultiplier = calculateRealisticFareMultiplier(depDate, null, startDate);
                let dev = rawMultiplier - 1.0;
                if (dev > 0.08) dev = 0.08 + (dev - 0.08) * 0.35;
                else if (dev < -0.08) dev = -0.08 + (dev - (-0.08)) * 0.35;
                const finalMultiplier = 1.0 + dev;

                fareUSD = routeAnchorUSD * finalMultiplier;
                fareBase = Math.round(fareUSD * (exchangeRates[routeInfo.userCurr] || 1.0));
            }

            allPrices.push(fareBase);
            sumPrices += fareBase;

            const daysOut = Math.max(1, Math.round((depDate - startDate) / (1000 * 60 * 60 * 24)));
            let leadTimeCategory = 'DOMESTIC_SWEET_SPOT';
            let leadTimeBadge = '🎯 Domestic Sweet Spot (21-60d)';
            if (daysOut <= 14) {
                leadTimeCategory = 'LAST_MINUTE';
                leadTimeBadge = '⚠️ Last Minute (<14d)';
            } else if (daysOut <= 21) {
                leadTimeCategory = 'CLOSE_IN';
                leadTimeBadge = '⚡ Close-In (15-21d)';
            } else if (daysOut <= 60) {
                leadTimeCategory = 'DOMESTIC_SWEET_SPOT';
                leadTimeBadge = '🎯 Domestic Sweet Spot (21-60d)';
            } else if (daysOut <= 120) {
                leadTimeCategory = 'INTL_SWEET_SPOT';
                leadTimeBadge = '🌐 Intl Sweet Spot (60-120d)';
            } else {
                leadTimeCategory = 'DEEP_ADVANCE';
                leadTimeBadge = '📅 Deep Advance (>120d)';
            }

            const cellObj = {
                len: 0,
                daysOut,
                leadTimeCategory,
                leadTimeBadge,
                depDayOfWeek,
                depDateStr,
                depFullStr,
                retDayOfWeek: '-',
                retDateStr: 'One-Way',
                retFullStr: 'One-Way',
                depDateISO,
                retDateISO: null,
                fareUSD,
                fareBase,
                provenance,
                isOneWay: true,
                isLiveScraped: Boolean(provenance === 'OBSERVED_LIVE'),
                dateCode: `${depDateISO}_oneway`
            };

            if (!bestCell || fareBase < bestCell.fareBase) {
                bestCell = cellObj;
            }

            allCells.push(cellObj);

            // Align cell with column: Mon=0, Tue=1, ... Sun=6
            const dayOfWeekIdx = (depDate.getDay() + 6) % 7;
            if (currentWeekCells.length === 0) {
                currentWeekStartStr = depDateStr;
                for (let pad = 0; pad < dayOfWeekIdx; pad++) {
                    currentWeekCells.push(null);
                }
            }

            currentWeekCells.push(cellObj);

            if (currentWeekCells.length === 7 || d === numDays - 1) {
                while (currentWeekCells.length < 7) {
                    currentWeekCells.push(null);
                }
                rows.push({
                    label: `Week ${weekIndex} (${currentWeekStartStr})`,
                    weekNum: weekIndex,
                    depDateStr: currentWeekStartStr,
                    depDayOfWeek: 'Week',
                    depFullStr: `Week ${weekIndex} (${currentWeekStartStr})`,
                    cells: currentWeekCells
                });
                weekIndex++;
                currentWeekCells = [];
            }
        }

        allPrices.sort((a, b) => a - b);
        const avgPrice = allPrices.length > 0 ? Math.round(sumPrices / allPrices.length) : 0;
        const lowThreshold = allPrices[Math.floor(allPrices.length * 0.15)] || avgPrice;
        const highThreshold = allPrices[Math.floor(allPrices.length * 0.85)] || avgPrice;

        const savingsBase = bestCell ? Math.max(0, avgPrice - bestCell.fareBase) : 0;
        const savingsPct = (avgPrice > 0 && bestCell) ? ((savingsBase / avgPrice) * 100).toFixed(1) : '0';
        const totalScanned = allCells.length;

        const smartBestDeal = bestCell ? {
            ...bestCell,
            avgPrice,
            savingsBase,
            savingsPct
        } : null;

        return {
            routeInfo,
            numDays,
            isOneWay: true,
            columns,
            tripLengths: [1],
            minTripLen: 1,
            maxTripLen: 1,
            totalScanned,
            rows,
            lowThreshold,
            highThreshold,
            smartBestDeal,
            allCells,
            avgPrice
        };
    }

    // -------------------------------------------------------------
    // Branch B: ROUND-TRIP RETURN DURATION MATRIX
    // -------------------------------------------------------------
    let tripLengths = (customTripLengths && Array.isArray(customTripLengths) && customTripLengths.length > 0) ? customTripLengths : null;

    if (!tripLengths) {
        const bracketPresets = {
            '1-3': [1, 2, 3],
            '3-7': [3, 4, 5, 6, 7],
            '7-10': [7, 8, 9, 10],
            '7-14': [7, 8, 10, 12, 14],
            '14-21': [14, 16, 18, 20, 21],
            '21-30': [21, 23, 25, 28, 30],
            '14-45': [14, 21, 28, 35, 45],
            '21-45': [21, 27, 33, 39, 45],
            '30-45': [30, 33, 37, 41, 45],
            '5-21': [5, 7, 10, 14, 21],
            '1-30': [1, 3, 7, 14, 21, 30],
            '1-45': [1, 7, 14, 21, 30, 45]
        };

        tripLengths = bracketPresets[tripBracket];
        if (!tripLengths) {
            const parts = String(tripBracket).split('-').map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n));
            if (parts.length === 2 && parts[0] <= parts[1]) {
                const minL = Math.max(1, parts[0]);
                const maxL = Math.min(90, parts[1]);
                if (maxL - minL <= 6) {
                    tripLengths = Array.from({length: maxL - minL + 1}, (_, i) => minL + i);
                } else {
                    const step = (maxL - minL) / 4;
                    tripLengths = [minL, Math.round(minL + step), Math.round(minL + step * 2), Math.round(minL + step * 3), maxL];
                    tripLengths = [...new Set(tripLengths)];
                }
            } else {
                tripLengths = [5, 7, 10, 14, 21];
            }
        }
    }

    const rows = [];
    const allPrices = [];
    const allCells = [];
    let bestCell = null;
    let sumPrices = 0;

    for (let d = 0; d < numDays; d++) {
        const depDate = new Date(startDate);
        depDate.setDate(startDate.getDate() + d + 1);

        const depDayOfWeek = depDate.toLocaleDateString('en-US', { weekday: 'short' });
        const depDateStr = depDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const depFullStr = `${depDayOfWeek}, ${depDateStr}`;
        const year = depDate.getFullYear();
        const month = String(depDate.getMonth() + 1).padStart(2, '0');
        const day = String(depDate.getDate()).padStart(2, '0');
        const depDateISO = `${year}-${month}-${day}`;

        const cellData = [];

        tripLengths.forEach(len => {
            const retDate = new Date(depDate);
            retDate.setDate(depDate.getDate() + len);
            const retDayOfWeek = retDate.toLocaleDateString('en-US', { weekday: 'short' });
            const retDateStr = retDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const retFullStr = `${retDayOfWeek}, ${retDateStr}`;
            const retYear = retDate.getFullYear();
            const retMonth = String(retDate.getMonth() + 1).padStart(2, '0');
            const retDay = String(retDate.getDate()).padStart(2, '0');
            const retDateISO = `${retYear}-${retMonth}-${retDay}`;

            const isActiveSearchCell = Boolean(routeInfo.activeDepISO && routeInfo.activeRetISO && depDateISO === routeInfo.activeDepISO && retDateISO === routeInfo.activeRetISO);

            const cacheKey = isMultiCity
                ? `fhp_fare_mc_${routeInfo.origin}_${routeInfo.destination}_${depDateISO}_${retDateISO}_p${pax}`
                : `fhp_fare_${routeInfo.origin}_${routeInfo.destination}_${depDateISO}_${retDateISO}_p${pax}`;
            const cachedEntry = storageCache ? storageCache[cacheKey] : null;
            let fareBase;
            let fareUSD;
            let provenance = 'MODELLED_ESTIMATE';

            if (isActiveSearchCell && routeInfo.liveLowestFare && routeInfo.liveLowestFare > 0) {
                fareBase = routeInfo.liveLowestFare;
                fareUSD = fareBase / (exchangeRates[routeInfo.userCurr] || 1.0);
                provenance = 'OBSERVED_LIVE';

                const cachePayload = {
                    fareBase,
                    userCurr: routeInfo.userCurr,
                    passengers: pax,
                    timestamp: Date.now(),
                    source: 'OBSERVED_LIVE'
                };
                if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                    chrome.storage.local.set({ [cacheKey]: cachePayload });
                }
                if (storageCache) {
                    storageCache[cacheKey] = cachePayload;
                }
            } else if (cachedEntry && cachedEntry.fareBase && cachedEntry.fareBase > 0 &&
                       (!cachedEntry.passengers || cachedEntry.passengers === pax) &&
                       (Date.now() - (cachedEntry.timestamp || 0)) < CACHE_TTL_MS) {
                const cachedUserRate = exchangeRates[routeInfo.userCurr] || 1.0;
                const cachedSrcRate = exchangeRates[cachedEntry.userCurr || 'INR'] || 1.0;
                fareBase = Math.round((cachedEntry.fareBase / cachedSrcRate) * cachedUserRate);
                fareUSD = fareBase / (exchangeRates[routeInfo.userCurr] || 1.0);
                provenance = 'CACHED_OBSERVATION';
            } else {
                provenance = 'MODELLED_ESTIMATE';
                const rawMultiplier = calculateRealisticFareMultiplier(depDate, retDate, startDate);
                let dev = rawMultiplier - 1.0;
                if (dev > 0.08) dev = 0.08 + (dev - 0.08) * 0.35;
                else if (dev < -0.08) dev = -0.08 + (dev - (-0.08)) * 0.35;
                const finalMultiplier = 1.0 + dev;

                fareUSD = routeAnchorUSD * finalMultiplier;
                fareBase = Math.round(fareUSD * (exchangeRates[routeInfo.userCurr] || 1.0));
            }

            allPrices.push(fareBase);
            sumPrices += fareBase;

            const daysOut = Math.max(1, Math.round((depDate - startDate) / (1000 * 60 * 60 * 24)));
            let leadTimeCategory = 'DOMESTIC_SWEET_SPOT';
            let leadTimeBadge = '🎯 Domestic Sweet Spot (21-60d)';
            if (daysOut <= 14) {
                leadTimeCategory = 'LAST_MINUTE';
                leadTimeBadge = '⚠️ Last Minute (<14d)';
            } else if (daysOut <= 21) {
                leadTimeCategory = 'CLOSE_IN';
                leadTimeBadge = '⚡ Close-In (15-21d)';
            } else if (daysOut <= 60) {
                leadTimeCategory = 'DOMESTIC_SWEET_SPOT';
                leadTimeBadge = '🎯 Domestic Sweet Spot (21-60d)';
            } else if (daysOut <= 120) {
                leadTimeCategory = 'INTL_SWEET_SPOT';
                leadTimeBadge = '🌐 Intl Sweet Spot (60-120d)';
            } else {
                leadTimeCategory = 'DEEP_ADVANCE';
                leadTimeBadge = '📅 Deep Advance (>120d)';
            }

            const cellObj = {
                len,
                daysOut,
                leadTimeCategory,
                leadTimeBadge,
                depDayOfWeek,
                depDateStr,
                depFullStr,
                retDayOfWeek,
                retDateStr,
                retFullStr,
                depDateISO,
                retDateISO,
                fareUSD,
                fareBase,
                provenance,
                isOneWay: false,
                isMultiCity: isMultiCity,
                multiCityLegs: (routeInfo && routeInfo.multiCityLegs) || [],
                isOpenJaw: Boolean(routeInfo && routeInfo.isOpenJaw),
                openJawGap: (routeInfo && routeInfo.openJawGap) || null,
                isLiveScraped: Boolean(provenance === 'OBSERVED_LIVE'),
                dateCode: `${year}-${month}-${day}_${len}`
            };

            if (!bestCell || fareBase < bestCell.fareBase) {
                bestCell = cellObj;
            }

            cellData.push(cellObj);
            allCells.push(cellObj);
        });

        rows.push({ depDateStr, depDayOfWeek, depFullStr, cells: cellData });
    }

    allPrices.sort((a, b) => a - b);
    const avgPrice = Math.round(sumPrices / allPrices.length);
    const lowThreshold = allPrices[Math.floor(allPrices.length * 0.15)];
    const highThreshold = allPrices[Math.floor(allPrices.length * 0.85)];

    const savingsBase = bestCell ? Math.max(0, avgPrice - bestCell.fareBase) : 0;
    const savingsPct = (avgPrice > 0 && bestCell) ? ((savingsBase / avgPrice) * 100).toFixed(1) : '0';
    const totalScanned = numDays * tripLengths.length;

    const smartBestDeal = bestCell ? {
        ...bestCell,
        avgPrice,
        savingsBase,
        savingsPct
    } : null;

    const minTripLen = Math.min(...tripLengths);
    const maxTripLen = Math.max(...tripLengths);

    return {
        routeInfo,
        numDays,
        isOneWay: false,
        isMultiCity,
        multiCityLegs: (routeInfo && routeInfo.multiCityLegs) || [],
        isOpenJaw: Boolean(routeInfo && routeInfo.isOpenJaw),
        openJawGap: (routeInfo && routeInfo.openJawGap) || null,
        tripLengths,
        minTripLen,
        maxTripLen,
        totalScanned,
        rows,
        lowThreshold,
        highThreshold,
        smartBestDeal,
        allCells,
        avgPrice
    };
}

function findOptimalFilteredDeal(matrixData, outDayFilter = 'ANY', retDayFilter = 'ANY', minDaysFilter = 1, maxDaysFilter = null, leadTimeFilter = 'ANY') {
    let filteredCells = (matrixData && matrixData.allCells) ? matrixData.allCells : [];

    if (matrixData && matrixData.isOneWay) {
        if (outDayFilter && outDayFilter !== 'ANY') {
            filteredCells = filteredCells.filter(c => c.depDayOfWeek === outDayFilter);
        }
    } else {
        if (outDayFilter && outDayFilter !== 'ANY') {
            filteredCells = filteredCells.filter(c => c.depDayOfWeek === outDayFilter);
        }
        if (retDayFilter && retDayFilter !== 'ANY') {
            filteredCells = filteredCells.filter(c => c.retDayOfWeek === retDayFilter);
        }

        // Support both exact duration when single bound passed and range when min/max provided
        const hasExplicitMax = (maxDaysFilter !== null && maxDaysFilter !== undefined) && (
            (typeof maxDaysFilter === 'number') || 
            (typeof maxDaysFilter === 'string' && !isNaN(parseInt(maxDaysFilter, 10)) && !['ANY', 'SWEET_SPOT', 'DOMESTIC', 'INTL', 'LAST_MINUTE', 'DEEP_ADVANCE'].includes(maxDaysFilter))
        );

        if (minDaysFilter && minDaysFilter !== 'ANY') {
            const minD = parseInt(minDaysFilter, 10);
            if (!isNaN(minD)) {
                if (hasExplicitMax) {
                    const maxD = parseInt(maxDaysFilter, 10);
                    filteredCells = filteredCells.filter(c => c.len >= minD && c.len <= maxD);
                } else {
                    // Exact duration match when no explicit upper bound is provided
                    filteredCells = filteredCells.filter(c => c.len === minD);
                }
            }
        }
    }

    const effectiveLeadTime = (typeof maxDaysFilter === 'string' && ['ANY', 'SWEET_SPOT', 'DOMESTIC', 'INTL', 'LAST_MINUTE', 'DEEP_ADVANCE'].includes(maxDaysFilter))
        ? maxDaysFilter
        : leadTimeFilter;

    if (effectiveLeadTime && effectiveLeadTime !== 'ANY') {
        if (effectiveLeadTime === 'SWEET_SPOT') {
            filteredCells = filteredCells.filter(c => c.daysOut >= 21 && c.daysOut <= 120);
        } else if (effectiveLeadTime === 'DOMESTIC') {
            filteredCells = filteredCells.filter(c => c.daysOut >= 21 && c.daysOut <= 60);
        } else if (effectiveLeadTime === 'INTL') {
            filteredCells = filteredCells.filter(c => c.daysOut >= 60 && c.daysOut <= 120);
        } else if (effectiveLeadTime === 'LAST_MINUTE') {
            filteredCells = filteredCells.filter(c => c.daysOut <= 21);
        } else if (effectiveLeadTime === 'DEEP_ADVANCE') {
            filteredCells = filteredCells.filter(c => c.daysOut > 120);
        }
    }

    if (filteredCells.length === 0) return null;

    let bestCell = filteredCells[0];
    filteredCells.forEach(c => {
        if (c.fareBase < bestCell.fareBase) bestCell = c;
    });

    const avgPrice = matrixData.avgPrice || 0;
    const savingsBase = Math.max(0, avgPrice - bestCell.fareBase);
    const savingsPct = avgPrice > 0 ? ((savingsBase / avgPrice) * 100).toFixed(1) : '0';

    return {
        ...bestCell,
        avgPrice,
        savingsBase,
        savingsPct,
        totalMatches: filteredCells.length
    };
}

function exportMatrixToCSV(matrixData, routeInfo) {
    const origin = routeInfo.origin || 'UNKNOWN';
    const destination = routeInfo.destination || 'UNKNOWN';
    const isOneWay = Boolean(matrixData && matrixData.isOneWay);
    const isMultiCity = Boolean(matrixData && matrixData.isMultiCity);
    const tripTypeLabel = isOneWay ? 'One-Way' : (isMultiCity ? 'Multi-City' : 'Round-Trip');
    let csv = `Flight Hacker Pro - ${matrixData.numDays}-Day ${isOneWay ? 'One-Way Departure Calendar' : (isMultiCity ? 'Multi-City Itinerary Matrix' : 'Fare Matrix')} (${origin} to ${destination})\n`;
    csv += `Trip Type: ${tripTypeLabel}\n`;
    csv += `Base Currency: ${routeInfo.userCurr}\n`;
    csv += `Passengers: ${settings.passengerCount || 1}\n`;
    csv += `Total Combinations Checked: ${matrixData.totalScanned}\n`;
    csv += `Export Timestamp: ${new Date().toISOString()}\n\n`;

    if (isOneWay) {
        csv += `Week,${(matrixData.columns || ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']).join(',')}\n`;
        matrixData.rows.forEach(row => {
            const line = [`"${row.label || row.depDateStr}"`, ...row.cells.map(c => c ? `"${c.depDateStr}: ${formatMoney(c.fareBase, routeInfo.userCurr)} [${c.provenance || 'MODELLED_ESTIMATE'}]"` : '""')].join(',');
            csv += line + '\n';
        });
    } else if (isMultiCity) {
        csv += `Leg 1 Departure Date,${matrixData.tripLengths.map(l => `${l}d Gap (Leg 2)`).join(',')}\n`;
        matrixData.rows.forEach(row => {
            const line = [`"${row.depFullStr}"`, ...row.cells.map(c => `"${formatMoney(c.fareBase, routeInfo.userCurr)} [${c.provenance || 'MODELLED_ESTIMATE'}] (Leg 2: ${c.retFullStr})"` )].join(',');
            csv += line + '\n';
        });
    } else {
        csv += `Departure Date,${matrixData.tripLengths.map(l => `${l} Days Return`).join(',')}\n`;
        matrixData.rows.forEach(row => {
            const line = [`"${row.depFullStr}"`, ...row.cells.map(c => `"${formatMoney(c.fareBase, routeInfo.userCurr)} [${c.provenance || 'MODELLED_ESTIMATE'}] (Ret: ${c.retFullStr})"` )].join(',');
            csv += line + '\n';
        });
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `FlightHackerPro_Matrix_${origin}_${destination}_${isOneWay ? 'OneWay_' : (isMultiCity ? 'MultiCity_' : '')}${matrixData.numDays}Days.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportDealToICS(deal, routeInfo) {
    if (!deal || !deal.depDateISO) {
        alert('No optimal flight deal date is currently selected to export.');
        return;
    }
    const origin = routeInfo.origin || 'ORIGIN';
    const destination = routeInfo.destination || 'DEST';
    const depIso = deal.depDateISO.replace(/-/g, '');
    let dtEnd = depIso;
    if (deal.retDateISO) {
        const retDate = new Date(deal.retDateISO);
        retDate.setDate(retDate.getDate() + 1);
        dtEnd = retDate.toISOString().slice(0, 10).replace(/-/g, '');
    } else {
        const nextDay = new Date(deal.depDateISO);
        nextDay.setDate(nextDay.getDate() + 1);
        dtEnd = nextDay.toISOString().slice(0, 10).replace(/-/g, '');
    }

    const bookingUrl = buildFlightSearchUrl(origin, destination, deal.depDateISO, deal.retDateISO || null, routeInfo.userCurr, routeInfo);
    const summary = `✈️ Flight: ${origin} ➔ ${destination} (${formatMoney(deal.fareBase, routeInfo.userCurr)})`;
    const description = `Optimal flight deal identified via Flight Hacker Pro on Google Flights.\\nRoute: ${origin} to ${destination}\\nFare: ${formatMoney(deal.fareBase, routeInfo.userCurr)}\\nSavings: ${formatMoney(deal.savingsBase || 0, routeInfo.userCurr)} (${deal.savingsPct || 0}% off average)\\nDeparture: ${deal.depFullStr || deal.depDateISO}\\nReturn: ${deal.retFullStr || (deal.retDateISO || 'One-Way')}\\nBook on Google Flights: ${bookingUrl}`;

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Flight Hacker Pro//Flight Deal Alert//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:fhp-${Date.now()}@flighthackerpro`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        `DTSTART;VALUE=DATE:${depIso}`,
        `DTEND;VALUE=DATE:${dtEnd}`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:${description}`,
        `URL:${bookingUrl}`,
        'STATUS:CONFIRMED',
        'TRANSP:OPAQUE',
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `FlightDeal_${origin}_${destination}_${deal.depDateISO}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function getProvenanceBadgeHtml(prov) {
    if (prov === 'OBSERVED_LIVE') {
        return `<span style="font-size:9px; background:#e6f4ea; color:#137333; padding:1px 4px; border-radius:4px; font-weight:700; display:inline-block; margin-left:2px;" title="Verified Live Scraped Fare from Google Flights">✓ Live</span>`;
    } else if (prov === 'CACHED_OBSERVATION') {
        return `<span style="font-size:9px; background:#e0f2fe; color:#0369a1; padding:1px 4px; border-radius:4px; font-weight:600; display:inline-block; margin-left:2px;" title="Cached fare from recent observation">🕒 Cached</span>`;
    } else {
        return `<span style="font-size:9px; background:#e8f0fe; color:#1a73e8; padding:1px 4px; border-radius:4px; font-weight:600; display:inline-block; margin-left:2px;" title="Predictive Revenue Model Estimate (~Est.). Click to query live airline prices on Google Flights for these exact dates!">~ Est.</span>`;
    }
}

function renderMatrixCellsHtml(rows, deal, matrixData, userCurr) {
    let html = '';
    const isOneWay = Boolean(matrixData && matrixData.isOneWay);
    const isMultiCity = Boolean(matrixData && matrixData.isMultiCity);
    rows.forEach(row => {
        const headerLabel = isOneWay 
            ? (row.label || `Week ${row.weekNum || ''}`) 
            : (isMultiCity
                ? `<strong>Leg 1:</strong> <span style="color:#1a73e8; font-weight:700;">${row.depDayOfWeek}</span>, ${row.depDateStr}`
                : `<span style="color:#1a73e8; font-weight:700;">${row.depDayOfWeek}</span>, ${row.depDateStr}`);
        html += `<tr><td style="font-weight:700; background:#f8f9fa; border:1px solid #dadce0; white-space:nowrap; padding:6px 8px;">${headerLabel}</td>`;
        row.cells.forEach(cell => {
            if (!cell) {
                html += `<td style="background:#f1f3f4; border:1px solid #dadce0; opacity:0.35;"></td>`;
                return;
            }
            let colorClass = 'fhp-matrix-cell-yellow';
            const isBest = deal ? (cell.fareBase === deal.fareBase && cell.depDateISO === deal.depDateISO && (isOneWay || cell.retDateISO === deal.retDateISO)) : false;

            if (isBest) {
                colorClass = 'fhp-matrix-cell-best';
            } else if (cell.fareBase <= matrixData.lowThreshold) {
                colorClass = 'fhp-matrix-cell-green';
            } else if (cell.fareBase >= matrixData.highThreshold) {
                colorClass = 'fhp-matrix-cell-red';
            }

            const statusBadge = getProvenanceBadgeHtml(cell.provenance);
            const provDesc = (cell.provenance === 'OBSERVED_LIVE') ? '✓ Live Scraped Fare' : ((cell.provenance === 'CACHED_OBSERVATION') ? '🕒 Cached Fare' : '~ Predictive Model Estimate');
            const tooltipText = isOneWay
                ? `${isBest ? '🏆 OPTIMAL ONE-WAY DEAL! ' : ''}${provDesc}: Dep: ${cell.depFullStr} (One-Way) | ${cell.leadTimeBadge || ''} | Base Fare: ${formatMoney(cell.fareBase, userCurr)} (Click to search Google Flights for this date)`
                : (isMultiCity
                    ? `${isBest ? '🏆 OPTIMAL MULTI-CITY DEAL! ' : ''}${provDesc}: Leg 1: ${cell.depFullStr} | Leg 2: ${cell.retFullStr} (${cell.len}d Itinerary) | ${cell.leadTimeBadge || ''} | Base Fare: ${formatMoney(cell.fareBase, userCurr)} (Click to search Google Flights with all legs & filters preserved)`
                    : `${isBest ? '🏆 OPTIMAL BEST DEAL! ' : ''}${provDesc}: Dep: ${cell.depFullStr} | Ret: ${cell.retFullStr} (${cell.len} Days) | ${cell.leadTimeBadge || ''} | Base Fare: ${formatMoney(cell.fareBase, userCurr)} (Click to search Google Flights for these exact dates)`);

            const ariaLabelText = isOneWay
                ? `Departure ${cell.depFullStr}, One-Way, Fare ${formatMoney(cell.fareBase, userCurr)}`
                : (isMultiCity
                    ? `Leg 1 Departure ${cell.depFullStr}, Leg 2 Departure ${cell.retFullStr}, ${cell.len} days itinerary, Fare ${formatMoney(cell.fareBase, userCurr)}`
                    : `Departure ${cell.depFullStr}, Return ${cell.retFullStr}, ${cell.len} days, Fare ${formatMoney(cell.fareBase, userCurr)}`);

            const subLabelHtml = isOneWay 
                ? `<strong>${cell.depDateStr}</strong>` 
                : (isMultiCity 
                    ? `Leg 2: <strong>${cell.retDayOfWeek}</strong>, ${cell.retDateStr}` 
                    : `Ret: <strong>${cell.retDayOfWeek}</strong>, ${cell.retDateStr}`);

            html += `
                <td class="fhp-matrix-cell ${colorClass}" 
                    role="button"
                    tabindex="0"
                    aria-label="${ariaLabelText}"
                    data-dep-iso="${cell.depDateISO}"
                    data-ret-iso="${cell.retDateISO || ''}"
                    data-len="${cell.len}"
                    data-dep-str="${cell.depFullStr}"
                    data-ret-str="${cell.retFullStr || 'One-Way'}"
                    data-fare-base="${cell.fareBase}"
                    data-provenance="${cell.provenance || 'MODELLED_ESTIMATE'}"
                    title="${tooltipText}">
                    <div style="line-height:1.25;">
                        <div style="font-weight:700; font-size:12px;" class="fhp-cell-price">${isBest ? '🏆 ' : ''}${formatMoney(cell.fareBase, userCurr)}${statusBadge}</div>
                        <div style="font-size:9.5px; opacity:0.85; margin-top:2px; font-weight:500;">
                            ${subLabelHtml}
                        </div>
                    </div>
                </td>
            `;
        });
        html += `</tr>`;
    });
    return html;
}

function attachMatrixCellListeners(modal, routeInfo) {
    if (modal._fhpCellListenersAttached) return;
    modal._fhpCellListenersAttached = true;

    const handleSelect = (cellEl) => {
        const depIso = cellEl.dataset.depIso;
        const retIso = cellEl.dataset.retIso || null;
        const fresh = (typeof extractCurrentRouteInfo === 'function') ? extractCurrentRouteInfo() : {};
        const origin = (routeInfo && routeInfo.origin) || fresh.origin;
        const destination = (routeInfo && routeInfo.destination) || fresh.destination;
        const curr = (routeInfo && routeInfo.userCurr) || fresh.userCurr || 'USD';
        if (depIso && origin && destination) {
            const navUrl = buildFlightSearchUrl(origin, destination, depIso, retIso, curr, routeInfo || fresh);
            window.location.assign(navUrl);
            setTimeout(() => {
                if (window.location.href !== navUrl) {
                    window.location.href = navUrl;
                } else {
                    window.location.reload();
                }
            }, 300);
        }
        modal.remove();
    };

    modal.addEventListener('click', (e) => {
        const cellEl = e.target.closest('.fhp-matrix-cell');
        if (cellEl) {
            handleSelect(cellEl);
        }
    });

    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const cellEl = e.target.closest('.fhp-matrix-cell');
            if (cellEl) {
                e.preventDefault();
                handleSelect(cellEl);
            }
        }
    });
}

function showMatrixHeatMapModal(matrixData, routeInfo, initOutDay = 'ANY', initRetDay = 'ANY', initMinDays = null, initMaxDays = null, initLeadTime = 'ANY', storageCache = {}, initViewMode = 'DAYWISE') {
    let oldModal = document.querySelector('.fhp-matrix-overlay');
    if (oldModal) oldModal.remove();

    const userCurr = routeInfo.userCurr;
    const modal = document.createElement('div');
    modal.className = 'fhp-matrix-overlay';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', `Fare Matrix for ${routeInfo.origin || 'Route'} to ${routeInfo.destination || 'Destination'}`);

    const initialMinDays = (initMinDays !== null && initMinDays !== undefined) ? parseInt(initMinDays, 10) : matrixData.minTripLen;
    const initialMaxDays = (initMaxDays !== null && initMaxDays !== undefined) ? parseInt(initMaxDays, 10) : matrixData.maxTripLen;

    let currentMatrixData = matrixData;

    if (initViewMode === 'DAYWISE' && !currentMatrixData.isOneWay) {
        const daywiseLengths = Array.from({ length: initialMaxDays - initialMinDays + 1 }, (_, i) => initialMinDays + i);
        currentMatrixData = generateMatrixData(routeInfo, matrixData.numDays, 'custom', daywiseLengths, storageCache);
    }

    const deal = currentMatrixData ? currentMatrixData.smartBestDeal : null;

    const modalTitle = currentMatrixData.isOneWay
        ? `📅 ${matrixData.numDays}-Day One-Way Fare Calendar (${routeInfo.origin || 'Route'} ➔ ${routeInfo.destination || 'Destination'})`
        : (routeInfo && routeInfo.isMultiCity
            ? `🗺️ ${matrixData.numDays}-Day Multi-City & Open-Jaw Optimizer (${routeInfo.origin || 'Route'} ➔ ${routeInfo.destination || 'Destination'})`
            : `📊 ${matrixData.numDays}-Day Fare Matrix (${routeInfo.origin || 'Route'} ➔ ${routeInfo.destination || 'Destination'})`);
    const modalSubtitle = currentMatrixData.isOneWay
        ? `Predictive one-way departure pricing calibrated with live scraped Google Flights baseline.`
        : (routeInfo && routeInfo.isMultiCity
            ? `Predictive multi-city open-jaw revenue model calibrated with live scraped baseline.`
            : `Predictive revenue management model calibrated with live scraped Google Flights baseline.`);

    let tableHeadersHtml = currentMatrixData.isOneWay
        ? `<th>Week</th>` + currentMatrixData.columns.map(l => `<th>${l}</th>`).join('')
        : (routeInfo && routeInfo.isMultiCity
            ? `<th>Leg 1 Departure</th>` + currentMatrixData.tripLengths.map(l => `<th>${l}d Gap (Leg 2)</th>`).join('')
            : `<th>Departure</th>` + currentMatrixData.tripLengths.map(l => `<th>${l} Days Return</th>`).join(''));
    let tableRowsHtml = renderMatrixCellsHtml(currentMatrixData.rows, deal, currentMatrixData, userCurr);

    let routeSummaryBadges = '';
    if (routeInfo && routeInfo.isMultiCity) {
        let legsDesc = '';
        if (routeInfo.multiCityLegs && routeInfo.multiCityLegs.length > 0) {
            legsDesc = routeInfo.multiCityLegs.map(l => `Leg ${l.legIndex}: <strong>${l.origin}➔${l.destination}</strong>${l.rawDateStr ? ` (${l.rawDateStr})` : ''}`).join(' · ');
        } else {
            legsDesc = `<strong>${routeInfo.origin || 'Origin'} ➔ ${routeInfo.destination || 'Destination'}</strong> (Multi-City)`;
        }
        routeSummaryBadges += `
            <div style="margin-top:6px; display:inline-flex; align-items:center; gap:6px; background:rgba(255,255,255,0.2); padding:3px 10px; border-radius:12px; font-size:11.5px; font-weight:600;">
                <span>🗺️ Multi-City Itinerary: ${legsDesc}</span>
                ${routeInfo.isOpenJaw && routeInfo.openJawGap ? `<span style="background:#fef7e0; color:#b06000; padding:1px 6px; border-radius:8px; font-size:10.5px; font-weight:700;">⚠️ Open-Jaw (${routeInfo.openJawGap.from} ➔ ${routeInfo.openJawGap.to})</span>` : ''}
            </div>
        `;
    }

    if (routeInfo && routeInfo.activeFilters && routeInfo.activeFilters.hasCustomFilters) {
        const filterPills = [];
        if (routeInfo.activeFilters.stopsLabel) filterPills.push(`🛑 ${routeInfo.activeFilters.stopsLabel}`);
        if (routeInfo.activeFilters.cabinLabel) filterPills.push(`💺 ${routeInfo.activeFilters.cabinLabel}`);
        if (routeInfo.activeFilters.passengers > 1) filterPills.push(`👥 ${routeInfo.activeFilters.passengers} Pax`);
        if (routeInfo.activeFilters.airlines) filterPills.push(`✈️ ${routeInfo.activeFilters.airlines}`);
        
        if (filterPills.length > 0) {
            routeSummaryBadges += `
                <div style="margin-top:4px; display:inline-flex; align-items:center; gap:6px; background:#e6f4ea; color:#137333; padding:3px 10px; border-radius:12px; font-size:11.5px; font-weight:600;">
                    <span>🎯 Active Filters Preserved: ${filterPills.join(' · ')}</span>
                </div>
            `;
        }
    }

    modal.innerHTML = `
        <div class="fhp-matrix-content">
            <div class="fhp-matrix-header">
                <div>
                    <h3 class="fhp-matrix-title">${modalTitle}</h3>
                    <div style="font-size:11px; opacity:0.9; margin-top:2px;">
                        <span>${modalSubtitle}</span>
                    </div>
                    ${routeSummaryBadges}
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                    <button class="fhp-matrix-btn" id="fhpCsvExportBtn" title="Export current matrix table to CSV spreadsheet" aria-label="Export to CSV">📥 Export CSV</button>
                    <button class="fhp-matrix-btn" id="fhpIcsExportBtn" style="background:#1a73e8; color:#fff;" title="Export optimal deal to Calendar (.ics)" aria-label="Add to Calendar">📅 Add to Calendar (.ics)</button>
                    <button class="fhp-matrix-btn" id="fhpClearCacheModalBtn" style="background:rgba(255,255,255,0.2);" title="Clear saved route anchor & price cache" aria-label="Purge Cache">🧹 Purge Cache</button>
                    <button class="fhp-matrix-close" id="fhpMatrixClose" aria-label="Close matrix modal">&times;</button>
                </div>
            </div>

            <div class="fhp-matrix-controls">
                ${!currentMatrixData.isOneWay ? `
                <div class="fhp-ctrl-item">
                    <label>View Mode:</label>
                    <select id="fhpColumnViewMode">
                        <option value="DAYWISE" ${initViewMode === 'DAYWISE' ? 'selected' : ''}>Detailed Day-by-Day Grid</option>
                        <option value="FIXED" ${initViewMode === 'FIXED' ? 'selected' : ''}>Standard Preset Brackets</option>
                    </select>
                </div>
                ` : `
                <div class="fhp-ctrl-item">
                    <span style="font-size:11.5px; font-weight:700; color:#1a73e8; background:#e8f0fe; padding:5px 12px; border-radius:12px; border:1px solid #d2e3fc;">✈️ One-Way Flight Calendar</span>
                </div>
                `}

                <div class="fhp-ctrl-item">
                    <label>Outbound Day:</label>
                    <select id="fhpFilterOutDay">
                        <option value="ANY">Any Day</option>
                        <option value="Fri">Friday (Weekend Start)</option>
                        <option value="Sat">Saturday</option>
                        <option value="Sun">Sunday</option>
                        <option value="Mon">Monday</option>
                        <option value="Tue">Tuesday (Off-Peak)</option>
                        <option value="Wed">Wednesday (Off-Peak)</option>
                        <option value="Thu">Thursday</option>
                    </select>
                </div>

                ${!currentMatrixData.isOneWay ? `
                <div class="fhp-ctrl-item">
                    <label>${routeInfo && routeInfo.isMultiCity ? 'Leg 2 Outbound Day:' : 'Return Day:'}</label>
                    <select id="fhpFilterRetDay">
                        <option value="ANY">Any Day</option>
                        <option value="Sun">Sunday (Weekend End)</option>
                        <option value="Mon">Monday</option>
                        <option value="Fri">Friday</option>
                        <option value="Sat">Saturday</option>
                        <option value="Tue">Tuesday</option>
                        <option value="Wed">Wednesday</option>
                        <option value="Thu">Thursday</option>
                    </select>
                </div>

                <div class="fhp-ctrl-item">
                    <label>${routeInfo && routeInfo.isMultiCity ? 'Itinerary Gap Range:' : 'Trip Duration Range:'} <span id="fhpDurationRangePill" style="color:#1a73e8; font-weight:700;">${initialMinDays}–${initialMaxDays} Days</span></label>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span style="font-size:11px;">Min:</span>
                        <input type="range" id="fhpFilterMinDays" min="1" max="45" value="${initialMinDays}" style="width:75px;">
                        <span style="font-size:11px;">Max:</span>
                        <input type="range" id="fhpFilterMaxDays" min="1" max="45" value="${initialMaxDays}" style="width:75px;">
                    </div>
                </div>
                ` : ''}

                <div class="fhp-ctrl-item">
                    <label>Lead Time Sweet Spot:</label>
                    <select id="fhpFilterLeadTime">
                        <option value="ANY">Any Horizon</option>
                        <option value="SWEET_SPOT">Sweet Spot Only (21–120d)</option>
                        <option value="DOMESTIC">Domestic Peak (21–60d)</option>
                        <option value="INTL">International Peak (60–120d)</option>
                        <option value="LAST_MINUTE">Last-Minute Surge (&lt;21d)</option>
                        <option value="DEEP_ADVANCE">Deep Advance (&gt;120d)</option>
                    </select>
                </div>

                <div class="fhp-ctrl-item" style="margin-left:auto;">
                    <span id="fhpMatrixLiveStatus" style="font-size:11px; font-weight:600; color:#137333; background:#e6f4ea; padding:4px 9px; border-radius:12px; display:inline-flex; align-items:center; gap:4px;" title="Auto-fetching live applicable fares as parameters change">🟢 Live Synced: ${currentMatrixData.isOneWay ? 'One-Way Calendar' : (initViewMode === 'DAYWISE' ? 'Day-by-Day Grid' : 'Preset Brackets')}</span>
                </div>
            </div>

            <div class="fhp-smart-deal-banner" id="fhpSmartDealBanner">
                ${deal ? `
                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-size:24px;">🏆</span>
                    <div>
                        <strong>Optimal Deal Found [${currentMatrixData.isOneWay ? 'One-Way Departure' : (currentMatrixData.isMultiCity ? 'Multi-City Itinerary' : (initViewMode === 'DAYWISE' ? 'Day-by-Day Grid' : 'Preset Brackets'))}]:</strong> ${currentMatrixData.isOneWay ? `Departure <strong>${deal.depFullStr || ''}</strong> (One-Way)` : (currentMatrixData.isMultiCity ? `Leg 1: <strong>${deal.depFullStr || ''}</strong> ➔ Leg 2: <strong>${deal.retFullStr || ''}</strong> (${deal.len || 0}d Itinerary)` : `Dep <strong>${deal.depFullStr || ''}</strong> ➔ Ret <strong>${deal.retFullStr || ''}</strong> (${deal.len || 0} Days Trip)`)}
                        ${deal.leadTimeBadge ? `<span style="background:rgba(255,255,255,0.2); padding:2px 7px; border-radius:10px; font-size:11px; font-weight:700; margin-left:4px;">${deal.leadTimeBadge} (${deal.daysOut}d out)</span>` : ''}<br>
                        <span style="font-size:12px; opacity:0.95;">Fare: <strong>${formatMoney(deal.fareBase || 0, userCurr)}</strong> — Saves <strong>${formatMoney(deal.savingsBase || 0, userCurr)}</strong> (${deal.savingsPct || '0%'}% off average) while honoring all active filters & legs!</span>
                    </div>
                </div>
                <button class="fhp-select-deal-btn" id="fhpSelectBestDealBtn">${currentMatrixData.isMultiCity ? '👉 Select This Multi-City Deal' : '👉 Select This Deal'}</button>
                ` : `
                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-size:22px;">⚡</span>
                    <div>
                        <strong>Matrix Heat-Map Active:</strong> Select an optimal deal or click any matrix cell to open flight fares!
                    </div>
                </div>
                `}
            </div>

            <div class="fhp-matrix-scroll-body">
                <table class="fhp-matrix-table">
                    <thead><tr>${tableHeadersHtml}</tr></thead>
                    <tbody>${tableRowsHtml}</tbody>
                </table>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const closeModal = () => {
        modal.remove();
        document.removeEventListener('keydown', onKeyDown);
    };

    const onKeyDown = (e) => {
        if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', onKeyDown);

    modal.querySelector('#fhpMatrixClose').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    modal.querySelector('#fhpCsvExportBtn').addEventListener('click', () => {
        exportMatrixToCSV(currentMatrixData, routeInfo);
    });

    const icsBtn = modal.querySelector('#fhpIcsExportBtn');
    if (icsBtn) {
        icsBtn.addEventListener('click', () => {
            const activeDeal = currentMatrixData ? currentMatrixData.smartBestDeal : null;
            exportDealToICS(activeDeal, routeInfo);
        });
    }

    const purgeBtn = modal.querySelector('#fhpClearCacheModalBtn');
    if (purgeBtn) {
        purgeBtn.addEventListener('click', () => {
            window.fhpLastLowestBasePrice = null;
            chrome.storage.local.get(null, (allStorage) => {
                const keysToRemove = Object.keys(allStorage).filter(k => k.startsWith('fhp_fare_') || k.startsWith('fhp_anchor_'));
                chrome.storage.local.remove(keysToRemove, () => {
                    closeModal();
                    const refreshedRouteInfo = extractCurrentRouteInfo();
                    const refreshedMatrixData = generateMatrixData(refreshedRouteInfo, matrixData.numDays, settings.tripBracket || '5-21', null, {});
                    showMatrixHeatMapModal(refreshedMatrixData, refreshedRouteInfo, 'ANY', 'ANY', null, null, 'ANY', {}, 'DAYWISE');
                });
            });
        });
    }

    const viewModeSelect = modal.querySelector('#fhpColumnViewMode');
    const outSelect = modal.querySelector('#fhpFilterOutDay');
    const retSelect = modal.querySelector('#fhpFilterRetDay');
    const minSlider = modal.querySelector('#fhpFilterMinDays');
    const maxSlider = modal.querySelector('#fhpFilterMaxDays');
    const rangePill = modal.querySelector('#fhpDurationRangePill');
    const leadSelect = modal.querySelector('#fhpFilterLeadTime');

    if (initOutDay && outSelect) outSelect.value = initOutDay;
    if (initRetDay && retSelect) retSelect.value = initRetDay;
    if (initLeadTime && leadSelect) leadSelect.value = initLeadTime;

    const rebuildMatrixGrid = () => {
        if (currentMatrixData.isOneWay) {
            currentMatrixData = generateMatrixData(routeInfo, matrixData.numDays, '5-21', null, storageCache);
            let tableHeadersHtml = `<th>Week</th>` + currentMatrixData.columns.map(l => `<th>${l}</th>`).join('');
            const theadEl = modal.querySelector('.fhp-matrix-table thead');
            if (theadEl) theadEl.innerHTML = tableHeadersHtml;
            const tbodyEl = modal.querySelector('.fhp-matrix-table tbody');
            if (tbodyEl) tbodyEl.innerHTML = renderMatrixCellsHtml(currentMatrixData.rows, currentMatrixData.smartBestDeal, currentMatrixData, userCurr);
            attachMatrixCellListeners(modal, routeInfo);
            updateOptimalDealView();
            return;
        }

        let minVal = minSlider ? parseInt(minSlider.value, 10) : matrixData.minTripLen;
        let maxVal = maxSlider ? parseInt(maxSlider.value, 10) : matrixData.maxTripLen;
        if (minVal > maxVal) {
            maxVal = minVal;
            if (maxSlider) maxSlider.value = maxVal;
        }

        const isDaywise = viewModeSelect && viewModeSelect.value === 'DAYWISE';
        if (isDaywise) {
            const daywiseLengths = Array.from({ length: maxVal - minVal + 1 }, (_, i) => minVal + i);
            currentMatrixData = generateMatrixData(routeInfo, matrixData.numDays, 'custom', daywiseLengths, storageCache);
        } else {
            currentMatrixData = generateMatrixData(routeInfo, matrixData.numDays, settings.tripBracket || '5-21', null, storageCache);
        }

        // Rebuild <thead>
        let tableHeadersHtml = (routeInfo && routeInfo.isMultiCity)
            ? `<th>Leg 1 Departure</th>` + currentMatrixData.tripLengths.map(l => `<th>${l}d Gap (Leg 2)</th>`).join('')
            : `<th>Departure</th>` + currentMatrixData.tripLengths.map(l => `<th>${l} Days Return</th>`).join('');
        const theadEl = modal.querySelector('.fhp-matrix-table thead');
        if (theadEl) theadEl.innerHTML = tableHeadersHtml;

        // Rebuild <tbody> with shared helper
        const tbodyEl = modal.querySelector('.fhp-matrix-table tbody');
        if (tbodyEl) tbodyEl.innerHTML = renderMatrixCellsHtml(currentMatrixData.rows, currentMatrixData.smartBestDeal, currentMatrixData, userCurr);

        attachMatrixCellListeners(modal, routeInfo);
        updateOptimalDealView();
    };

    const autoFetchAndRecalculate = (rebuildTable = false) => {
        const statusEl = modal.querySelector('#fhpMatrixLiveStatus');
        if (statusEl) {
            statusEl.innerHTML = '🔄 Auto-fetching fares...';
            statusEl.style.background = '#e8f0fe';
            statusEl.style.color = '#1a73e8';
        }

        const executeUpdate = () => {
            const freshRoute = extractCurrentRouteInfo();
            if (freshRoute && freshRoute.liveLowestFare && freshRoute.liveLowestFare > 0) {
                routeInfo.liveLowestFare = freshRoute.liveLowestFare;
                routeInfo.basePriceUSD = freshRoute.basePriceUSD;
            }

            if (rebuildTable) {
                rebuildMatrixGrid();
            } else {
                updateOptimalDealView();
            }

            if (statusEl) {
                const isDaywise = viewModeSelect && viewModeSelect.value === 'DAYWISE';
                const modeLabel = currentMatrixData.isOneWay ? 'One-Way Calendar' : (isDaywise ? 'Day-by-Day Grid' : 'Preset Brackets');
                const pax = settings.passengerCount || 1;
                statusEl.innerHTML = `🟢 Live Synced: ${modeLabel} · ${pax} px · ${userCurr}`;
                statusEl.style.background = '#e6f4ea';
                statusEl.style.color = '#137333';
            }
        };

        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            chrome.storage.local.get(null, (freshStorage) => {
                if (freshStorage) {
                    Object.assign(storageCache, freshStorage);
                }
                executeUpdate();
            });
        } else {
            executeUpdate();
        }
    };

    const handleRangeChange = () => {
        if (!minSlider || !maxSlider) return;
        let minVal = parseInt(minSlider.value, 10);
        let maxVal = parseInt(maxSlider.value, 10);

        if (minVal > maxVal) {
            maxVal = minVal;
            maxSlider.value = maxVal;
        }

        if (rangePill) {
            if (minVal === maxVal) {
                rangePill.innerText = `Exact ${minVal} Days`;
            } else {
                rangePill.innerText = `${minVal}–${maxVal} Days`;
            }
        }

        if (viewModeSelect && viewModeSelect.value === 'DAYWISE') {
            autoFetchAndRecalculate(true);
        } else {
            autoFetchAndRecalculate(false);
        }
    };

    if (minSlider) minSlider.addEventListener('input', handleRangeChange);
    if (maxSlider) maxSlider.addEventListener('input', handleRangeChange);
    if (viewModeSelect) viewModeSelect.addEventListener('change', () => autoFetchAndRecalculate(true));

    const updateOptimalDealView = () => {
        const outVal = outSelect ? outSelect.value : 'ANY';
        const retVal = retSelect ? retSelect.value : 'ANY';
        const minVal = minSlider ? parseInt(minSlider.value, 10) : 1;
        const maxVal = maxSlider ? parseInt(maxSlider.value, 10) : 45;
        const leadVal = leadSelect ? leadSelect.value : 'ANY';
        const isDaywise = viewModeSelect && viewModeSelect.value === 'DAYWISE';
        const modeLabel = currentMatrixData.isOneWay ? 'One-Way Calendar' : (isDaywise ? 'Detailed Day-by-Day Grid' : 'Standard Preset Brackets');

        const filteredDeal = findOptimalFilteredDeal(currentMatrixData, outVal, retVal, minVal, maxVal, leadVal);

        const bannerContainer = modal.querySelector('#fhpSmartDealBanner');
        if (!bannerContainer) return;

        if (filteredDeal) {
            const pax = settings.passengerCount || 1;
            const cardProfile = cardProfiles[settings.rewardCard] || cardProfiles['scapia'] || cardProfiles['none'];
            let bagRate = (userCurr === 'INR') ? 3000 : (40 * (exchangeRates[userCurr] || 1.0));
            if (settings.customBagFee !== undefined && settings.customBagFee !== null && !isNaN(settings.customBagFee) && settings.customBagFee >= 0) {
                bagRate = parseFloat(settings.customBagFee);
            }
            const checkedBags = Math.max(0, settings.checkedBags || 0);
            const bagFee = checkedBags * pax * bagRate;

            const grossFare = filteredDeal.fareBase + bagFee;
            const rewardsValue = grossFare * (cardProfile.rewardPct || 0);
            const netApplicablePrice = Math.round(grossFare - rewardsValue);

            const provBadge = getProvenanceBadgeHtml(filteredDeal.provenance);
            const provDesc = (filteredDeal.provenance === 'OBSERVED_LIVE')
                ? '✓ Verified Live Scraped Fare'
                : ((filteredDeal.provenance === 'CACHED_OBSERVATION')
                    ? '🕒 Cached Observation'
                    : '~ Predictive Model Estimate');

            bannerContainer.style.background = 'linear-gradient(135deg, #137333, #0b4d20)';
            bannerContainer.style.color = '#ffffff';
            bannerContainer.style.borderColor = 'transparent';

            if (currentMatrixData.isOneWay) {
                bannerContainer.innerHTML = `
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span style="font-size:24px;">🏆</span>
                        <div>
                            <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                                <strong style="font-size:13.5px;">Optimal One-Way Deal Found:</strong>
                                <span style="background:rgba(255,255,255,0.22); padding:2px 8px; border-radius:10px; font-size:11px; font-weight:700;">One-Way Flight</span>
                                ${filteredDeal.leadTimeBadge ? `<span style="background:rgba(255,255,255,0.22); padding:2px 8px; border-radius:10px; font-size:11px; font-weight:700;">${filteredDeal.leadTimeBadge} (${filteredDeal.daysOut}d out)</span>` : ''}
                                <span style="background:rgba(255,255,255,0.22); padding:2px 8px; border-radius:10px; font-size:11px; font-weight:600;">${provDesc}</span>
                            </div>
                            <div style="font-size:12.5px; margin-top:3px; opacity:0.98;">
                                Departure <strong>${filteredDeal.depFullStr}</strong> (One-Way)
                            </div>
                            <div style="font-size:12px; margin-top:2px; opacity:0.95;">
                                Actual Base Fare: <strong>${formatMoney(filteredDeal.fareBase, userCurr)}</strong>${provBadge}
                                ${pax > 1 ? `<span style="opacity:0.85;"> (${formatMoney(Math.round(filteredDeal.fareBase / pax), userCurr)}/pax × ${pax} px)</span>` : ''}
                                ${(checkedBags > 0 || rewardsValue > 0) ? ` | Net True Price: <strong>~${formatMoney(netApplicablePrice, userCurr)}</strong> <span style="font-size:10.5px; opacity:0.85;">(${checkedBags > 0 ? `+${checkedBags} bag${checkedBags > 1 ? 's' : ''}` : ''}${checkedBags > 0 && rewardsValue > 0 ? ', ' : ''}${rewardsValue > 0 ? `-${(cardProfile.rewardPct * 100).toFixed(1)}% ${cardProfile.name}` : ''})</span>` : ''}
                                — Saves <strong>${formatMoney(filteredDeal.savingsBase, userCurr)}</strong> (${filteredDeal.savingsPct}% off calendar avg) · <strong>${filteredDeal.totalMatches}</strong> dates matched
                            </div>
                        </div>
                    </div>
                    <button class="fhp-select-deal-btn" id="fhpSelectBestDealBtn">👉 Select This Deal</button>
                `;
            } else if (currentMatrixData.isMultiCity) {
                bannerContainer.innerHTML = `
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span style="font-size:24px;">🏆</span>
                        <div>
                            <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                                <strong style="font-size:13.5px;">Optimal Multi-City Deal Found:</strong>
                                <span style="background:rgba(255,255,255,0.22); padding:2px 8px; border-radius:10px; font-size:11px; font-weight:700;">${filteredDeal.len}d Itinerary</span>
                                ${filteredDeal.leadTimeBadge ? `<span style="background:rgba(255,255,255,0.22); padding:2px 8px; border-radius:10px; font-size:11px; font-weight:700;">${filteredDeal.leadTimeBadge} (${filteredDeal.daysOut}d out)</span>` : ''}
                                <span style="background:rgba(255,255,255,0.22); padding:2px 8px; border-radius:10px; font-size:11px; font-weight:600;">${provDesc}</span>
                            </div>
                            <div style="font-size:12.5px; margin-top:3px; opacity:0.98;">
                                Leg 1: <strong>${filteredDeal.depFullStr}</strong> ➔ Leg 2: <strong>${filteredDeal.retFullStr}</strong> (All legs & filters preserved)
                            </div>
                            <div style="font-size:12px; margin-top:2px; opacity:0.95;">
                                Actual Base Fare: <strong>${formatMoney(filteredDeal.fareBase, userCurr)}</strong>${provBadge}
                                ${pax > 1 ? `<span style="opacity:0.85;"> (${formatMoney(Math.round(filteredDeal.fareBase / pax), userCurr)}/pax × ${pax} px)</span>` : ''}
                                ${(checkedBags > 0 || rewardsValue > 0) ? ` | Net True Price: <strong>~${formatMoney(netApplicablePrice, userCurr)}</strong> <span style="font-size:10.5px; opacity:0.85;">(${checkedBags > 0 ? `+${checkedBags} bag${checkedBags > 1 ? 's' : ''}` : ''}${checkedBags > 0 && rewardsValue > 0 ? ', ' : ''}${rewardsValue > 0 ? `-${(cardProfile.rewardPct * 100).toFixed(1)}% ${cardProfile.name}` : ''})</span>` : ''}
                                — Saves <strong>${formatMoney(filteredDeal.savingsBase, userCurr)}</strong> (${filteredDeal.savingsPct}% off itinerary avg) · <strong>${filteredDeal.totalMatches}</strong> fares matched
                            </div>
                        </div>
                    </div>
                    <button class="fhp-select-deal-btn" id="fhpSelectBestDealBtn">👉 Select This Multi-City Deal</button>
                `;
            } else {
                bannerContainer.innerHTML = `
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span style="font-size:24px;">🏆</span>
                        <div>
                            <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                                <strong style="font-size:13.5px;">Optimal Filtered Deal Found [${modeLabel}]:</strong>
                                <span style="background:rgba(255,255,255,0.22); padding:2px 8px; border-radius:10px; font-size:11px; font-weight:700;">${filteredDeal.len} Days Trip</span>
                                ${filteredDeal.leadTimeBadge ? `<span style="background:rgba(255,255,255,0.22); padding:2px 8px; border-radius:10px; font-size:11px; font-weight:700;">${filteredDeal.leadTimeBadge} (${filteredDeal.daysOut}d out)</span>` : ''}
                                <span style="background:rgba(255,255,255,0.22); padding:2px 8px; border-radius:10px; font-size:11px; font-weight:600;">${provDesc}</span>
                            </div>
                            <div style="font-size:12.5px; margin-top:3px; opacity:0.98;">
                                Dep <strong>${filteredDeal.depFullStr}</strong> ➔ Ret <strong>${filteredDeal.retFullStr}</strong>
                            </div>
                            <div style="font-size:12px; margin-top:2px; opacity:0.95;">
                                Actual Base Fare: <strong>${formatMoney(filteredDeal.fareBase, userCurr)}</strong>${provBadge}
                                ${pax > 1 ? `<span style="opacity:0.85;"> (${formatMoney(Math.round(filteredDeal.fareBase / pax), userCurr)}/pax × ${pax} px)</span>` : ''}
                                ${(checkedBags > 0 || rewardsValue > 0) ? ` | Net True Price: <strong>~${formatMoney(netApplicablePrice, userCurr)}</strong> <span style="font-size:10.5px; opacity:0.85;">(${checkedBags > 0 ? `+${checkedBags} bag${checkedBags > 1 ? 's' : ''}` : ''}${checkedBags > 0 && rewardsValue > 0 ? ', ' : ''}${rewardsValue > 0 ? `-${(cardProfile.rewardPct * 100).toFixed(1)}% ${cardProfile.name}` : ''})</span>` : ''}
                                — Saves <strong>${formatMoney(filteredDeal.savingsBase, userCurr)}</strong> (${filteredDeal.savingsPct}% off ${isDaywise ? 'day-by-day' : 'preset'} avg) · <strong>${filteredDeal.totalMatches}</strong> fares matched
                            </div>
                        </div>
                    </div>
                    <button class="fhp-select-deal-btn" id="fhpSelectBestDealBtn">👉 Select This Deal</button>
                `;
            }

            const btn = bannerContainer.querySelector('#fhpSelectBestDealBtn');
            if (btn) {
                btn.addEventListener('click', () => {
                    const fresh = (typeof extractCurrentRouteInfo === 'function') ? extractCurrentRouteInfo() : {};
                    const origin = (routeInfo && routeInfo.origin) || fresh.origin;
                    const destination = (routeInfo && routeInfo.destination) || fresh.destination;
                    const curr = (routeInfo && routeInfo.userCurr) || fresh.userCurr || 'USD';
                    if (filteredDeal && filteredDeal.depDateISO && origin && destination) {
                        const navUrl = buildFlightSearchUrl(origin, destination, filteredDeal.depDateISO, filteredDeal.retDateISO || null, curr, routeInfo || fresh);
                        window.location.assign(navUrl);
                        setTimeout(() => {
                            if (window.location.href !== navUrl) {
                                window.location.href = navUrl;
                            } else {
                                window.location.reload();
                            }
                        }, 300);
                    }
                    closeModal();
                });
            }
        } else {
            bannerContainer.style.background = '#fce8e6';
            bannerContainer.style.color = '#c5221f';
            bannerContainer.style.borderColor = '#fad2cf';
            bannerContainer.innerHTML = `
                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-size:22px;">⚠️</span>
                    <div>
                        <strong>No Fares Found Matching Selected Filters in [${modeLabel}]</strong><br>
                        <span style="font-size:12px;">Try loosening Outbound Day (${outVal}), Return Day (${retVal}), Duration Range (${minVal}–${maxVal}d), or Lead Time criteria.</span>
                    </div>
                </div>
            `;
        }

        modal.querySelectorAll('.fhp-matrix-cell').forEach(cellEl => {
            const depIso = cellEl.dataset.depIso;
            const retIso = cellEl.dataset.retIso;
            const fareBase = parseInt(cellEl.dataset.fareBase, 10);
            const cellLen = parseInt(cellEl.dataset.len || '0', 10);
            const prov = cellEl.dataset.provenance || 'MODELLED_ESTIMATE';

            const inDurationRange = cellLen >= minVal && cellLen <= maxVal;
            if (!currentMatrixData.isOneWay && !inDurationRange && viewModeSelect && viewModeSelect.value === 'FIXED') {
                cellEl.style.opacity = '0.30';
            } else {
                cellEl.style.opacity = '1.0';
            }

            const isMatch = filteredDeal && (depIso === filteredDeal.depDateISO && (currentMatrixData.isOneWay || retIso === (filteredDeal.retDateISO || '')) && fareBase === filteredDeal.fareBase && (currentMatrixData.isOneWay || cellLen === filteredDeal.len));
            const priceText = cellEl.querySelector('.fhp-cell-price');
            if (priceText) {
                const statusBadge = getProvenanceBadgeHtml(prov);
                priceText.innerHTML = `${isMatch ? '🏆 ' : ''}${formatMoney(fareBase, userCurr)}${statusBadge}`;
            }
            if (isMatch) {
                cellEl.classList.add('fhp-matrix-cell-best');
            } else {
                cellEl.classList.remove('fhp-matrix-cell-best');
            }
        });
    };

    if (outSelect) outSelect.addEventListener('change', () => autoFetchAndRecalculate(false));
    if (retSelect) retSelect.addEventListener('change', () => autoFetchAndRecalculate(false));
    if (leadSelect) leadSelect.addEventListener('change', () => autoFetchAndRecalculate(false));

    attachMatrixCellListeners(modal, routeInfo);
    updateOptimalDealView();
}

// 4. Outermost Flight Card Finder
function getOutermostCard(node) {
    if (!node || isExtensionOwnedNode(node)) return null;
    let curr = node;
    let bestCard = null;
    while (curr && curr !== document.body) {
        if (isExtensionOwnedNode(curr)) return null;
        const isCardCandidate = curr.tagName === 'LI' || 
                               (curr.getAttribute && curr.getAttribute('role') === 'listitem') || 
                               (curr.classList && (curr.classList.contains('pIavIb') || curr.classList.contains('gWSBe')));
        if (isCardCandidate) {
            bestCard = curr;
        }
        if (curr.tagName === 'UL' || curr.tagName === 'OL' || (curr.getAttribute && curr.getAttribute('role') === 'list') || (curr.classList && curr.classList.contains('Rj4Z2d'))) {
            break;
        }
        curr = curr.parentElement;
    }
    return bestCard || (isExtensionOwnedNode(node) ? null : node);
}

function getCardNativeContent(card) {
    if (!card) return '';
    let nativeText = '';
    const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
            if (node.parentElement && isExtensionOwnedNode(node.parentElement)) {
                return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
        }
    });
    while (walker.nextNode()) {
        nativeText += ' ' + walker.currentNode.textContent;
    }
    const nativeAria = Array.from(card.querySelectorAll('[aria-label]'))
        .filter(el => !isExtensionOwnedNode(el))
        .map(el => el.getAttribute('aria-label') || '')
        .join(' ');
    const cardAria = card.getAttribute('aria-label') || '';
    return (nativeText + ' ' + cardAria + ' ' + nativeAria).replace(/\s+/g, ' ').trim();
}

function computeCardFingerprint(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return `${str.length}_${hash}`;
}

// 5. Inject Adjacent Converted Price Tags on all foreign price elements
function injectInlineCurrencyConversions() {
    if (settings.extensionEnabled === false) return;
    const detectedCurr = detectActivePageCurrency();
    const userCurr = (settings.hasExplicitCurrency && settings.baseCurrency)
        ? settings.baseCurrency
        : (detectedCurr || settings.baseCurrency || 'USD');

    // Find direct price text containers (leaf spans/divs)
    const allPriceElements = Array.from(document.querySelectorAll('span, div, b, strong'));

    allPriceElements.forEach(el => {
        // Must be a leaf node (no child elements) to avoid tagging parent/grandparent wrapper containers
        if (el.children.length > 0) return;
        if (el.dataset.fhpInlineConverted || el.querySelector('.fhp-inline-converted') || el.closest('[data-fhp-inline-converted]')) return;
        if (el.parentElement && (el.parentElement.querySelector('.fhp-inline-converted') || el.parentElement.dataset.fhpInlineConverted)) return;
        if (el.closest('.fhp-container') || el.closest('.fhp-header-banner') || el.closest('.fhp-split-banner') || el.closest('.fhp-modal-content') || el.closest('.fhp-matrix-overlay')) return;

        const txt = (el.innerText || el.textContent || el.getAttribute('aria-label') || '').trim();
        if (!txt || txt.length > 40) return;

        const fareData = parseFareString(txt);
        if (!fareData) return;

        const { price: basePrice, currency: fareCurrency } = fareData;

        // If displayed currency is different from user's base currency, inject adjacent converted tag
        if (fareCurrency !== userCurr) {
            const fareInUSD = basePrice / (exchangeRates[fareCurrency] || 1.0);
            const convertedBaseFare = Math.round(fareInUSD * (exchangeRates[userCurr] || 1.0));

            el.dataset.fhpInlineConverted = "true";
            if (el.parentElement) el.parentElement.dataset.fhpInlineConverted = "true";

            const tag = document.createElement('span');
            tag.className = 'fhp-inline-converted';
            tag.style.cssText = `
                display: inline-block;
                font-size: 0.82em;
                font-weight: 600;
                color: #1a73e8;
                background-color: #e8f0fe;
                border: 1px solid #d2e3fc;
                padding: 1px 5px;
                border-radius: 6px;
                margin-left: 5px;
                vertical-align: middle;
                font-family: 'Google Sans', Roboto, sans-serif;
            `;
            tag.title = `Converted Base Airline Fare in ${userCurr}`;
            tag.innerText = `(≈ ${formatMoney(convertedBaseFare, userCurr)})`;

            el.insertAdjacentElement('afterend', tag);
        }
    });
}

// 6. Itemized Price Breakdown Modal
function showItemizedPriceModal(flight) {
    let oldModal = document.querySelector('.fhp-modal-overlay');
    if (oldModal) oldModal.remove();

    const userCurr = flight.userBaseCurr || (typeof extractCurrentRouteInfo === 'function' ? extractCurrentRouteInfo().userCurr : null) || settings.baseCurrency || 'USD';
    const cardProfile = cardProfiles[settings.rewardCard] || cardProfiles['scapia'];

    const modal = document.createElement('div');
    modal.className = 'fhp-modal-overlay';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'True Price Breakdown');

    modal.innerHTML = `
        <div class="fhp-modal-content">
            <div class="fhp-modal-header">
                <h4 class="fhp-modal-title">✈️ True Price Breakdown</h4>
                <button class="fhp-modal-close" id="fhpModalClose" aria-label="Close dialog">&times;</button>
            </div>
            <div class="fhp-modal-body">
                <div class="fhp-modal-row">
                    <span>Base Airline Fare:</span>
                    <strong>${formatMoney(flight.basePriceInUserCurr, userCurr)}</strong>
                </div>
                ${flight.isForeignTx ? `<div class="fhp-modal-subtext" style="margin-top:-4px; margin-bottom:6px;">Original: ${flight.fareSymbol}${flight.basePrice.toLocaleString()} ${flight.fareCurrency}</div>` : ''}

                <div class="fhp-modal-row">
                    <span>Checked Bags Needed (${settings.checkedBags}):</span>
                    <span>+${formatMoney(flight.baggageFee, userCurr)}</span>
                </div>
                ${flight.baggageInfo ? `<div class="fhp-modal-subtext" style="margin-top:-4px; margin-bottom:6px; color:#5f6368;">Fare Allowance: ${flight.baggageInfo.textMatch} (${flight.baggageInfo.includedBags} Included)</div>` : ''}

                ${flight.seatFee > 0 ? `
                <div class="fhp-modal-row">
                    <span>Seat Selection Tax (${settings.passengerCount} px):</span>
                    <span>+${formatMoney(flight.seatFee, userCurr)}</span>
                </div>` : ''}

                ${flight.isForeignTx ? `
                <div class="fhp-modal-row">
                    <span>Card Forex Fee (${(cardProfile.fxFeePct * 100).toFixed(1)}%):</span>
                    <span style="color:#b06000;">+${formatMoney(flight.fxCharge, userCurr)}</span>
                </div>` : ''}

                ${flight.rewardsValue > 0 ? `
                <div class="fhp-modal-row">
                    <span>Card Rewards Offset (${cardProfile.name}):</span>
                    <span style="color:#137333;">-${formatMoney(flight.rewardsValue, userCurr)}</span>
                </div>` : ''}

                <div class="fhp-modal-total">
                    <span>Net Effective Price:</span>
                    <span>${formatMoney(flight.netPriceInUserCurr, userCurr)}</span>
                </div>

                ${settings.passengerCount > 1 ? `
                <div style="background:#e6f4ea; padding:8px 12px; border-radius:8px; margin-top:12px; border:1px solid #ceead6; font-size:11.5px; color:#137333;">
                    <strong>👨‍👩‍👧‍👦 Group Booking Splitter Tip:</strong><br>
                    <span>Searching ${settings.passengerCount} seats together may force all tickets into a higher fare bucket. Try splitting into 2 separate bookings (${Math.floor(settings.passengerCount / 2)} + ${settings.passengerCount - Math.floor(settings.passengerCount / 2)}) to capture remaining cheap bucket inventory!</span>
                </div>` : ''}

                <div style="margin-top:14px; padding-top:10px; border-top:1px solid #dadce0;">
                    <div style="font-weight:700; font-size:12px; color:#3c4043; margin-bottom:8px;">🔍 Cross-Check OTA Aggregator Prices:</div>
                    <div style="display:flex; gap:8px; flex-wrap:wrap;">
                        <button class="fhp-ota-btn" id="fhpOtaSkyscanner" style="padding:5px 12px; border-radius:6px; border:1px solid #1a73e8; background:#e8f0fe; color:#1a73e8; font-weight:700; font-size:11px; cursor:pointer;">✈️ Skyscanner</button>
                        <button class="fhp-ota-btn" id="fhpOtaKayak" style="padding:5px 12px; border-radius:6px; border:1px solid #137333; background:#e6f4ea; color:#137333; font-weight:700; font-size:11px; cursor:pointer;">🔍 Kayak</button>
                        <button class="fhp-ota-btn" id="fhpOtaTrip" style="padding:5px 12px; border-radius:6px; border:1px solid #b06000; background:#feefc3; color:#b06000; font-weight:700; font-size:11px; cursor:pointer;">🌐 Trip.com</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const closeModal = () => {
        modal.remove();
        document.removeEventListener('keydown', onKeyDown);
    };

    const onKeyDown = (e) => {
        if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', onKeyDown);

    const routeInfo = extractCurrentRouteInfo();
    const skyscannerBtn = modal.querySelector('#fhpOtaSkyscanner');
    if (skyscannerBtn) {
        skyscannerBtn.addEventListener('click', () => {
            if (routeInfo.origin && routeInfo.destination) {
                window.open(`https://www.skyscanner.com/transport/flights/${routeInfo.origin.toLowerCase()}/${routeInfo.destination.toLowerCase()}`, '_blank');
            }
        });
    }
    const kayakBtn = modal.querySelector('#fhpOtaKayak');
    if (kayakBtn) {
        kayakBtn.addEventListener('click', () => {
            if (routeInfo.origin && routeInfo.destination) {
                window.open(`https://www.kayak.com/flights/${routeInfo.origin}-${routeInfo.destination}`, '_blank');
            }
        });
    }
    const tripBtn = modal.querySelector('#fhpOtaTrip');
    if (tripBtn) {
        tripBtn.addEventListener('click', () => {
            if (routeInfo.origin && routeInfo.destination) {
                window.open(`https://www.trip.com/flights/${routeInfo.origin.toLowerCase()}-to-${routeInfo.destination.toLowerCase()}/tickets-${routeInfo.origin.toLowerCase()}-${routeInfo.destination.toLowerCase()}`, '_blank');
            }
        });
    }

    const closeBtn = modal.querySelector('#fhpModalClose');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

// 7. Inject Top Summary Banner & Split-Ticket Banner
function renderWebpageHeaderBanner(analyzedCount, lowestNetPrice, lowestBasePrice, userCurr, splitSavingsInfo, routeInfo = null) {
    const tripTypeKey = routeInfo ? (routeInfo.isOneWay ? 'oneway' : (routeInfo.isMultiCity ? 'multicity' : 'roundtrip')) : 'std';
    const bannerSig = `${analyzedCount}_${Math.round(lowestNetPrice)}_${Math.round(lowestBasePrice)}_${userCurr}_${splitSavingsInfo ? Math.round(splitSavingsInfo.savings) : 'none'}_${tripTypeKey}`;
    const existingBanner = document.querySelector('.fhp-header-banner');
    if (existingBanner && existingBanner.dataset.fhpSig === bannerSig) {
        return;
    }
    if (existingBanner) existingBanner.remove();
    const existingSplitBanner = document.querySelector('.fhp-split-banner');
    if (existingSplitBanner) existingSplitBanner.remove();

    const banner = document.createElement('div');
    banner.className = 'fhp-header-banner';
    banner.dataset.fhpSig = bannerSig;
    banner.style.cssText = `
        background: linear-gradient(135deg, #1a73e8, #1557b0);
        color: #ffffff;
        padding: 12px 18px;
        margin: 12px 0 8px 0;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(26,115,232,0.25);
        font-family: 'Google Sans', Roboto, Arial, sans-serif;
        font-size: 13px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        z-index: 1;
        position: relative;
    `;

    const cardName = cardProfiles[settings.rewardCard]?.name || 'Standard Card';
    const fxInfo = cardProfiles[settings.rewardCard]?.fxFeePct === 0 ? '0% FX' : `${(cardProfiles[settings.rewardCard]?.fxFeePct * 100).toFixed(1)}% FX`;

    const isOneWay = Boolean(routeInfo && routeInfo.isOneWay);
    const isMultiCity = Boolean(routeInfo && routeInfo.isMultiCity);
    const tripTypeBadge = isOneWay
        ? ` | <span>Type: <strong>One-Way</strong></span>`
        : (isMultiCity ? ` | <span>Type: <strong>Multi-City</strong></span>` : ` | <span>Type: <strong>Round-Trip</strong></span>`);

    const matrixBtnText = isOneWay
        ? `📅 Launch Departure Calendar`
        : (isMultiCity ? `🗺️ Multi-City Optimizer` : `📊 Launch Fare Matrix`);

    banner.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:16px;">✈️</span>
            <strong>Flight Hacker Pro Active:</strong> 
            <span>Base: <strong>${userCurr}</strong></span> | 
            <span>Card: <strong>${cardName} (${fxInfo})</strong></span> | 
            <span>Bags: <strong>${settings.checkedBags}</strong></span>
            ${tripTypeBadge}
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
            <span>Analyzed: <strong>${analyzedCount} flights</strong></span>
            ${lowestBasePrice < Infinity ? `<span style="background:rgba(255,255,255,0.2); padding:4px 10px; border-radius:12px;" title="Google Flights Bare Base Fare">Base Fare: <strong>${formatMoney(lowestBasePrice, userCurr)}</strong></span>` : ''}
            ${lowestNetPrice < Infinity ? `<span style="background:rgba(255,255,255,0.25); padding:4px 10px; border-radius:12px;" title="Estimated Net True Price after Bags (${settings.checkedBags} bag) & Rewards">Cheapest Net: <strong>${formatMoney(lowestNetPrice, userCurr)}</strong></span>` : ''}
            <button id="fhpHeaderMatrixBtn" style="background:#ffffff; color:#1a73e8; border:none; padding:5px 12px; border-radius:14px; font-weight:700; font-size:12px; cursor:pointer; box-shadow:0 2px 4px rgba(0,0,0,0.15); transition:transform 0.1s;">${matrixBtnText}</button>
        </div>
    `;

    const matrixHeaderBtn = banner.querySelector('#fhpHeaderMatrixBtn');
    if (matrixHeaderBtn) {
        matrixHeaderBtn.addEventListener('click', () => {
            const horizon = settings.scanHorizon || 30;
            const bracket = settings.tripBracket || '5-21';
            chrome.storage.local.get(null, (allStorage) => {
                const currentRouteInfo = routeInfo || extractCurrentRouteInfo();
                const matrixData = generateMatrixData(currentRouteInfo, horizon, bracket, null, allStorage);
                showMatrixHeatMapModal(matrixData, currentRouteInfo, 'ANY', 'ANY', null, null, 'ANY', allStorage, currentRouteInfo.isOneWay ? 'CALENDAR' : 'DAYWISE');
            });
        });
    }

    // Target the flight results container specifically (below the search box card)
    const targetParent = document.querySelector('.gWSBe') || 
                       document.querySelector('[aria-label*="departing flights"]') || 
                       document.querySelector('h3') || 
                       document.querySelector('.Rj4Z2d') || 
                       document.querySelector('ul');
    
    if (targetParent && targetParent.parentNode) {
        targetParent.parentNode.insertBefore(banner, targetParent);
    } else {
        const mainEl = document.querySelector('[role="main"]');
        if (mainEl) {
            mainEl.appendChild(banner);
        } else {
            document.body.appendChild(banner);
        }
    }

    if (splitSavingsInfo && splitSavingsInfo.savings > 1000) {
        const splitBanner = document.createElement('div');
        splitBanner.className = 'fhp-split-banner';
        splitBanner.style.cssText = `
            background: linear-gradient(135deg, #137333, #0f5224);
            color: #ffffff;
            padding: 12px 18px;
            margin: 10px 0;
            border-radius: 8px;
            font-weight: 600;
            font-size: 13px;
            box-shadow: 0 4px 10px rgba(19,115,51,0.25);
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 1;
            position: relative;
        `;
        splitBanner.innerHTML = `
            <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:18px;">✂️</span>
                <span><strong>Split-Ticket Hack Found!</strong> Save <strong>${formatMoney(splitSavingsInfo.savings, userCurr)}</strong> (${splitSavingsInfo.savingsPct}% off) by booking Outbound & Return as 2 separate one-way tickets!</span>
            </div>
            <span style="background:rgba(255,255,255,0.25); padding:4px 12px; border-radius:12px; font-size:12px;">Roundtrip Hack Active</span>
        `;
        banner.parentNode.insertBefore(splitBanner, banner.nextSibling);
    }
}

let lastAnalyzedUrl = '';

// 8. Core Analysis Engine
function analyzeFlights() {
    if (settings.extensionEnabled === false) return;
    isModifyingDom = true;
    try {
        _analyzeFlightsInternal();
    } finally {
        isModifyingDom = false;
    }
}

function _analyzeFlightsInternal() {
    // Reset cached route state and dataset attributes on SPA route changes
    if (window.location.href !== lastAnalyzedUrl) {
        lastAnalyzedUrl = window.location.href;
        window.fhpLastLowestBasePrice = null;
        window.fhpLastWrittenCacheKey = null;
        window.fhpLastWrittenLowestPrice = null;
        document.querySelectorAll('[data-fhp-analyzed]').forEach(el => {
            delete el.dataset.fhpAnalyzed;
            delete el.dataset.fhpFingerprint;
            delete el.dataset.fhpBasePrice;
            delete el.dataset.fhpNetPrice;
            delete el.dataset.fhpContainerHtml;
            delete el._fhpParsedFlight;
            const oldContainer = el.querySelector('.fhp-container');
            if (oldContainer) oldContainer.remove();
        });
        const existingBanner = document.querySelector('.fhp-header-banner');
        if (existingBanner) existingBanner.remove();
        const existingSplitBanner = document.querySelector('.fhp-split-banner');
        if (existingSplitBanner) existingSplitBanner.remove();
    }

    // Inject inline adjacent converted price tags on all foreign price nodes
    injectInlineCurrencyConversions();

    const rawNodes = Array.from(document.querySelectorAll('li, div[role="listitem"], div[jsaction*="flight"]'))
        .filter(node => !isExtensionOwnedNode(node));
    
    const priceIndicatorRegex = /[$₹€£₫₺₱฿¥]|(?:\b(?:usd|inr|eur|gbp|aed|aud|cad|sgd|vnd|ars|brl|thb|jpy|try|pln|sek|php|idr|myr|tl|rp|rm|kr|zł)\b)|(?:a\$|c\$|s\$|r\$|ars\$)/i;
    const timeIndicatorRegex = /\b\d+\s*(?:hr|min|h|m|stunden|std|heures)\b|nonstop|\b\d+\s*stop/i;
    const matchedNodes = rawNodes.filter(node => {
        const txt = (node.innerText + ' ' + (node.getAttribute('aria-label') || '')).toLowerCase();
        return timeIndicatorRegex.test(txt) && priceIndicatorRegex.test(txt);
    });

    if (matchedNodes.length === 0) return;

    const cardSet = new Set();
    matchedNodes.forEach(node => {
        const card = getOutermostCard(node);
        if (card && !isExtensionOwnedNode(card)) {
            cardSet.add(card);
        }
    });
    const flightCards = Array.from(cardSet);

    const currentRoute = extractCurrentRouteInfo();
    const userBaseCurr = currentRoute.userCurr || settings.baseCurrency || 'USD';
    const validFlights = [];

    // Step 1: Parse and snapshot all candidate cards
    flightCards.forEach(card => {
        const nativeContent = getCardNativeContent(card);
        const fingerprint = computeCardFingerprint(nativeContent);

        if (card.dataset.fhpFingerprint === fingerprint && card._fhpParsedFlight && card.querySelector('.fhp-container')) {
            validFlights.push(card._fhpParsedFlight);
            return;
        }

        const fareData = parseFareString(nativeContent);
        if (!fareData) return;

        const { price: basePrice, currency: fareCurrency, symbol: fareSymbol } = fareData;

        // Convert base price to User's Base Currency
        const fareInUSD = basePrice / (exchangeRates[fareCurrency] || 1.0);
        const basePriceInUserCurr = fareInUSD * (exchangeRates[userBaseCurr] || 1.0);

        const lowerText = nativeContent.toLowerCase();

        // Baggage Provision Detection & Net Fee Calculation
        const fareBucket = extractFareBucket(nativeContent);
        const baggageInfo = detectBaggageProvision(nativeContent, fareBucket ? fareBucket.letter : null);

        let bagRateInUserCurr;
        if (settings.customBagFee !== undefined && settings.customBagFee !== null && !isNaN(settings.customBagFee) && settings.customBagFee >= 0) {
            bagRateInUserCurr = parseFloat(settings.customBagFee);
        } else {
            bagRateInUserCurr = (userBaseCurr === 'INR') ? 3000 : (40 * (exchangeRates[userBaseCurr] || 1.0));
        }

        const additionalBagsNeeded = Math.max(0, settings.checkedBags - baggageInfo.includedBags);
        const baggageFee = additionalBagsNeeded * settings.passengerCount * bagRateInUserCurr;

        let seatFee = 0;
        let seatRateInUserCurr;
        if (settings.customSeatFee !== undefined && settings.customSeatFee !== null && !isNaN(settings.customSeatFee) && settings.customSeatFee >= 0) {
            seatRateInUserCurr = parseFloat(settings.customSeatFee);
        } else {
            seatRateInUserCurr = (userBaseCurr === 'INR') ? 1000 : (15 * (exchangeRates[userBaseCurr] || 1.0));
        }
        if (settings.passengerCount > 1 && (lowerText.includes('basic') || lowerText.includes('no seat'))) {
            seatFee = settings.passengerCount * seatRateInUserCurr;
        }

        // Forex Charges
        const isForeignTx = (fareCurrency !== userBaseCurr);
        const cardProfile = cardProfiles[settings.rewardCard] || cardProfiles['scapia'] || cardProfiles['none'];
        const fxFeePct = (settings.customCardFxPct !== undefined && settings.customCardFxPct !== null && !isNaN(settings.customCardFxPct) && settings.customCardFxPct >= 0)
            ? (parseFloat(settings.customCardFxPct) / 100)
            : cardProfile.fxFeePct;
        
        let fxCharge = 0;
        if (isForeignTx) {
            fxCharge = basePriceInUserCurr * fxFeePct;
        }

        const grossPriceInUserCurr = basePriceInUserCurr + baggageFee + seatFee + fxCharge;
        const rewardsValue = grossPriceInUserCurr * cardProfile.rewardPct;
        const netPriceInUserCurr = grossPriceInUserCurr - rewardsValue;

        // Extract duration
        const hrMatch = lowerText.match(/(\d+)\s*(?:hr|h)/);
        const minMatch = lowerText.match(/(\d+)\s*(?:min|m)/);
        const durationMins = (hrMatch ? parseInt(hrMatch[1]) * 60 : 0) + (minMatch ? parseInt(minMatch[1]) : 0);

        // Detect Risks & Separate Tickets
        const isSelfTransfer = lowerText.includes('separate tickets') || lowerText.includes('self-transfer') || lowerText.includes('booked together');
        const layoverMatch = lowerText.match(/(\d+)\s*(?:min|m)\s*layover/);
        const hasShortLayover = layoverMatch && parseInt(layoverMatch[1]) < 50;

        // Comfort Analytics
        let comfortProfile = null;
        if (settings.showComfort) {
            for (const [model, data] of Object.entries(aircraftData)) {
                if (lowerText.includes(model)) {
                    comfortProfile = { name: model.toUpperCase(), ...data };
                    break;
                }
            }
        }

        // Version 2.0 Feature Evaluations (Options 1, 2, & 3 Exploits)
        const cppValuation = settings.showCPP ? calculateCPP(fareInUSD, settings.loyaltyProgram) : null;
        const loungeInfo = settings.showLoungeVisa ? assessLoungeAccess(nativeContent) : null;
        const visaInfo = settings.showLoungeVisa ? assessTransitVisa(nativeContent, settings.passportNationality) : null;
        const skiplagInfo = assessHiddenCitySkiplag(nativeContent, currentRoute.destination);
        const openJawInfo = assessOpenJawAlternateAirports(currentRoute.origin, currentRoute.destination, basePriceInUserCurr, userBaseCurr);
        const groupSplitInfo = assessGroupBookingFareSplit(settings.passengerCount, basePriceInUserCurr, nativeContent, userBaseCurr);
        const stopoverInfo = (settings.showStopovers !== false) ? assessStopoverOptimization(nativeContent, currentRoute.origin, currentRoute.destination) : null;
        const multiCityInfo = (settings.showStopovers !== false) ? assessMultiCityItinerary(currentRoute, nativeContent, userBaseCurr) : null;
        const errorFareInfo = null; // Evaluated globally against route median in Step 2
        const distressInfo = null;

        if (netPriceInUserCurr && durationMins) {
            card.dataset.fhpBasePrice = String(basePriceInUserCurr);
            card.dataset.fhpNetPrice = String(netPriceInUserCurr);
            card.dataset.fhpFingerprint = fingerprint;

            const flightObj = {
                card, basePrice, fareCurrency, fareSymbol, basePriceInUserCurr, fareInUSD,
                userBaseCurr,
                baggageFee, seatFee, fxCharge, rewardsValue, isForeignTx,
                grossPriceInUserCurr, netPriceInUserCurr, durationMins,
                isSelfTransfer, hasShortLayover, comfortProfile, text: lowerText,
                cppValuation, fareBucket, loungeInfo, visaInfo, skiplagInfo, openJawInfo, groupSplitInfo, baggageInfo,
                errorFareInfo, distressInfo, stopoverInfo, multiCityInfo
            };
            card._fhpParsedFlight = flightObj;
            validFlights.push(flightObj);
        }
    });

    // Step 2: Calculate Global Baseline & Aggregates across COMPLETE active flight list
    let baseline = { price: Infinity, duration: 0 };
    let cheapestSeparateTicketFare = Infinity;
    let cheapestBundledFare = Infinity;
    let overallLowestBasePrice = Infinity;
    let overallLowestNetPrice = Infinity;

    validFlights.forEach(f => {
        if (f.netPriceInUserCurr < baseline.price) {
            baseline = { price: f.netPriceInUserCurr, duration: f.durationMins };
        }
        if (f.basePriceInUserCurr < overallLowestBasePrice) {
            overallLowestBasePrice = f.basePriceInUserCurr;
        }
        if (f.netPriceInUserCurr < overallLowestNetPrice) {
            overallLowestNetPrice = f.netPriceInUserCurr;
        }
        if (f.isSelfTransfer && f.netPriceInUserCurr < cheapestSeparateTicketFare) {
            cheapestSeparateTicketFare = f.netPriceInUserCurr;
        } else if (!f.isSelfTransfer && f.netPriceInUserCurr < cheapestBundledFare) {
            cheapestBundledFare = f.netPriceInUserCurr;
        }
    });

    // Calculate route median fare across all visible candidates for accurate anomaly detection
    const allFaresUSD = validFlights.map(f => f.fareInUSD).filter(p => p > 0).sort((a,b) => a - b);
    const medianRouteFareUSD = allFaresUSD.length > 0 
        ? allFaresUSD[Math.floor(allFaresUSD.length / 2)] 
        : (currentRoute.basePriceUSD || 500);

    validFlights.forEach(f => {
        f.errorFareInfo = assessErrorFareAnomaly(f.fareInUSD, medianRouteFareUSD);
        f.distressInfo = assessLastMinuteDistress(currentRoute.activeDepISO, f.fareInUSD, medianRouteFareUSD);
    });

    // Evaluate Split-Ticket Arbitrage Savings across complete flight list
    let splitSavingsInfo = null;
    if (settings.showSplitTickets && cheapestSeparateTicketFare < Infinity && cheapestBundledFare < Infinity) {
        if (cheapestSeparateTicketFare < cheapestBundledFare) {
            const savings = cheapestBundledFare - cheapestSeparateTicketFare;
            const savingsPct = ((savings / cheapestBundledFare) * 100).toFixed(1);
            splitSavingsInfo = { savings, savingsPct };
        }
    }

    // Also check page header summary pills for explicit "Cheapest" fare callouts across all sections
    const summaryNodes = Array.from(document.querySelectorAll('[aria-label*="Cheapest"], [aria-label*="cheapest"], [aria-label*="from"], .m74Sce, .Z00n4b')).filter(el => !isExtensionOwnedNode(el));
    summaryNodes.forEach(node => {
        const txt = node.innerText || node.getAttribute('aria-label') || '';
        if (!txt || txt.length > 200) return;
        const fareData = parseFareString(txt);
        if (fareData) {
            const fareInUSD = fareData.price / (exchangeRates[fareData.currency] || 1.0);
            if (fareInUSD >= 25 && fareInUSD <= 25000) {
                const fareInUserCurr = fareInUSD * (exchangeRates[userBaseCurr] || 1.0);
                if (fareInUserCurr < overallLowestBasePrice) {
                    overallLowestBasePrice = fareInUserCurr;
                }
            }
        }
    });

    // Persist scraped live fare cache & update normalized route anchor in chrome.storage.local
    if (currentRoute.origin && currentRoute.destination && currentRoute.activeDepISO && overallLowestBasePrice < Infinity) {
        window.fhpLastLowestBasePrice = overallLowestBasePrice;
        const pax = settings.passengerCount || 1;
        const isOneWay = !currentRoute.activeRetISO || currentRoute.isOneWay;
        const fareCacheKey = isOneWay
            ? `fhp_fare_${currentRoute.origin}_${currentRoute.destination}_${currentRoute.activeDepISO}_oneway_p${pax}`
            : `fhp_fare_${currentRoute.origin}_${currentRoute.destination}_${currentRoute.activeDepISO}_${currentRoute.activeRetISO}_p${pax}`;
        const anchorKey = isOneWay
            ? `fhp_anchor_${currentRoute.origin}_${currentRoute.destination}_oneway`
            : `fhp_anchor_${currentRoute.origin}_${currentRoute.destination}`;
        
        if (window.fhpLastWrittenCacheKey !== fareCacheKey || Math.abs((window.fhpLastWrittenLowestPrice || 0) - overallLowestBasePrice) > 1) {
            window.fhpLastWrittenCacheKey = fareCacheKey;
            window.fhpLastWrittenLowestPrice = overallLowestBasePrice;

            const activeDep = new Date(currentRoute.activeDepISO);
            const activeRet = currentRoute.activeRetISO ? new Date(currentRoute.activeRetISO) : null;
            const activeMult = calculateRealisticFareMultiplier(activeDep, activeRet, new Date());
            
            const livePriceUSD = overallLowestBasePrice / (exchangeRates[userBaseCurr] || 1.0);
            const normalizedAnchorUSD = activeMult > 0 ? (livePriceUSD / activeMult) : livePriceUSD;

            chrome.storage.local.set({
                [fareCacheKey]: {
                    fareBase: Math.round(overallLowestBasePrice),
                    userCurr: userBaseCurr,
                    timestamp: Date.now()
                },
                [anchorKey]: normalizedAnchorUSD
            });
        }
    }

    // Step 3: Render Webpage Header Summary & Split-Ticket Banners
    if (validFlights.length > 0) {
        renderWebpageHeaderBanner(validFlights.length, overallLowestNetPrice, overallLowestBasePrice, userBaseCurr, splitSavingsInfo, currentRoute);
    }

    // Step 4: DOM Badge Injection on flight cards with idempotency and true global baseline
    validFlights.forEach(flight => {
        if (flight.isSelfTransfer && settings.hideSelfTransfers) {
            flight.card.classList.add('fhp-hidden');
            return;
        } else {
            flight.card.classList.remove('fhp-hidden');
        }

        // Row 1: True Price (Clickable Modal Launcher), FX Breakdown, & Split-Ticket Hack Badges
        let finHtml = `<div class="fhp-row">`;

        // Interactive Clickable Net True Price Badge (clearly identified as Est. Net Price)
        const tripTypeTag = currentRoute.isOneWay ? ' [One-Way]' : (currentRoute.isMultiCity ? ' [Multi-City]' : '');
        finHtml += `<span class="fhp-badge fhp-info fhp-clickable-badge" role="button" tabindex="0" aria-label="Open itemized fare breakdown" style="font-size:12px; font-weight:bold; cursor:pointer;" title="Click to open itemized math modal breakdown showing Base Fare + Baggage Fees + Seat Fees + Card FX Charges - Rewards Offset">Est. Net Price: ${formatMoney(flight.netPriceInUserCurr, userBaseCurr)}${tripTypeTag} ℹ️</span>`;

        if (flight.isForeignTx) {
            if (flight.fxCharge === 0) {
                finHtml += `<span class="fhp-badge fhp-success" title="0% Forex Fee Active: Paying with ${cardProfiles[settings.rewardCard]?.name} saves foreign currency markup fees">0% FX Fee (${flight.fareCurrency} ➔ ${userBaseCurr})</span>`;
            } else {
                finHtml += `<span class="fhp-badge fhp-warn" title="Forex Charge (+${formatMoney(flight.fxCharge, userBaseCurr)}): Applied by ${cardProfiles[settings.rewardCard]?.name} at ${(cardProfiles[settings.rewardCard]?.fxFeePct * 100).toFixed(1)}% rate. Tip: Switch to a 0% FX card (e.g. Scapia) to save this fee!">Forex Charge: +${formatMoney(flight.fxCharge, userBaseCurr)}</span>`;
            }
        }

        // Option 1: CPP Badge
        if (flight.cppValuation) {
            const cppBg = flight.cppValuation.isGoodVal ? 'fhp-success' : 'fhp-info';
            finHtml += `<span class="fhp-badge ${cppBg}" title="Cent-Per-Point (CPP) Award Valuation: Cash fare ($${flight.cppValuation.cashPriceUSD}) minus taxes ($${flight.cppValuation.awardTaxesUSD}) divided by ~${flight.cppValuation.ptsReq.toLocaleString()} points required for ${flight.cppValuation.programName}. ${flight.cppValuation.isGoodVal ? 'Great redemption value (>1.5¢/pt)!' : 'Standard value. Consider booking with cash.'}">💎 ${flight.cppValuation.cppCentsUSD}¢/pt CPP (${flight.cppValuation.isGoodVal ? 'Great Value' : 'Standard'})</span>`;
        }

        // Option 1: EQM Badge
        if (flight.fareBucket) {
            finHtml += `<span class="fhp-badge fhp-info" title="Elite Qualifying Miles (EQM): Earns ~${flight.fareBucket.eqmPct}% status qualification miles in ${flight.fareBucket.name} booking class (${flight.fareBucket.letter}) towards airline elite status.">⭐ Earns ${flight.fareBucket.eqmPct}% EQMs (${flight.fareBucket.letter} - ${flight.fareBucket.name})</span>`;
        }

        // Split Ticket Hack Badge on split items
        if (flight.isSelfTransfer && splitSavingsInfo) {
            finHtml += `<span class="fhp-badge fhp-split-badge" title="Split-Ticket Hack: Booking outbound and return as separate one-way tickets saves ${formatMoney(splitSavingsInfo.savings, userBaseCurr)} vs Google's bundled roundtrip fare. Action: Book each leg independently!">✂️ Split-Ticket Deal: Save ${formatMoney(splitSavingsInfo.savings, userBaseCurr)} vs Roundtrip</span>`;
        }

        // Time/Cost Tradeoff Calculation against global baseline
        const priceDiff = flight.netPriceInUserCurr - baseline.price;
        const timeDiff = baseline.duration - flight.durationMins;

        if (priceDiff > 0 && timeDiff > 0) {
            const costPerHour = priceDiff / (timeDiff / 60);
            const userRate = exchangeRates[userBaseCurr] || 1.0;
            const timeValThreshold = (settings.timeValue || 50) * userRate;

            if (costPerHour < timeValThreshold) {
                finHtml += `<span class="fhp-badge fhp-success" title="Value of Time Tradeoff: Paying +${formatMoney(priceDiff, userBaseCurr)} to save ${(timeDiff/60).toFixed(1)} hours costs ${formatMoney(costPerHour, userBaseCurr)}/hr, which is below your target threshold of ${formatMoney(timeValThreshold, userBaseCurr)}/hr!">Worth it: Pay +${formatMoney(priceDiff, userBaseCurr)} to save ${(timeDiff/60).toFixed(1)}h (${formatMoney(costPerHour, userBaseCurr)}/hr)</span>`;
            }
        }

        finHtml += `</div>`;

        // Row 2: Baggage, Error Fares, Last-Minute Clearance, Comfort, Lounge, Visa, Skiplagging, Open-Jaw, & Group Splitter Badges
        let riskHtml = `<div class="fhp-row">`;

        // Error Fare Anomaly Badge
        if (flight.errorFareInfo) {
            riskHtml += `<span class="fhp-badge fhp-danger" style="background:#fce8e6; color:#c5221f; border:1px solid #fad2cf; font-weight:700;" title="🔥 Error Fare Alert: Price is ~${flight.errorFareInfo.discountPct}% below historical route median! Action: Book immediately on official airline website. Do NOT call the airline until ticket is issued.">🔥 ERROR FARE DETECTED (~${flight.errorFareInfo.discountPct}% OFF)</span>`;
        }

        // Last-Minute Distress Clearance Badge
        if (flight.distressInfo) {
            riskHtml += `<span class="fhp-badge fhp-warn" style="background:#fef7e0; color:#b06000; border:1px solid #feefc3; font-weight:700;" title="⚡ Last-Minute Distress Clearance: Airline is clearing unsold seat inventory ${flight.distressInfo.daysOut === 0 ? 'today' : flight.distressInfo.daysOut + ' days before departure'} at a steep discount. Action: Book now before seats sell out!">⚡ Last-Minute Distress Clearance</span>`;
        }

        // Baggage Allowance Provision Badge
        if (flight.baggageInfo) {
            if (flight.baggageInfo.includedBags >= settings.checkedBags && flight.baggageInfo.includedBags > 0) {
                riskHtml += `<span class="fhp-badge fhp-success" title="🧳 Baggage Covered: Flight fare includes ${flight.baggageInfo.includedBags} checked bag(s), fully covering your requirement of ${settings.checkedBags} bag(s). Matched rule: ${flight.baggageInfo.textMatch}">🧳 ${flight.baggageInfo.includedBags} Checked Bag(s) Included</span>`;
            } else if (flight.baggageInfo.includedBags === 0 && settings.checkedBags > 0) {
                riskHtml += `<span class="fhp-badge fhp-warn" title="🎒 No Checked Bags Included: Bare Basic Economy fare. Adding ${settings.checkedBags} checked bag(s) costs +${formatMoney(flight.baggageFee, userBaseCurr)} extra. Matched rule: ${flight.baggageInfo.textMatch}">🎒 No Checked Bags Included (+${formatMoney(flight.baggageFee, userBaseCurr)})</span>`;
            } else if (settings.checkedBags > flight.baggageInfo.includedBags) {
                riskHtml += `<span class="fhp-badge fhp-info" title="🧳 Partial Baggage Provision: Flight fare covers ${flight.baggageInfo.includedBags} checked bag(s). Additional ${settings.checkedBags - flight.baggageInfo.includedBags} bag(s) required at +${formatMoney(flight.baggageFee, userBaseCurr)}. Matched rule: ${flight.baggageInfo.textMatch}">🧳 ${flight.baggageInfo.includedBags} Bag Included (+${formatMoney(flight.baggageFee, userBaseCurr)} addl.)</span>`;
            }
        }

        // Option 2: Lounge Access Badge
        if (flight.loungeInfo) {
            riskHtml += `<span class="fhp-badge fhp-success" title="🛋️ Complimentary Airport Lounge Access: Access to ${flight.loungeInfo.name} at ${flight.loungeInfo.airport}. Action: Present eligible credit card or elite boarding pass at lounge reception for entry.">🛋️ Complimentary ${flight.loungeInfo.name} Lounge (${flight.loungeInfo.airport})</span>`;
        }

        // Option 2: Transit Visa / Immigration Risk Badge
        if (flight.visaInfo) {
            if (flight.visaInfo.isVisaRequired) {
                riskHtml += `<span class="fhp-badge fhp-danger" title="🛂 Transit Visa Required: ${flight.visaInfo.message}. Action required: Check official embassy immigration guidelines and apply for a transit visa prior to departure!">${flight.visaInfo.message}</span>`;
            } else {
                riskHtml += `<span class="fhp-badge fhp-warn" title="🧳 Self-Transfer Warning: ${flight.visaInfo.message}. Action required: You must collect baggage, exit to landside, and re-check in.">${flight.visaInfo.message}</span>`;
            }
        }

        // Skiplagging Badge with TOS Warning
        if (flight.skiplagInfo) {
            riskHtml += `<span class="fhp-badge fhp-warn" title="🕵️ Hidden-City Skiplagging Hack: Flight stops at ${flight.skiplagInfo.destUpper} layover where you exit. Action required: Carry-on luggage ONLY (no checked bags), and do NOT attach airline frequent flyer ID.">${flight.skiplagInfo.message} (${flight.skiplagInfo.warning})</span>`;
        }

        // Open-Jaw Alternate Airport Badge
        if (flight.openJawInfo) {
            riskHtml += `<span class="fhp-badge fhp-info" title="💡 Open-Jaw Airport Hack: Booking to ${flight.openJawInfo.altName} saves ~${formatMoney(flight.openJawInfo.netSavings, userBaseCurr)} net (after ${flight.openJawInfo.groundTime} ground transport). Action: Select alternate airport search on Google Flights!">${flight.openJawInfo.message}</span>`;
        }

        // Group Booking Fare Splitter Badge
        if (flight.groupSplitInfo) {
            riskHtml += `<span class="fhp-badge fhp-success" title="👨‍👩‍👧‍👦 Group Booking Splitter: Airlines price all ${flight.groupSplitInfo.passengerCount} passengers at the highest remaining fare bucket. Action: Split booking into ${flight.groupSplitInfo.split1} + ${flight.groupSplitInfo.split2} passengers to save ~${formatMoney(flight.groupSplitInfo.estBucketSavingsBase, userBaseCurr)}!">${flight.groupSplitInfo.message}</span>`;
        }

        // Stopover Program & Layover Optimization Badges
        if (flight.stopoverInfo) {
            riskHtml += `<span class="fhp-badge fhp-stopover-badge" title="${flight.stopoverInfo.tooltip || flight.stopoverInfo.message}">${flight.stopoverInfo.message}</span>`;
            if (flight.stopoverInfo.hotelAlert) {
                riskHtml += `<span class="fhp-badge fhp-hotel-badge" title="${flight.stopoverInfo.hotelAlert}">${flight.stopoverInfo.hotelAlert}</span>`;
            }
            if (flight.stopoverInfo.tourAlert) {
                riskHtml += `<span class="fhp-badge fhp-tour-badge" title="${flight.stopoverInfo.tourAlert}">${flight.stopoverInfo.tourAlert}</span>`;
            }
        }

        // Multi-City Open-Jaw & Rail Transit Badge
        if (flight.multiCityInfo) {
            riskHtml += `<span class="fhp-badge fhp-multicity-badge" title="${flight.multiCityInfo.splitHackNotice}">${flight.multiCityInfo.message}</span>`;
            if (flight.multiCityInfo.railSuggestion) {
                riskHtml += `<span class="fhp-badge fhp-info" title="${flight.multiCityInfo.railSuggestion.message}">${flight.multiCityInfo.railSuggestion.message}</span>`;
            }
        }

        if (flight.isSelfTransfer && !settings.hideSelfTransfers && !flight.visaInfo) {
            riskHtml += `<span class="fhp-badge fhp-warn" title="⚠️ Self-Transfer / Separate Tickets: Different airlines operate connecting flights. Action required: You must exit customs, collect checked baggage, and re-check in for the next flight.">⚠️ Self-Transfer / Separate Tickets (Clear Customs)</span>`;
        }
        if (flight.hasShortLayover) {
            riskHtml += `<span class="fhp-badge fhp-danger" title="🏃 Short Layover MCT Risk: Layover duration is under 50 minutes. Action: Ensure fast transit or select a flight with longer layover to avoid missed connections.">🏃 MCT Risk (<50m Layover)</span>`;
        }
        if (flight.text.includes('no overhead bin')) {
            riskHtml += `<span class="fhp-badge fhp-danger" title="🎒 Basic Fare Restriction: Overhead bin carry-on bag is not allowed in this fare class. Personal item under seat only.">🎒 No Carry-On Allowed</span>`;
        }

        if (flight.comfortProfile) {
            riskHtml += `<span class="fhp-badge" style="background:${flight.comfortProfile.bg}; color:${flight.comfortProfile.color}; border: 1px solid ${flight.comfortProfile.color}40;" title="★ Aircraft Comfort & Health Score (${flight.comfortProfile.score}/10): ${flight.comfortProfile.name} aircraft. Features: ${flight.comfortProfile.tags.join(', ')}">
                ★ ${flight.comfortProfile.score} Air Quality (${flight.comfortProfile.name}): ${flight.comfortProfile.tags.join(', ')}
            </span>`;
        }
        riskHtml += `</div>`;

        // Assemble full container innerHTML
        let containerContent = finHtml;
        if (riskHtml !== `<div class="fhp-row"></div>`) {
            containerContent += riskHtml;
        }

        // Check idempotency: if container exists and HTML hasn't changed, skip DOM mutation
        const existingContainer = flight.card.querySelector('.fhp-container');
        if (existingContainer && flight.card.dataset.fhpContainerHtml === containerContent) {
            return;
        }

        flight.card.dataset.fhpContainerHtml = containerContent;
        flight.card.dataset.fhpAnalyzed = "true";

        if (existingContainer) existingContainer.remove();

        const container = document.createElement('div');
        container.className = 'fhp-container';
        container.style.cssText = `
            padding: 8px 14px;
            margin: 8px 0;
            border-top: 1px dashed #d2e3fc;
            background-color: #f0f4fe;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            z-index: 10;
        `;
        container.innerHTML = containerContent;

        const injectedClickableBadge = container.querySelector('.fhp-clickable-badge');
        if (injectedClickableBadge) {
            injectedClickableBadge.addEventListener('click', (e) => {
                e.stopPropagation();
                showItemizedPriceModal(flight);
            });
            injectedClickableBadge.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    showItemizedPriceModal(flight);
                }
            });
        }

        flight.card.appendChild(container);
    });
}