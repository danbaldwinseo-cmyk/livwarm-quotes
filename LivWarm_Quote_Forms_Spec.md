# LivWarm Quote Forms - Master Spec Document

_Last updated: June 2026. This document is the single source of truth for the build. All sessions start here._

---

## 1. Project Overview

LivWarm (livwarm.co.uk) is an affiliate of UKEM (UK Energy Management Group). This project rebuilds the four affiliate quote flows from scratch as a single React SPA, replacing the underperforming Cornerstone/WordPress forms at deals.livwarm.co.uk.

The new forms capture leads, generate instant quotes, and submit them to Payaca via a WordPress AJAX handler. The experience mirrors and improves upon the UKEM quote flow (app.ukem.co.uk), branded for LivWarm.

Four flows, built in this order:

1. Solar PV (priority - most complex, templates the rest)
2. EV Charger
3. Heat Pump / ASHP
4. Boiler Upgrade

---

## 2. Build Method

| Item | Decision |
|------|----------|
| Framework | React SPA (single HTML file output) |
| Deployment | WordPress via Code Snippets plugin (or child theme) |
| Local development | VS Code + Claude Code extension |
| Staging | Vercel (livwarm-quotes.vercel.app) |
| Code lives | Developer's local machine (livwarm-quotes/ folder) + GitHub repo |
| Context carrier | This Claude Project (not the conversation) |
| Session approach | Short focused sessions, one goal per session |
| Model | Opus in Claude Code (VS Code), Sonnet in Project chat |

---

## 3. Brand & Styling

### Colours

```css
--color-primary: #E8323A;       /* LivWarm red - dominant brand colour */
--color-primary-light: #F05A5F; /* Lighter red - buttons, step numbers */
--color-cta-green: #4CAF50;     /* CTA buttons on red backgrounds */
--color-dark: #2D2D2D;          /* Headings on white */
--color-body: #4A4A4A;          /* Body text */
--color-grey-bg: #3D3D3D;       /* Dark section backgrounds */
--color-white: #FFFFFF;
--color-card-bg: #F8F8F8;       /* Light card backgrounds in form */
--color-border: #E5E5E5;        /* Subtle borders */
--color-selected: #E8323A;      /* Selected card state */
```

### Typography

- Brand font: lbrand (woff2, woff, ttf files in /fonts/ folder)
- Fallback stack: 'lbrand', 'Nunito', sans-serif
- Minimum font size: 16px everywhere, including inputs

### Font scale

```css
--text-display: 2.5rem; /* Quote results headline */
--text-h1: 2rem;        /* Step question */
--text-h2: 1.5rem;      /* Section headers */
--text-body: 1rem;      /* Body copy - minimum 16px always */
--text-small: 0.875rem; /* Labels, captions - min 16px in inputs */
```

### UI Language

