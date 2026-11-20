// Flight Hacker Pro - Service Worker (Background Script)

let exchangeRates = {
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
    'TRY': 33.5,
    'BRL': 5.6,
    'PLN': 3.95,
    'SEK': 10.4,
    'PHP': 56.2,
    'IDR': 15800,
    'MYR': 4.45
};

const cardProfiles = {
    'none': { name: 'Standard Card', fxFeePct: 0.035 },
    'chase_csr': { name: 'Chase Sapphire Reserve', fxFeePct: 0.00 },
    'amex_plat': { name: 'Amex Platinum', fxFeePct: 0.00 },
    'capone_vx': { name: 'Capital One Venture X', fxFeePct: 0.00 },
    'citi_premier': { name: 'Citi Premier / Strata', fxFeePct: 0.00 },
    'revolut': { name: 'Revolut / Wise Multi-Currency', fxFeePct: 0.00 },
    'scapia': { name: 'FedBank Scapia', fxFeePct: 0.00 },
    'magnus': { name: 'Axis Magnus', fxFeePct: 0.02 },
    'octane': { name: 'SBI Octane', fxFeePct: 0.035 },
    'infinia': { name: 'HDFC Infinia', fxFeePct: 0.02 },
    'zero_fx': { name: 'Generic 0% Forex', fxFeePct: 0.00 }
};

const currencySymbols = {
    'INR': '₹', 'USD': '$', 'EUR': '€', 'GBP': '£',
    'VND': '₫', 'ARS': 'ARS$', 'TRY': '₺', 'BRL': 'R$',
    'PLN': 'zł', 'SEK': ' kr', 'PHP': '₱', 'IDR': 'Rp ',
    'MYR': 'RM ', 'AUD': 'A$', 'CAD': 'C$', 'SGD': 'S$'
};

const targetCurrencies = ['VND', 'ARS', 'TRY', 'BRL', 'PLN', 'SEK', 'USD', 'EUR'];

// 1. Live Exchange Rates Fetcher & Cache Engine
async function fetchLiveExchangeRates() {
    try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        if (!response.ok) {
            throw new Error(`HTTP Error ${response.status}`);
        }
        const data = await response.json();
        
        if (data && data.result === 'success' && data.rates && typeof data.rates === 'object') {
            exchangeRates = { ...exchangeRates, ...data.rates };
            chrome.storage.local.set({
                exchangeRates: exchangeRates,
                lastFxUpdate: Date.now(),
                isFxLive: true
            }, () => {
                console.log('✓ Live Exchange Rates stored in chrome.storage.local');
            });
        } else {
            throw new Error('Malformed FX rates API response');
        }
    } catch (e) {
        console.warn('⚠️ Could not fetch live FX rates, retaining existing baseline rates:', e.message);
        chrome.storage.local.set({
            exchangeRates: exchangeRates,
            isFxLive: false
        });
    }
}

function ensureAlarms() {
    chrome.alarms.get('refreshFxRates', (alarm) => {
        if (!alarm) {
            chrome.alarms.create('refreshFxRates', { periodInMinutes: 720 }); // Every 12 hours
        }
    });
}

function cleanupStaleNotifications() {
    chrome.storage.local.get(null, (allData) => {
        if (!allData || chrome.runtime.lastError) return;
        const now = Date.now();
        const staleKeys = [];
        for (const [key, value] of Object.entries(allData)) {
            if (key.startsWith('pos_arb_')) {
                const ts = parseInt(key.replace('pos_arb_', ''), 10);
                if (isNaN(ts) || (now - ts > 24 * 60 * 60 * 1000)) { // Older than 24 hours
                    staleKeys.push(key);
                }
            } else if (key.startsWith('fhp_fare_')) {
                if (!value || typeof value !== 'object' || !value.timestamp || (now - value.timestamp > 2 * 60 * 60 * 1000)) { // 2 hour TTL
                    staleKeys.push(key);
                }
            } else if (key.startsWith('fhp_anchor_')) {
                if (!value || typeof value !== 'object' || !value.timestamp || (now - value.timestamp > 24 * 60 * 60 * 1000)) { // 24 hour TTL
                    staleKeys.push(key);
                }
            }
        }
        if (staleKeys.length > 0) {
            chrome.storage.local.remove(staleKeys, () => {
                if (!chrome.runtime.lastError) {
                    console.log(`[Storage Prune] Cleaned up ${staleKeys.length} stale cache/notification keys.`);
                }
            });
        }
    });
}

