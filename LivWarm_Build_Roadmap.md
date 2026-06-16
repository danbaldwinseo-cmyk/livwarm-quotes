# LivWarm Quote Forms - Build Roadmap

_Last updated: June 2026. Companion to LivWarm_Quote_Forms_Spec.md._

---

## How to Use This Document

Each session has a Goal, Pre-session checks, Prompt, and Done when criteria.

**Golden rule:** One session = one goal. Commit when done.

**Where sessions happen:**
- Pre-build planning: this Claude Project (Sonnet)
- Build sessions: Claude Code in VS Code (Opus)

---

## Important: Prompt Currency

- Total steps: 13
- Postcode lookup: postcodes.io (free, no API key)
- Landlord is NOT a dead-end
- No Continue buttons on card-based screens - auto-advance after 500ms
- Finance: 9.9% APR, default 180 months, Math.ceil, deposit cap 50%, min £199
- paymentMethod ('finance'/'cash') set in Step 8 finance modal, carried through
- Payment model: four options on Step 12 (deposit/full/finance/provisional)
- Card interaction system: answer cards only (Steps 1-7). PRESS_MS=80, SELECT_HOLD_MS=500 - never change.
- Payment option cards (Step 12): completely different system - white bg, dark border selected, no depression
- No slim system reminder bar on Steps 9-13
- Shimmer fixed and working on all answer cards
- Occupancy card double animation fixed
- All prices VAT-inclusive
- All currency: £X,XXX with commas, no decimals
- No em dashes - hyphens only
- UK English throughout

---

## Completed Sessions

### Sessions 1-7A - COMPLETE

Steps 1-7 and upsell/micro-commitment built. Full card interaction system. Finance modal with savings, FCA example, deposit slider, term pills, "Update quote →" button, persisted settings.

### Steps 8-12 + Fixes - COMPLETE

Flow restructured to 13 steps. Steps 9-12 built and deployed. Animation fixes applied. Three-step cards widened. Payment option cards styled.

---

## Next Sessions

---

### Session: Add Step 2 - Roof Tile Type - NEXT

**Goal:** Insert new Step 2 (roof tile type) between current Step 1 and current Step 3. Update progress bar to 13.

**Pre-session checks:**
- All previous work committed and pushed
- Read spec Section 6 Step 2 before starting

**Prompt:**

```
Read LivWarm_Quote_Forms_Spec.md fully before starting.
Add one new step only. Do not touch any other screen.

NEW STEP 2 - ROOF TILE TYPE

Insert a new step between the current Step 1 (home details /
qualifier) and the current Step 3 (electricity usage / kWh).
All existing steps from current Step 3 onwards shift up by one.
Update the progress bar denominator from 12 to 13.

---

STEP CONTENT

Progress bar: Step 2 of 13. Label: "Roof type".

Question heading: "What type of roof tiles do you have?"
font-size: 2rem, bold, #2D2D2D, centred.

Subheading: "This affects the fixings and mountings we use
during installation."
font-size: 1rem, #4A4A4A, centred.

Four answer cards in a 2x2 grid (same layout as house type
cards on Step 1), using the existing answer card interaction
system (raised shadow, press animation, neutral grey selected
state, shimmer on click, auto-advance after 500ms):

Card 1: "Standard"
Card 2: "Rosemary"
Card 3: "Slate"
Card 4: "I don't know"

Use simple inline SVG placeholders for icons (48px, #E8323A
for tile icons, #4A4A4A for question mark). No external assets.

No dead-ends - all four options continue the flow.

Data collected: roof_tile_type
Values: 'standard' / 'rosemary' / 'slate' / 'unknown'

Store in app state as roof_tile_type. Add to breadcrumb pills.
Add to Payaca fData payload alongside existing solar fields.

PRESS_MS = 80, SELECT_HOLD_MS = 500 - do not change.
All CSS variables in :root - never hardcode colours.
Do not change any other step, any existing card, or any
shared component.
```

**Done when:** Step 2 of 13 shows in progress bar. Four tile cards render and auto-advance. roof_tile_type stored in app state. Back navigation works. All other steps unaffected.

---

### Session: Step 13 - Confirmation + Payaca PHP - TO BUILD

**Goal:** Confirmation screen and server-side lead handoff to Payaca.

**Pre-session checks:**
- Step 2 tile question complete and committed
- Payaca credentials in payaca_webhook.txt confirmed
- Stripe account set up (or confirm using placeholder)

**Prompt:**

