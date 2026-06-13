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

- Total steps is 9
- No Solar API - panel sizing uses lookup table
- Postcode lookup uses postcodes.io (free, no API key needed) - decision taken to avoid Ideal Postcodes costs. Returns lat/long and town only, user types street address manually.
- Landlord is NOT a dead-end
- No Continue buttons on card-based screens - auto-advance after 500ms
- Finance APR is 9.9%, default 180 months, Math.ceil on monthly payment
- All prices VAT-inclusive, "All prices include VAT" footnote on booking and payment screens
- Finance calculator is on the quote screen (Step 7) as an inline expandable section - NOT a modal on Step 8
- "Get your quote emailed to you" optional name + email capture is on the quote screen (Step 7) - not a blocking gate
- Step 8 framed as "Secure your free survey" - no payment, no finance modal
- Shermin confirmed provider (Stax). `// SHERMIN_INTEGRATION_POINT` in code.
- Card interaction system: neutral grey selected state, hover matches selected depth, 300ms transitions, outer shadow fades via zero-opacity placeholder layers, single dark shimmer on click only
- Sub-question reveal delayed until press animation completes (Battery, EV steps)
- Quote screen: no breadcrumbs, no address line, savings bar inside cards with three figures, "or pay in full" wording, "Your price" label
- Upsell modal addon cards match refined answer card system

---

## Pre-Build Phase - COMPLETE

### Pre-Session A - COMPLETE
### Pre-Session B - COMPLETE

---

## Build Phase

---

### Sessions 1-5 - COMPLETE

Steps 1-5 built. Card interaction system built and refined through multiple polish passes.

---

### Session 6 - COMPLETE

Step 6 built: postcode lookup, satellite map, orientation compass, occupancy. Green "Prepare my quote" button triggers loading overlay.

---

### Session 7 / Quote Screen - COMPLETE

Quote screen built. solar-products.json deployed. Loading overlay built.

---

### Quote Screen Polish Pass - COMPLETE

All layout fixes applied. See spec Section 10 for full list of changes.

---

### Session 7A - Upsell Modal + Micro-commitment - COMPLETE

Upsell modal and micro-commitment screen built. Addon card styling refined to match answer card system.

---

### Session 7B: Quote Screen Additions + Step 8 Contact Details - NEXT SESSION

**Goal:** Add inline finance calculator and email capture to the quote screen (Step 7), then build Step 8 contact details with revised framing.

**Pre-session checks:**
- Session 7A complete and committed
- Shermin Finance integration method confirmed if possible - if not, build self-contained calculator (see prompt)
- Reference calculators:
  - UKEM custom Shermin calculator (primary reference): https://v0-ukem-calculator.vercel.app/
  - Public Stax calculator: https://www.staxpay.co.uk/finance-calculator

**Prompt:**