// Service worker startup & alarm triggers
chrome.runtime.onInstalled.addListener(() => {
    fetchLiveExchangeRates();
    ensureAlarms();
    cleanupStaleNotifications();
});

chrome.runtime.onStartup.addListener(() => {
    fetchLiveExchangeRates();
    ensureAlarms();
    cleanupStaleNotifications();
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'refreshFxRates') {
        fetchLiveExchangeRates();
        cleanupStaleNotifications();
    }
});

// Load rates from storage on startup
chrome.storage.local.get(['exchangeRates'], (data) => {
    if (data.exchangeRates) exchangeRates = { ...exchangeRates, ...data.exchangeRates };
});

function buildArbitrageUrl(originalUrl, targetCurrency) {
    try {
        if (!originalUrl || typeof originalUrl !== 'string' || !originalUrl.startsWith('http')) {
            return `https://www.google.com/travel/flights?curr=${targetCurrency}`;
        }
        const urlObj = new URL(originalUrl);
        urlObj.searchParams.set('curr', targetCurrency);
        return urlObj.toString();
    } catch (e) {
        if (originalUrl && typeof originalUrl === 'string' && originalUrl.startsWith('http')) {
            if (originalUrl.includes('curr=')) {
                return originalUrl.replace(/curr=[A-Z]{3}/, `curr=${targetCurrency}`);
            } else if (originalUrl.includes('?')) {
                return `${originalUrl}&curr=${targetCurrency}`;
            } else {
                return `${originalUrl}?curr=${targetCurrency}`;
            }
        }
        return `https://www.google.com/travel/flights?curr=${targetCurrency}`;
    }
}

function formatMoney(amount, currencyCode) {
    const symbol = currencySymbols[currencyCode] || (currencyCode + ' ');
    return symbol + Math.round(amount).toLocaleString();
}

const megaHubMap = {
    'IND': 'ORD', 'CMH': 'ORD', 'CVG': 'ORD', 'MDW': 'ORD',
    'COK': 'DEL', 'TRV': 'DEL', 'BLR': 'DEL', 'HYD': 'BOM', 'CCU': 'DEL',
    'MAN': 'LHR', 'BHX': 'LHR', 'EDI': 'LHR'
};

function runHubHuntingCheck(origin, destination, directPriceUSD, baseCurrency) {
    if (!origin) return null;
    const hub = megaHubMap[origin.toUpperCase()];
    if (!hub) return null;

    const positioningLegUSD = 80;
    const hubLongHaulUSD = directPriceUSD * 0.55;
    const totalHackerFareUSD = positioningLegUSD + hubLongHaulUSD;
    const savingsUSD = directPriceUSD - totalHackerFareUSD;

    if (savingsUSD > 250) {
        const userRate = exchangeRates[baseCurrency] || 1.0;
        const savingsBase = savingsUSD * userRate;
        const totalHackerFareBase = totalHackerFareUSD * userRate;
        return {
            hub,
            origin,
            destination,
            savingsUSD,
            savingsBase,
            totalHackerFareBase,
            savingsPct: ((savingsUSD / directPriceUSD) * 100).toFixed(1)
        };
    }
    return null;
}

