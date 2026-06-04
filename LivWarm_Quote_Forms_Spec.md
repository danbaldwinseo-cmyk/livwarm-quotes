# LivWarm Quote Forms - Master Spec Document

_Last updated: June 2026. This document is the single source of truth for the build. All sessions start here._

---

## 1. Project Overview

LivWarm (livwarm.co.uk) is an affiliate of UKEM (UK Energy Management Group). This project rebuilds the four affiliate quote flows from scratch as a single React SPA, replacing the underperforming Cornerstone/WordPress forms at deals.livwarm.co.uk.

The new forms capture leads, generate instant quotes, and submit them to Payaca via a WordPress AJAX handler. The experience mirrors and improves upon the UKEM quote flow (app.ukem.co.uk), branded for LivWarm.

**Four flows, built in this order:**
1. Solar PV (priority - most complex, templates the rest)
2. EV Charger
3. Heat Pump / ASHP
4. Boiler Upgrade

---

## 2. Build Method

| Item | Decision |
|---|---|
| Framework | React SPA (single HTML file output) |
| Deployment | WordPress via Code Snippets plugin (or child theme) |
| Local development | VS Code + Claude Code extension |
| Code lives on | Developer's local machine (livwarm-quotes/ folder) |
| Context carrier | This Claude Project (not the conversation) |
| Session approach | Short focused sessions, one goal per session |
| Model | Opus in Claude Code (VS Code), Sonnet in Project chat |

---

## 3. Brand & Styling

### Colours

```css
--color-primary: #E8323A;        /* LivWarm red - dominant brand colour */
--color-primary-light: #F05A5F;  /* Lighter red - buttons, step numbers */
--color-cta-green: #4CAF50;      /* CTA buttons on red backgrounds */
--color-dark: #2D2D2D;           /* Headings on white */
--color-body: #4A4A4A;           /* Body text */
--color-grey-bg: #3D3D3D;        /* Dark section backgrounds */
--color-white: #FFFFFF;
--color-card-bg: #F8F8F8;        /* Light card backgrounds in form */
--color-border: #E5E5E5;         /* Subtle borders */
--color-selected: #E8323A;       /* Selected card state */
```

### Typography

- Brand font: IBrand (woff files to be provided by client - add to /fonts/ in project)
- Fallback stack: `'IBrand', 'Nunito', sans-serif`
- Font face declaration: To be added in CSS once woff files are in project
- Licence check required before build - confirm web embedding is covered

### Font scale

```css
--text-display: 2.5rem;   /* Quote results headline */
--text-h1: 2rem;          /* Step question */
--text-h2: 1.5rem;        /* Section headers */
--text-body: 1rem;        /* Body copy - minimum 16px always */
--text-small: 0.875rem;   /* Labels, captions - min 16px in inputs */
```

### UI Language

