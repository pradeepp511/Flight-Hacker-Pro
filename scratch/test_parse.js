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
    // 4. Spaces: 1 250
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

const tests = [
    { input: '$1250', expectedAmount: 1250, expectedCurrency: 'USD' },
    { input: '$12345', expectedAmount: 12345, expectedCurrency: 'USD' },
    { input: '₹1,23,456', expectedAmount: 123456, expectedCurrency: 'INR' },
    { input: 'A$5000', expectedAmount: 5000, expectedCurrency: 'AUD' },
    { input: 'USD 500', expectedAmount: 500, expectedCurrency: 'USD' },
    { input: '500 USD', expectedAmount: 500, expectedCurrency: 'USD' },
    { input: '€1.250,50', expectedAmount: 1250.5, expectedCurrency: 'EUR' },
    { input: '1 250 €', expectedAmount: 1250, expectedCurrency: 'EUR' },
    { input: '1.250 €', expectedAmount: 1250, expectedCurrency: 'EUR' },
    { input: '£750', expectedAmount: 750, expectedCurrency: 'GBP' },
    { input: 'Round trip / $850 / economy', expectedAmount: 850, expectedCurrency: 'USD' }
];

let failed = 0;
tests.forEach(t => {
    const res = parseFareString(t.input);
    if (!res || res.price !== t.expectedAmount || res.currency !== t.expectedCurrency) {
        console.error(`FAIL: ${t.input} -> expected ${t.expectedAmount} ${t.expectedCurrency}, got ${JSON.stringify(res)}`);
        failed++;
    } else {
        console.log(`PASS: ${t.input} -> ${res.price} ${res.currency}`);
    }
});

if (failed === 0) {
    console.log('\nALL 11 TESTS PASSED PERFECTLY!');
} else {
    process.exit(1);
}
