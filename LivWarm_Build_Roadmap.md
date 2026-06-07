# LivWarm Quote Forms - Build Roadmap

_Last updated: June 2026. Companion to LivWarm_Quote_Forms_Spec.md._

---

## How to Use This Document

Each session has:
- **Goal** - the single deliverable for that session
- **Pre-session checks** - what you need ready before starting
- **Prompt** - paste this into Claude Code to start the session
- **Done when** - clear criteria for ending the session

**Golden rule:** One session = one goal. When the goal is met, save, commit, end the session. Resist the urge to do more - long sessions degrade output quality.

**Where each session happens:**
- Pre-build sessions: this Claude Project (Sonnet)
- Build sessions: Claude Code in VS Code (Opus)

---

## Important: Prompt Currency

The prompts in this document reflect the build as it actually exists. Key differences from the original roadmap PDF:

- Total steps is 9 not 8 - electricity usage was split into Step 2 (kWh) and Step 3 (tariff)
- No Solar API - panel sizing uses lookup table + occupancy + orientation questions
- Postcode lookup uses Ideal Postcodes, not Google Places
- Landlord is NOT a dead-end - flows through
- Battery outside sub-locations added (Side of garage / Side of house / Back of house / Other)
- EV charging method sub-question added for "Yes I have an EV" users
- No Continue buttons on card-based screens - auto-advance after 500ms
- No per-step summary screens - single consolidated review screen only
- Two-card layouts max-width 860px, content block max-width 1100px
- All session prompts include a full context block - do not strip this out
- Product content (images, descriptions) lives in solar-products.json - not hardcoded
- Finance APR is 6.9% over 10 years - no VAT shown anywhere
- "Prepare my quote" green button at end of Step 6, triggers loading overlay

---

## Pre-Build Phase - COMPLETE

### Pre-Session A - COMPLETE
Spec and roadmap in Project Knowledge. Project instructions set.

### Pre-Session B - COMPLETE / IN PROGRESS

| Item | Status |
|------|--------|
| lbrand font files | Complete - in /fonts/ folder |
| GitHub repo + Vercel deployment | Complete |
| Ideal Postcodes account | To confirm |
| Google Maps API key (Maps JS only) | Complete - domain restrictions set |
| Shermin Finance integration method | To confirm - APR confirmed at 6.9% |
| Panel count lookup table confirmed with UKEM | To confirm |
| Stripe account | To set up |
| Deposit vs full payment confirmed | To confirm |
| Payaca credentials valid | To confirm |
| solar-products.json | Complete - deployed at livwarm-quotes.vercel.app/solar/solar-products.json |

---

## Build Phase

---

### Session 1: Project Setup + Step 1 Qualifier Screens - COMPLETE

**Goal:** Working React app shell with brand styling, progress bar, breadcrumb pills, and Step 1 qualifier questions.

**What was built:**
- File structure: /solar/index.html as self-contained React SPA
- Brand styling: lbrand font, colour variables, typography scale, rounded corners
- Progress bar: bold red, percentage and step name visible, advances per question
- Breadcrumb pills: accumulate above each question, show previous answers with edit icon, centred. Collapses to "X previous answers ∨" when more than 6 pills.
- Back button: top-left of step header on all screens except first
- Card interaction system: raised default, sinks on hover with shimmer sweep, two-beat punch-and-rise on click, depressed inset shadow selected state, 60% opacity desaturation on unselected cards, 500ms auto-advance delay
- Dot texture: lower-right corner of all cards, radial gradient, red dots on selected state
- Step 1: homeowner/landlord, property type, roof type, bedrooms
- Dead-ends: Flat property type and Flat roof redirect to /sorry-we-cannot-help. Landlord continues.
- LivWarm logo in header

---

### Session 2: Step 2 Electricity Usage (kWh) - COMPLETE

**Goal:** kWh input screen with help modal and national average fallback.

**Done:** User can enter kWh, use the fallback, view the help modal (highlights usage row only), and proceed.

---

### Session 3: Step 3 Electricity Tariff - COMPLETE

**Goal:** Tariff screen with toggle cards, rate inputs, and national average fallback.

**Done:** Tariff toggle cards work, rate inputs show correctly per selection, fallback populates, breadcrumb shows rate value. Help modal highlights unit rate row only.

---

### Session 4: Steps 4 + 5 Battery and EV Details - COMPLETE

**Goal:** Battery location and EV cross-sell questions, including all sub-questions.

**Done:** Both steps work with all sub-questions, answers persist.

