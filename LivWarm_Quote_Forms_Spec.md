# LivWarm Quote Forms - Master Spec Document

_Last updated: June 2026. This document is the single source of truth for the build. All sessions start here._

---

## 1. Project Overview

LivWarm (livwarm.co.uk) is an affiliate of UKEM (UK Energy Management Group). This project rebuilds the four affiliate quote flows from scratch as a single React SPA, replacing the underperforming Cornerstone/WordPress forms at deals.livwarm.co.uk.

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
| Session approach | Short focused sessions, one goal per session |
| Model | Opus in Claude Code (VS Code), Sonnet in Project chat |

---

## 3. Brand & Styling

### Colours

```css
--color-primary: #E8323A;
--color-primary-light: #F05A5F;
--color-cta-green: #4CAF50;
--color-dark: #2D2D2D;
--color-body: #4A4A4A;
--color-grey-bg: #3D3D3D;
--color-white: #FFFFFF;
--color-card-bg: #F8F8F8;
--color-border: #E5E5E5;
--color-selected: #E8323A;
```

### Typography

- Brand font: IBrand (woff2, woff, ttf in /fonts/)
- Fallback: 'IBrand', 'Nunito', sans-serif
- Minimum font size: 16px everywhere including inputs

### Answer Card Interaction System (Steps 1-7 only)

- Default: raised shadow, light background, dot texture lower-right
- Hover: sinks to selected depth, outer shadow fades via zero-opacity placeholder layers
- Click: two-beat punch-and-rise, single dark shimmer sweep (shimmer-sweep-click keyframe). Fixed and working.
- Selected: neutral grey depression - background #e8e8e8, border 1px solid rgba(0,0,0,0.10), inset shadow, translateY(1px), label bold. No red glow, no red dots.
- Unselected (after selection): 60% opacity, desaturated
- PRESS_MS = 80, SELECT_HOLD_MS = 500 - never change these
- 300ms transitions throughout

### Payment Option Cards (Step 12 only)

Completely different system from answer cards - do not cross-contaminate.

- Default: white bg, 1px solid #EEEEEE, box-shadow 0 2px 8px rgba(0,0,0,0.07)
- Hover: shadow 0 3px 12px rgba(0,0,0,0.10), border #E0E0E0
- Selected: white bg, 1.5px solid #2D2D2D, same shadow, no depression, no tint
- Expand inline on selection, collapse when another selected
- No auto-advance - user clicks CTA inside expanded card
- Gap between cards: 14px

### Continue Button

Solid red pill, max-width 380px, centred, no red glow.

### "Prepare My Quote" Button (end of Step 7 only)

Background: #4CAF50 green, white text, label "Prepare my quote →". Only green button in flow.

### Layout

- Content block max-width: 1100px centred
- Two-card layouts: max-width 860px centred
- Step 9 three-step card row: max-width 860px centred
- No Continue on card-based screens - auto-advance after 500ms
- Steps 9-13: single column, centred, no slim system reminder bar

### Step 9 Three-Step Cards

- Container: max-width 860px
- Card: white, no border, border-radius 16px, box-shadow 0 6px 20px rgba(0,0,0,0.10) + 0 2px 6px rgba(0,0,0,0.06), padding 32px 28px, min-height 200px, flex-grow 1, gap 20px
- Step label: 1.5rem, bold, #E8323A
- Title: 1.125rem, bold, #2D2D2D
- Divider: 1px solid #E5E5E5
- Description: 1rem, #4A4A4A, line-height 1.5

---

## 4. Architecture

```
livwarm-quotes/
├── fonts/
├── solar/
│   ├── index.html
│   └── solar-products.json
├── ev/
├── heatpump/
├── boiler/
└── shared/
```

WordPress custom post type slug: prod. REST API: https://deals.livwarm.co.uk/wp-json/wp/v2/prod.

---

## 5. Third-Party APIs & Integrations

| Service | Purpose | Notes |
|---------|---------|-------|
| Google Maps JavaScript API | Satellite map | Already licensed |
| postcodes.io | Postcode geocoding | Free, no API key |
| Stripe | Deposit and full payment | New account needed. // STRIPE_INTEGRATION_POINT |
| Shermin Finance (Stax) | Finance application | 9.9% APR, terms 36-180 months. // SHERMIN_INTEGRATION_POINT |
| Payaca | CRM / lead management | WordPress AJAX handler |

