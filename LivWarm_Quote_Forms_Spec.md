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
| postcodes.io | Postcode geocoding (lat/long lookup) | Free open-source API. Returns lat/long and town only - no street-level address dropdown. User types house number and street manually after postcode lookup. |
| Stripe | Payment processing | Card, Klarna, Revolut Pay. New account needed for LivWarm. Used for deposit or full payment only - not finance. |
| Shermin Finance (Stax) | Finance application | Confirmed finance provider. Platform is Stax (staxpay.co.uk). Integration method TBC - `// SHERMIN_INTEGRATION_POINT` in code. APR: 9.9% fixed. Loan terms: 36/48/60/84/120/180 months. Deposit cap: 50%. Max loan: £25,000. |
| Payaca | CRM / lead management | Direct API call via WordPress AJAX handler (PHP) on same WP install. |

### Finance calculation

APR: 9.9% fixed. Default term: 180 months (15 years). Deposit cap: 50%. Max loan: £25,000.

```javascript
monthlyRate = 0.099 / 12
monthlyPayment = systemCost × (monthlyRate × (1 + monthlyRate)^months) / ((1 + monthlyRate)^months - 1)
// Round up to nearest £ using Math.ceil
```

### VAT treatment

All prices are shown VAT-inclusive throughout the flow. "All prices include VAT" footnote on booking summary and payment screens.

### Payment model

A physical survey is required before a final price can be confirmed. The payment screen therefore offers four options:

1. **Pay a deposit** - minimum £199 (confirm with client), user can increase up to full system price via slider. Stripe payment element. Balance due on installation day after survey confirms final spec. Deposit is fully refundable if final survey price does not suit the customer.
2. **Pay in full** - Stripe payment element, full system price. Messaging: balance subject to adjustment after survey, difference refunded or invoiced accordingly.
3. **Apply for finance** - Shermin/Stax application. No payment taken. `// SHERMIN_INTEGRATION_POINT`.
4. **I'd like an exact price first** - no payment. Booking held provisionally. Remote survey produces fixed quote within 48 hours. Payment or finance application handled after quote confirmed.

All four paths submit to Payaca. Payment method and amount stored in app state.

---

## 6. Solar Flow - Step by Step

### Overview: 12 steps

Steps 1-8 are complete and deployed at livwarm-quotes.vercel.app/solar.
Steps 9-12 are to build.

Total step count: 12 (updated from 9 - Steps 8-12 restructured for clarity and conversion).

---

### Step 1 - Home Details (Qualifier) - COMPLETE

Data collected: `house_owner_type`, `house_type`, `roof_type`, `house_bedrooms`

---

### Step 2 - Electricity Usage (kWh) - COMPLETE

Data collected: `electricity_usage`

---

### Step 3 - Electricity Tariff - COMPLETE

Data collected: `rate_type`, `day_unit_rate`, `night_unit_rate`

---

### Step 4 - Battery Details - COMPLETE

Data collected: `battery_location`, `battery_location_inside`, `battery_location_outside`

---

### Step 5 - EV Details - COMPLETE

Data collected: `has_ev`, `ev_charging_method`, `ev_plans`

---

### Step 6 - Address & Roof Confirmation - COMPLETE

Generation multipliers by orientation: S=1.00, SE/SW=0.93, E/W=0.82, NE/NW=0.65, N=0.52

CTA: Green "Prepare my quote →" button triggers loading overlay.

Data collected: `postcode`, `address_line1`, `town`, `latlong`, `roof_orientation`, `occupants`

---

### "Preparing Your Quote" Loading Overlay - COMPLETE

6.8 second overlay, 5 messages at 1,200ms each, red progress bar, rotating sun icon.

---

### Step 7 - Your Solar Potential (Quote Screen) - COMPLETE

Tier carousel (Essential / Performance / Custom), savings bar inside cards, inline finance calculator (expandable), optional quote email capture.

Finance calculator carries `paymentMethod` ('finance' or 'cash') and finance selections (`depositAmount`, `loanTermMonths`) forward to Step 11.

Data collected: `product_selection`, `solar_panel_number`, `payment_total`, `paymentMethod`, `depositAmount`, `loanTermMonths`, `quote_email_captured`, `lead_first_name`, `lead_email`

---

### Step 7A - Upsell Modal + Micro-commitment - COMPLETE

Three addon cards: EV Charger enquiry, Extended Warranty (+£199), BUS Heat Pump Grant.

Micro-commitment "Here's your system" screen shows selected system, add-ons under "Added to your system" heading, price block reflecting paymentMethod (cash or finance as hero figure).

Data collected: `warrantyAdded`, `busGrant`, `evChargerEnquiry`

---

### Step 8 - What Happens Next (Motivation screen) - TO BUILD

**Purpose:** Sell the survey before asking for anything. No form fields on this screen.

Single column, centred, max-width 640px.