- Rounded corners throughout: border-radius 12px cards, 8px buttons/inputs
- LivWarm red as dominant colour on answer cards, selected states, progress bar
- Green (#4CAF50) for primary CTAs on red backgrounds
- Red (#E8323A) for primary CTAs on white backgrounds
- Generous white space between sections
- Trust signals (MCS Certified, Trustpilot 4.9, 2yr Warranty) visible at bottom of quote screen

### Card Interaction System (built in Session 1 - do not alter)

Three-state interaction:

- **Default:** raised shadow (0 4px 12px rgba(0,0,0,0.10)), light background, dot texture lower-right corner
- **Hover:** card sinks slightly, shimmer sweep across surface
- **Click:** two-beat punch-and-rise animation, then settles into depressed inset shadow selected state
- **Selected:** inset shadow (depressed feel), background fills with LivWarm red at low opacity, border becomes solid red, label goes bold, dot texture switches to rgba(232,50,58,0.25) red dots
- **Unselected (after selection made):** dims to 60% opacity with desaturation
- Smooth 150ms transition throughout
- 500ms delay before auto-advancing after card selection

### Dot Texture (all cards)

```css
background-image: radial-gradient(circle, #d8d8d8 1px, transparent 1px);
background-size: 10px 10px;
mask: radial-gradient(ellipse at 100% 100%, rgba(0,0,0,0.5) 0%, transparent 100%);
width: 65%; height: 65%; /* bottom-right corner only */
```

Selected state dot colour: `rgba(232,50,58,0.25)`

### Tariff Toggle Cards

Styled as mini answer cards - rectangular, rounded corners, dot texture lower-right corner. Selected state: `background: rgba(232,50,58,0.04)`, `border: 1.5px solid rgba(232,50,58,0.9)`, red text, soft red bloom box-shadow.

### Continue Button

Solid red pill button, full width of content block. Neutral dark drop shadow default, darkens and shadow reduces on hover, presses down on active. No red glow on shadow.

### Layout

- Content block max-width: 1100px, centred
- Two-card layouts: max-width 860px, centred
- Vertically positioned at roughly 45% from top
- No Continue buttons on card-based screens - cards auto-advance after 500ms
- Continue button only on input screens (kWh, tariff)

### Logo

- LivWarm logo in header of every step

---

## 4. Architecture

### File structure

```
livwarm-quotes/
├── fonts/
│   ├── lbrand.woff2
│   ├── lbrand.woff
│   └── lbrand.ttf
├── solar/
│   ├── index.html        (self-contained React SPA)
│   └── pricing.json      (solar pricing data)
├── ev/
├── heatpump/
├── boiler/
└── shared/
    ├── components/       (shared React components)
    └── utils/            (pricing engine, API helpers)
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
|---------|---------|-------|
| Google Maps JavaScript API | Satellite map display - visual confirmation only | Already licensed on LivWarm. No data extracted from map. |
| Ideal Postcodes API | Postcode/address lookup dropdown | This is what UKEM uses - not Google Places. Confirm whether LivWarm has an account or needs one. |
| Stripe | Payment processing | Card, Klarna, Revolut Pay. New account needed for LivWarm. |
| Shermin Finance | Finance calculator | TBC: embed/API or link-out. Confirm with Shermin before build. |
| Payaca | CRM / lead management | Direct API call via WordPress AJAX handler (PHP) on same WP install. Credentials and field maps already in existing PHP. No Zapier needed. |

### Google Solar API - NOT USED

The Google Solar API has been removed from the spec. Panel sizing is handled by the lookup table in Section 6, supplemented by the occupancy and roof orientation questions. This removes API cost, Google Cloud setup complexity, and build risk with no meaningful loss of quote accuracy given all quotes are estimates subject to technical verification.

### Google Maps setup required

- Maps JavaScript API only
- API key needs domain restrictions for: `*.deals.livwarm.co.uk/*` and `*.vercel.app/*` (remove Vercel restriction before production launch)
- No billing anxiety - Maps JS API has generous free tier for this use case

### Postcode lookup

UKEM uses Ideal Postcodes (api.ideal-postcodes.co.uk), not Google Places. Confirm whether LivWarm already has an Ideal Postcodes account. If not, sign up at ideal-postcodes.co.uk - pricing is per lookup, low cost for lead gen volumes.

---

## 6. Solar Flow - Step by Step

### Overview: 9 steps

Steps 1-5 are complete and deployed at livwarm-quotes.vercel.app/solar.

Note: electricity usage was split into two steps (kWh and tariff), making the total 9 not 8 as originally planned.

---

### Step 1 - Home Details (Qualifier) - COMPLETE

Questions on this screen (accordion-style, answers summarised above as user progresses):

1. Are you a homeowner or a landlord?
   - Homeowner → continue
   - Landlord → continues (NOT a dead-end - landlords can get solar)

2. What type of home do you live in?
   - Detached / Semi-Detached / Terrace / Bungalow → continue
   - Flat → dead-end to /sorry-we-cannot-help

3. What type of roof do you have?
   - Pitched → continue
   - Flat → dead-end to /sorry-we-cannot-help

4. How many bedrooms?
   - 1 / 2 / 3 / 4 / 5+

Data collected: `house_owner_type`, `house_type`, `roof_type`, `house_bedrooms`

---

### Step 2 - Electricity Usage (kWh) - COMPLETE

- Annual kWh input with placeholder "e.g. 4,100", unit label "kWh/yr"
- "Where do I find this?" link - help modal with annotated placeholder energy bill image
- "I'm not sure - use national averages" link that populates 4,100 kWh/yr
- Continue button activates once kWh field is populated
- Breadcrumb pill: "Usage: 4,100 kWh"

Data collected: `electricity_usage`

---

### Step 3 - Electricity Tariff - COMPLETE

- Screen title: "How are you charged for electricity?"
- Subtitle: "You'll find this on your latest electricity bill."
- Tariff toggle cards: Same rate / Economy 7 (different day/night rates)
- If same rate: single unit rate input in p/kWh
- If Economy 7: day rate and night rate inputs in p/kWh
- "I'm not sure - use national averages" link: populates 26.35p/kWh single, or 28p/15p Economy 7
- Continue button
- Breadcrumb pill: "Rate: 27p/kWh" or "Rate: 28p/15p (E7)"

Data collected: `rate_type`, `day_unit_rate`, `night_unit_rate`

---

### Step 4 - Battery Details - COMPLETE

1. Where would you like your battery installed?
   - Inside / Outside / I'm not sure

2. If Inside: Where inside?
   - Garage / Utility room / Cupboard / Other

3. If Outside: Where outside?
   - Side of the garage / Side of the house / Back of the house / Other

Data collected: `battery_location`, `battery_location_inside`, `battery_location_outside`

---

### Step 5 - EV Details - COMPLETE

1. Do you have an electric vehicle?
   - Yes → sub-question: How do you currently charge it?
     - Home charger / Public charger / Both
   - No → sub-question: Are you planning to get one?
     - Yes, within 2 years / Maybe in 2-5 years / No plans currently

Data collected: `has_ev`, `ev_charging_method`, `ev_plans`

---

### Step 6 - Address & Roof Confirmation - TO BUILD

#### Part A: Postcode lookup

- "Let's identify your roof" heading
- Postcode input + "Find Addresses" button (Ideal Postcodes API)
- Address dropdown populated from postcode lookup
- "Can't find your address? Enter manually" fallback
- On address selection: lat/long stored in app state. Street bearing auto-calculated from address geometry to derive a suggested roof orientation (see Part C).

#### Part B: Satellite map confirmation

- On address selection: full-screen Google Maps satellite view loads
- Pin drops on selected property
- Tooltip: "Is this the roof where you want the panels installed? Confirm, or reposition the pin by tapping your roof."
- Confirm button

The satellite map is visual confirmation only. No API data is extracted from it. Panel sizing comes from the lookup table in this section.

#### Part C: Roof orientation

After satellite map confirmation, the orientation screen shows.

- **Auto-suggestion:** Street bearing is calculated from the address lat/long. The suggested front-facing direction is shown: "Based on your address, your front door appears to face South. Does that sound right?"
- **If Yes:** orientation confirmed, store value, advance
- **If No / I'm not sure:** show the interactive compass UI (see below)

**Compass UI:**
- Satellite map zoomed in tight to confirmed property, with a compass rose SVG overlaid top-right corner (fixed, always north-up)
- Eight-point interactive compass below the map: N / NE / E / SE / S / SW / W / NW
- Prompt: "If you look out of your front door, which direction are you facing?"
- User taps their direction on the compass - it highlights in LivWarm red
- Selected direction shown as text confirmation below
- Continue button

**Compass rose behaviour:**
- Always oriented north-up (matches Google Maps default)
- If user rotates/drags the map, compass rose rotates to maintain true north alignment (use Maps JS `heading_changed` event)

**From front door bearing, derive roof orientation:**
- Front-facing slope = same direction as front door
- Rear-facing slope = opposite direction
- Quote assumes rear/best-facing slope for panel placement (confirmed at survey)

#### Generation multipliers by orientation

| Direction | Multiplier |
|-----------|------------|
| S | 1.00 |
| SE / SW | 0.93 |
| E / W | 0.82 |
| NE / NW | 0.65 |
| N | 0.52 |

#### Part D: Occupancy

- "How many people live in your home?"
- Card options: 1 / 2 / 3 / 4 / 5+
- Used to refine usage estimate for users who used the national average fallback

**Occupancy usage table:**

| Occupants | Estimated annual usage |
|-----------|----------------------|
| 1 | 1,800 kWh |
| 2 | 2,700 kWh |
| 3 | 3,500 kWh |
| 4 | 4,300 kWh |
| 5+ | 5,500 kWh |

Note: if user entered their own kWh in Step 2, occupancy is collected but does not override their stated usage. It is used only when the national average fallback was applied.

Data collected: `postcode`, `address_full`, `latlong`, `roof_orientation`, `occupants`

---

### Step 7 - Your Solar Potential (Quote Screen)

This is the conversion centrepiece. Layout follows the reading order in Section 7.

#### Panel sizing logic

Panel count is determined by the lookup table, adjusted for EV and orientation:

**Base panel count (lookup table):**

| Property | Bedrooms | Base panels |
|----------|----------|-------------|
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

Note: these numbers are placeholders pending confirmation from UKEM/LivWarm.

**EV adjustments:**
- `has_ev = true` → add 2 panels
- `ev_plans = within_2_years` → add 2 panels
- `ev_plans = maybe_2_5_years` → add 1 panel

**Orientation adjustment:**
- Apply generation multiplier from Section 6 Part C to annual generation estimate

#### Three tier cards

| Tier | Label | Contents | Badge |
|------|-------|----------|-------|
| 1 | Essential | Panels only, no battery | - |
| 2 | Performance | Panels + recommended battery | RECOMMENDED |
| 3 | Custom | User selects panel count + battery from dropdowns | - |

#### Battery sizing guide (Performance tier)

| Annual generation | Recommended battery |
|------------------|-------------------|
| Under 4,000 kWh | 5kW |
| 4,000-6,000 kWh | 10kW |
| 6,000-8,000 kWh | 15kW |
| Over 8,000 kWh | Powerwall |

#### Financial projection calculations

```
export_tariff = 15p/kWh
grid_import_rate = from user input (default 26.35p/kWh)
electricity_price_inflation = 3% per year
annual_generation = base_generation × orientation_multiplier
self_consumption_rate = 0.5
annual_saving = (annual_generation × 0.5 × grid_import_rate)
              + (annual_generation × 0.5 × export_tariff)
break_even_year = system_cost / annual_saving
20_year_saving = (annual_saving × 20) - system_cost
```

Data collected: `product_selection`, `solar_panel_number`, `payment_total`

---

### Step 8 - Upsell Modal (triggered on Continue from quote screen)

Modal: "Enhance Your System"

- Extended Warranty toggle: 5-year workmanship guarantee (+£199)
- BUS Heat Pump Grant cross-sell card (orange highlight): £7,500 grant available
- "Not this time" / "Continue: Add Selected" buttons

---

### Micro-Commitment Step (between upsell modal and contact details)

Before contact details are collected:

- Summary of selected tier (name, panel count, battery, price)
- Single button: "This looks right - get my full quote"

Anchors the user to their choice, improves lead quality.

---

### Step 8 - Your Details + Booking Summary

Left side:
- First name, Surname, Email, Phone
- Preferred installation date: calendar picker (weekdays only - add "Weekdays only" note)
- Copy: "Select your preferred date. Our team will confirm availability after your technical review."

Right side - Booking Summary:
- Address confirmed
- System selected (tier name, panel count, battery)
- Price breakdown (panels + battery, VAT included)
- Pay total: £X,XXX (one-off) | Pay monthly: £XXX/mo (finance)
- "Explore finance options" → opens finance modal
- Estimated savings: yearly saving, 20-year saving, monthly bill reduction, break-even
- What's included list
- Trust badges: MCS Certified / 2yr Warranty Workmanship / Rated 4.9 Trustpilot

Finance modal:
- Toggle: Pay monthly / Cash payment
- Loan term dropdown (up to 15 years)
- APR (fixed) - from Shermin
- Optional deposit slider (0-30%)
- Live calculation: monthly payment, loan amount, cost of finance, total repayable
- Representative example (FCA compliant)
- Provider: Shermin Finance

Data collected: `full_name`, `email`, `phone`, `preferred_date`, `payment_method`

---

### Step 9 - Secure Your Booking (Payment)

- Booking summary recap
- "How would you like to pay?" - two options:
  - Pay securely online (Stripe) - Card, Klarna, Revolut Pay
  - Spread the cost with finance (Shermin)
- Stripe Payment Element
- "Your booking is secure" trust line
- "What happens next?" panel: Provisional Booking / Remote Survey / Final Confirmation
- Pay button: "Pay £X,XXX.00"
- Footer: "Payments are securely processed by Stripe"

On successful payment:
- POST to WordPress AJAX handler → Payaca API
- Advance to Step 10 confirmation

---

### Step 10 - Confirmation

- "You're all booked in!" headline
- Summary of selected system
- Preferred date confirmed
- What happens next (3-step process)
- QR code for photo submission
- Email confirmation note

---

## 7. UX & Design Improvements Over UKEM

### Quote Screen Reading Order (Step 7)

Content must appear in this order, top to bottom:

1. Price headline - "£17,069 or from £182/month" - large, prominent, above the fold
2. Three scannable savings figures - Monthly saving / 20-year saving / Break-even year
3. Tier selector cards - Essential / Performance / Custom - 3-state interaction, live price update on switch
4. What's included - panel count, battery, inverter, monitoring, installation
5. Trust signals - MCS Certified, HIES badge, partner logos, Trustpilot 4.9
6. Single CTA - "Continue with this system"

The satellite map does NOT appear on the quote screen.

### Key improvements over UKEM

1. Bold, warm brand-led design - not clinical software
2. Trust signals from Step 1 onward - MCS Certified, Trustpilot, partner logos
3. Bold red progress bar with percentage and step name always visible
4. Fuller screens - no dead space
5. Financial data prominent on quote screen - large, scannable, immediately below price
6. No satellite map on quote screen - space used for financial case instead
7. Price as headline on product cards - large and confident
8. Contact details as dedicated screen - not modal overlay
9. 3-state card interactions with physical feedback
10. Consistent rounded icon set in brand red
11. "Weekdays only" note on calendar date picker
12. Warm, relationship-starting confirmation screen

---

## 8. Payaca Integration

Method: Direct Payaca API call via WordPress AJAX handler on deals.livwarm.co.uk. React form POSTs to WordPress AJAX endpoint added via Code Snippets plugin. That endpoint calls Payaca API server-side. Existing PHP credentials and field maps are already live.

Trigger: On successful payment.

Payload for Solar (form ID 3):

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
  "roof_orientation": "SE",
  "occupants": "3",
  "solar_panel_number": "10",
  "product_selection": "Performance Solar PV System",
  "payment_total": "15529.00",
  "full_name": "John Smith",
  "email": "john@example.com",
  "phone": "07700900000"
}
```

---

## 9. Dead-End Rules

| Condition | Action |
|-----------|--------|
| Flat (property type) | Redirect to /sorry-we-cannot-help |
| Flat roof | Redirect to /sorry-we-cannot-help |
| Landlord | Continues through flow (NOT a dead-end) |
| LPG or Oil fuel (boiler flow) | "Form Fill Required - Bespoke Project" - capture details, route to callback |

---

## 10. Outstanding TBC Items

| Item | Action needed |
|------|--------------|
| Shermin Finance integration | Call Shermin - confirm embed widget, API, or link-out |
| Panel count lookup table | Confirm numbers with UKEM before launch |
| Stripe account | Set up new Stripe account for LivWarm, obtain publishable key |
| lbrand font licence | Confirm web embedding is covered by existing licence |
| Ideal Postcodes account | Confirm whether LivWarm has account or needs one. API key needed for Session 6. |
| Google Maps API key | Set up Google Cloud project, enable Maps JavaScript API only, add domain restrictions for Vercel and deals.livwarm.co.uk |
| Deposit vs full payment | Client to confirm - currently assuming full payment (mirrors UKEM) |

---

## 11. Session Handover Notes

### Pre-build sessions (June 2026) - Planning complete

- Full UKEM flow reviewed via Claude in Chrome
- UKEM confirmed to use Ideal Postcodes for address lookup (not Google Places)
- UKEM confirmed to use Solar API server-side - but this has been removed from LivWarm spec (see Section 5)
- Pricing matrix extracted from spreadsheet
- Brand assets extracted from livwarm.co.uk
- lbrand font files confirmed in /fonts/ folder
- All major decisions made - see sections above

### Sessions 1-5 (June 2026) - Complete

- Steps 1 (home details), 2 (kWh), 3 (tariff), 4 (battery), 5 (EV) built and deployed
- Deployed at livwarm-quotes.vercel.app/solar
- Card interaction system fully built and refined
- Tariff toggles styled as mini answer cards
- Total steps confirmed as 9 (electricity usage split into Steps 2 and 3)
- Landlord confirmed NOT a dead-end
- Battery outside sub-locations added (Side of garage / Side of house / Back of house / Other)
- EV charging method sub-question added for "Yes I have an EV" users
- No per-step summary screens - single consolidated review screen before quote generation
- No Continue buttons on card-based screens - auto-advance after 500ms

### Session 6 - To do

Address lookup, satellite map, roof orientation compass, occupancy question. See roadmap for prompt.
