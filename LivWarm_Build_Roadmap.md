# LivWarm Quote Forms - Build Roadmap

_Last updated: June 2026. Companion to LivWarm_Quote_Forms_Spec.md._

---

## How to Use This Document

Each session has:
- **Goal** - the single deliverable for that session
- **Pre-session checks** - what you need ready before starting
- **Prompt** - paste this into Claude Code to start the session
- **Done when** - clear criteria for ending the session

**Golden rule:** One session = one goal. When the goal is met, save, commit, end the session.

**Where each session happens:**
- Pre-build sessions: this Claude Project (Sonnet)
- Build sessions: Claude Code in VS Code (Opus)

---

## Important: Prompt Currency

Key decisions reflected in all prompts:

- Total steps is now 12 (restructured from 9 - see spec Section 10)
- No Solar API - panel sizing uses lookup table
- Postcode lookup uses postcodes.io (free, no API key needed)
- Landlord is NOT a dead-end
- No Continue buttons on card-based screens - auto-advance after 500ms
- Finance APR is 9.9%, default 180 months, Math.ceil on monthly payment
- All prices VAT-inclusive, "All prices include VAT" footnote on booking and payment screens
- Finance calculator is on the quote screen (Step 7) as an inline expandable section
- paymentMethod state ('finance' or 'cash') set in Step 7 finance modal, carried through all subsequent screens
- Card interaction system: neutral grey selected state, hover matches selected depth, 300ms transitions, outer shadow fades via zero-opacity placeholder layers, single dark shimmer on click only
- PRESS_MS = 80, SELECT_HOLD_MS = 500 - do not change
- Sub-question reveal delayed until press animation completes (Battery, EV steps)
- Shermin confirmed provider (Stax). `// SHERMIN_INTEGRATION_POINT` in code.
- Stripe for deposit and full payment only. `// STRIPE_INTEGRATION_POINT` in code.
- Minimum deposit: £199 (TBC with client)
- Payment model: four options on Step 11 (deposit / full / finance / provisional)

---

## Pre-Build Phase - COMPLETE

### Pre-Session A - COMPLETE
### Pre-Session B - COMPLETE

---

## Build Phase

---

### Sessions 1-5 - COMPLETE

Steps 1-5 built. Card interaction system built and refined.

---

### Session 6 - COMPLETE

Step 6 built: postcode lookup, satellite map, orientation compass, occupancy.

---

### Session 7 / Quote Screen - COMPLETE

Quote screen built. solar-products.json deployed. Loading overlay built. Finance modal built with savings, FCA example, deposit slider, term pills. paymentMethod state introduced.

---

### Session 7A - Upsell Modal + Micro-commitment - COMPLETE

Upsell modal and micro-commitment screen built. "Added to your system" heading on extras. paymentMethod reflected in price block.

---

### Session 7B + Polish Passes - COMPLETE

Finance modal savings reordered. Booking summary restored. Calendar auto-advance. Multiple fixes applied. See spec Section 10 for full list.

---

### Session 8A: Restructure Current Step 8 into Steps 8-10 - NEXT SESSION

**Goal:** Replace the existing single Step 8 screen with three focused screens: motivation (Step 8), details (Step 9), and calendar (Step 10). Update the progress bar denominator to 12.

**Pre-session checks:**
- All previous sessions committed and deployed to Vercel
- Read spec Section 6 Steps 8, 9, 10 fully before starting

**Prompt:**