### Finance calculation

```javascript
monthlyRate = 0.099 / 12
monthlyPayment = Math.ceil(financeAmount * (monthlyRate * (1+monthlyRate)^months) / ((1+monthlyRate)^months - 1))
```

Default 180 months. Deposit cap 50%. Min deposit £199 (TBC). Max loan £25,000.

### Payment model - four paths (Step 12)

1. Pay a deposit - min £199, max 50%, £50 steps. Stripe. Fully refundable.
2. Pay in full - Stripe. Adjustment after survey refunded/invoiced.
3. Apply for finance - Shermin. "Finance coming soon" modal placeholder until go-live.
4. I'd like an exact price first - no payment, provisional hold, quote within 48 hours.

---

## 6. Solar Flow - Step by Step

### Overview: 13 steps total

Steps 1, 3-12 complete. Step 2 (roof tile type) to build. Step 13 (confirmation) to build.

---

### Step 1 - Home Details (Qualifier) - COMPLETE

Data: house_owner_type, house_type, roof_type, house_bedrooms

---

### Step 2 - Roof Tile Type - TO BUILD

Question: "What type of roof tiles do you have?"
Subheading: "This affects the fixings and mountings we use during installation."

Four answer cards (2x2 grid), auto-advance 500ms:
- Standard
- Rosemary
- Slate
- I don't know

No dead-ends on any option.

Data: roof_tile_type ('standard' / 'rosemary' / 'slate' / 'unknown')

---

### Step 3 - Electricity Usage (kWh) - COMPLETE

Data: electricity_usage

---

### Step 4 - Electricity Tariff - COMPLETE

Data: rate_type, day_unit_rate, night_unit_rate

---

### Step 5 - Battery Details - COMPLETE

Data: battery_location, battery_location_inside, battery_location_outside

---

### Step 6 - EV Details - COMPLETE

Data: has_ev, ev_charging_method, ev_plans

---

### Step 7 - Address & Roof Confirmation - COMPLETE

Data: postcode, address_line1, town, latlong, roof_orientation, occupants

CTA: Green "Prepare my quote →" triggers loading overlay.

---

### Loading Overlay - COMPLETE

6.8 seconds, 5 messages, red progress bar, rotating sun icon.

---

### Step 8 - Quote Screen - COMPLETE

Tier carousel (Essential / Performance / Custom), savings bar inside cards.

Finance modal: Pay monthly/Pay in full toggle. Deposit slider 0-50%, £500 steps. Term pills 36/48/60/84/120/180 months (default 180). 9.9% APR. Savings section above FCA example. Button "Update quote →" writes monthly figure back to quote screen. Reopens with persisted settings.

Optional quote email capture below finance calculator.

Data: product_selection, solar_panel_number, payment_total, paymentMethod, depositAmount, loanTermMonths, quote_email_captured, lead_first_name, lead_email

---

### Step 8A - Upsell Modal + Micro-commitment - COMPLETE

Three addon cards: EV Charger enquiry, Extended Warranty (+£199), BUS Heat Pump Grant.
"Added to your system" heading above extras.
Price block reflects paymentMethod.

Data: warrantyAdded, busGrant, evChargerEnquiry

---

### Step 9 - What Happens Next (Motivation) - COMPLETE

Single column, max-width 640px, all centred. Green tick, headline, subheading.

Three-step cards (860px container):
1. Step 1 / Provisional booking / We reserve your preferred slot
2. Step 2 / Remote survey / Our experts verify your design using satellite imagery (no home visit needed)
3. Step 3 / Final confirmation / We confirm your installation date and lock in the final price

CTA: "Book my free survey →"

---

### Step 10 - Your Details - COMPLETE

Single column, max-width 560px, centred. First name, surname, email, phone.
Pre-populates from lead_first_name / lead_email if quote_email_captured.

Data: full_name, email, phone

---

### Step 11 - Installation Date - COMPLETE

Heading: "When would you like your panels installed?"
Subheading: "Pick your ideal installation date and we'll pencil it in. We'll carry out a quick remote survey first to confirm your system is right for your home - if anything needs adjusting, we'll agree a revised date with you before anything is confirmed."

Calendar: weekdays only, 14-day minimum, auto-advances to first month with 5+ selectable dates.