- Green tick icon (SVG, 48px, #4CAF50) at top, centred
- Headline: "Here's what happens next" - 2rem, bold, #2D2D2D
- Subheading: "Book a free no-obligation survey and our engineers will assess your roof, confirm your panel layout, and give you a final fixed price - with no pressure to proceed." - 1rem, #4A4A4A

Three-step block (the UKEM "What happens next" steps - these are the confirmed process):
1. **Provisional booking** - We reserve your preferred slot
2. **Remote survey** - Our experts verify your design using satellite imagery (no home visit needed)
3. **Final confirmation** - We confirm the system fits your needs and lock in the price

Style: three cards in a row (stacks on mobile), each with a numbered red circle, bold label, small grey description. Subtle border around each card.

Slim system reminder bar below the three steps:
- Shows tier name + panel count + price (cash or monthly depending on paymentMethod)
- Background: #F8F8F8, border: 1px solid #E5E5E5, border-radius 8px, padding 12px 20px
- No sticky summary column - this screen is motivation only

CTA: "Book my free survey →" - solid red pill, max-width 380px, centred

No back button restriction - back returns to micro-commitment screen.

---

### Step 9 - Your Details - TO BUILD

**Purpose:** Contact details capture only. One job, nothing else.

Single column, centred, max-width 560px.

- Heading: "Your details" - 1.75rem, bold, #2D2D2D
- Subheading: "We'll use these to confirm your booking and send your survey report." - 1rem, #4A4A4A

Four fields:
- First name (half width) - pre-populate from `lead_first_name` if `quote_email_captured`
- Surname (half width, same row)
- Email address (full width) - pre-populate from `lead_email` if `quote_email_captured`
- Phone number (full width)

Field styling: border 1px solid #E5E5E5 default, 2px solid #E8323A on focus, border-radius 8px, padding 12px 16px, font-size 1rem minimum.

Slim system reminder bar (same as Step 8) above the form fields.

CTA: "Continue →" - solid red pill, max-width 380px, centred. Disabled until all fields non-empty, email valid format, phone valid UK format.

Data collected: `full_name`, `email`, `phone`

---

### Step 10 - Preferred Survey Date - TO BUILD

**Purpose:** Date selection only. Calendar given full space to breathe.

Single column, centred, max-width 560px.

- Heading: "Choose a preferred survey date" - 1.75rem, bold, #2D2D2D
- Subheading: "Weekdays only. Our team will confirm your slot within 24 hours - you can reschedule any time." - 1rem, #4A4A4A

Custom calendar picker - full width of content block:
- Monthly grid, weekdays only (Saturday and Sunday cells muted: opacity 0.3, cursor not-allowed)
- Selected date: red circle, white text
- Today's date: subtle red outline, no fill (unless selected)
- Month navigation: left/right chevron arrows
- Earliest selectable date: 14 days from today
- Auto-advances to first month with 5+ selectable weekdays on mount
- Selected date stored as `preferred_date` (ISO format YYYY-MM-DD)

Slim system reminder bar above the calendar.

CTA: "Continue →" - solid red pill, max-width 380px, centred. Disabled until date selected.

Data collected: `preferred_date`

---

### Step 11 - Payment Options - TO BUILD

**Purpose:** Four-path payment screen. Honest, low-pressure, matches the process reality.

Single column, centred, max-width 640px.

- Heading: "How would you like to proceed?" - 1.75rem, bold, #2D2D2D
- Subheading: "Your slot is provisionally held. Choose how you'd like to secure it." - 1rem, #4A4A4A

Slim system reminder bar at top (same pattern as Steps 8-10).

Four option cards below - use the existing answer card interaction system (raised shadow, press animation, selected state neutral grey). Cards do NOT auto-advance - they expand inline on selection. Only one card selected at a time.

**Card 1 - Pay a deposit**
Label: "Pay a deposit to secure your slot"
Sublabel: "Fully refundable if the final survey price doesn't suit you"
Badge: "Most flexible"
When selected, expands to show:
- Deposit amount slider: minimum £199, maximum = full system price, £50 steps
- Show deposit amount large and bold, percentage of system price in grey below
- "Balance of £{remainder} due on installation day" - 0.875rem, #4A4A4A
- Stripe Payment Element (Card, Klarna, Revolut Pay)
- `// STRIPE_INTEGRATION_POINT`
- CTA: "Pay £{depositAmount} deposit →"

**Card 2 - Pay in full**
Label: "Pay in full today"
Sublabel: "Lock in your price - any adjustment after survey is refunded"
Badge: "Best value" (only show if paymentMethod === 'cash' from finance modal)
When selected, expands to show:
- System price large and bold
- "All prices include VAT" footnote
- Stripe Payment Element
- `// STRIPE_INTEGRATION_POINT`
- CTA: "Pay £{systemPrice} →"

**Card 3 - Spread the cost with finance**
Label: "Spread the cost with finance"
Sublabel: "Apply now for an instant decision - no payment today"
Badge: "From £{monthlyPayment}/mo" (uses finance selections from Step 7 if set, otherwise default 180 months 0% deposit)
When selected, expands to show:
- Summary of finance terms selected at Step 7 (or default if not set): monthly payment, term, APR, total repayable
- "Edit finance terms" link - re-opens finance calculator inline (same component as Step 7)
- FCA representative example (updates live if terms edited)
- `// SHERMIN_INTEGRATION_POINT`
- Placeholder: "Finance applications will open shortly. Call 0800 222 9494."
- CTA: "Submit finance application →" (placeholder - disabled with tooltip until Shermin live)

**Card 4 - I'd like an exact price first**
Label: "I'd like an exact price before committing"
Sublabel: "We'll complete your remote survey and send a fixed quote within 48 hours"
Badge: "No payment today"
When selected, expands to show:
- "Your slot is provisionally held for 48 hours."
- "Once you receive your fixed quote, you can pay online or apply for finance."
- No payment element
- CTA: "Hold my slot provisionally →"

All four CTAs submit to Payaca on success and advance to Step 12.
`paymentOption` stored in app state: 'deposit' / 'full' / 'finance' / 'provisional'
`paymentAmount` stored for deposit and full payment paths.

"Your booking is secure" trust line with padlock icon below the cards.
"Payments are securely processed by Stripe. No card details are stored by LivWarm." - 0.75rem, #999, below Stripe cards only.

---

### Step 12 - Confirmation - TO BUILD

No progress bar - flow complete.

- Green tick animation on load (SVG, 64px, #4CAF50)
- Headline: "You're all booked in!" - 2.25rem, bold
- System summary: tier name, panel count, battery, preferred date
- Payment confirmation line (conditional on paymentOption):
  - deposit: "Deposit of £{amount} paid. Balance due on installation day."
  - full: "Payment of £{amount} confirmed."
  - finance: "Finance application submitted. You'll receive a decision within 24 hours."
  - provisional: "Your slot is provisionally held. Fixed quote on its way within 48 hours."
- "What happens next?" three-step: survey within 48hrs / MCS paperwork / Installation day
- "A confirmation has been sent to {email}"
- LivWarm contact: 0800 222 9494, info@livwarm.co.uk
- QR code section: placeholder for Payaca follow-up photo submission

On mount: POST all app state to WordPress AJAX endpoint `/wp-admin/admin-ajax.php?action=livwarm_solar_lead` → Payaca.

---

## 7. Payaca Integration

Payload for Solar (form ID 3) - see payaca_webhook.txt for full PHP implementation.

Additional fields to map:
- `quote_email_captured` - bool, whether user submitted email at Step 7
- `lead_first_name` - captured at Step 7 email prompt if submitted
- `lead_email` - captured at Step 7 email prompt if submitted (may differ from Step 9 email)
- `warrantyAdded` - bool
- `busGrant` - bool
- `evChargerEnquiry` - bool
- `paymentMethod` - 'finance' or 'cash'
- `paymentOption` - 'deposit' / 'full' / 'finance' / 'provisional'
- `paymentAmount` - amount paid (deposit or full), 0 for finance/provisional paths
- `depositAmount` - deposit slider value from Step 7 finance calculator
- `loanTermMonths` - loan term from Step 7 finance calculator

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
| Minimum deposit amount | £199 assumed - confirm with client. |
| IBrand font licence | Confirm web embedding covered. |
| Google Maps API key | Remove Vercel restriction before production. |
| WordPress AJAX endpoint for quote email | `/wp-admin/admin-ajax.php?action=livwarm_email_quote` - PHP snippet needed in Session 12. |

---

## 10. Session Handover Notes

### Sessions 1-6 (June 2026) - Complete

Steps 1-6 built and deployed. Card interaction system built. All step logic confirmed.

### Session 7 / Quote Screen (June 2026) - Complete

Quote screen built. solar-products.json deployed. Finance APR 9.9% confirmed. Loading overlay built.

### Quote Screen Polish Pass (June 2026) - Complete

- Breadcrumb pills hidden on quote screen
- Address line and price breakdown removed from headline block
- Savings bar added inside tier cards with three figures and "est." suffix
- "or pay in full: £X,XXX" replaces "cash" wording
- "Your price" label added to card price block
- Recommended card border: `1.5px solid rgba(232,50,58,0.55)`

### Session 7A - Upsell Modal + Micro-commitment (June 2026) - Complete

- Upsell modal built with three addon cards
- "Added to your system" heading added above extras section
- Micro-commitment screen reflects paymentMethod (cash vs finance hero figure)

### Session 7B + Polish (June 2026) - Complete

- Finance modal built with savings section, FCA example, deposit slider, term pills
- Finance modal content reordered: savings above FCA example
- paymentMethod state ('finance'/'cash') carried through to micro-commitment and booking summary
- Step 8 built as two-column contact + calendar + booking summary
- Multiple polish passes: booking summary images, savings styling, calendar auto-advance, card fixes

### Flow Restructure (June 2026)

Steps 8-12 restructured from original 9-step plan. Rationale: Step 8 was overloaded. Payment model revised - deposit/full/finance/provisional options replace single Stripe payment. New structure:

- Step 8: What happens next (motivation only)
- Step 9: Your details
- Step 10: Preferred survey date
- Step 11: Payment options (four paths)
- Step 12: Confirmation

Total steps updated from 9 to 12. Progress bar denominator needs updating in code.

### Next session: Session 8A - Restructure current Step 8

See roadmap for prompt.
