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
--color-cta-green: #4CAF50;     /* CTA buttons - also used for "Prepare my quote" button */
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
- Green (#4CAF50) for the "Prepare my quote" CTA button at end of Step 6
- Red (#E8323A) for all other primary CTAs on white backgrounds
- Generous white space between sections
- Trust signals (MCS Certified, Trustpilot 4.9, 2yr Warranty) in footer bar only - not duplicated above CTA

### Card Interaction System (built in Session 1 - do not alter)

Three-state interaction:

- **Default:** raised shadow (0 4px 16px rgba(0,0,0,0.13), 0 2px 6px rgba(0,0,0,0.09)), light background, dot texture lower-right corner
- **Hover:** card sinks slightly, shimmer sweep to rgba(255,255,255,0.65) across surface
- **Click:** two-beat punch-and-rise animation, then settles into depressed inset shadow selected state
- **Selected:** inset shadow (depressed feel), background fills with LivWarm red at low opacity, border becomes solid red, label goes bold, dot texture switches to rgba(232,50,58,0.25) red dots
- **Unselected (after selection made):** dims to 60% opacity with desaturation
- Smooth 150ms transition throughout
- 500ms delay before auto-advancing after card selection

### Dot Texture (all cards)

```css
background-image: radial-gradient(circle, #b8b8b8 1px, transparent 1px);
background-size: 10px 10px;
mask: radial-gradient(ellipse at 100% 100%, rgba(0,0,0,0.5) 0%, transparent 100%);
width: 65%; height: 65%; /* bottom-right corner only */
```

Selected state dot colour: `rgba(232,50,58,0.25)`

### Tariff Toggle Cards

Styled as mini answer cards - rectangular, rounded corners, dot texture lower-right corner. Selected state: `background: rgba(232,50,58,0.04)`, `border: 1.5px solid rgba(232,50,58,0.9)`, red text, soft red bloom box-shadow.

### Continue Button

Solid red pill button, full width of content block. Neutral dark drop shadow default, darkens and shadow reduces on hover, presses down on active. No red glow on shadow.

### "Prepare My Quote" Button (end of Step 6 only)

Full width, same pill shape and shadow as Continue button. Background: #4CAF50 (green), white text. Label: "Prepare my quote →". This is the only green button in the entire flow. Margin-top: 32px above the button. Padding-bottom: 32px below.

### Layout

- Content block max-width: 1100px, centred
- Two-card layouts: max-width 860px, centred
- Vertically positioned at roughly 45% from top
- No Continue buttons on card-based screens - cards auto-advance after 500ms
- Continue button only on input screens (kWh, tariff)
- Subheadings globally: font-size 1.125rem, font-weight 500, colour #4A4A4A

### Logo

- LivWarm logo in header of every step

### Breadcrumb Pills

- Accumulate above each question, show previous answers with edit icon, centred
- Collapses to "X previous answers ∨" toggle when more than 6 pills

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
│   ├── index.html              (self-contained React SPA)
│   └── solar-products.json    (product content - images, descriptions, who_for copy)
├── ev/
├── heatpump/
├── boiler/
└── shared/
    ├── components/             (shared React components)
    └── utils/                  (pricing engine, API helpers)
```

Note: pricing.json is no longer a separate file. Solar pricing is hardcoded inline in the component as a PRICING constant (see Section 6). Product content (images, descriptions, battery brand names) lives in solar-products.json.

### solar-products.json

Lives at `/solar/solar-products.json`. Fetched by the React SPA on quote screen mount. Contains:

- `batteries` object keyed by tier size (`none`, `5kw`, `10kw`, `15kw`, `powerwall`) - each entry has: `wp_id`, `name`, `brand`, `capacity_kwh`, `image` (full WordPress media URL), `short_description`, `who_for`
- `tiers` object keyed by tier name (`essential`, `performance`, `custom`) - each entry has: `name`, `tagline`, `who_for`, `highlight_colour`
- `panels.standard` - panel name, brand, wattage, image URL

**Battery products confirmed (from WordPress post type `prod`):**

| Tier key | WP ID | Product name | Capacity | Image URL |
|----------|-------|--------------|----------|-----------|
| none | 510 | No Battery | - | - |
| 5kw | 385 | Fox ESS EP6 Battery | 6.0 kWh | https://deals.livwarm.co.uk/wp-content/uploads/2025/10/Fox-ESS-6kw-Battery.webp |
| 10kw | 387 | Fox ESS EP12 Battery | 11.52 kWh | https://deals.livwarm.co.uk/wp-content/uploads/2026/02/foxess-ep12-battery.webp |
| 15kw | 508 | Fox ESS EP18 Battery | 18.0 kWh | https://deals.livwarm.co.uk/wp-content/uploads/2025/10/foxess-ep18-battery.webp |
| powerwall | 509 | Tesla Powerwall 13.5kWh | 13.5 kWh | https://deals.livwarm.co.uk/wp-content/uploads/2025/10/tesla-powerwall-png-no-background.png |

**Panel image:** https://deals.livwarm.co.uk/wp-content/uploads/2025/10/12-Solar-Panels.webp

**Maintenance:** To update product content, edit solar-products.json directly in VS Code and commit to GitHub. Vercel deploys within 30 seconds. No code changes needed.

### WordPress product catalogue

- WordPress custom post type slug: `prod` (not `products`)
- REST API endpoint: `https://deals.livwarm.co.uk/wp-json/wp/v2/prod`
- Product images live in WordPress media library at `https://deals.livwarm.co.uk/wp-content/uploads/`
- No WooCommerce installed - custom post type only
- Product types taxonomy used for categorisation (Battery Storage, Air Source Heat Pumps, EV Chargers, Boilers, Solar Panels)
- Note: no Solar Panel products currently exist in WordPress - panel image sourced directly from media library

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
| Shermin Finance (Stax) | Finance calculator | Confirmed finance provider. Platform is Stax (staxpay.co.uk). Integration method TBC - build self-contained calculator placeholder for now; Shermin embed drops in once credentials confirmed. APR: 9.9% fixed. Loan terms: 36/48/60/84/120/180 months. Deposit cap: 30%. Max loan: £25,000. |
| Payaca | CRM / lead management | Direct API call via WordPress AJAX handler (PHP) on same WP install. Credentials and field maps already in existing PHP. No Zapier needed. |

### Google Solar API - NOT USED

The Google Solar API has been removed from the spec. Panel sizing is handled by the lookup table in Section 6, supplemented by the occupancy and roof orientation questions.

### Google Maps setup required

- Maps JavaScript API only
- API key needs domain restrictions for: `*.deals.livwarm.co.uk/*` and `*.vercel.app/*` (remove Vercel restriction before production launch)

### Postcode lookup

UKEM uses Ideal Postcodes (api.ideal-postcodes.co.uk), not Google Places. Confirm whether LivWarm already has an Ideal Postcodes account.

### Finance calculation

APR: 9.9% fixed (confirmed from UKEM Stax/Shermin calculator and UKEM quote engine).
Available terms: 36 / 48 / 60 / 84 / 120 / 180 months.
Default term shown to user: 180 months (15 years) - displays the lowest monthly figure as the headline number, matching UKEM approach.
Deposit cap: 30% of system price (matches UKEM quote engine - not the 50% shown on the standalone Vercel calculator).
Max loan amount: £25,000.

```javascript
monthlyRate = 0.099 / 12
// Default display uses 180 months to show lowest monthly figure
monthlyPayment = systemCost × (monthlyRate × (1 + monthlyRate)^months) / ((1 + monthlyRate)^months - 1)
// Round up to nearest £ using Math.ceil
```

### VAT treatment

All prices are shown VAT-inclusive throughout the flow. A footnote "All prices include VAT" appears below the price breakdown on the booking summary and payment screens. This matches UKEM exactly. The prices in the PRICING constant are treated as VAT-inclusive - no multiplication applied.

Note: VAT on solar PV and battery storage is 5% (reduced rate for energy-saving materials), not 20%. The spreadsheet prices are assumed to already include this 5% VAT. Awaiting confirmation from UKEM account manager - see Section 10 TBC items.

---

## 6. Solar Flow - Step by Step

### Overview: 9 steps

Steps 1-7 are complete and deployed at livwarm-quotes.vercel.app/solar. Step 7 (quote screen) has a polish pass pending (see Section 11).

Note: electricity usage was split into two steps (kWh and tariff), making the total 9 not 8 as originally planned.

---

### Step 1 - Home Details (Qualifier) - COMPLETE

1. Are you a homeowner or a landlord?
   - Homeowner / Landlord → both continue (NOT a dead-end)

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
- "Where do I find this?" link - help modal with annotated energy bill. Passes `highlightField='usage'` to modal - only the "Electricity used (annual)" row is highlighted.
- "I'm not sure - use national averages" link populates 4,100 kWh/yr
- Continue button activates once kWh field is populated
- Breadcrumb pill: "Usage: 4,100 kWh"

Data collected: `electricity_usage`

---

### Step 3 - Electricity Tariff - COMPLETE

- Screen title: "How are you charged for electricity?"
- Subtitle: "You'll find this on your latest electricity bill."
- Tariff toggle cards: Same rate / Economy 7
- If same rate: single unit rate input in p/kWh. "Where do I find this?" passes `highlightField='rate'` to modal - only the "Unit rate" row is highlighted.
- If Economy 7: day rate and night rate inputs
- "I'm not sure - use national averages": 26.35p/kWh single, or 28p/15p Economy 7
- Breadcrumb pill: "Rate: 27p/kWh" or "Rate: 28p/15p (E7)"

Data collected: `rate_type`, `day_unit_rate`, `night_unit_rate`

### Help Modal - dynamic field highlighting

The "Where do I find this?" modal accepts a `highlightField` prop ('usage' or 'rate'). Only the relevant row is highlighted with the red box and annotation. The other row renders as a normal unhighlighted bill row. Same modal component used for both steps - context-aware via prop.

---

### Step 4 - Battery Details - COMPLETE

1. Where would you like your battery installed? - Inside / Outside / I'm not sure
2. If Inside: Garage / Utility room / Cupboard / Other
3. If Outside: Side of the garage / Side of the house / Back of the house / Other

Data collected: `battery_location`, `battery_location_inside`, `battery_location_outside`

---

### Step 5 - EV Details - COMPLETE

1. Do you have an electric vehicle? - Yes / No
2. If Yes: How do you currently charge it? - Home charger / Public charger / Both
3. If No: Are you planning to get one? - Yes within 2 years / Maybe 2-5 years / No plans

Data collected: `has_ev`, `ev_charging_method`, `ev_plans`

---

### Step 6 - Address & Roof Confirmation - COMPLETE

#### Part A: Postcode lookup
- "Let's identify your roof" heading
- Postcode input + "Find Addresses" button (Ideal Postcodes API)
- Address dropdown populated from postcode lookup
- "Can't find your address? Enter manually" fallback
- On selection: lat/long stored, street bearing calculated for orientation suggestion

#### Part B: Satellite map confirmation
- Full-screen Google Maps satellite view, pin on property
- Pin is draggable - updates stored lat/long
- Confirm button

#### Part C: Roof orientation
- Auto-suggestion from street bearing: "Your front door appears to face [Direction]. Does that sound right?"
- If Yes: confirmed, advance
- If No: interactive compass UI with satellite map + eight-point compass graphic
- User taps direction, highlighted in LivWarm red

Generation multipliers by orientation:

| Direction | Multiplier |
|-----------|------------|
| S | 1.00 |
| SE / SW | 0.93 |
| E / W | 0.82 |
| NE / NW | 0.65 |
| N | 0.52 |

#### Part D: Occupancy
- "How many people live in your home?" - cards: 1 / 2 / 3 / 4 / 5+
- Used to refine usage when national average fallback was applied

| Occupants | Estimated annual usage |
|-----------|----------------------|
| 1 | 1,800 kWh |
| 2 | 2,700 kWh |
| 3 | 3,500 kWh |
| 4 | 4,300 kWh |
| 5+ | 5,500 kWh |

**CTA at end of Step 6:** Green "Prepare my quote →" button (not red Continue). Full width, #4CAF50, margin-top 32px, padding-bottom 32px. Triggers loading overlay before quote screen.

Data collected: `postcode`, `address_line1`, `town`, `latlong`, `roof_orientation`, `occupants`

---

### "Preparing Your Quote" Loading Overlay

Triggered by the "Prepare my quote" button. Full-screen white overlay, runs for ~6.8 seconds, then dissolves into the quote screen. Pure setTimeout - no actual processing. Psychological purpose: labour illusion increases perceived value and trust.

- LivWarm logo centred top
- Rotating sun SVG icon, 56px, LivWarm red
- Heading: "Preparing your quote" - 2.25rem, bold, #2D2D2D
- Progress bar: LivWarm red, 10px height, border-radius 5px, fills left to right over 6 seconds
- Five sequential messages, each shown for 1,200ms, 1.25rem, font-weight 500, #2D2D2D, centred:
  1. "Analysing your property and roof orientation..."
  2. "Calculating your solar generation potential..."
  3. "Checking current energy rates and export tariffs..."
  4. "Matching you to the best available systems..."
  5. "Finalising your personalised quote..."
- Fades in over 300ms, fades out over 500ms at end

---

### Step 7 - Your Solar Potential (Quote Screen) - COMPLETE (polish pass pending)

#### Pricing data (inline PRICING constant)

```javascript
const PRICING = {
  basePanels: 6,
  pricePerExtraPanel: 250,
  base: { noB: 4342, b5: 5842, b10: 6842, b15: 7842, pw: 10842 }
};
// 445W panels. Base generation: 400 kWh/year/panel at south-facing.

function getPrice(panels, battery) {
  const extraPanels = Math.max(0, panels - 6);
  const basePrice = PRICING.base[{none:'noB','5kw':'b5','10kw':'b10','15kw':'b15','powerwall':'pw'}[battery]];
  return basePrice + (extraPanels * 250);
}
```

#### Panel sizing logic

Base panel count from lookup table:

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

EV adjustments: has_ev=true +2, ev_plans=within_2_years +2, ev_plans=maybe_2_5_years +1. Applied to Performance tier only. Essential uses base count with no EV adjustment.

#### Battery sizing (Performance tier)

| Annual generation | Battery key |
|------------------|-------------|
| Under 4,000 kWh | 5kw |
| 4,000-6,000 kWh | 10kw |
| 6,000-8,000 kWh | 15kw |
| Over 8,000 kWh | powerwall |

#### Financial calculations

```
export_tariff = 0.15
gridImportRate = day_unit_rate / 100 (default 0.2635)
annualGeneration = panelCount × 400 × orientationMultiplier
annualSaving = (annualGeneration × 0.5 × gridImportRate) + (annualGeneration × 0.5 × 0.15)
breakEvenYear = systemCost / annualSaving
saving20yr = (annualSaving × 20) - systemCost
monthlySaving = annualSaving / 12
currentBill = (electricity_usage / 12) × gridImportRate
billAfterSolar = Math.max(0, currentBill - monthlySaving)
monthlyPayment = Math.ceil(systemCost × (monthlyRate × (1+monthlyRate)^180) / ((1+monthlyRate)^180 - 1))
// monthlyRate = 0.099 / 12 (9.9% APR, default 180 months / 15 years for headline figure)
```

#### Quote screen layout (reading order - top to bottom)

1. **Headline block**
   - Address line: address_line1 + town, 0.9rem, #4A4A4A
   - Two prices side by side: "£{price}" (2.5rem, bold, #2D2D2D) + "or" separator + "£{monthly}/mo" (2.5rem, bold, #E8323A)
   - Disclaimer: "Subject to survey and final system confirmation" - 0.75rem, #999, italic
   - Price breakdown: "£{panelsCost} panels + £{batteryCost} battery storage" or "panels only" - 0.85rem, #4A4A4A
   - All update live on tier switch

2. **Savings hero block** (red gradient box, full width)
   - Background: linear-gradient(135deg, #E8323A 0%, #c42830 100%), border-radius 16px
   - Left: "Your estimated monthly saving" label + "~£{monthlySaving}/mo" value (2.5rem, bold, white)
   - Right: "Currently paying ~£{currentBill}/mo" (strikethrough) + "With solar: ~£{billAfterSolar}/mo"
   - Updates live on tier switch

3. **Two smaller stat boxes** (side by side)
   - "£{saving20yr}" / "20-year saving"
   - "{breakEvenYear} years" / "Estimated break-even"

4. **Three tier cards** (Essential / Performance / Custom)
   - Performance pre-selected on load. Tier cards switch immediately (no 500ms delay).
   - Performance: heading 1.15rem bold, red price, 2px red border selected, red background wash, product image 160px right side, who_for text italic below specs, price breakdown line
   - Essential: heading 1rem, grey price (#4A4A4A), panel image 140px right side, who_for text
   - Custom: heading 1rem, grey price, panel/battery dropdowns, no product image

5. **What's included** (flush below tier cards, 32px margin)
   - Wrapped in card (white bg, 1px border #E5E5E5, border-radius 12px, padding 24px 32px)
   - Two-column grid desktop, single column mobile (below 600px)
   - Updates dynamically per selected tier
   - Red SVG tick icons

6. **CTA** - "Continue with this system →"
   - Width: auto, min-width 320px, max-width 380px, centred
   - No trust badge pills above CTA - removed. Footer trust bar only.

Data collected: `product_selection`, `solar_panel_number`, `payment_total`

---

### Step 8 - Upsell Modal (triggered on Continue from quote screen)

Modal: "Enhance Your System"
- Extended Warranty toggle: 5-year workmanship guarantee (+£199)
- BUS Heat Pump Grant cross-sell card (orange highlight): £7,500 grant available
- "Not this time" / "Continue: Add Selected" buttons

---

### Micro-Commitment Step

- Summary of selected tier (name, panel count, battery, price)
- Single button: "This looks right - get my full quote"

---

### Step 8 - Your Details + Booking Summary

Left side:
- First name, Surname, Email, Phone
- Preferred installation date: calendar picker, weekdays only
- Copy: "Select your preferred date. Our team will confirm availability after your technical review."

Right side - Booking Summary:
- System selected, price breakdown, savings estimates, trust badges
- "Explore finance options" → finance calculator (inline expanded section, matching UKEM pattern)
- Finance calculator: 9.9% APR, terms 36/48/60/84/120/180 months, default 180 months, deposit slider 0-30%, live monthly payment, FCA compliant representative example, Shermin integration point clearly marked in code

Data collected: `full_name`, `email`, `phone`, `preferred_date`, `payment_method`

---

### Step 9 - Secure Your Booking (Payment)

- Pay securely online (Stripe) or Spread the cost (Shermin)
- Stripe Payment Element: Card, Klarna, Revolut Pay
- Pay button: "Pay £X,XXX.00"
- On successful payment: POST to WordPress AJAX handler → Payaca API

---

### Step 10 - Confirmation

- "You're all booked in!" headline
- System summary, preferred date, what happens next (3-step)
- QR code for photo submission

---

## 7. UX & Design Improvements Over UKEM

### Quote Screen - key decisions vs UKEM

- Monthly price given equal visual weight to cash price (both 2.5rem, side by side) - monthly figure in red as conversion lever
- Red gradient savings hero box replaces three equal stat boxes - loss aversion via crossed-out current bill
- No satellite map on quote screen
- Performance card has strongest visual weight - Essential and Custom are secondary
- Product images pulled from solar-products.json - battery unit photos on Performance card
- Trust badge pills removed from above CTA - footer bar only (avoids duplication)
- "Prepare my quote" green button + loading overlay before quote screen - labour illusion increases perceived value

### Key improvements over UKEM

1. Bold, warm brand-led design
2. Trust signals in header on every step
3. Bold red progress bar with percentage and step name
4. Monthly price as hero figure alongside cash price
5. Red savings block with crossed-out current bill
6. Product images on tier cards from WordPress media library
7. Context-aware help modal (highlights only the relevant bill field)
8. "Prepare my quote" loading overlay with personalised messages
9. 3-state card interactions with physical feedback
10. Warm confirmation screen

---

## 8. Payaca Integration

Method: Direct Payaca API call via WordPress AJAX handler on deals.livwarm.co.uk.

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
| Shermin Finance integration method | Confirmed provider (Stax). Integration method TBC - confirm embed widget, redirect, or API. `// SHERMIN_INTEGRATION_POINT` marked in Session 7B code. |
| VAT - are spreadsheet prices inclusive? | Email sent to UKEM account manager. Assumption: prices are VAT-inclusive at 5%. Confirm before launch. |
| LivWarm vs UKEM pricing discrepancy | £194 gap between spreadsheet (£9,342) and UKEM app (£9,148) for 11-panel + 10kW system. Email sent to UKEM account manager. |
| Panel wattage - 445W vs 450W | Spreadsheet uses 445W, UKEM app uses 450W JA Solar. Confirm which applies to LivWarm installs. Email sent to UKEM account manager. |
| Panel count lookup table | Confirm numbers with UKEM before launch |
| Stripe account | Set up new Stripe account for LivWarm, obtain publishable key |
| lbrand font licence | Confirm web embedding is covered by existing licence |
| Ideal Postcodes account | Confirm whether LivWarm has account or needs one |
| Google Maps API key | Domain restrictions set for Vercel and deals.livwarm.co.uk - remove Vercel before production |
| Deposit vs full payment | Client to confirm - currently assuming full payment |
| Solar panel product in WordPress | Add a Solar Panels product type to WordPress catalogue for future use |
| Battery model confirmation | Confirm with UKEM that Fox ESS EP6/EP12/EP18 and Tesla Powerwall are the correct models for LivWarm installs |

---

## 11. Session Handover Notes

### Pre-build sessions (June 2026) - Planning complete

- Full UKEM flow reviewed via Claude in Chrome
- UKEM confirmed to use Ideal Postcodes for address lookup (not Google Places)
- Solar API removed from spec - panel sizing via lookup table
- Pricing matrix extracted from spreadsheet
- Brand assets and lbrand font confirmed
- All major decisions made

### Sessions 1-5 (June 2026) - Complete

- Steps 1-5 built and deployed at livwarm-quotes.vercel.app/solar
- Card interaction system fully built and refined
- Tariff toggles styled as mini answer cards
- Total steps confirmed as 9
- Landlord confirmed NOT a dead-end
- Battery outside sub-locations added
- EV charging method sub-question added
- No per-step summary screens - single consolidated review screen
- No Continue buttons on card-based screens - auto-advance after 500ms

### Session 6 (June 2026) - Complete

- Step 6 built: postcode lookup (Ideal Postcodes), satellite map confirmation, orientation compass with interactive SVG, occupancy question
- All four parts within Step 6 - occupancy does NOT increment step counter
- Street bearing auto-calculates suggested front door direction
- Compass rose overlay on satellite map, always north-up
- "Prepare my quote" green button replaces Continue at end of Step 6

### Session 7 / Quote Screen Session (June 2026) - Complete, polish pass pending

- Step 7 quote screen built and deployed
- solar-products.json created and deployed to Vercel with all battery product data and images sourced from WordPress media library via Claude in Chrome
- WordPress custom post type confirmed as `prod` (not `products`) - REST API accessible at /wp-json/wp/v2/prod
- No WooCommerce on site - custom post type with media library images
- Battery products confirmed: Fox ESS EP6 (6kWh), EP12 (11.52kWh), EP18 (18kWh), Tesla Powerwall 13.5kWh
- Panel image confirmed: 12-Solar-Panels.webp in media library
- Finance APR was noted as 6.9% from UKEM pricing example - THIS WAS INCORRECT, see pre-session 7A notes below
- "Preparing your quote" loading overlay designed and built - 5 messages, 1,200ms each, 6.8s total
- Loading overlay uses labour illusion psychology - no actual processing, pure UX
- Trust badge pills removed from above CTA - footer bar only
- VAT: not shown anywhere in flow - THIS WAS INCORRECT, see pre-session 7A notes below

### Quote Screen Polish Pass - PENDING (next session)

The following fixes are queued and ready to paste into Claude Code when session tokens reset. Full prompt is in the roadmap document.

- FIX 1 REVISION: "Prepare my quote" button - correct width (auto, max 560px, centred) with proper spacing
- FIX 2: Quote screen headline - two prices side by side at equal size (cash + monthly)
- FIX 3: Red gradient savings hero box replacing equal stat boxes
- FIX 4: Tier card visual hierarchy - Performance dominant, Essential/Custom secondary
- FIX 5: Product images at correct size (160px) from solar-products.json
- FIX 6: "What's included" - flush below tier cards, two-column layout, card wrapper
- FIX 7: "Continue with this system" button - auto width, centred, not full width
- FIX 8: Remove trust badge pills above CTA entirely
- FIX 9: Help modal dynamic highlighting - `highlightField` prop, only relevant row highlighted

### Pre-session 7A (June 2026) - Confirmed corrections, roadmap updated

This session compared the UKEM quote engine and Stax/Shermin calculator via Claude in Chrome and corrected several errors in the spec. All prompts in the roadmap have been updated to reflect these corrections. Do NOT use the 6.9% or 10-year figures from earlier sessions.

**Confirmed corrections:**

- APR: **9.9%** (was 6.9% - the 6.9% figure was incorrect)
- Default term shown to user: **180 months / 15 years** (displays lowest monthly figure as headline - matches UKEM)
- Available terms: **36 / 48 / 60 / 84 / 120 / 180 months**
- Deposit cap: **30%** (matches UKEM quote engine)
- VAT: **"All prices include VAT"** footnote shown on booking summary and payment screens - prices treated as VAT-inclusive throughout (matches UKEM exactly)
- Finance calculator style: **inline expanded section** within the payment step, not a separate modal (matches UKEM pattern)
- Shermin is confirmed provider, platform is **Stax** (staxpay.co.uk). Integration method still TBC.

**Three items pending UKEM account manager reply (email sent):**
1. Are spreadsheet prices VAT-inclusive?
2. Why is there a £194 gap between spreadsheet (£9,342) and UKEM app (£9,148) for 11 panels + 10kW?
3. Spreadsheet uses 445W panels, UKEM app uses 450W - which applies to LivWarm?

**Next action:** Session 7A in Claude Code - upsell modal and micro-commitment screen. Prompt is in roadmap. Run the quote screen polish pass first if not already done.