```
Read LivWarm_Quote_Forms_Spec.md fully before starting. Steps 1-7 and 7A are
complete. The current Step 8 is a single two-column screen with contact details,
calendar, and booking summary. This session replaces it entirely with three
focused screens. Do not touch any screen before the current Step 8.

IMPORTANT CONTEXT:
- Total steps is now 12 - update the progress bar denominator from 9 to 12
- PRESS_MS = 80, SELECT_HOLD_MS = 500 - do not change
- paymentMethod state ('finance' or 'cash') is already in app state from Step 7
- warrantyAdded, busGrant, evChargerEnquiry already in app state from Step 7A
- depositAmount, loanTermMonths already in app state from Step 7 finance modal
- All CSS variables in :root - never hardcode colours
- Content block max-width 1100px
- Continue button: solid red pill, auto width, max 380px, centred, no red glow
- All currency: £X,XXX with commas, no decimals

SLIM SYSTEM REMINDER BAR (used on Steps 8, 9, 10):
A compact bar shown above the content on each of these three screens.
Background: #F8F8F8, border: 1px solid #E5E5E5, border-radius: 8px,
padding: 12px 20px, margin-bottom: 24px, max-width: 560px, centred.
Content: tier name + panel count (0.875rem, #4A4A4A) on left, price on right.
Price display: IF paymentMethod === 'finance': "£{monthly}/mo" (red, bold)
              IF paymentMethod === 'cash': "£{systemPrice}" (dark, bold)
No images, no savings figures - compact reference only.

---

NEW STEP 8 - WHAT HAPPENS NEXT (replaces existing Step 8 entirely)

Progress bar: Step 8 of 12. Label: "What's next".

Single column, centred, max-width 640px.

Slim system reminder bar at top.

Green tick icon (SVG, 48px, #4CAF50), centred, margin-bottom 16px.
Headline: "Here's what happens next" - 2rem, bold, #2D2D2D, centred.
Subheading: "Book a free no-obligation survey. Our engineers will assess
your roof, confirm your panel layout, and give you a final fixed price -
with no pressure to proceed." - 1rem, #4A4A4A, centred, max-width 480px.

Three-step cards (row on desktop, stacked on mobile), margin-top 32px:
Each card: white bg, 1px solid #E5E5E5, border-radius 12px, padding 20px,
flex-grow 1.
  Card 1: red circle "1", bold "Provisional booking",
           grey "We reserve your preferred slot"
  Card 2: red circle "2", bold "Remote survey",
           grey "Our experts verify your design using satellite imagery
           (no home visit needed)"
  Card 3: red circle "3", bold "Final confirmation",
           grey "We confirm the system fits your needs and lock in the price"

CTA: "Book my free survey →" - solid red pill, max-width 380px, centred,
margin-top 32px.

---

NEW STEP 9 - YOUR DETAILS

Progress bar: Step 9 of 12. Label: "Your details".

Single column, centred, max-width 560px.

Slim system reminder bar at top.

Heading: "Your details" - 1.75rem, bold, #2D2D2D.
Subheading: "We'll use these to confirm your booking and send your
survey report." - 1rem, #4A4A4A.

Four fields, margin-top 24px:
Row 1: First name (half width) | Surname (half width)
Row 2: Email address (full width)
Row 3: Phone number (full width)

Pre-populate first name from lead_first_name if quote_email_captured = true.
Pre-populate email from lead_email if quote_email_captured = true.

Field styling:
- Border: 1px solid #E5E5E5 default, 2px solid #E8323A on focus
- Border-radius: 8px, padding: 12px 16px, font-size: 1rem (16px minimum)
- Label above each field: 0.875rem, font-weight 500, #2D2D2D

CTA: "Continue →" - solid red pill, max-width 380px, centred, margin-top 24px.
Disabled until all four fields non-empty, email valid format,
phone valid UK format (basic: 10-11 digits, optional leading +44).

On advance: store full_name (first + surname), email, phone in app state.

---

NEW STEP 10 - PREFERRED SURVEY DATE

Progress bar: Step 10 of 12. Label: "Survey date".

Single column, centred, max-width 560px.

Slim system reminder bar at top.

Heading: "Choose a preferred date" - 1.75rem, bold, #2D2D2D.
Subheading: "Weekdays only. Our team will confirm your slot within
24 hours - you can reschedule any time." - 1rem, #4A4A4A.

Custom calendar picker, full width of content block, margin-top 24px:
- Monthly grid, Mon-Sun column headers
- Weekdays only: Saturday and Sunday cells opacity 0.3, cursor not-allowed,
  not selectable
- Selected date: red circle background (#E8323A), white text
- Today's date: subtle red outline, no fill (unless selected)
- Month navigation: left/right chevron arrows, month + year label centred
- Earliest selectable date: 14 days from today
- On mount: if fewer than 5 selectable weekdays remain in current month
  after the 14-day cutoff, auto-advance to next month
- Selected date stored as preferred_date (ISO format YYYY-MM-DD)

CTA: "Continue →" - solid red pill, max-width 380px, centred, margin-top 24px.
Disabled until a date is selected.

---

REMOVE the old Step 8 component entirely. The three new screens above
replace it. Do not leave dead code.

Do not build Step 11 or Step 12 in this session.
```

