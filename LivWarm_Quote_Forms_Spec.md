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

- Brand font: IBrand (woff2, woff, ttf files in /fonts/ folder)
- Fallback stack: 'IBrand', 'Nunito', sans-serif
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

### Card Interaction System (built in Session 1, refined in polish sessions)

Three-state interaction:

- **Default:** raised shadow (`0 4px 16px rgba(0,0,0,0.13), 0 2px 6px rgba(0,0,0,0.09), inset 0 0 18px 8px rgba(255,255,255,0.92), inset 0 4px 12px rgba(0,0,0,0), inset 0 2px 4px rgba(0,0,0,0)`), light background, dot texture lower-right corner
- **Hover:** card sinks to same depth as selected state. Outer shadow fades out smoothly over 300ms via zero-opacity placeholder layers in both default and hover states so CSS can interpolate between them. No shimmer on hover.
- **Click:** two-beat punch-and-rise animation. At 35% (deepest press) translateY(5px) with stronger inset shadow (`inset 0 8px 20px rgba(0,0,0,0.28), inset 0 3px 6px rgba(0,0,0,0.18)`). Single dark shimmer sweep plays on click only. Settles back to hover/selected depth.
- **Selected:** same visual depth as hover - `background: #e8e8e8`, `border: 1px solid rgba(0,0,0,0.10)`, inset shadow (`inset 0 4px 12px rgba(0,0,0,0.22), inset 0 2px 4px rgba(0,0,0,0.14)`), translateY(1px), label goes bold, grey dot texture
- **Unselected (after selection made):** dims to 60% opacity with desaturation
- 300ms transition on box-shadow, transform, background-color, border-color
- 500ms delay before auto-advancing after card selection
- No red glow on selected state - neutral grey depression only
- Grey dot texture on selected state - no red dots

### Shimmer

- Single dark shimmer on click only (`rgba(0,0,0,0.08)` sweep via `shimmer-sweep-click` keyframe)
- No hover shimmer - removed entirely

### Dot Texture (all cards)

```css
background-image: radial-gradient(circle, #b8b8b8 1px, transparent 1px);
background-size: 10px 10px;
mask: radial-gradient(ellipse at 100% 100%, rgba(0,0,0,0.5) 0%, transparent 100%);
width: 65%; height: 65%; /* bottom-right corner only */
```

Selected state dot colour: same grey (`#b8b8b8`) - no red dots on selected cards.

### Tariff Toggle Cards

Styled as mini answer cards - rectangular, rounded corners, dot texture lower-right corner. Selected state uses red treatment (unlike answer cards): `background: rgba(232,50,58,0.04)`, `border: 1.5px solid rgba(232,50,58,0.9)`, red text, soft red inset shadow. Default state: no visible border, raised shadow. Hover: subtle sink, no border.

### Continue Button

Solid red pill button, full width of content block. Neutral dark drop shadow default, darkens and shadow reduces on hover, presses down on active. No red glow on shadow.

### "Prepare My Quote" Button (end of Step 6 only)

Full width, same pill shape and shadow as Continue button. Background: #4CAF50 (green), white text. Label: "Prepare my quote →". This is the only green button in the entire flow. Margin-top: 32px above the button. Padding-bottom: 32px below.

### Layout

- Content block max-width: 1100px, centred
- Two-card layouts: max-width 860px, centred
- No Continue buttons on card-based screens - cards auto-advance after 500ms
- Continue button only on input screens (kWh, tariff)
- Subheadings globally: font-size 1.125rem, font-weight 500, colour #4A4A4A

### Logo

- LivWarm logo in header of every step

### Breadcrumb Pills

- Accumulate above each question, show previous answers with edit icon, centred
- Collapses to "X previous answers ∨" toggle when more than 6 pills
- Hidden entirely on the quote screen (Step 7) - not needed on a results screen

### Sub-question reveal timing

On steps where clicking an answer card reveals a sub-question row (Battery step, EV step), the sub-question does not appear until the full press animation is complete (after PRESS_MS + SELECT_HOLD_MS). Implemented via local `settledLocation` / `settledHasEv` state in each step component, initialised from props so back-navigation shows prior answers correctly.

---

## 4. Architecture

### File structure