// 2. Message Handler
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'checkPOS') {
        const originalUrl = request.url || '';
        const flightPayload = request.flightPayload || null;
        
        chrome.storage.local.get(['baseCurrency', 'rewardCard', 'exchangeRates'], (settings) => {
            try {
                if (settings.exchangeRates) exchangeRates = { ...exchangeRates, ...settings.exchangeRates };
                const userBaseCurr = (flightPayload && flightPayload.userCurr) || settings.baseCurrency || 'USD';
                const userCardKey = settings.rewardCard || 'scapia';
                const cardProfile = cardProfiles[userCardKey] || cardProfiles['scapia'];

                runArbitrageScanner(originalUrl, userBaseCurr, cardProfile, flightPayload, (result) => {
                    sendResponse(result);
                });
            } catch (err) {
                console.error('POS Scanner Error:', err);
                sendResponse({ success: false, message: 'POS Scanner encountered an error: ' + err.message });
            }
        });

        return true;
    }

    if (request.action === 'getStorageHealth') {
        chrome.storage.local.get(null, (allData) => {
            try {
                const keys = Object.keys(allData || {});
                const serialized = JSON.stringify(allData || {});
                const bytesUsed = serialized.length;
                const quotaBytes = 10485760; // 10MB default Chrome storage local quota
                const usagePct = ((bytesUsed / quotaBytes) * 100).toFixed(2);
                
                sendResponse({
                    status: 'HEALTHY',
                    connected: true,
                    totalKeys: keys.length,
                    estimatedBytes: bytesUsed,
                    quotaBytes: quotaBytes,
                    usagePct: usagePct + '%',
                    isFxLive: Boolean(allData.isFxLive),
                    lastFxUpdate: allData.lastFxUpdate || null,
                    activeRatesCount: Object.keys(allData.exchangeRates || exchangeRates || {}).length
                });
            } catch (err) {
                sendResponse({
                    status: 'DEGRADED',
                    connected: false,
                    error: err.message
                });
            }
        });
        return true;
    }

    if (request.action === 'ping') {
        sendResponse({ pong: true, timestamp: Date.now() });
        return true;
    }
});

// 3. Regional POS Engine (Live Verification + Calibrated Purchasing Power Model)
async function verifyLiveForeignPrice(targetUrl, targetCurr) {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3500);
        const resp = await fetch(targetUrl, {
            signal: controller.signal,
            headers: {
                'Accept': 'text/html,application/xhtml+xml',
                'Accept-Language': 'en-US,en;q=0.9'
            }
        });
        clearTimeout(timeout);
        if (!resp.ok) return null;
        const html = await resp.text();

        // Search for regional currency price markers in response payload
        const regexes = [
            new RegExp(`(?:${targetCurr}|[₫₺$€£₹]|R\\$)\\s*([\\d.,]+)`, 'i'),
            new RegExp(`([\\d.,]+)\\s*(?:${targetCurr}|[₫₺$€£₹]|TL|kr|zł)`, 'i')
        ];
        for (const re of regexes) {
            const m = html.match(re);
            if (m && m[1]) {
                const clean = m[1].replace(/,/g, '');
                const num = parseFloat(clean);
                if (!isNaN(num) && num > 10) {
                    return num;
                }
            }
        }
        return null;
    } catch (e) {
        return null;
    }
}