```
Read LivWarm_Quote_Forms_Spec.md fully before starting. Steps 1-7 are complete,
the upsell modal and micro-commitment screen are built. This session has two goals:
(A) add two new sections to the existing quote screen (Step 7), and
(B) build Step 8 (contact details) from scratch.

Context (relevant to this session):
- Progress bar, step label and percentage working across 9 total steps
- Back button top-left of step header on all screens except the first
- Continue button: solid red pill, auto width, max 380px, centred, no red glow
- Content block max-width 1100px
- Total steps: 9
- Finance APR: 9.9%, terms 36/48/60/84/120/180 months, default 180 months, Math.ceil on monthly payment
- All prices VAT-inclusive - "All prices include VAT" footnote on booking and payment screens
- warrantyAdded state is in app state from Session 7A - use it in the booking summary
- Card interaction system: neutral grey selected state (background #e8e8e8, border 1px solid rgba(0,0,0,0.10), inset shadow), hover matches selected depth, 300ms transitions
- PRESS_MS = 80, SELECT_HOLD_MS = 500 - do not change these

Do not touch any previously built screens beyond the specific additions to Step 7 described below.

---

GOAL A - TWO ADDITIONS TO THE EXISTING QUOTE SCREEN (STEP 7)

Add these two sections below the tier carousel and above the "Continue with this system" CTA.
Do not change the carousel, tier cards, savings bar, or any other existing quote screen element.

---

ADDITION 1 - INLINE FINANCE CALCULATOR

Collapsed by default. Triggered by a link/button labelled "Explore finance options" - 
0.9rem, red, underlined, centred, sits directly below the tier carousel.

When expanded, the section slides open (smooth max-height transition, 300ms).
Background: white, border: 1px solid #E5E5E5, border-radius: 12px, padding: 24px,
margin: 0 auto, max-width: 560px.

NOTE ON SHERMIN: Build self-contained calculator. Mark integration point clearly:
// SHERMIN_INTEGRATION_POINT

Payment toggle at top: "Pay monthly" / "Pay in full" - pill style, default "Pay monthly".
Selected pill: solid red background, white text. Unselected: white, grey border.

PAY MONTHLY section:
- "Your deposit" label, then slider: 0% to 50% of current tier system price, £500 steps.
  Show deposit amount and percentage below slider in grey.
- "Loan term" label, then pill selector: 36 / 48 / 60 / 84 / 120 / 180 months. Default 180.
  Selected pill: solid red, white text.
- Monthly payment display: large, bold, red. Updates live on every slider/term change.
  Formula (Math.ceil):
  monthlyRate = 0.099 / 12
  financeAmount = systemPrice - depositAmount
  monthlyPayment = financeAmount * (monthlyRate * (1+monthlyRate)^months) / ((1+monthlyRate)^months - 1)
- FCA representative example (required by law, updates live):
  "Representative example: Borrowing £{financeAmount} over {term} years at 9.9% APR (fixed).
  Monthly repayments of £{monthlyPayment}. Total amount repayable: £{totalRepayable}.
  Credit is subject to status and affordability."
  Font size: 0.75rem, colour: #999, italic.
- "Apply for Finance with Shermin →" button - outlined red pill.
  // SHERMIN_INTEGRATION_POINT
  Currently shows: "Finance applications will open shortly. Call 0800 222 9494."

PAY IN FULL section:
- "£{systemPrice}" large bold #2D2D2D
- "Save £{financeSavingVsTotal} compared to paying monthly over 15 years" - 0.875rem, green (#4CAF50)
- No button needed - user continues with the main CTA below.

The calculator must update its system price dynamically whenever the user swipes to a different
tier card. It does not need to re-open if collapsed - it simply recalculates internally.

---

ADDITION 2 - "GET YOUR QUOTE EMAILED TO YOU"

Sits below the finance calculator and above the main CTA. Optional - not a blocking gate.
If user skips it and hits the CTA, that is fine.

Container: white, border: 1px solid #E5E5E5, border-radius: 12px, padding: 20px 24px,
margin: 0 auto, max-width: 560px.

Heading: "Get your quote emailed to you" - 1rem, bold, #2D2D2D
Subtext: "We'll send a summary to your inbox so you can review it any time." - 0.875rem, #4A4A4A

Two fields inline (50/50 on desktop, stacked on mobile):
- First name - text input
- Email address - email input
Field styling: border 1px solid #E5E5E5, border-radius 8px, padding 10px 14px,
font-size 1rem (16px minimum).

Submit button: "Send my quote →" - outlined red pill, auto width, sits below the two fields.
Disabled until both fields are non-empty and email is valid format.

On submit:
- POST { first_name, email, product_selection, solar_panel_number, payment_total, tier_name }
  to WordPress AJAX endpoint: /wp-admin/admin-ajax.php?action=livwarm_email_quote
  (provide a placeholder PHP snippet in comments - full implementation in Session 9)
- Replace the form with a green tick icon + "Quote sent - check your inbox." message
- Store first_name and email in app state as lead_first_name and lead_email
- Set quote_email_captured = true in app state

Pre-population rule: if the user already submitted this form and then navigates back to
the quote screen, show the success state rather than the form again.
Pre-populate Step 8 first name and email fields from lead_first_name and lead_email
if quote_email_captured is true.

---

GOAL B - STEP 8: CONTACT DETAILS

Progress bar: Step 8 of 9. Label: "Your details".

Two-column layout (desktop: 55% left / 45% right, stacks to single column below 768px):

LEFT COLUMN - Contact form:

Heading: "Secure your free survey" - 1.75rem, bold, #2D2D2D
Subheading: "No payment today. Our team will contact you within 24 hours to confirm
your installation date." - 1rem, #4A4A4A

Form fields (all required, 16px minimum font size, red focus ring on inputs):
- First name (half width) - pre-populate from lead_first_name if quote_email_captured
- Surname (half width, same row)
- Email address (full width) - pre-populate from lead_email if quote_email_captured
- Phone number (full width)

Field styling:
- Border: 1px solid #E5E5E5 default, 2px solid #E8323A on focus
- Border-radius: 8px, padding: 12px 16px, background: white
- Label above each field: 0.875rem, font-weight 500, #2D2D2D

Preferred installation date:
- Label: "Preferred installation date"
- Subtext: "Weekdays only. Our team will confirm availability after your technical review."
- Custom calendar picker - monthly grid (do not use browser native date input)
- Weekdays only - Saturday and Sunday cells visually muted (opacity 0.3, cursor not-allowed)
- Selected date: red circle, white text
- Today's date: subtle red outline, no fill (unless selected)
- Month navigation: left/right chevron arrows
- Earliest selectable date: 14 days from today
- Selected date stored as preferred_date (ISO format YYYY-MM-DD)

"What happens next?" - three-step inline note, sits below the calendar and above the CTA button:
- Step 1: "Survey booked" - we'll confirm your slot within 24 hours
- Step 2: "Remote design" - our engineers review your roof and design your system
- Step 3: "Installation day" - your system is fitted by our MCS-certified team
Style: three items in a row (stacks on mobile), each with a numbered circle (red, white text),
label bold, description small grey. Subtle top border above the block.

Continue button at bottom of left column:
- Label: "Book my free survey →"
- Solid red pill, full width of left column
- Disabled until all fields populated and date selected
- Validates fields (non-empty, email format, UK phone format), then advances to Step 9

RIGHT COLUMN - Booking summary panel:

Sticky (position: sticky, top: 24px).
Panel: white bg, 1px border #E5E5E5, border-radius 16px, padding 24px,
box-shadow 0 4px 16px rgba(0,0,0,0.08)

Heading: "Your booking summary" - 1.1rem, bold, #2D2D2D

System section:
- Tier name - 0.95rem, bold
- Panel + battery line - 0.875rem, #4A4A4A
- If warrantyAdded: "5-Year Workmanship Guarantee" with green tick

Horizontal divider

Price section:
- "System price" + "£{total}" - label 0.875rem #4A4A4A, value 1rem bold #2D2D2D
- If warrantyAdded: "+£199 warranty" line item in small grey
- Monthly finance: "or £{monthly}/mo" in red, 0.95rem
- "at 9.9% APR, 15-year term" - 0.75rem, #999

Horizontal divider

Savings section:
- "Monthly bill reduction" + "£{monthlySaving} est./mo"
- "20-year saving" + "£{saving20yr} est."
- Both: label 0.8rem #4A4A4A, value 0.95rem bold #2D2D2D

Horizontal divider

Trust badges (three inline, centred): MCS Certified / Trustpilot 4.9 ★ / HIES Member

---

IMPORTANT NOTES:
- All currency: £X,XXX with commas, no decimals
- Monthly figures: Math.round. Monthly payment: Math.ceil.
- All prices VAT-inclusive - "All prices include VAT" footnote on booking and payment screens
- preferred_date stored as YYYY-MM-DD
- full_name, email, phone stored in app state for Payaca payload
- Match all existing CSS variables, spacing, and animation patterns exactly
- No finance modal on Step 8 - the finance calculator lives on the quote screen
```