---

### Session 5: Step 6 Address Lookup + Satellite Map + Orientation + Occupancy - COMPLETE

**Goal:** Postcode lookup, satellite map confirmation, roof orientation compass, occupancy question.

**Done:** Postcode lookup returns addresses, satellite map shows property, orientation compass works, occupancy captured. Green "Prepare my quote" button triggers loading overlay.

---

### Session 6: Step 7 Quote Screen - COMPLETE (polish pass pending)

**Goal:** The quote screen - the conversion centrepiece.

**What was built:**
- Price headline with cash and monthly price
- Savings figures
- Three tier cards (Essential / Performance / Custom) with live price updates
- What's included list
- Trust signals
- CTA button
- solar-products.json sourced from WordPress media library via Claude in Chrome
- "Preparing your quote" loading overlay (5 messages, 6.8 seconds)
- Finance calculation at 6.9% APR confirmed from UKEM pricing

**Polish pass prompt (paste into Claude Code when session tokens reset):**

```
Read LivWarm_Quote_Forms_Spec.md before starting. This is a fixes-only pass on the quote screen (Step 7) and related elements. Do not touch any other steps or screens.

Read the current index.html carefully before making any changes. Match all existing CSS variables, spacing, and patterns exactly.

---

FIX 1 REVISION - "Prepare my quote" button width and spacing

Fix both issues:
- Width: auto, min-width 400px, max-width 560px, centred horizontally
- margin-top: 32px above the button to separate it from the answer cards
- padding-bottom: 32px on the content container below the button
- Ensure the bottom row of answer cards is fully visible and not obscured
  by the button - add sufficient padding-bottom to the cards container so
  all cards are fully visible above the button

---

FIX 2 - Quote screen headline block - make monthly price the hero

The cash price is dominant and the monthly figure is too small. Restructure the headline block:

- Address line: address_line1 + town, 0.9rem, #4A4A4A (keep as-is)
- Two prices side by side on one line, vertically centred:
  Left: "£{price}" - 2.5rem, bold, #2D2D2D (dark, not red)
  Separator: "or" - 1rem, #999, margin 0 12px
  Right: "£{monthly}/mo" - 2.5rem, bold, #E8323A (red - this is the conversion number)
- Below the prices, centred: "Subject to survey and final system confirmation" - 0.75rem, #999, italic
- Below that: price breakdown line "£{panelsCost} panels + £{batteryCost} battery storage"
  (or "panels only" for Essential) - 0.85rem, #4A4A4A
- Remove the standalone large red price - the two-price layout replaces it entirely
- Both prices update live when tier switches

---

FIX 3 - Savings block - make it hit harder

Replace the three equal stat boxes with a stronger hierarchy:

Top row - single wide "monthly saving" hero box:
- Full width of content block
- Background: linear-gradient(135deg, #E8323A 0%, #c42830 100%)
- White text throughout
- Left side:
  - "Your estimated monthly saving" label, 0.875rem, rgba(255,255,255,0.8)
  - "~£{monthlySaving}/mo" value, 2.5rem, bold, white
- Right side (separated by a subtle white divider):
  - Crossed-out current bill: "Currently paying ~£{currentBill}/mo" with strikethrough, 0.875rem, rgba(255,255,255,0.7)
  - "With solar: ~£{billAfterSolar}/mo" where billAfterSolar = currentBill - monthlySaving, 1.1rem, bold, white
- Border-radius 16px, padding 24px 32px
- Updates live when tier switches

Bottom row - two smaller stat boxes side by side (existing style):
- Box 1: "£{saving20yr}" label "20-year saving"
- Box 2: "{breakEvenYear} years" label "Estimated break-even"

Calculations:
- currentBill = Math.round((electricity_usage / 12) × (day_unit_rate / 100))
- billAfterSolar = Math.max(0, currentBill - Math.round(monthlySaving))
- If currentBill comes out below £20, default to £120

---

FIX 4 - Tier cards - fix image display and visual hierarchy

Performance card:
- Battery image from solar-products.json at 160px height, object-fit contain
- Positioned right side of card, vertically centred
- Card content (specs, who_for, price) on the left
- If image fails, hide gracefully - no broken image icon
- who_for text from JSON: italic, 0.875rem, #4A4A4A, below specs
- Price breakdown beneath total: "£X,XXX panels + £X,XXX battery" in 0.8rem, #4A4A4A
  (battery cost = getPrice(panels, batteryKey) - getPrice(panels, 'none'))
- Selected border: 2px solid rgba(232,50,58,0.9)
- Selected background wash: rgba(232,50,58,0.03)

Essential card:
- Solar panel image at 140px height, same positioning
- who_for text from JSON
- If no image, hide gracefully

Visual hierarchy:
- Performance: heading 1.15rem bold, price in red (#E8323A)
- Essential: heading 1rem, font-weight 500, price in #4A4A4A
- Custom: heading 1rem, font-weight 500, price in #4A4A4A, no product image

---

FIX 5 - "What's included" - move up and improve layout

- Remove gap - sits flush below tier cards with 32px margin only
- Two-column grid desktop, single column mobile (below 600px)
- Each item: red SVG tick (16px) + text, 1rem, #2D2D2D
- Updates dynamically per selected tier:
  All tiers: {N} × 445W solar panels / Solar inverter / Smart monitoring app /
  Professional installation / MCS certified installation / Manufacturer warranty
  Performance and Custom with battery: add "{battery name} battery storage" as second item
- Section heading: 1.25rem, font-weight 600, #2D2D2D, margin-bottom 16px
- Card wrapper: white bg, 1px border #E5E5E5, border-radius 12px, padding 24px 32px
- Max-width 860px, centred

---

FIX 6 - "Continue with this system" button width

- Width: auto, min-width 320px, max-width 380px, centred horizontally
- Keep all other styling (red, white text, pill shape, shadow, arrow)

---

FIX 7 - Remove trust badge pills above CTA

The three trust badge pills (MCS Certified, 4.9 Trustpilot, HIES Member) that sit
between "What's included" and the Continue button are too small to be effective and
duplicate the footer trust bar. Remove them entirely from this position.
The footer trust bar remains untouched.

---

FIX 8 - Dynamic help modal - highlight relevant field only

The "Where to find this?" help modal currently shows both rows highlighted.
Fix it to be context-aware:

- Add a prop to the modal: highlightField - accepts either 'usage' or 'rate'
- When highlightField === 'usage':
  - Red highlight box and annotation on "Electricity used (annual)" row only
  - "Unit rate" row renders as normal unhighlighted
- When highlightField === 'rate':
  - Red highlight box and annotation on "Unit rate" row only
  - "Electricity used (annual)" row renders as normal unhighlighted
- "Where do I find this?" on Step 2 (kWh) passes highlightField='usage'
- "Where do I find this?" on Step 3 (tariff) passes highlightField='rate'
- All other modal styling, layout and behaviour stays exactly as-is

---

IMPORTANT NOTES:
- solar-products.json is already deployed at /solar/solar-products.json and being fetched
- Do not change the fetch logic, only fix image rendering size and who_for text rendering
- Do not change any pricing calculations, financial logic, or app state
- Do not touch Steps 1-6 except the button fix in Fix 1
- currentBill uses electricity_usage and day_unit_rate from app state - already available
- All currency: £X,XXX with commas, no decimals
- Monthly figures: Math.round. Monthly payment: Math.ceil.
- If any app state value is missing or zero, fail gracefully - no NaN or £0 shown

Done when: button correctly sized and spaced, monthly price equal prominence to cash price,
red savings hero box shows correct before/after figures, tier card images at correct size,
Essential and Custom have reduced visual weight, What's included flush below cards in
two-column layout, Continue button centred, trust pills removed, help modal highlights
only the relevant field.
```

