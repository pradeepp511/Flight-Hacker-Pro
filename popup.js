document.addEventListener('DOMContentLoaded', () => {
    const inputs = {
        extensionEnabled: document.getElementById('extensionEnabled'),
        baseCurrency: document.getElementById('baseCurrency'),
        timeValue: document.getElementById('timeValue'),
        checkedBags: document.getElementById('checkedBags'),
        passengerCount: document.getElementById('passengerCount'),
        rewardCard: document.getElementById('rewardCard'),
        loyaltyProgram: document.getElementById('loyaltyProgram'),
        passportNationality: document.getElementById('passportNationality'),
        hideSelfTransfers: document.getElementById('hideSelfTransfers'),
        showComfort: document.getElementById('showComfort'),
        showSplitTickets: document.getElementById('showSplitTickets'),
        showCPP: document.getElementById('showCPP'),
        showLoungeVisa: document.getElementById('showLoungeVisa'),
        showHubHunting: document.getElementById('showHubHunting'),
        showStopovers: document.getElementById('showStopovers'),
        scanHorizon: document.getElementById('scanHorizon'),
        tripBracket: document.getElementById('tripBracket'),
        customBagFee: document.getElementById('customBagFee'),
        customSeatFee: document.getElementById('customSeatFee'),
        customAwardTaxes: document.getElementById('customAwardTaxes'),
        customCardFxPct: document.getElementById('customCardFxPct')
    };
    const arbitrageBtn = document.getElementById('checkArbitrage');
    const statusText = document.getElementById('status');

    const liveFxTicker = document.getElementById('liveFxTicker');
    const fxStatusPill = document.getElementById('fxStatusPill');
    
    let currentRates = { 'INR': 83.5, 'EUR': 0.92, 'GBP': 0.78, 'USD': 1.0 };
    const timeValueLabel = document.getElementById('timeValueLabel');
    const currSymbols = { 'INR': '₹', 'USD': '$', 'EUR': '€', 'GBP': '£', 'AED': 'AED', 'AUD': 'A$', 'CAD': 'C$', 'SGD': 'S$' };

    const updateTicker = (curr) => {
        const sym = currSymbols[curr] || curr;
        if (timeValueLabel) timeValueLabel.innerText = `Value of Time (${sym}/hr)`;
        if (!liveFxTicker) return;
        const inrRate = (currentRates.INR || 83.5).toFixed(2);
        const eurRate = (currentRates.EUR || 0.92).toFixed(2);
        const gbpRate = (currentRates.GBP || 0.78).toFixed(2);

        if (curr === 'INR') liveFxTicker.innerText = `Live FX: 1 USD = ₹${inrRate} INR | 1 EUR = ₹${(inrRate / eurRate).toFixed(2)} INR`;
        else if (curr === 'USD') liveFxTicker.innerText = `Live FX: 1 EUR = $${(1 / eurRate).toFixed(2)} USD | 1 GBP = $${(1 / gbpRate).toFixed(2)} USD`;
        else liveFxTicker.innerText = `Base Currency set to ${curr} (USD: ${currentRates.USD || 1})`;
    };

    chrome.storage.local.get(['exchangeRates', 'isFxLive'], (fxData) => {
        if (fxData.exchangeRates) currentRates = { ...currentRates, ...fxData.exchangeRates };
        if (fxStatusPill) {
            if (fxData.isFxLive !== false) {
                fxStatusPill.innerText = '🟢 Live FX Synced';
                fxStatusPill.style.background = 'rgba(255,255,255,0.25)';
            } else {
                fxStatusPill.innerText = '🟠 Baseline FX';
                fxStatusPill.style.background = 'rgba(255,165,0,0.3)';
            }
        }
        updateTicker(inputs.baseCurrency.value || 'INR');
    });

    // Load saved settings
    chrome.storage.local.get(Object.keys(inputs), (data) => {
        if(data.extensionEnabled !== undefined && inputs.extensionEnabled) inputs.extensionEnabled.checked = data.extensionEnabled;
        if(data.baseCurrency !== undefined) {
            inputs.baseCurrency.value = data.baseCurrency;
            updateTicker(data.baseCurrency);
        } else {
            updateTicker(inputs.baseCurrency.value || 'INR');
        }
        if(data.timeValue !== undefined) inputs.timeValue.value = data.timeValue;
        if(data.checkedBags !== undefined) inputs.checkedBags.value = data.checkedBags;
        if(data.passengerCount !== undefined) inputs.passengerCount.value = data.passengerCount;
        if(data.rewardCard !== undefined) inputs.rewardCard.value = data.rewardCard;
        if(data.loyaltyProgram !== undefined && inputs.loyaltyProgram) inputs.loyaltyProgram.value = data.loyaltyProgram;
        if(data.passportNationality !== undefined && inputs.passportNationality) inputs.passportNationality.value = data.passportNationality;
        if(data.hideSelfTransfers !== undefined) inputs.hideSelfTransfers.checked = data.hideSelfTransfers;
        if(data.showComfort !== undefined) inputs.showComfort.checked = data.showComfort;
        if(data.showSplitTickets !== undefined) inputs.showSplitTickets.checked = data.showSplitTickets;
        if(data.showCPP !== undefined && inputs.showCPP) inputs.showCPP.checked = data.showCPP;
        if(data.showLoungeVisa !== undefined && inputs.showLoungeVisa) inputs.showLoungeVisa.checked = data.showLoungeVisa;
        if(data.showHubHunting !== undefined && inputs.showHubHunting) inputs.showHubHunting.checked = data.showHubHunting;
        if(data.showStopovers !== undefined && inputs.showStopovers) inputs.showStopovers.checked = data.showStopovers;
        if(data.scanHorizon !== undefined && inputs.scanHorizon) inputs.scanHorizon.value = data.scanHorizon;
        if(data.tripBracket !== undefined && inputs.tripBracket) inputs.tripBracket.value = data.tripBracket;
        if(data.customBagFee !== undefined && inputs.customBagFee) inputs.customBagFee.value = data.customBagFee !== null ? data.customBagFee : '';
        if(data.customSeatFee !== undefined && inputs.customSeatFee) inputs.customSeatFee.value = data.customSeatFee !== null ? data.customSeatFee : '';
        if(data.customAwardTaxes !== undefined && inputs.customAwardTaxes) inputs.customAwardTaxes.value = data.customAwardTaxes !== null ? data.customAwardTaxes : '';
        if(data.customCardFxPct !== undefined && inputs.customCardFxPct) inputs.customCardFxPct.value = data.customCardFxPct !== null ? data.customCardFxPct : '';
    });

    // Save settings and notify content script
    const saveSettings = () => {
        updateTicker(inputs.baseCurrency.value);
        const parseOverride = (el) => (el && el.value !== '' && !isNaN(parseFloat(el.value))) ? Math.max(0, parseFloat(el.value)) : null;
        const settings = {
            extensionEnabled: inputs.extensionEnabled ? inputs.extensionEnabled.checked : true,
            baseCurrency: inputs.baseCurrency.value || 'INR',
            hasExplicitCurrency: true,
            timeValue: Math.max(0, parseInt(inputs.timeValue.value) || 0),
            checkedBags: Math.max(0, parseInt(inputs.checkedBags.value) || 0),
            passengerCount: Math.max(1, parseInt(inputs.passengerCount.value) || 1),
            rewardCard: inputs.rewardCard.value,
            loyaltyProgram: inputs.loyaltyProgram ? inputs.loyaltyProgram.value : 'aeroplan',
            passportNationality: inputs.passportNationality ? inputs.passportNationality.value : 'India',
            hideSelfTransfers: inputs.hideSelfTransfers.checked,
            showComfort: inputs.showComfort.checked,
            showSplitTickets: inputs.showSplitTickets.checked,
            showCPP: inputs.showCPP ? inputs.showCPP.checked : true,
            showLoungeVisa: inputs.showLoungeVisa ? inputs.showLoungeVisa.checked : true,
            showHubHunting: inputs.showHubHunting ? inputs.showHubHunting.checked : true,
            showStopovers: inputs.showStopovers ? inputs.showStopovers.checked : true,
            scanHorizon: inputs.scanHorizon ? parseInt(inputs.scanHorizon.value) : 30,
            tripBracket: inputs.tripBracket ? inputs.tripBracket.value : '5-21',
            customBagFee: parseOverride(inputs.customBagFee),
            customSeatFee: parseOverride(inputs.customSeatFee),
            customAwardTaxes: parseOverride(inputs.customAwardTaxes),
            customCardFxPct: parseOverride(inputs.customCardFxPct)
        };
        chrome.storage.local.set(settings, () => {
            chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                if (tabs[0]) {
                    chrome.tabs.sendMessage(tabs[0].id, {action: 'recalculate'}, () => {
                        void chrome.runtime.lastError;
                    });
                }
            });
        });
    };

    // Attach listeners
    Object.values(inputs).forEach(input => {
        if (input) input.addEventListener('change', saveSettings);
    });

    const arbLink = document.getElementById('arbLink');

    arbitrageBtn.addEventListener('click', () => {
        statusText.style.color = "#1a73e8";
        statusText.innerText = "Simulating regional POS pricing (VND, ARS, TRY, BRL)...";
        arbitrageBtn.disabled = true;
        if (arbLink) arbLink.style.display = "none";
        
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'getRoutePayload' }, (payload) => {
                    if (chrome.runtime.lastError || !payload) {
                        arbitrageBtn.disabled = false;
                        statusText.style.color = "#c5221f";
                        statusText.innerText = "Error: Open a Google Flights page first.";
                        return;
                    }
                    if (!payload.basePriceUSD || payload.basePriceUSD <= 0) {
                        arbitrageBtn.disabled = false;
                        statusText.style.color = "#c5221f";
                        statusText.innerText = "Error: No active flight fare detected on current page.";
                        return;
                    }
                    const activeUrl = tabs[0].url || payload.url || 'https://www.google.com/travel/flights';
                    chrome.runtime.sendMessage({
                        action: 'checkPOS',
                        url: activeUrl,
                        flightPayload: payload
                    }, (response) => {
                        arbitrageBtn.disabled = false;
                        if (response && response.success && response.arbitrage) {
                            statusText.style.color = "#1e8e3e";
                            statusText.innerText = `Simulated Regional Estimate: ~${response.arbitrage.savingsPct}% off in ${response.arbitrage.currency}`;
                            if (arbLink) {
                                const userBaseCurr = inputs.baseCurrency.value || 'INR';
                                const currencySymbols = { 'INR': '₹', 'USD': '$', 'EUR': '€', 'GBP': '£', 'AED': 'AED ', 'AUD': 'A$', 'CAD': 'C$', 'SGD': 'S$' };
                                const sym = currencySymbols[userBaseCurr] || (userBaseCurr + ' ');
                                arbLink.href = response.arbitrage.url;
                                arbLink.innerText = `👉 Open ${response.arbitrage.currency} Search (Est. Save ~${sym}${Math.round(response.arbitrage.savings).toLocaleString()})`;
                                arbLink.style.display = "block";
                            }
                        } else {
                            statusText.style.color = "#5f6368";
                            statusText.innerText = response?.reason || "Scan complete. No significant regional differential estimated.";
                        }
                    });
                });
            } else {
                arbitrageBtn.disabled = false;
                statusText.innerText = "Error: Open Google Flights tab first.";
            }
        });
    });

    const matrixBtn = document.getElementById('launchMatrixScan');
    if (matrixBtn) {
        matrixBtn.addEventListener('click', () => {
            const horizon = parseInt(document.getElementById('scanHorizon')?.value) || 30;
            const bracket = document.getElementById('tripBracket')?.value || '5-21';
            
            statusText.style.color = "#137333";
            statusText.innerText = `Generating ${horizon}-Day Fare Matrix...`;
            chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                if (tabs[0]) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'startMatrixScan',
                        scanHorizon: horizon,
                        tripBracket: bracket,
                        viewMode: 'DAYWISE'
                    }, (res) => {
                        if (chrome.runtime.lastError) {
                            statusText.style.color = "#c5221f";
                            statusText.innerText = "Error: Open a Google Flights page first.";
                            return;
                        }
                        if (res && res.success) {
                            statusText.style.color = "#137333";
                            statusText.innerText = `${horizon}-Day Matrix Heat-Map Rendered!`;
                        } else {
                            statusText.style.color = "#c5221f";
                            statusText.innerText = res?.reason || "Could not generate matrix. Ensure route is visible.";
                        }
                    });
                }
            });
        });
    }

    const clearCacheBtn = document.getElementById('clearCacheBtn');
    if (clearCacheBtn) {
        clearCacheBtn.addEventListener('click', () => {
            statusText.style.color = "#1a73e8";
            statusText.innerText = "Purging cache & auto-tuning fares...";
            chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                if (tabs[0]) {
                    chrome.tabs.sendMessage(tabs[0].id, { action: 'clearCacheAndAutoTune' }, (res) => {
                        if (chrome.runtime.lastError) {
                            statusText.style.color = "#c5221f";
                            statusText.innerText = "Error: Open a Google Flights page first.";
                            return;
                        }
                        statusText.innerText = `🧹 Cache Purged & Auto-Tuned! (${res?.clearedCount || 0} entries cleared)`;
                    });
                }
            });
        });
    }

    const resetBtn = document.getElementById('resetDefaults');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (inputs.extensionEnabled) inputs.extensionEnabled.checked = true;
            if (inputs.baseCurrency) inputs.baseCurrency.value = 'INR';
            if (inputs.timeValue) inputs.timeValue.value = 50;
            if (inputs.checkedBags) inputs.checkedBags.value = 0;
            if (inputs.passengerCount) inputs.passengerCount.value = 1;
            if (inputs.rewardCard) inputs.rewardCard.value = 'scapia';
            if (inputs.loyaltyProgram) inputs.loyaltyProgram.value = 'aeroplan';
            if (inputs.passportNationality) inputs.passportNationality.value = 'India';
            if (inputs.hideSelfTransfers) inputs.hideSelfTransfers.checked = true;
            if (inputs.showComfort) inputs.showComfort.checked = true;
            if (inputs.showSplitTickets) inputs.showSplitTickets.checked = true;
            if (inputs.showCPP) inputs.showCPP.checked = true;
            if (inputs.showLoungeVisa) inputs.showLoungeVisa.checked = true;
            if (inputs.showHubHunting) inputs.showHubHunting.checked = true;
            if (inputs.showStopovers) inputs.showStopovers.checked = true;
            if (inputs.scanHorizon) inputs.scanHorizon.value = '30';
            if (inputs.tripBracket) inputs.tripBracket.value = '5-21';
            if (inputs.customBagFee) inputs.customBagFee.value = '';
            if (inputs.customSeatFee) inputs.customSeatFee.value = '';
            if (inputs.customAwardTaxes) inputs.customAwardTaxes.value = '';
            if (inputs.customCardFxPct) inputs.customCardFxPct.value = '';

            statusText.style.color = '#1a73e8';
            statusText.innerText = 'Reset all settings to defaults!';
            saveSettings();
        });
    }
});