**Done when:** Inline finance calculator on quote screen expands and calculates live, updates when tier changes. Email capture form submits and shows success state. Step 8 at correct progress bar position, two-column layout correct on desktop, heading reads "Secure your free survey", calendar blocks weekends and dates within 14 days, "What happens next?" three-step block visible, CTA reads "Book my free survey →", booking summary shows correct system and pricing including warranty.

---

### Session 8: Step 9 Payment via Stripe - TO BUILD

**Goal:** Stripe Payment Element with Card, Klarna, Revolut Pay.

**Pre-session checks:**
- LivWarm Stripe account set up, publishable key available
- Deposit vs full payment confirmed by client

**Prompt:**

```
Read LivWarm_Quote_Forms_Spec.md fully before starting. Steps 1-8 are complete.
Continue the solar flow build - Session 8 goal only.

Context:
- Progress bar working across 9 total steps
- Content block max-width 1100px
- All prices VAT-inclusive - "All prices include VAT" footnote on booking and payment screens
- warrantyAdded, full_name, email, phone, preferred_date, product_selection,
  solar_panel_number, payment_total all in app state

Session 8 goal - build Step 9 (payment) only:
- Progress bar: Step 9 of 9. Label: "Secure your booking"
- Booking summary recap at top (system, price, date)
- "How would you like to pay?" heading
- Two options: "Pay securely online" (Stripe) / "Spread the cost" (Shermin - placeholder URL)
- Stripe Payment Element: Card, Klarna, Revolut Pay
- "Your booking is secure" trust line with padlock icon
- "What happens next?" panel: Provisional Booking / Remote Survey / Final Confirmation
- Pay button: "Pay £{total}" - solid red pill
- Footer note: "Payments are securely processed by Stripe. No card details are stored by LivWarm."
- On successful payment: POST all app state to WordPress AJAX endpoint
  /wp-admin/admin-ajax.php?action=livwarm_solar_lead
- On payment failure: show inline error, do not advance
- All prices VAT-inclusive - "All prices include VAT" footnote
```