**Done when:** All eight fixes applied, quote screen looks and functions correctly.

---

### Session 7: Step 8 Upsell + Micro-commitment + Contact Details - TO BUILD

**Goal:** Upsell modal, micro-commitment step, contact details screen, finance calculator.

**Pre-session checks:**
- Shermin finance integration method confirmed (APR 6.9% confirmed - confirm embed or link-out)

**Prompt:**

```
Read LivWarm_Quote_Forms_Spec.md fully before starting. Steps 1-7 are complete
including the quote screen polish pass. Continue the solar flow build - Session 7 goal only.

Context from previous sessions (do not rebuild, just match):
- Progress bar, step label and percentage working across 9 total steps
- Breadcrumb pills accumulate above each question with edit icon, collapse after 6
- Back button top-left of step header on all screens except the first
- Answer cards: raised shadow default, sinks on hover, two-beat punch-and-rise on click,
  depressed selected state, 60% dimmed unselected, 500ms auto-advance
- Continue button: solid red pill, full width, no red glow
- Content block max-width 1100px, two-card layouts max-width 860px
- Total steps: 9
- Finance APR: 6.9%, 10-year term, no VAT shown anywhere

Session 7 goal - build the upsell modal, micro-commitment step, and Step 8 contact details:

UPSELL MODAL (triggered on Continue from quote screen):
- "Enhance Your System" heading
- Extended Warranty toggle: 5-year workmanship guarantee (+£199)
- BUS Heat Pump Grant cross-sell card (orange highlight): £7,500 grant available
- "Not this time" / "Continue: Add Selected" buttons

MICRO-COMMITMENT STEP (after upsell modal):
- Summary of selected tier: name, panel count, battery, price
- Single button: "This looks right - get my full quote"
- Brief confirmation screen - no progress bar increment

STEP 8 - CONTACT DETAILS:
- Left side: First name, Surname, Email, Phone
- Preferred installation date: calendar picker, weekdays only, "Weekdays only" note
- Copy: "Select your preferred date. Our team will confirm availability after your technical review."
- Right side: Booking summary - system, price breakdown, savings estimates, trust badges
- "Explore finance options" → finance modal
- Finance modal: 6.9% APR, loan term up to 15 years, deposit slider 0-30%,
  live monthly payment, FCA compliant representative example
```

