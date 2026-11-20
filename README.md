# Flight Hacker Pro ✈️ (v2.0)

> **Advanced Manifest V3 Chrome Extension for Google Flights**: True price baggage calculators, Point-of-Sale (POS) currency arbitrage, flexible 90-day matrix scanning, time/cost tradeoffs, aircraft comfort analytics, lounge & visa assistance, positioning flight hub-hunting, skiplagging alerts, and self-transfer segregations.

---

## 🌟 Key Features

### 1. 🧳 True Price Baggage & Fee Calculator
- Calculates out-of-pocket costs by dynamically factoring in carry-on restrictions, checked luggage fees, and seat selection taxes ("Family Tax" multiplier).
- Automatically deducts fare inclusions based on cabin class and airline baggage rules.

### 2. 🌐 Point-of-Sale (POS) & Currency Arbitrage
- Detects airfare pricing variations across international Google Flights regional domains and foreign currencies (`VND`, `ARS`, `TRY`, `BRL`).
- Incorporates payment card foreign transaction fees (0% to 3.5%) and card reward cashbacks (1% to 7.5%) to calculate net savings.
- Dual-engine: Live background verification with calibrated purchasing-power parity fallback.

### 3. 📊 90-Day Flexible Matrix Deep Scan
- Restricts Google Flights' narrow $\pm 3$ day limit to a wide 14- to 180-day scanning horizon.
- Day-of-week filters (e.g. Outbound Friday, Return Sunday), trip length sliders, and calendar heat-maps.
- One-click export to CSV spreadsheet and RFC 5545 iCalendar (`.ics`).

### 4. 🛋️ Logistics, Lounge & Visa Assistance
- Identifies risk-heavy unbundled self-transfers requiring customs re-clearance.
- Warns against Minimum Connection Time (MCT) traps with layovers under 50 minutes.
- Evaluates transit visa requirements (including multi-airport Schengen layovers) based on passport nationality.
- Matches complimentary airport lounge access (Priority Pass, Centurion Lounges).

### 5. 🎯 Advanced Travel Hacks
- **Hub-Hunting**: Identifies massive price drops from mega-hubs (`ORD`, `DEL`, `LHR`) combined with cheap positioning flights.
- **Split-Ticketing**: Compares independent one-way tickets against bundled roundtrip airfares.
- **Hidden-City (Skiplagging)**: Discovers beyond-destination flights with layovers at your target city.
- **Error Fare Radar**: Anomaly detector highlighting prices $\le 48\%$ of route medians.
- **Airline Stopover Programs**: Alerts on free 4★/5★ transit hotels (Turkish Airlines in IST, Qatar in DOH) and free stopovers (Icelandair in KEF).

### 6. ⚡ High-Performance Viewport Rendering
- `IntersectionObserver` lazy rendering ensures smooth 60fps scrolling even with 100+ flights loaded.
- String fingerprinting and dataset markers prevent infinite DOM mutation loops.

---

## 🚀 Installation & Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/pradeepp511/Flight-Hacker-Pro.git
   cd Flight-Hacker-Pro
   ```
2. **Open Google Chrome** and navigate to `chrome://extensions/`.
3. Toggle on **Developer mode** in the upper-right corner.
4. Click **Load unpacked** and select the `Flight-Hacker-Pro` directory.
5. Navigate to [Google Flights](https://www.google.com/travel/flights) and start searching!

---

## 🧪 Automated Regression Test Suites

The extension contains comprehensive automated unit and regression test suites covering currency parsing, math models, and route extraction:

```bash
node scratch/test_audit_regressions.js
node scratch/test_deal_filters.js
node scratch/test_parse.js
```

---

## 🔒 Privacy & Permissions

Flight Hacker Pro is 100% client-side with zero remote analytics or tracking. Review our [Privacy Policy](file:///e:/Flight-Hacker-Pro/PRIVACY.md) for complete details.

---

## 📄 License

MIT License © 2026 Flight Hacker Pro Contributors.