**Done when:** Progress bar shows /12. Step 8 shows motivation screen with three-step cards and correct CTA. Step 9 shows contact form, pre-populates correctly, validates before advancing. Step 10 shows calendar, blocks weekends and sub-14-day dates, auto-advances month correctly. Back navigation works across all three screens.

---

### Session 8B: Step 11 - Payment Options - TO BUILD

**Goal:** Build the four-path payment screen.

**Pre-session checks:**
- Session 8A complete and committed
- Stripe publishable key available (or use test key `pk_test_...` as placeholder)
- Minimum deposit amount confirmed with client (assumed £199)

**Prompt:**

```
Read LivWarm_Quote_Forms_Spec.md fully before starting. Steps 1-10 are
complete. Build Step 11 (payment options) only. Do not touch any other screen.

CONTEXT:
- Total steps: 12. Progress bar denominator: 12.
- PRESS_MS = 80, SELECT_HOLD_MS = 500 - do not change
- paymentMethod ('finance'/'cash'), depositAmount, loanTermMonths,
  warrantyAdded, full_name, email, phone, preferred_date,
  product_selection, solar_panel_number, payment_total all in app state
- All CSS variables in :root - never hardcode colours
- All currency: £X,XXX with commas, no decimals
- All prices VAT-inclusive

STEP 11 - PAYMENT OPTIONS

Progress bar: Step 11 of 12. Label: "Secure your slot".

Single column, centred, max-width 640px.

Slim system reminder bar at top (same pattern as Steps 8-10).

Heading: "How would you like to proceed?" - 1.75rem, bold, #2D2D2D.
Subheading: "Your slot is provisionally held. Choose how you'd like
to secure it." - 1rem, #4A4A4A.

Four option cards below, margin-top 24px. Use the existing answer card
interaction system (raised shadow, press animation, neutral grey selected
state). Cards do NOT auto-advance - they expand inline on selection to
reveal additional content. Only one card selected at a time. Selecting a
new card collapses the previously selected one.

Each card has: title (1rem, bold, #2D2D2D), subtitle (0.875rem, #4A4A4A),
badge pill (0.75rem, white text, red background, border-radius 20px,
padding 3px 10px, top-right of card).

---

CARD 1 - PAY A DEPOSIT

Title: "Pay a deposit to secure your slot"
Subtitle: "Fully refundable if the final survey price doesn't suit you"
Badge: "Most flexible"

When selected, expands below the card title row:
- "Your deposit" label (0.875rem, 500 weight, #2D2D2D)
- Deposit amount: show £{depositAmount} large (1.5rem, bold, #E8323A)
  and percentage of system price small grey below
- Slider: min £199, max = payment_total, step £50
  Initialise from depositAmount in app state if set, otherwise £199
- "Balance of £{remainder} due on installation day after survey"
  (0.875rem, #4A4A4A, margin-top 8px)
- Horizontal divider
- // STRIPE_INTEGRATION_POINT
  Placeholder: white box, 1px solid #E5E5E5, border-radius 8px,
  padding 20px, text "Stripe payment element loads here"
- "All prices include VAT" (0.75rem, #999, centred)
- CTA: "Pay £{depositAmount} deposit →" - solid red pill, full width
  of expanded area

---

CARD 2 - PAY IN FULL

Title: "Pay in full today"
Subtitle: "Lock in your price - any spec adjustment after survey is
refunded"
Badge: "Best value" - only show if paymentMethod === 'cash',
       otherwise badge: "Pay today"

When selected, expands:
- System price: £{payment_total} (1.5rem, bold, #2D2D2D)
- If warrantyAdded: "+ £199 extended warranty" (0.875rem, #4A4A4A)
- "All prices include VAT" (0.75rem, #999)
- Horizontal divider
- // STRIPE_INTEGRATION_POINT
  Placeholder: white box, 1px solid #E5E5E5, border-radius 8px,
  padding 20px, text "Stripe payment element loads here"
- CTA: "Pay £{payment_total} →" - solid red pill, full width

---

CARD 3 - FINANCE

Title: "Spread the cost with finance"
Subtitle: "Apply now for an instant decision - no payment today"
Badge: "From £{monthlyDefault}/mo" where monthlyDefault uses
loanTermMonths and depositAmount from app state if set,
otherwise 180 months 0 deposit

When selected, expands:
- Finance summary box (white bg, 1px #E5E5E5 border, border-radius 8px,
  padding 16px):
  - Monthly payment: £{monthly}/mo (1.25rem, bold, #E8323A)
  - Term: {loanTermMonths} months ({years} years) · 9.9% APR
  - Deposit: £{depositAmount} ({pct}%)
  - Total repayable: £{totalRepayable}
  All figures calculated from app state finance selections.
- "Edit finance terms →" link (0.875rem, red, underlined)
  When clicked, shows inline finance calculator (same component as
  Step 7 - reuse it). Updates app state on change. Collapses on close.
- FCA representative example (0.75rem, #999, italic, updates live)
- Horizontal divider
- // SHERMIN_INTEGRATION_POINT
  Placeholder box (same style as Stripe placeholder):
  "Finance applications will open shortly. Call 0800 222 9494."
- CTA: "Submit finance application →" - outlined red pill, full width,
  disabled with tooltip: "Finance applications opening soon"

---

CARD 4 - PROVISIONAL

Title: "I'd like an exact price before committing"
Subtitle: "We'll complete your remote survey and send a fixed quote
within 48 hours"
Badge: "No payment today"

When selected, expands:
- Info box (background: #F8F8F8, border-radius 8px, padding 16px):
  - "Your slot is provisionally held for 48 hours." (0.875rem, bold)
  - "Once you receive your fixed quote, you can pay online or apply
    for finance." (0.875rem, #4A4A4A)
- CTA: "Hold my slot provisionally →" - solid red pill, full width

---

Below all four cards:
- "Your booking is secure" with padlock SVG icon, centred,
  0.875rem, #4A4A4A, margin-top 24px
- "Payments are securely processed by Stripe. No card details are
  stored by LivWarm." - 0.75rem, #999, centred
  (only visible when Card 1 or Card 2 is expanded)

All four CTAs on click:
- Set paymentOption in app state ('deposit'/'full'/'finance'/'provisional')
- Set paymentAmount in app state (depositAmount / payment_total / 0 / 0)
- Advance to Step 12

Do not build Step 12 in this session.
```