Data: preferred_date (YYYY-MM-DD)

---

### Step 12 - Payment Options - COMPLETE

Four expandable option cards (payment card interaction system - not answer cards).

Card 1: Pay a deposit - slider min £199, max 50% system price, £50 steps. Stripe placeholder. // STRIPE_INTEGRATION_POINT
Card 2: Pay in full - Stripe placeholder. // STRIPE_INTEGRATION_POINT
Card 3: Finance - "YOUR FINANCE SELECTION" header, finance summary from app state, "Edit finance terms →" inline, FCA example, "Submit finance application →" solid red pill triggers "Finance coming soon" modal. // SHERMIN_INTEGRATION_POINT
Card 4: Provisional - "Hold my slot provisionally →"

Stripe security note only visible inside expanded Cards 1/2.

Data: paymentOption ('deposit'/'full'/'finance'/'provisional'), paymentAmount

---

### Step 13 - Confirmation - TO BUILD

No progress bar.

- Green tick animation (64px, #4CAF50, 600ms draw)
- "You're all booked in!" - 2.25rem, bold, centred
- System summary card: tier, panels, battery, preferred date
- Payment confirmation line (conditional on paymentOption):
  - deposit: "Deposit of £{amount} paid. Balance due on installation day."
  - full: "Payment of £{amount} confirmed."
  - finance: "Finance application submitted. Decision within 24 hours."
  - provisional: "Slot provisionally held. Fixed quote within 48 hours."
- "What happens next?" three-step block (same card style as Step 9):
  1. Survey within 48 hours
  2. MCS paperwork and final design
  3. Installation day
- "A confirmation has been sent to {email}"
- Contact: 0800 222 9494 / info@livwarm.co.uk
- QR code placeholder: "Submit your property photos"

On mount: POST all app state to /wp-admin/admin-ajax.php?action=livwarm_solar_lead

---

## 7. Payaca Integration

All fields map to fData. See payaca_webhook.txt for PHP implementation.

Fields to map:
- house_owner_type, house_type, roof_type, house_bedrooms
- roof_tile_type (new - Step 2)
- electricity_usage, rate_type, day_unit_rate, night_unit_rate
- battery_location, battery_location_inside, battery_location_outside
- has_ev, ev_charging_method, ev_plans
- postcode, address_line1, town, latlong, roof_orientation, occupants
- product_selection, solar_panel_number, payment_total
- quote_email_captured, lead_first_name, lead_email
- warrantyAdded, busGrant, evChargerEnquiry
- paymentMethod, paymentOption, paymentAmount
- depositAmount, loanTermMonths
- preferred_date

---

## 8. Dead-End Rules

| Condition | Action |
|-----------|--------|
| Flat (property type) | Redirect to /sorry-we-cannot-help |
| Flat roof | Redirect to /sorry-we-cannot-help |
| Landlord | Continues - NOT a dead-end |

---

## 9. Outstanding TBC Items

| Item | Action needed |
|------|--------------|
| Shermin Finance integration | TBC - SHERMIN_INTEGRATION_POINT in code |
| VAT inclusivity | Assumed 5% inclusive - confirm |
| LivWarm vs UKEM pricing discrepancy | £194 gap unresolved |
| Panel wattage 445W vs 450W | Unconfirmed |
| Stripe account | Not yet set up for LivWarm |
| Minimum deposit amount | £199 assumed - confirm with client |
| IBrand font licence | Confirm web embedding covered |
| Google Maps API key | Remove Vercel restriction before production |
| WordPress AJAX endpoint for quote email | PHP snippet needed in Session 9 |

---

## 10. Session Handover Notes

### Sessions 1-7A (June 2026) - Complete

Steps 1-7 and upsell/micro-commitment built. Card interaction system built and refined. Finance modal built with savings, FCA example, deposit slider, term pills. "Update quote →" writes monthly to quote screen. Modal persists selections on reopen.

### Steps 8-12 + Animation Fixes (June 2026) - Complete

Flow restructured to 13 steps. Steps 9-12 built. Shimmer animation restored globally. Occupancy card double animation fixed. Three-step cards widened to 860px with proportional fonts. Payment cards use separate interaction system from answer cards. Installation date wording updated.

### Next session: Step 2 (roof tile type) + Step 13 (confirmation + Payaca PHP)

See roadmap for prompts.