**Done when:** Upsell modal works, micro-commitment shows correctly, contact form complete, date picker weekdays only, finance modal calculates live.

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

[Insert full context block from Session 7 prompt here]

Session 8 goal - build Step 9 (payment) only:
- Booking summary recap
- Pay securely online (Stripe) vs Spread the cost (Shermin)
- Stripe Payment Element: Card, Klarna, Revolut Pay
- "Your booking is secure" trust line
- "What happens next?" panel: Provisional Booking / Remote Survey / Final Confirmation
- Pay button: "Pay £X,XXX.00"
- Footer: "Payments are securely processed by Stripe"
- On successful payment: POST lead data to WordPress AJAX endpoint (placeholder)
- No VAT shown anywhere
```

**Done when:** Test card processes payment in Stripe test mode.

---

### Session 9: Step 10 Confirmation + Payaca Integration - TO BUILD

**Goal:** Confirmation screen and server-side lead handoff to Payaca.

**Prompt:**

```
Read LivWarm_Quote_Forms_Spec.md fully before starting. Steps 1-9 are complete.
Continue the solar flow build - Session 9 goal only.

[Insert full context block here]

Session 9 goal - confirmation screen and Payaca integration:

STEP 10 - CONFIRMATION:
- "You're all booked in!" headline
- Summary of selected system
- Preferred date confirmed
- What happens next (3-step process)
- QR code for photo submission
- Email confirmation note
- LivWarm contact details

PAYACA INTEGRATION:
- Create WordPress AJAX endpoint via Code Snippets plugin
- Endpoint calls Payaca API server-side using existing credentials and field map (Section 8 of spec)
- On successful Stripe payment, React form POSTs lead data to this endpoint
- Payload includes roof_orientation and occupants fields
- Handle success and failure states gracefully
```

**Done when:** Full test journey Steps 1-10 successfully creates a customer and project in Payaca.

---

### Session 10: Polish + Mobile + Deploy - TO BUILD

**Goal:** Final polish, mobile testing, deployed to staging for client review.

**Prompt:**

```
Read LivWarm_Quote_Forms_Spec.md fully before starting. The solar flow build is complete.
This is the polish session.

[Insert full context block here]

Goals:
1. Test full flow on mobile (375px viewport upward) - fix any layout issues
2. Add any missing animations, transitions, micro-interactions
3. Check accessibility basics - keyboard navigation, focus states, alt text on images
4. Set up WordPress staging deployment via Code Snippets plugin
5. Remove Vercel domain from Google Maps API key restrictions
6. Document any final TBC items or known issues

No new features. Polish only.
```

**Done when:** Solar flow live on staging URL, mobile-responsive, accessible, ready for client review.

---

## Subsequent Flows

Once solar is approved:

- **EV Charger:** 2-3 sessions (simplest flow)
- **Heat Pump / ASHP:** 3-4 sessions (similar to solar without satellite/orientation steps)
- **Boiler Upgrade:** 4-5 sessions (most questions, BUS grant logic)

Each needs its own products JSON file (same structure as solar-products.json) and the same Payaca field map approach. Pricing hardcoded inline from the UKEM spreadsheet.

---

## Roadmap Maintenance

At the end of every build session, ask Claude Code:

```
Write a session handover note covering: what was completed, what was not, any
TBC items raised, and what the next session should focus on. Add it to Section 11
of the spec document.
```