**Done when:** All four cards expand correctly on selection. Deposit slider updates amount and remainder live. Finance summary shows correct figures from app state. All four CTAs advance to a placeholder Step 12.

---

### Session 9: Step 12 - Confirmation + Payaca Integration - TO BUILD

**Goal:** Confirmation screen and server-side lead handoff to Payaca.

**Pre-session checks:**
- Session 8B complete and committed
- Payaca credentials confirmed (in payaca_webhook.txt)

**Prompt:**

```
Read LivWarm_Quote_Forms_Spec.md fully before starting. Steps 1-11 are
complete. Build Step 12 (confirmation) and the Payaca PHP integration only.

CONTEXT:
- No progress bar on Step 12 - flow is complete
- All lead data in app state: full_name, email, phone, preferred_date,
  postcode, address_line1, town, latlong, roof_orientation, occupants,
  house_owner_type, house_type, roof_type, house_bedrooms,
  electricity_usage, day_unit_rate, night_unit_rate, rate_type,
  battery_location, battery_location_inside, battery_location_outside,
  has_ev, ev_charging_method, ev_plans, solar_panel_number,
  product_selection, payment_total, warrantyAdded, busGrant,
  evChargerEnquiry, paymentMethod, paymentOption, paymentAmount,
  depositAmount, loanTermMonths, quote_email_captured,
  lead_first_name, lead_email

STEP 12 - CONFIRMATION

Single column, centred, max-width 560px. No header progress bar.

- Green tick animation on load (SVG, 64px, #4CAF50, draw animation 600ms)
- Headline: "You're all booked in!" - 2.25rem, bold, #2D2D2D, centred
- System summary card (white, 1px #E5E5E5 border, border-radius 12px,
  padding 20px 24px, margin-top 24px):
  - Tier name (bold) + panel count + battery name
  - "Preferred date: {preferred_date formatted as 'Mon D Month YYYY'}"
  - Payment confirmation line (conditional on paymentOption):
    - deposit: "Deposit of £{paymentAmount} paid. Balance due on
      installation day."
    - full: "Payment of £{paymentAmount} confirmed."
    - finance: "Finance application submitted. Decision within 24 hours."
    - provisional: "Slot provisionally held. Fixed quote within 48 hours."

- "What happens next?" three-step block (same style as Step 8):
  1. Survey within 48 hours
  2. MCS paperwork and final design
  3. Installation day

- "A confirmation has been sent to {email}" - 0.875rem, #4A4A4A, centred
- LivWarm contact block: 0800 222 9494 / info@livwarm.co.uk

- QR code placeholder section:
  White card, border 1px #E5E5E5, border-radius 12px, padding 20px:
  Heading: "Submit your property photos"
  Text: "Our team will send you a link to upload photos of your roof
  and consumer unit. This helps us complete your remote survey faster."
  Placeholder: grey box 120x120px with "QR code" label

PAYACA INTEGRATION:
On Step 12 mount, POST to /wp-admin/admin-ajax.php?action=livwarm_solar_lead

Provide the PHP snippet to paste into WordPress Code Snippets plugin.
The snippet must:
- Create a customer in Payaca using the field map in spec Section 7
- Create a project under that customer with all fData fields
- Include warrantyAdded, busGrant, evChargerEnquiry, paymentMethod,
  paymentOption, paymentAmount, depositAmount, loanTermMonths,
  quote_email_captured, lead_first_name, lead_email
- Encrypt projectId and set allowUserSubmissionDate (72 hours) as per
  existing payaca_webhook.txt pattern

Also provide the PHP snippet for the quote email endpoint:
- Endpoint: /wp-admin/admin-ajax.php?action=livwarm_email_quote
- Receives: first_name, email, product_selection, solar_panel_number,
  payment_total, tier_name
- Creates partial Payaca lead (customer + project stub)
- Sends summary email to user via wp_mail()
```