```
livwarm-quotes/
├── fonts/
│   ├── IBrand.woff2
│   ├── IBrand.woff
│   └── IBrand.ttf
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

### WordPress product catalogue

- WordPress custom post type slug: `prod` (not `products`)
- REST API endpoint: `https://deals.livwarm.co.uk/wp-json/wp/v2/prod`
- No WooCommerce installed - custom post type only

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
| postcodes.io | Postcode geocoding (lat/long lookup) | Free open-source API. Decision taken to use postcodes.io instead of Ideal Postcodes to avoid costs. Returns lat/long and town only - no street-level address dropdown. User types house number and street manually after postcode lookup. |
| Stripe | Payment processing | Card, Klarna, Revolut Pay. New account needed for LivWarm. |
| Shermin Finance (Stax) | Finance calculator | Confirmed finance provider. Platform is Stax (staxpay.co.uk). Integration method TBC - build self-contained calculator placeholder for now; Shermin embed drops in once credentials confirmed. APR: 9.9% fixed. Loan terms: 36/48/60/84/120/180 months. Deposit cap: 30%. Max loan: £25,000. Reference calculators: UKEM custom build at https://v0-ukem-calculator.vercel.app/ (primary reference - matches LivWarm requirements exactly), public Stax calculator at https://www.staxpay.co.uk/finance-calculator |
| Payaca | CRM / lead management | Direct API call via WordPress AJAX handler (PHP) on same WP install. |

### Finance calculation

APR: 9.9% fixed. Default term: 180 months (15 years). Deposit cap: 30%. Max loan: £25,000.

```javascript
monthlyRate = 0.099 / 12
monthlyPayment = systemCost × (monthlyRate × (1 + monthlyRate)^months) / ((1 + monthlyRate)^months - 1)
// Round up to nearest £ using Math.ceil
```

### VAT treatment

All prices are shown VAT-inclusive throughout the flow. "All prices include VAT" footnote on booking summary and payment screens.

---

## 6. Solar Flow - Step by Step

### Overview: 9 steps

Steps 1-7 and Step 7A are complete and deployed at livwarm-quotes.vercel.app/solar.

---

### Step 1 - Home Details (Qualifier) - COMPLETE

1. Are you a homeowner or a landlord? - Homeowner / Landlord (both continue)
2. What type of home do you live in? - Detached / Semi-Detached / Terrace / Bungalow / Flat (dead-end)
3. What type of roof do you have? - Pitched / Flat (dead-end)
4. How many bedrooms? - 1 / 2 / 3 / 4 / 5+

Data collected: `house_owner_type`, `house_type`, `roof_type`, `house_bedrooms`

---

### Step 2 - Electricity Usage (kWh) - COMPLETE

- Annual kWh input, "Where do I find this?" modal (highlightField='usage'), national average fallback (4,100 kWh)

Data collected: `electricity_usage`

---

### Step 3 - Electricity Tariff - COMPLETE

- Tariff toggle cards: Same rate / Economy 7
- Rate input(s), "Where do I find this?" modal (highlightField='rate'), national average fallback

Data collected: `rate_type`, `day_unit_rate`, `night_unit_rate`

---

### Step 4 - Battery Details - COMPLETE

1. Where would you like your battery installed? - Inside / Outside / I'm not sure
2. If Inside: Garage / Utility room / Cupboard / Other
3. If Outside: Side of the garage / Side of the house / Back of the house / Other

Sub-question delayed until press animation completes via local `settledLocation` state.

Data collected: `battery_location`, `battery_location_inside`, `battery_location_outside`

---

### Step 5 - EV Details - COMPLETE

1. Do you have an electric vehicle? - Yes / No
2. If Yes: How do you currently charge it? (4 options)
3. If No: Are you planning to get one? - Yes within 2 years / Maybe 2-5 years / No plans

Sub-question delayed until press animation completes via local `settledHasEv` state.

Data collected: `has_ev`, `ev_charging_method`, `ev_plans`

---

### Step 6 - Address & Roof Confirmation - COMPLETE

Parts A-D: postcode lookup → satellite map → orientation compass → occupancy

Generation multipliers by orientation: S=1.00, SE/SW=0.93, E/W=0.82, NE/NW=0.65, N=0.52

Occupancy adjustments when national average kWh used: 1=1800, 2=2700, 3=3500, 4=4300, 5+=5500 kWh

CTA: Green "Prepare my quote →" button triggers loading overlay.

Data collected: `postcode`, `address_line1`, `town`, `latlong`, `roof_orientation`, `occupants`

---

### "Preparing Your Quote" Loading Overlay - COMPLETE

6.8 second overlay, 5 messages at 1,200ms each, red progress bar, rotating sun icon. Pure labour illusion - no actual processing.

---

### Step 7 - Your Solar Potential (Quote Screen) - COMPLETE

#### Pricing data (inline PRICING constant)

```javascript
const PRICING = {
  basePanels: 6,
  pricePerExtraPanel: 250,
  base: { noB: 4342, b5: 5842, b10: 6842, b15: 7842, pw: 10842 }
};
```

#### Panel sizing logic

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

EV adjustments (Performance tier only): has_ev=Yes +2, ev_plans=within_2_years +2, maybe_2_5_years +1.