**Done when:** Test card processes in Stripe test mode and success handler fires.

---

### Session 9: Step 10 Confirmation + Payaca Integration - TO BUILD

**Goal:** Confirmation screen and server-side lead handoff to Payaca.

**Prompt:**

```
Read LivWarm_Quote_Forms_Spec.md fully before starting. Steps 1-9 are complete.
Continue the solar flow build - Session 9 goal only.

Context:
- All lead data in app state: full_name, email, phone, preferred_date,
  postcode, address_line1, town, latlong, roof_orientation, occupants,
  house_owner_type, house_type, roof_type, house_bedrooms,
  electricity_usage, day_unit_rate, night_unit_rate, rate_type,
  battery_location, battery_location_inside, battery_location_outside,
  has_ev, ev_charging_method, ev_plans, solar_panel_number,
  product_selection, payment_total, warrantyAdded,
  quote_email_captured, lead_first_name, lead_email

Session 9 goal - confirmation screen and Payaca integration:

STEP 10 - CONFIRMATION (no progress bar - flow complete):
- "You're all booked in!" headline - 2.25rem, bold
- Green tick animation on load (SVG, 64px, #4CAF50)
- System summary: tier name, panel count, battery, date confirmed
- "What happens next?" three-step: survey within 48hrs / MCS paperwork / Installation day
- "A confirmation has been sent to {email}"
- LivWarm contact: 0800 222 9494, info@livwarm.co.uk
- QR code section: placeholder for Payaca follow-up photo submission

PAYACA INTEGRATION:
- Create WordPress AJAX endpoint via Code Snippets plugin (provide PHP snippet)
- Endpoint creates customer + project in Payaca using field map in spec Section 7
- warrantyAdded maps to custom field "warrantyAdded" in fData
- quote_email_captured, lead_first_name, lead_email map to fData fields
- Endpoint URL: /wp-admin/admin-ajax.php?action=livwarm_solar_lead

Also provide the PHP snippet for the quote email endpoint:
- Endpoint URL: /wp-admin/admin-ajax.php?action=livwarm_email_quote
- Receives: first_name, email, product_selection, solar_panel_number, payment_total, tier_name
- Creates a partial lead record in Payaca (customer + project stub)
- Sends a summary email to the user via wp_mail()
```

**Done when:** Full test journey Steps 1-10 creates customer and project in Payaca. Confirmation screen displays correctly. Both PHP snippets ready to paste into Code Snippets.

---

### Session 10: Polish + Mobile + Deploy - TO BUILD

**Goal:** Final polish, mobile testing, deployed to staging for client review.

**Prompt:**

```
Read LivWarm_Quote_Forms_Spec.md fully before starting. The solar flow build is complete.
This is the polish session.

Goals:
1. Test full flow on mobile (375px viewport upward) - fix any layout issues
2. Step 8 two-column layout stacks correctly below 768px
3. Carousel cards are swipeable on touch
4. Check accessibility basics - keyboard navigation, focus states, alt text
5. Set up WordPress staging deployment via Code Snippets plugin
6. Remove Vercel domain from Google Maps API key restrictions
7. Document any final TBC items or known issues

No new features. Polish only.
```

**Done when:** Solar flow live on staging, mobile-responsive to 375px, ready for client review.

---

## Subsequent Flows

Once solar is approved:

- **EV Charger:** 2-3 sessions (simplest flow)
- **Heat Pump / ASHP:** 3-4 sessions
- **Boiler Upgrade:** 4-5 sessions

Each needs its own products JSON file and Payaca field map. Pricing hardcoded inline from the UKEM spreadsheet.

---

## Roadmap Maintenance

At the end of every build session, ask Claude Code:

```
Write a session handover note covering: what was completed, what was not, any
TBC items raised, and what the next session should focus on. Add it to Section 11
of the spec document.
```
