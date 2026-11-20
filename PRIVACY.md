# Privacy Policy for Flight Hacker Pro ✈️

**Last Updated:** November 2026  
**Extension Version:** 2.0  

Flight Hacker Pro is committed to privacy and user data transparency. This Privacy Policy details our practices regarding information collection, storage, and processing.

---

### 1. Data Collection & Processing Principles

Flight Hacker Pro is engineered as a **100% client-side extension**.
- **No Personal Data Collected:** We do not collect, transmit, store, or sell names, emails, IP addresses, search queries, flight bookings, payment details, or browsing history.
- **No Third-Party Analytics:** We do not include Google Analytics, Mixpanel, Sentry, advertising SDKs, or any remote user telemetry.
- **Local Storage Only:** All user preferences (such as base currency, passenger count, value of time, and payment card choice) are stored exclusively in your browser's local sandbox via `chrome.storage.local`.

---

### 2. Permissions Justification (Manifest V3)

Flight Hacker Pro requests only the minimal permissions necessary for its operational features:

| Permission | Purpose |
| :--- | :--- |
| `storage` | Persists user settings (currency, baggage preferences, payment cards) and temporarily caches scraped calendar fares locally to accelerate matrix calculations without duplicate network requests. |
| `activeTab` | Injects flight calculation overlays, true price badges, and the flexible 90-day matrix modal into the active Google Flights page upon user interaction. |
| `notifications` | Dispatches desktop notifications only when significant Point-of-Sale (POS) currency arbitrage deals or error fares are detected. |
| `alarms` | Schedules a periodic background job (every 12 hours) to refresh foreign exchange conversion rates. |
| `host_permissions` | Restricted strictly to Google Flights regional web domains (`*.google.com`, `*.google.co.uk`, `*.google.de`, etc.) to parse visible flight cards, and `https://open.er-api.com/*` for free, public daily currency exchange rates. |

---

### 3. External Network Requests

Flight Hacker Pro makes only two types of network requests:
1. **Public Foreign Exchange Rates:** A `GET` request to `https://open.er-api.com/v6/latest/USD` to fetch open foreign exchange rates. No user identifiers or tokens are sent.
2. **Point-of-Sale Arbitrage Verification:** When you explicitly request a regional POS check, the background service worker requests the public Google Flights URL with the regional currency flag (e.g. `&curr=VND`) to verify live pricing.

---

### 4. Data Retention & Cache Purging

- You can purge all cached route anchors and fare data at any time by clicking the **"🧹 Purge Cache & Auto-Tune"** button in the extension popup.
- Uninstalling the extension immediately and permanently removes all stored preferences from your machine.

---

### 5. Contact & Open Source

Flight Hacker Pro is open-source under the MIT License. For inquiries, audits, or contributions:
- **Repository:** https://github.com/pradeepp511/Flight-Hacker-Pro