#### Battery sizing (Performance tier)

| Annual generation | Battery key |
|------------------|-------------|
| Under 4,000 kWh | 5kw |
| 4,000-6,000 kWh | 10kw |
| 6,000-8,000 kWh | 15kw |
| Over 8,000 kWh | powerwall |

#### Quote screen layout (top to bottom)

1. **Headline block**
   - "Your instant quote" label - 0.875rem, #4A4A4A
   - Two prices: `£{price}` (2.5rem, bold, #2D2D2D) + "or" + `£{monthly}/mo` (2.5rem, bold, #E8323A)
   - Product summary line (e.g. "16 panels (7.12kW system) · Fox ESS EP12 Battery · 11.52kWh") - 0.875rem, #4A4A4A
   - Disclaimer - 0.75rem, #999, italic
   - No address line, no price breakdown, no savings boxes, no breadcrumb pills

2. **"Choose your system"** heading - tightened spacing

3. **Navigation dots** - dots only, no labels, `margin: 8px 0 12px`

4. **Tier carousel** - Performance centred, Essential left peek, Custom right peek
   - Performance active border: `1.5px solid rgba(232,50,58,0.55)`

5. **Savings bar** (inside each card, Essential and Performance only)
   - Background: `linear-gradient(115deg, #E8323A 45%, #d44a2a 100%)`
   - White dot texture overlay, bottom-right corner
   - Heading: "Your estimated savings" - 0.95rem, bold, white
   - Three columns: monthly saving / 20-year saving / break-even, each with "est." suffix
   - All figures update dynamically per tier

6. **What's included** - two-column grid, green ticks

7. **Price block** (card footer, right side)
   - "Your price" label - 1.15rem, font-weight 700, #E8323A
   - `£{monthly}/mo` - 2.5rem, bold, #E8323A
   - `or pay in full: £{price}` (replaces previous "cash" wording)

8. **Inline finance calculator** (below tier carousel, above CTA)
   - Collapsed by default, expandable via "Explore finance options" link/button
   - When expanded: deposit slider 0-30% of system price in £500 steps, loan term selector 36/48/60/84/120/180 months (default 180), live monthly payment (Math.ceil, 9.9% APR), FCA representative example updating live
   - `// SHERMIN_INTEGRATION_POINT` marked at "Apply for Finance" button
   - This allows users to understand affordability before committing to contact details
   - Updates dynamically when user switches between tier cards

9. **"Get your quote emailed to you"** prompt (below finance calculator, above CTA)
   - Lightweight name + email capture. Not a blocking gate - clearly optional.
   - Label: "Get your quote emailed to you"
   - Subtext: "We'll send a summary to your inbox so you can review it any time."
   - Two fields inline: First name (half width) / Email address (half width)
   - Submit button: "Send my quote →" - outlined red pill, auto width
   - On submit: POST name + email + current system selection to WordPress AJAX endpoint `/wp-admin/admin-ajax.php?action=livwarm_email_quote`
   - Sends a summary email to the user and stores the lead in Payaca for follow-up
   - On success: replace the form with a green tick and "Quote sent - check your inbox."
   - If user skips this and hits the main CTA, that is fine - no enforcement
   - Fields pre-populate at Step 8 if the user already submitted them here

10. **CTA** - "Continue with this system →", auto width, max 380px, centred

Data collected: `product_selection`, `solar_panel_number`, `payment_total`, `quote_email_captured` (bool), `lead_first_name` (if captured), `lead_email` (if captured)

---

### Step 7A - Upsell Modal + Micro-commitment - COMPLETE

#### Upsell Modal

Three addon cards:
1. **EV Charger & Installation** (conditional) - "Enquire", toggle
2. **Extended Warranty** - +£199, toggle. Selected: neutral grey (`#e8e8e8`), `border: 1px solid rgba(0,0,0,0.10)`, no red. Hover: matches selected depth, 300ms transition.
3. **Heat Pump Government Grant** - green card. Default: `border: 1px solid rgba(76,175,80,0.25)`. Selected: `border: 1.5px solid rgba(76,175,80,0.55)`. Toggle: green (#4CAF50) when on. Hover: maintains green tint with same inset shadow depth.

All addon cards use same shadow/interaction system as answer cards.

#### Micro-commitment Screen

System summary, prices, add-ons, "All prices include VAT", disclaimer. CTA advances to Step 8.

---

### Step 8 - Your Details + Booking Confirmation - TO BUILD

Two-column layout (55% left / 45% right, stacks below 768px).

Left column: name (pre-populated if captured at Step 7), email (pre-populated if captured at Step 7), phone, weekday-only calendar picker (min 14 days lead time).

Heading framing: "Secure your free survey" / "No payment today. Our team will contact you within 24 hours to confirm your installation date." - sets clear expectations, removes ambiguity about commitment level.

"What happens next?" three-step note inline below the form fields (not below the button): Survey booked / Remote design confirmed / Installation day.

Right column: sticky booking summary panel with system, price (cash + monthly), warranty if added, savings figures, trust badges. No "Explore finance options" link - finance calculator is already on the quote screen.

CTA: "Book my free survey →" - red pill, disabled until all fields + date populated.

Data collected: `full_name`, `email`, `phone`, `preferred_date`

---

### Step 9 - Secure Your Booking (Payment) - TO BUILD

Stripe Payment Element (Card, Klarna, Revolut Pay). On success: POST to WordPress AJAX handler → Payaca.

---

### Step 10 - Confirmation - TO BUILD

"You're all booked in!", system summary, what happens next, QR code for photo submission.

---

## 7. Payaca Integration

Payload for Solar (form ID 3) - see payaca_webhook.txt for full PHP implementation.

Additional fields to map:
- `quote_email_captured` - bool, whether user submitted email at Step 7
- `lead_first_name` - captured at Step 7 email prompt if submitted
- `lead_email` - captured at Step 7 email prompt if submitted (may differ from Step 8 email)

---

## 8. Dead-End Rules

| Condition | Action |
|-----------|--------|
| Flat (property type) | Redirect to /sorry-we-cannot-help |
| Flat roof | Redirect to /sorry-we-cannot-help |
| Landlord | Continues through flow (NOT a dead-end) |

---

## 9. Outstanding TBC Items

| Item | Action needed |
|------|--------------|
| Shermin Finance integration method | Confirmed provider (Stax). Integration method TBC. `// SHERMIN_INTEGRATION_POINT` in code. |
| VAT - are spreadsheet prices inclusive? | Assumption: VAT-inclusive at 5%. Confirm before launch. |
| LivWarm vs UKEM pricing discrepancy | £194 gap for 11-panel + 10kW system. Email sent to UKEM. |
| Panel wattage - 445W vs 450W | Confirm which applies to LivWarm installs. |
| Panel count lookup table | Confirm numbers with UKEM before launch. |
| Stripe account | Set up new Stripe account for LivWarm. |
| IBrand font licence | Confirm web embedding covered. |
| Google Maps API key | Remove Vercel restriction before production. |
| Deposit vs full payment | Client to confirm - currently assuming full payment. |
| WordPress AJAX endpoint for quote email | `/wp-admin/admin-ajax.php?action=livwarm_email_quote` - PHP snippet needed (Session 7B). |

---

## 10. Session Handover Notes

### Sessions 1-6 (June 2026) - Complete

Steps 1-6 built and deployed. Card interaction system built. All step logic confirmed.

### Session 7 / Quote Screen (June 2026) - Complete

Quote screen built. solar-products.json deployed. Finance APR 9.9% confirmed. Loading overlay built.

### Quote Screen Polish Pass (June 2026) - Complete

- Breadcrumb pills hidden on quote screen
- Address line and price breakdown removed from headline block
- Savings stat boxes removed from above cards
- Savings bar added inside tier cards with three figures and "est." suffix
- "or pay in full: £X,XXX" replaces "cash" wording
- "Your price" label added to card price block (1.15rem, bold, red)
- Recommended card border: `1.5px solid rgba(232,50,58,0.55)`
- Navigation dot labels removed, spacing tightened
- "All systems include professional installation and MCS certification" removed

### Card Interaction System Refinements (June 2026) - Complete

- Selected state: neutral grey depression, no red glow, no red dots
- Hover state: matches selected depth, outer shadow fades smoothly via zero-opacity placeholder layers
- Click animation: deeper press at 35% with stronger inset shadow
- Hover shimmer removed - single dark shimmer on click only
- 300ms transitions throughout
- Sub-question reveal delayed until press animation completes

### Session 7A - Upsell Modal + Micro-commitment (June 2026) - Complete

- Upsell modal built with three addon cards
- Addon card interactions match refined answer card system
- Warranty selected state: neutral grey, no red
- BUS grant toggle: green when on, subtle green borders
- Micro-commitment screen built

### Session 7B - Contact Details + Quote Email Capture (June 2026) - NEXT SESSION

Two additions to the original Session 7B scope:
1. Inline finance calculator added to quote screen (Step 7) - expandable, updates per tier
2. "Get your quote emailed to you" lightweight capture added to quote screen (Step 7) - optional, name + email only, sends summary email, pre-populates Step 8
3. Step 8 reframed: heading changed to "Secure your free survey", subheading sets clear expectations, CTA label changed to "Book my free survey →", finance modal removed (calculator already on quote screen)

See roadmap for full prompt.