- Rounded corners throughout: `border-radius: 12px` cards, `border-radius: 8px` buttons/inputs
- LivWarm red as dominant colour on answer cards, selected states, progress bar
- Green (#4CAF50) for primary CTAs on red backgrounds
- Red (#E8323A) for primary CTAs on white backgrounds
- Product photography floating above card backgrounds with drop shadow (no background)
- Generous white space between sections
- Trust signals (MCS Certified, Trustpilot 4.9, 2yr Warranty) visible at bottom of quote screen

### Logo

- LivWarm logo in header of every step
- Source: existing livwarm.co.uk assets or to be provided as SVG/PNG

---

## 4. Architecture

### File structure

```
livwarm-quotes/
├── fonts/
│   └── ibrand.woff2 (+ other weights)
├── solar/
│   ├── index.html          (self-contained React app)
│   ├── pricing.json        (solar pricing data)
│   └── config.json         (API keys reference - keys stored server-side)
├── ev/
├── heatpump/
├── boiler/
└── shared/
    ├── components/         (shared React components)
    └── utils/              (pricing engine, API helpers)
```

### WordPress deployment

- Each flow is a self-contained HTML file
- Deployed via Code Snippets plugin or child theme
- Replaces existing Cornerstone forms at:
  - deals.livwarm.co.uk/solar-quote/
  - deals.livwarm.co.uk/ev-charger-quote/
  - deals.livwarm.co.uk/heatpump-quote/
  - deals.livwarm.co.uk/boiler-quote/

---

## 5. Third-Party APIs & Integrations

| Service | Purpose | Notes |
|---|---|---|
| Google Maps JavaScript API | Satellite map + pin display | Already licensed on LivWarm |
| Google Places API | Postcode/address lookup dropdown | Already licensed on LivWarm |
| Google Solar API | Roof area calculation + panel sizing | Needs enabling in Google Cloud - ~$0.075/call, free up to ~2,666 calls/month |
| Stripe | Payment processing | Card, Klarna, Revolut Pay. New account needed for LivWarm |
| Shermin Finance | Finance calculator | TBC: embed/API or link-out. Confirm with Shermin before build |
| Payaca | CRM / lead management | Direct API call via WordPress AJAX handler (PHP) on same WP install. Credentials and field maps already in existing PHP. No Zapier needed. |

### Google Cloud setup required

All three Google APIs use the same project and API key. Maps JS and Places are likely already enabled. Solar API needs adding. Confirm:
- Billing is enabled on the Google Cloud project
- Solar API is enabled
- API key restrictions allow the deals.livwarm.co.uk domain

---

## 6. Solar Flow - Step by Step

**Overview: 8 steps (mirrors UKEM structure, improves on it)**

### Step 1 - Home Details (Qualifier)

Questions on this screen (accordion-style, answers summarised above as user progresses):

1. **Are you a homeowner or a landlord?**
   - Homeowner → continue
   - Landlord → dead-end to /sorry-we-cannot-help

2. **What type of home do you live in?**
   - Detached / Semi-Detached / Terrace / Bungalow → continue
   - Flat → dead-end to /sorry-we-cannot-help

3. **What type of roof do you have?**
   - Pitched → continue
   - Flat → dead-end to /sorry-we-cannot-help

4. **How many bedrooms?**
   - 1 / 2 / 3 / 4 / 5+

**Data collected:** house_owner_type, house_type, roof_type, house_bedrooms

---

### Step 2 - Electricity Usage

Screen content:
- "Your current electricity usage in kWh"
- Annual kWh input (placeholder: e.g. 4,100) with "kWh/year" unit label
- Unit rate toggle: Same day & night rate / Different day/night rates
- Unit rate input in p/kWh
- "I'm not sure" fallback link - applies national averages (4,100 kWh/yr, 26.35p/kWh)

**Data collected:** electricity_usage, day_unit_rate, night_unit_rate

---

### Step 3 - Battery Details

Questions:
1. **Where would you like your battery installed?**
   - Inside / Outside / I'm not sure
2. **If Inside: Where inside?**
   - Garage / Utility room / Cupboard / Other

**Data collected:** battery_location, battery_location_inside

---

### Step 4 - EV Details

Questions:
1. **Do you have an electric vehicle?**
   - Yes (adds 1,500-2,500 kWh to sizing calculation) / No
2. **If No: Are you planning to get one?**
   - Yes, within 2 years / Maybe in 2-5 years / No plans currently
   - (Adjusts panel sizing upward if Yes or Maybe)

**Data collected:** has_ev, ev_plans

---

### Step 5 - Address & Roof Confirmation

Screen content:
- "Let's identify your roof"
- Postcode input + Find Addresses button (Google Places API)
- Address dropdown populated from postcode lookup
- "Can't find your address? Enter manually" fallback
- On address selection: full-screen Google Maps satellite view loads
- Pin drops on selected property
- Tooltip: "Is this the roof where you want the panels installed? Confirm, or reposition the pin by tapping your roof."
- Confirm button

On confirm:
- Google Solar API fires with lat/long
- Returns: roof area (m²), sunshine hours, panel capacity
- Panel count calculated from Solar API data + kWh usage (see Panel Sizing Logic)

**Data collected:** postcode, address_dropdown, latlong

---

### Step 6 - Your Solar Potential (Quote Screen)

This is the conversion centrepiece. Two-column layout:

**Left column:**
- Static satellite thumbnail of confirmed property
- Property stats bar: Sunshine hours / Roof Area / CO₂ saved / System capacity
- Energy usage summary (editable - pencil icon to go back)
- 20-year financial analysis chart
  - Two lines: "No Solar" vs "With Solar"
  - Adjustable projection slider (1-25 years)
  - Energy cost without solar / with solar
  - Total savings / Break-even year
  - Estimated monthly bill with solar / monthly saving

**Right column - three tier cards:**

| Tier | Label | Contents | Badge |
|---|---|---|---|
| 1 | Essential | Panels only, no battery | - |
| 2 | Performance | Panels + recommended battery | RECOMMENDED |
| 3 | Custom / Build Your Own | User selects panel count + battery from dropdowns | - |

Each tier card shows:
- System name and description
- Panel count + kW system size
- Battery (if applicable)
- Estimated annual generation (kWh)
- Price breakdown (panels + battery)
- Total price + monthly finance equivalent
- "Who is this system for?" copy

**Data collected:** product_selection, solar_panel_number, payment_total

---

### Panel Sizing Logic

Panel count is determined by the Google Solar API response combined with kWh usage:

```
Base panels = Solar API recommended panel count for address
Adjustment: if has_ev = true → add 2 panels
Adjustment: if ev_plans = 'within_2_years' → add 2 panels
Adjustment: if ev_plans = 'maybe_2_5_years' → add 1 panel
```

**Tier mapping:**
- Essential = base panel count, no battery
- Performance = base panel count + EV adjustment, with battery sized to ~50% daily generation
- Custom = user-selectable from 6-22 panels, battery optional

**Battery sizing guide (Performance tier):**

| Annual generation | Recommended battery |
|---|---|
| Under 4,000 kWh | 5kW |
| 4,000-6,000 kWh | 10kW |
| 6,000-8,000 kWh | 15kW |
| Over 8,000 kWh | Powerwall |

**Fallback (if Solar API unavailable):** Use property type + bedrooms lookup table:

| Property | Bedrooms | Panels |
|---|---|---|
| Terrace | 2 | 6 |
| Terrace | 3 | 8 |
| Terrace | 4+ | 10 |
| Semi-Detached | 2 | 8 |
| Semi-Detached | 3 | 10 |
| Semi-Detached | 4+ | 12 |
| Detached | 3 | 12 |
| Detached | 4 | 14 |
| Detached | 5+ | 16 |
| Bungalow | 2 | 10 |
| Bungalow | 3+ | 12 |

_Note: These numbers are placeholders pending confirmation from UKEM/LivWarm._

---

### Financial Projection Calculations

Using national UK averages as defaults (user-overridable):

```
export_tariff = 15p/kWh (Smart Export Guarantee approximate)
grid_import_rate = from user input (default 26.35p/kWh)
electricity_price_inflation = 3% per year
annual_generation = from Solar API (kWh)
self_consumption_rate = 0.5 (50% used on-site, 50% exported)

annual_saving = (annual_generation × self_consumption_rate × grid_import_rate)
              + (annual_generation × (1 - self_consumption_rate) × export_tariff)

break_even_year = system_cost / annual_saving
20_year_saving = (annual_saving × 20) - system_cost (simplified, pre-inflation)
```

---

### Step 7 - Upsell Modal (triggered on Continue from quote screen)

**Modal: "Enhance Your System"**
- Extended Warranty toggle: 5-year workmanship guarantee (+£199)
- BUS Heat Pump Grant cross-sell (orange highlight card): £7,500 grant available - "click to enquire"
- "Not this time" / "Continue: Add Selected" buttons

---

### Step 8 - Your Details + Booking Summary

**Left side:**
- Contact card: "Where shall we send your offer?"
- First name, Surname, Email, Phone
- "Click to enter your details" collapsed state
- Preferred installation date: calendar picker (preferred date only - UKEM team confirms availability)
- Copy: "Select your preferred date. Our team will confirm availability after your technical review."

**Right side - Booking Summary:**
- Address confirmed
- System selected (tier name, panel count, battery)
- Price breakdown (panels + battery, VAT included)
- Pay total amount: £X,XXX (one-off) | Pay monthly: £XXX/mo (finance)
- "Explore finance options" → opens finance modal
- Estimated savings panel: yearly saving, 20-year saving, monthly bill reduction, break-even
- What's included: Solar Panels / Battery Storage / Hybrid Inverter / Cloud & App Monitoring / Professional Installation & Aftercare
- Trust badges: MCS Certified / 2yr Warranty Workmanship / Rated 4.9 Trustpilot
- "Your installation journey" link

**Finance modal (on "Explore finance options"):**
- Toggle: Pay monthly / Cash payment
- Loan term dropdown (up to 15 years)
- APR (fixed) - from Shermin
- Optional deposit slider (0-30%)
- Live calculation: monthly payment, loan amount, cost of finance, total repayable
- Overpayment analysis section
- Representative example (FCA compliant)
- Provider: Shermin Finance - TBC whether embed/API or link-out

**Data collected:** full_name, email, phone, preferred_date, address (full), payment_method

---

### Step 9 - Secure Your Booking (Payment)

Screen: "Secure Your Booking"
- Booking summary recap (name, address, date, system, total)
- "How would you like to pay?"
  - Pay securely online (Card, Klarna, Revolut Pay via Stripe) - "Instant checkout"
  - Spread the cost with finance (Shermin) - "Subject to approval"
- Stripe Payment Element (handles all three payment methods in one component)
- "Your booking is secure" trust line
- "What happens next?" panel:
  1. Provisional Booking: We reserve your preferred slot
  2. Remote Survey: Our experts verify your design using satellite imagery (no home visit needed)
  3. Final Confirmation: We confirm the system fits your needs and lock in the price
- Pay button: "Pay £X,XXX.00"
- Footer: "Payments are securely processed by Stripe"

On successful payment:
- Trigger WordPress AJAX handler → Payaca API direct
- Confirmation screen

---

### Step 10 - Confirmation

- "You're all booked in!" headline
- Summary of selected system
- Preferred date confirmed
- What happens next (3-step process)
- QR code for photo submission (post-installation survey)
- Email confirmation sent to customer

---

## 7. UX & Design Improvements Over UKEM

_These are not optional enhancements - they are core requirements._

### What UKEM does well (replicate these)

- **Answer breadcrumb trail** - previous answers stack above current question as pill badges
- **"I'm not sure" as a valid answer** - on battery location and other uncertain questions
- **National average fallback** - "Apply national kWh average (4,100 / 26.35p)" button on electricity usage screen
- **Help modal with annotated bill image** - shows a real energy bill with arrows pointing to the right fields
- **EV question within solar flow** - qualifies leads for EV charger product simultaneously
- **Upsell modal post-product-selection** - extended warranty + BUS heat pump grant
- **"Provisional booking" framing** - "Subject to final confirmation following technical verification."
- **"What happens next" panel** - 3-step process on confirmation screen
- **QR code for property photos** - post-booking, links to photo submission flow
- **Date picker copy** - "Our team will confirm availability after your technical review."

### What UKEM does poorly (improve on these)

1. **Clinical, cold design** - LivWarm's red-led brand gives a richer palette. Every screen should feel like an extension of livwarm.co.uk - bold, warm, confident.

2. **No trust signals until Step 6** - MCS Certified, Trustpilot 4.9, partner brand logos (AIKO, Fox ESS, Tesla, Vaillant) should be visible from Step 1 onward.

3. **Progress bar is invisible** - Use a bold red progress bar with percentage label and step name visible at all times.

4. **Huge dead space on every screen** - Use brand mascot or product imagery to fill space purposefully.

5. **Financial data buried until too late** - Savings figures must appear on the quote screen (Step 6) prominently - large, scannable, immediately below the price.

6. **Quote screen layout is wrong** - The satellite map does NOT appear on the quote screen. It belongs on the address confirmation step only.

7. **Prices not prominent enough** - Lead with price as a headline - large and confident. "£9,095 or from £97/month" is a statement of value.

8. **Contact details as a modal overlay** - LivWarm version: contact details as a full dedicated screen with a compact product/price summary at the top.

9. **Weak card interaction states** - LivWarm cards use a 3-state interaction:
   - Default: `box-shadow: 0 4px 12px rgba(0,0,0,0.10)`, light background
   - Hover: shadow lifts and deepens, card rises 2px
   - Selected: shadow collapses (pressed feel), background fills with LivWarm red at low opacity, border becomes solid red, label goes bold
   - Smooth 150ms transition throughout

10. **Icons are inconsistent and weak** - Use a consistent, warm icon set - rounded line icons in brand red.

11. **Weekend dates greyed out with no explanation** - Add a "Weekdays only" note.

12. **Confirmation screen is generic** - LivWarm's confirmation screen should feel like the start of a relationship - warm copy, the LivWarm mascot, contact details, and a clear summary of what happens next.

---

### The LivWarm Quote Screen - Reading Order

The quote screen (Step 6) content must appear in this order, top to bottom:

1. **Price headline** - "£17,069 or from £182/month" - large, prominent, above the fold
2. **Three scannable savings figures** - Monthly saving / 20-year saving / Break-even year
3. **Tier selector cards** - Essential / Performance / Custom - selecting a tier updates price and savings figures live
4. **What's included** - panel count, battery, inverter, monitoring, installation
5. **Trust signals** - MCS Certified, HIES badge, partner logos, Trustpilot 4.9
6. **Single CTA** - "Continue with this system" - prominent, full-width

The satellite map does NOT appear on the quote screen.

---

### Micro-Commitment Step

Before contact details are collected, a brief confirmation micro-step is shown:
- Summary of selected tier (name, panel count, battery, price)
- Single button: "This looks right - get my full quote"

This anchors the user to their choice and improves lead quality.

---

## 8. Payaca Integration

**Method:** Direct Payaca API call via WordPress AJAX handler on the same deals.livwarm.co.uk installation. The React form POSTs collected data to a WordPress AJAX endpoint added via Code Snippets plugin. That endpoint calls the Payaca API server-side, keeping credentials secure. Existing PHP credentials and field maps are already live on the site - reuse as-is.

**Trigger:** On successful payment (or on form submission if payment is skipped in a future phase)

**Payload mirrors existing PHP field map for Solar (form ID 3):**

```json
{
  "house_owner_type": "Homeowner",
  "house_type": "Semi-Detached",
  "roof_type": "Pitched",
  "electricity_usage": "4100",
  "day_unit_rate": "26.35",
  "night_unit_rate": "",
  "battery_location": "Inside",
  "battery_location_inside": "Garage",
  "postcode": "DY13 8UA",
  "address_dropdown": "5 Almond Way, Stourport-on-Severn",
  "latlong": "52.3456,-2.2345",
  "solar_panel_number": "10",
  "product_selection": "Performance Solar PV System",
  "payment_total": "15529.00",
  "full_name": "John Smith",
  "email": "john@example.com",
  "phone": "07700900000"
}
```

_Note: No Zapier required. Payaca client ID and secret are already stored in the existing WordPress PHP integration._

---

## 8. Dead-End Rules

| Condition | Action |
|---|---|
| Landlord | Redirect to /sorry-we-cannot-help |
| Flat (property type) | Redirect to /sorry-we-cannot-help |
| Flat roof | Redirect to /sorry-we-cannot-help |
| LPG or Oil fuel (boiler flow) | "Form Fill Required - Bespoke Project" - capture details, route to callback |

---

## 9. Outstanding TBC Items

_These will not block the build but must be resolved before launch:_

| Item | Action needed |
|---|---|
| Shermin Finance integration | Call Shermin - confirm embed widget, API, or link-out |
| Panel count lookup table | Confirm numbers with UKEM before launch |
| Stripe account | Set up new Stripe account for LivWarm, obtain publishable key |
| IBrand font licence | Confirm web embedding is covered by existing licence |
| Google Cloud Solar API | Enable Solar API on existing Google Cloud project |
| Deposit vs full payment | Client to confirm - currently assuming full payment (mirrors UKEM) |

---

## 10. Session Handover Notes

### Session 1 (June 2026) - Planning complete

- Full UKEM flow reviewed via Claude in Chrome
- Pricing matrix extracted from spreadsheet
- Brand assets extracted from livwarm.co.uk
- All major decisions made - see sections above
- Ready to begin build: Step 1 (qualifier screens) first
