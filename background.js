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
        const now = Date.now();
        const staleKeys = [];
        for (const key of Object.keys(allData)) {
            if (key.startsWith('pos_arb_')) {
                const ts = parseInt(key.replace('pos_arb_', ''), 10);
                if (isNaN(ts) || (now - ts > 24 * 60 * 60 * 1000)) { // Older than 24 hours
                    staleKeys.push(key);
                }
            }
        }
        if (staleKeys.length > 0) {
            chrome.storage.local.remove(staleKeys, () => {
                console.log(`Cleaned up ${staleKeys.length} stale notification tracking keys.`);
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
});

// 3. Regional POS Simulation Engine (Modelled Scenarios)
function runArbitrageScanner(originalUrl, baseCurrency, cardProfile, flightPayload, callback) {
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
                    isModelledEstimate: true,
                    disclaimer: 'Simulated regional disparity estimate. Does not constitute a verified foreign market quote.'
                };
            }
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
            title: `✈️ Regional POS Simulation (${bestArbitrage.currency})`,
            message: `Simulated estimate: Booking in ${bestArbitrage.currency} may save ~${formatMoney(bestArbitrage.savings, baseCurrency)} (${bestArbitrage.savingsPct}% off based on regional purchasing power models).\nNote: Modelled estimate, verify on airline site.`,
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