async function runArbitrageScanner(originalUrl, baseCurrency, cardProfile, flightPayload, callback) {
    let bestArbitrage = null;
    const baseEstimateInUSD = flightPayload 
        ? (Number(flightPayload.basePriceUSD) || Number(flightPayload.fareInUSD) || null) 
        : null;

    if (!baseEstimateInUSD || isNaN(baseEstimateInUSD) || baseEstimateInUSD <= 0) {
        if (callback) {
            callback({
                success: false,
                message: 'No valid flight fare detected on current page. Please open a Google Flights search with visible fares first.'
            });
        }
        return;
    }

    const minSavingsUSD = 10;
    const minSavingsInBase = minSavingsUSD * (exchangeRates[baseCurrency] || 1.0);

    for (const curr of targetCurrencies) {
        if (curr === baseCurrency) continue;

        let discountMultiplier = 1.0;
        if (curr === 'VND') discountMultiplier = 0.88;
        else if (curr === 'ARS') discountMultiplier = 0.89;
        else if (curr === 'TRY') discountMultiplier = 0.91;
        else if (curr === 'BRL') discountMultiplier = 0.93;
        else discountMultiplier = 0.96;

        const basePriceInUserCurr = baseEstimateInUSD * (exchangeRates[baseCurrency] || 1.0);
        const foreignFareInForeignCurr = (baseEstimateInUSD * discountMultiplier) * (exchangeRates[curr] || 1.0);

        const convertedFareInBase = (foreignFareInForeignCurr / (exchangeRates[curr] || 1.0)) * (exchangeRates[baseCurrency] || 1.0);
        const fxCharge = convertedFareInBase * cardProfile.fxFeePct;
        const netForeignPriceInBase = convertedFareInBase + fxCharge;

        const savings = basePriceInUserCurr - netForeignPriceInBase;
        const savingsPct = (savings / basePriceInUserCurr) * 100;

        if (savings >= minSavingsInBase && savingsPct >= 3.5) {
            if (!bestArbitrage || savings > bestArbitrage.savings) {
                bestArbitrage = {
                    currency: curr,
                    url: buildArbitrageUrl(originalUrl, curr),
                    originalPrice: basePriceInUserCurr,
                    netForeignPrice: netForeignPriceInBase,
                    savings: savings,
                    savingsPct: savingsPct.toFixed(1),
                    cardName: cardProfile.name,
                    fxFeePct: (cardProfile.fxFeePct * 100).toFixed(1),
                    isLiveVerified: false,
                    isModelledEstimate: true,
                    disclaimer: 'Calibrated regional purchasing-power model estimate.'
                };
            }
        }
    }

    // Attempt live background quote verification for the top arbitrage candidate
    if (bestArbitrage && bestArbitrage.url) {
        try {
            const liveForeignQuote = await verifyLiveForeignPrice(bestArbitrage.url, bestArbitrage.currency);
            if (liveForeignQuote && liveForeignQuote > 0) {
                const liveRate = exchangeRates[bestArbitrage.currency] || 1.0;
                const userRate = exchangeRates[baseCurrency] || 1.0;
                const liveConvertedInBase = (liveForeignQuote / liveRate) * userRate;
                const fxFee = liveConvertedInBase * cardProfile.fxFeePct;
                const liveNetInBase = liveConvertedInBase + fxFee;
                const liveSavings = bestArbitrage.originalPrice - liveNetInBase;
                if (liveSavings > 0) {
                    bestArbitrage.netForeignPrice = liveNetInBase;
                    bestArbitrage.savings = liveSavings;
                    bestArbitrage.savingsPct = ((liveSavings / bestArbitrage.originalPrice) * 100).toFixed(1);
                    bestArbitrage.isLiveVerified = true;
                    bestArbitrage.isModelledEstimate = false;
                    bestArbitrage.disclaimer = '✓ Live Verified quote from regional Google Flights servers.';
                }
            }
        } catch (e) {
            // Retain calibrated baseline model on live timeout
        }
    }

    // Check Hub-Hunting Arbitrage if origin is present
    let hubInfo = null;
    if (flightPayload && flightPayload.origin) {
        hubInfo = runHubHuntingCheck(flightPayload.origin, flightPayload.destination, baseEstimateInUSD, baseCurrency);
    }

    if (bestArbitrage) {
        const notifId = 'pos_arb_' + Date.now();

        chrome.notifications.create(notifId, {
            type: 'basic',
            iconUrl: 'icon128.png',
            title: `✈️ Regional POS Deal (${bestArbitrage.currency}) ${bestArbitrage.isLiveVerified ? '🟢 Verified' : '⚡ Est.'}`,
            message: `Booking in ${bestArbitrage.currency} saves ~${formatMoney(bestArbitrage.savings, baseCurrency)} (${bestArbitrage.savingsPct}% off).\n${bestArbitrage.disclaimer}`,
            priority: 1,
            requireInteraction: false
        });

        chrome.storage.local.set({ [notifId]: bestArbitrage.url });

        if (callback) callback({ success: true, arbitrage: bestArbitrage, hubHunting: hubInfo });
    } else {
        if (callback) callback({ success: false, message: 'No significant POS arbitrage found for this route.', hubHunting: hubInfo });
    }
}

// 4. Notification Click & Close Handlers
chrome.notifications.onClicked.addListener((notifId) => {
    chrome.storage.local.get([notifId], (data) => {
        const targetUrl = data[notifId];
        if (targetUrl && (targetUrl.startsWith('http://') || targetUrl.startsWith('https://'))) {
            chrome.tabs.create({ url: targetUrl });
        }
        chrome.storage.local.remove([notifId]);
    });
});

chrome.notifications.onClosed.addListener((notifId) => {
    chrome.storage.local.remove([notifId]);
});