```
Read LivWarm_Quote_Forms_Spec.md fully before starting.
Steps 1-12 are complete. Build Step 13 (confirmation) and
the Payaca PHP integration only.

CONTEXT:
- No progress bar on Step 13 - flow is complete
- All lead data in app state: full_name, email, phone,
  preferred_date, postcode, address_line1, town, latlong,
  roof_orientation, occupants, house_owner_type, house_type,
  roof_type, roof_tile_type, house_bedrooms, electricity_usage,
  day_unit_rate, night_unit_rate, rate_type, battery_location,
  battery_location_inside, battery_location_outside, has_ev,
  ev_charging_method, ev_plans, solar_panel_number,
  product_selection, payment_total, warrantyAdded, busGrant,
  evChargerEnquiry, paymentMethod, paymentOption, paymentAmount,
  depositAmount, loanTermMonths, quote_email_captured,
  lead_first_name, lead_email

STEP 13 - CONFIRMATION

Single column, max-width 560px, centred. No progress bar.

- Green tick animation (SVG, 64px, #4CAF50, draw 600ms)
- "You're all booked in!" - 2.25rem, bold, centred
- System summary card (white, 1px #E5E5E5, border-radius 12px,
  padding 20px 24px):
  - Tier name + panel count + battery name
  - "Preferred date: {preferred_date as 'Day D Month YYYY'}"
  - Payment confirmation line (conditional on paymentOption):
    deposit: "Deposit of £{paymentAmount} paid. Balance due on
    installation day."
    full: "Payment of £{paymentAmount} confirmed."
    finance: "Finance application submitted. Decision within
    24 hours."
    provisional: "Slot provisionally held. Fixed quote within
    48 hours."

- "What happens next?" three-step block (same card style as
  Step 9 - reuse the component):
  1. Survey within 48 hours
  2. MCS paperwork and final design
  3. Installation day

- "A confirmation has been sent to {email}" - 0.875rem, centred
- Contact: 0800 222 9494 / info@livwarm.co.uk

- QR code placeholder (white card, 1px #E5E5E5, border-radius
  12px, padding 20px):
  Heading: "Submit your property photos"
  Text: "Our team will send you a link to upload photos of your
  roof and consumer unit. This helps us complete your remote
  survey faster."
  Placeholder: grey box 120x120px, label "QR code"

PAYACA INTEGRATION:

On Step 13 mount, POST to:
/wp-admin/admin-ajax.php?action=livwarm_solar_lead

Provide the PHP snippet to paste into WordPress Code Snippets.
The snippet must:
- Create a customer in Payaca
- Create a project under that customer with all fData fields
  including roof_tile_type, warrantyAdded, busGrant,
  evChargerEnquiry, paymentMethod, paymentOption, paymentAmount,
  depositAmount, loanTermMonths, quote_email_captured,
  lead_first_name, lead_email
- Encrypt projectId and set allowUserSubmissionDate (72 hours)
  as per existing payaca_webhook.txt pattern

Also provide the PHP snippet for the quote email endpoint:
- Endpoint: /wp-admin/admin-ajax.php?action=livwarm_email_quote
- Receives: first_name, email, product_selection,
  solar_panel_number, payment_total, tier_name
- Creates partial Payaca lead (customer + project stub)
- Sends summary email via wp_mail()
```

**Done when:** Full journey Steps 1-13 creates customer and project in Payaca. Confirmation screen displays correctly for all four paymentOption values. Both PHP snippets ready to paste into Code Snippets.

---

### Session: Polish + Mobile + Deploy - TO BUILD

**Goal:** Final polish, mobile testing, WordPress staging deployment.

**Prompt:**

```
Read LivWarm_Quote_Forms_Spec.md fully before starting.
Solar flow build is complete. Polish session only.

Goals:
1. Test full flow on mobile (375px upward) - fix layout issues
2. Steps 9-12 single-column layouts correct on all screen sizes
3. Carousel cards swipeable on touch
4. Finance calculator and payment cards keyboard accessible
5. Accessibility basics - focus states, alt text, colour contrast
6. Set up WordPress staging deployment via Code Snippets plugin
7. Remove Vercel domain restriction from Google Maps API key
8. Document any final TBC items

No new features. Polish only.
```

**Done when:** Solar flow live on WordPress staging, mobile-responsive to 375px, ready for client review.

---

## Subsequent Flows

Once solar is approved:

- **EV Charger:** 2-3 sessions
- **Heat Pump / ASHP:** 3-4 sessions
- **Boiler Upgrade:** 4-5 sessions

Steps 9-13 (motivation through confirmation) are shared logic - extract to shared component before building the second flow.

---

## Roadmap Maintenance

At the end of every build session, ask Claude Code:

```
Write a session handover note covering: what was completed,
what was not, any TBC items raised, and what the next session
should focus on. Add it to Section 10 of the spec document.
```