**Done when:** Full test journey Steps 1-12 creates customer and project in Payaca. Confirmation screen displays correctly for all four paymentOption values. Both PHP snippets ready to paste into Code Snippets.

---

### Session 10: Polish + Mobile + Deploy - TO BUILD

**Goal:** Final polish, mobile testing, deployed to staging for client review.

**Prompt:**

```
Read LivWarm_Quote_Forms_Spec.md fully before starting. The solar flow
build is complete. This is the polish session.

Goals:
1. Test full flow on mobile (375px viewport upward) - fix any layout issues
2. Steps 8-11 single-column layouts correct on all screen sizes
3. Carousel cards swipeable on touch
4. Finance calculator and payment cards keyboard accessible
5. Check accessibility basics - focus states, alt text, colour contrast
6. Set up WordPress staging deployment via Code Snippets plugin
7. Remove Vercel domain restriction from Google Maps API key
8. Document any final TBC items or known issues

No new features. Polish only.
```

**Done when:** Solar flow live on staging, mobile-responsive to 375px, ready for client review.

---

## Subsequent Flows

Once solar is approved:

- **EV Charger:** 2-3 sessions (simplest flow)
- **Heat Pump / ASHP:** 3-4 sessions
- **Boiler Upgrade:** 4-5 sessions

Each needs its own products JSON file and Payaca field map. Pricing hardcoded inline from the UKEM spreadsheet. Steps 8-12 (motivation through confirmation) are shared logic - extract to a shared component before building the second flow.

---

## Roadmap Maintenance

At the end of every build session, ask Claude Code:

```
Write a session handover note covering: what was completed, what was not,
any TBC items raised, and what the next session should focus on. Add it
to Section 10 of the spec document.
```
