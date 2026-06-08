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
- Quote screen uses a carousel (not three-column tier cards) - Performance centred by default
- Session 7 was split into 7A (upsell + micro-commitment) and 7B (contact details + finance modal)
- Finance modal uses a self-contained calculator placeholder - Shermin embed drops in later

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
| Shermin Finance integration method | TBC - build self-contained calculator placeholder for now; Shermin embed drops in once credentials confirmed |
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
- "Preparing your quote" loading overlay (5 messages, 6.8 seconds)
- Headline block: address line, system summary, dual price (cash + monthly), disclaimer, price breakdown
- Savings section: monthly bill reduction + 20-year saving stat boxes, count-up animations
- Carousel: Performance centred by default, Essential left peek, Custom right peek
- Carousel cards: descriptive headings, three-component image row, what's included (green ticks, two-column), summary/who_for, data sheet links, price block
- "★ Top Pick" gold diagonal ribbon on Performance card
- Navigation indicators above carousel (dot + tier name label)
- Arrow navigation + touch swipe
- CTA: "Continue with this system" - auto width, centred, max 380px
- Footer trust bar only - no trust badge pills above CTA
- solar-products.json sourced from WordPress media library via Claude in Chrome
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

The "Where do I find this?" help modal currently shows both rows highlighted.
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

### Session 7A: Upsell Modal + Micro-commitment - TO BUILD

**Goal:** Upsell modal triggered from the quote screen Continue button, followed by the micro-commitment confirmation screen.

**Pre-session checks:**
- Session 6 quote screen polish pass complete and committed

**Prompt:**

```
Read LivWarm_Quote_Forms_Spec.md fully before starting. Steps 1-7 are complete
including the quote screen polish pass. Continue the solar flow build -
Session 7A goal only.

Context from previous sessions (do not rebuild, just match):
- Progress bar, step label and percentage working across 9 total steps
- Breadcrumb pills accumulate above each question with edit icon, collapse after 6
- Back button top-left of step header on all screens except the first
- Answer cards: raised shadow default, sinks on hover, two-beat punch-and-rise on click,
  depressed selected state, 60% dimmed unselected, 500ms auto-advance
- Continue button: solid red pill, auto width, max 380px, centred, no red glow
- Content block max-width 1100px, two-card layouts max-width 860px
- Total steps: 9
- Finance APR: 6.9%, 10-year term, no VAT shown anywhere
- Quote screen uses a carousel - Performance centred by default, Essential left peek,
  Custom right peek. Each card has a three-component image row, what's included list,
  who_for summary, and price block.
- "★ Top Pick" gold ribbon on Performance card only
- Footer trust bar only - no trust badge pills above CTA

Session 7A goal - build the upsell modal and micro-commitment screen only.
Do not touch Steps 1-7 or start on contact details.

---

UPSELL MODAL

Triggered when the user clicks "Continue with this system" on the quote screen.
This is a modal overlay, not a new step - the progress bar does not increment.

Design:
- White modal, max-width 560px, centred, border-radius 16px
- Dark overlay behind (rgba(0,0,0,0.55))
- Close button (×) top-right corner
- Heading: "Enhance Your System" - 1.5rem, bold, #2D2D2D
- Subheading: "Optional add-ons for your installation" - 0.9rem, #4A4A4A

Two add-on items:

1. Extended Warranty toggle
   - Label: "5-Year Workmanship Guarantee"
   - Description: "Covers labour and workmanship for 5 years beyond standard installation
     warranty. Peace of mind, included in your finance payments."
   - Price: "+£199"
   - Toggle switch (red when on, grey when off) - off by default
   - Full row is clickable to toggle

2. BUS Heat Pump Grant cross-sell card
   - Background: rgba(255,152,0,0.08), border: 1.5px solid rgba(255,152,0,0.6)
   - Icon: orange flame or heat icon (SVG)
   - Heading: "You may qualify for a £7,500 BUS Grant"
   - Description: "The Boiler Upgrade Scheme provides a government grant of up to
     £7,500 toward a heat pump installation. Many LivWarm solar customers also
     qualify."
   - CTA link: "Find out if you qualify →" in orange (#F57C00)
   - This card is informational only - clicking the link opens a new tab to
     livwarm.co.uk (placeholder URL for now). It does not add to the order total.
   - No checkbox or toggle on this card

Button row at bottom of modal:
- Left: "Not this time" - outlined pill, #4A4A4A border and text, white background
- Right: "Continue →" - solid red pill (#E8323A, white text)
- If warranty toggle is on, right button label becomes "Continue: +£199 added →"
- Both buttons close the modal and advance to the micro-commitment screen

Pricing logic:
- If warranty toggle is on: add £199 to the total carried forward into micro-commitment
  and all subsequent steps. Store as warrantyAdded: true in app state.
- Do not recalculate monthly price at this stage - monthly price update happens
  on the contact details screen where finance is shown

---

MICRO-COMMITMENT SCREEN

Shown immediately after the upsell modal closes (whether via "Not this time" or "Continue").
This is a brief confirmation screen - no progress bar increment, no breadcrumb pill added.

Design:
- Centred content, max-width 600px
- Green tick icon (SVG, 48px, #4CAF50) at top, centred
- Heading: "Here's your system summary" - 1.75rem, bold, #2D2D2D
- System summary card (white, 1px border #E5E5E5, border-radius 12px, padding 24px 32px):
  - Tier name (e.g. "Our Recommended Package") - 1.1rem, bold, #2D2D2D
  - Panel count + battery name (e.g. "10 × 445W panels + Fox ESS EP12 battery") - 0.9rem, #4A4A4A
  - If warranty was added: "5-Year Workmanship Guarantee included" with green tick - 0.875rem
  - Horizontal divider
  - Cash price: "£{total}" - 1.5rem, bold, #2D2D2D
  - Monthly price: "or £{monthly}/mo est. at 6.9% APR" - 0.95rem, #E8323A
  - If warranty added: prices reflect the +£199 addition
- Below card: "Prices subject to survey and final system confirmation." - 0.75rem, #999, italic, centred

Single CTA button:
- Label: "This looks right - continue to booking →"
- Solid red pill, auto width, min-width 320px, max-width 440px, centred
- Advances to Step 8 (contact details) - this is where the progress bar increments to Step 8

Edit link below button:
- "← Change system" in small red text, centred
- Returns user to the quote screen carousel

---

IMPORTANT NOTES:
- Do not start on Step 8 contact details - that is Session 7B
- All currency: £X,XXX with commas, no decimals
- Monthly figures: Math.round. Monthly payment: Math.ceil.
- warrantyAdded state must persist into subsequent steps so it can be included
  in the Payaca payload and shown in the booking summary
- No VAT shown anywhere
- Match all existing CSS variables, spacing, and animation patterns exactly
```

**Done when:** "Continue with this system" on the quote screen triggers the upsell modal, both modal buttons work correctly, warranty toggle adds £199 to state, micro-commitment shows correct system summary with updated prices, "This looks right" button is wired to advance (even if Step 8 is not yet built - a placeholder screen is fine).

---

### Session 7B: Step 8 Contact Details + Finance Modal - TO BUILD

**Goal:** Contact details screen with two-column layout, weekday-only date picker, booking summary panel, and self-contained finance calculator modal.

**Pre-session checks:**
- Session 7A complete and committed
- Shermin Finance integration method confirmed if possible - if not, build self-contained calculator (see prompt)

**Prompt:**

```
Read LivWarm_Quote_Forms_Spec.md fully before starting. Steps 1-7 are complete,
the upsell modal and micro-commitment screen are built. Continue the solar flow
build - Session 7B goal only.

Context from previous sessions (do not rebuild, just match):
- Progress bar, step label and percentage working across 9 total steps
- Breadcrumb pills accumulate above each question with edit icon, collapse after 6
- Back button top-left of step header on all screens except the first
- Answer cards: raised shadow default, sinks on hover, two-beat punch-and-rise on click,
  depressed selected state, 60% dimmed unselected, 500ms auto-advance
- Continue button: solid red pill, auto width, max 380px, centred, no red glow
- Content block max-width 1100px
- Total steps: 9
- Finance APR: 6.9%, 10-year term, Math.ceil on monthly payment, no VAT shown anywhere
- warrantyAdded state is in app state from Session 7A - use it in the booking summary

Session 7B goal - build Step 8 (contact details) only.
Do not touch any previously built screens.

---

STEP 8 - CONTACT DETAILS

Progress bar: Step 8 of 9. Label: "Your details".

Two-column layout (desktop: 55% left / 45% right, stacks to single column below 768px):

LEFT COLUMN - Contact form:

Heading: "Almost there - just a few details" - 1.75rem, bold, #2D2D2D
Subheading: "We'll use these to confirm your installation." - 1rem, #4A4A4A

Form fields (all required, 16px minimum font size, red focus ring on inputs):
- First name (half width)
- Surname (half width, same row)
- Email address (full width)
- Phone number (full width)

Field styling:
- Border: 1px solid #E5E5E5 default, 2px solid #E8323A on focus
- Border-radius: 8px
- Padding: 12px 16px
- Background: white
- Label above each field: 0.875rem, font-weight 500, #2D2D2D

Preferred installation date:
- Label: "Preferred installation date"
- Subtext below label: "Weekdays only. Our team will confirm availability
  after your technical review." - 0.8rem, #4A4A4A
- Custom calendar picker - render as a monthly grid
  (do not use the browser native date input)
- Weekdays only - Saturday and Sunday cells are visually muted
  (opacity 0.3, cursor not-allowed) and unselectable
- Selected date: red circle, white text
- Today's date: subtle red outline, no fill (unless selected)
- Month navigation: left/right chevron arrows
- Earliest selectable date: 14 days from today
  (installations need a minimum lead time)
- Selected date stored in app state as preferred_date (ISO format YYYY-MM-DD)

Continue button at bottom of left column:
- Label: "Confirm my booking →"
- Solid red pill, full width of left column
- Disabled and greyed out until all fields are populated and a date is selected
- On click: validates fields (basic - non-empty, email format, UK phone format),
  then advances to Step 9

RIGHT COLUMN - Booking summary panel:

Sticky positioning (position: sticky, top: 24px) so it stays visible as the
user scrolls the form.

Panel styling: white background, 1px border #E5E5E5, border-radius 16px,
padding 24px, box-shadow: 0 4px 16px rgba(0,0,0,0.08)

Panel heading: "Your booking summary" - 1.1rem, bold, #2D2D2D

System section:
- Tier name (e.g. "Our Recommended Package") - 0.95rem, bold, #2D2D2D
- Panel + battery line (e.g. "10 × 445W panels + Fox ESS EP12") - 0.875rem, #4A4A4A
- If warrantyAdded: "5-Year Workmanship Guarantee" line with green tick - 0.85rem

Horizontal divider

Price section:
- "System price" label + "£{total}" value - label 0.875rem #4A4A4A, value 1rem bold #2D2D2D
- If warrantyAdded: show "+£199 warranty" as a separate line item in small grey text
- Monthly finance line: "or £{monthly}/mo" in red (#E8323A), 0.95rem
- "at 6.9% APR, 10-year term" below monthly line - 0.75rem, #999
- "Explore finance options" link - 0.875rem, red underlined, opens finance modal

Horizontal divider

Savings section:
- "Monthly bill reduction" label + "£{monthlySaving} est./mo" value
- "20-year saving" label + "£{saving20yr} est." value
- Both: label 0.8rem #4A4A4A, value 0.95rem bold #2D2D2D

Horizontal divider

Trust badges (three inline, centred):
- MCS Certified
- Trustpilot 4.9 ★
- HIES Member
- Small icons + text, 0.75rem, #4A4A4A

---

FINANCE MODAL

Triggered by "Explore finance options" link. Modal overlay, not a new step.

NOTE ON SHERMIN: The live Shermin STAX integration is not yet confirmed.
Build a fully working self-contained finance calculator. When Shermin
credentials and embed method are confirmed, the "Apply for Finance" button
in this modal will be replaced with the Shermin embed or redirect.
Design the modal so the Shermin integration point is obvious and isolated.

Modal design:
- White modal, max-width 520px, centred, border-radius 16px
- Dark overlay behind (rgba(0,0,0,0.55))
- Close button (×) top-right corner
- Heading: "Finance options" - 1.4rem, bold, #2D2D2D

Payment toggle at top:
- Two toggle options: "Pay monthly" / "Pay in full"
- Styled as tab toggles - active tab: red background, white text
- Default: "Pay monthly" active

Pay monthly section (shown when "Pay monthly" is active):

Deposit slider:
- Label: "Deposit amount"
- Slider: 0% to 30% of system price, in £500 steps
- Shows: "£{depositAmount}" above the slider thumb
- Shows: "Remaining to finance: £{financeAmount}" below in small grey text

Loan term selector:
- Label: "Loan term"
- Segmented control (not a dropdown): 5yr / 7yr / 10yr / 12yr / 15yr
- Default: 10yr
- Active: red background, white text

Live monthly payment:
- Updates immediately on any change to slider or term
- Formula: monthlyRate = APR / 12, where APR = 0.069
  monthlyPayment = Math.ceil(financeAmount × (monthlyRate × (1 + monthlyRate)^months)
  / ((1 + monthlyRate)^months - 1))
- Display: "£{monthlyPayment} per month" - 2.25rem, bold, #E8323A, centred
- Below: "over {term} years" - 0.875rem, #4A4A4A

FCA representative example (required - must be present and legible):
- Small text block, 0.75rem, #666, border-top 1px solid #E5E5E5, padding-top 12px
- "Representative example: Borrowing £{financeAmount} over {term} years
  at 6.9% APR (fixed). Monthly repayments of £{monthlyPayment}.
  Total amount repayable: £{totalRepayable}.
  Credit is subject to status and affordability."
- All values update live with the calculator

"Apply for Finance" button:
- Solid red pill, full width of modal
- Label: "Apply for Finance with Shermin →"
- For now: clicking shows a small inline message below the button:
  "Finance applications will open shortly. Call 0800 222 9494 to discuss."
- SHERMIN INTEGRATION POINT: this button and the message below it are the
  only things that change when Shermin embed is added. Mark with a comment
  in the code: // SHERMIN_INTEGRATION_POINT

Pay in full section (shown when "Pay in full" is active):
- "Full system price" - large, bold, #2D2D2D: "£{total}"
- Savings vs finance note: "Save £{financeSavingVsTotal} vs paying monthly over 10 years"
  in small green text (#4CAF50)
  (financeSavingVsTotal = (monthlyPayment10yr × 120) - total, where monthlyPayment10yr
  uses 0 deposit and 10 years)
- "Proceed to payment →" red pill button - closes modal and advances to Step 9

---

IMPORTANT NOTES:
- All currency: £X,XXX with commas, no decimals
- Monthly figures: Math.round. Monthly payment: Math.ceil.
- No VAT shown anywhere
- preferred_date stored in ISO format YYYY-MM-DD
- full_name, email, phone stored in app state for Payaca payload
- Finance modal does NOT advance to Step 9 - only the "Confirm my booking" button
  on the main form does that (or "Proceed to payment" on the Pay in full tab)
- Match all existing CSS variables, spacing, and animation patterns exactly
```

**Done when:** Step 8 renders at the correct progress bar position, both columns display correctly on desktop, calendar picker blocks weekends and dates within 14 days, booking summary shows correct system and pricing including warranty if added, finance modal calculates live with representative example updating, Shermin integration point is clearly marked in code.

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

Context from previous sessions (do not rebuild, just match):
- Progress bar, step label and percentage working across 9 total steps
- Breadcrumb pills accumulate above each question with edit icon, collapse after 6
- Back button top-left of step header on all screens except the first
- Continue button: solid red pill, auto width, max 380px, centred, no red glow
- Content block max-width 1100px
- Total steps: 9
- Finance APR: 6.9%, 10-year term, no VAT shown anywhere
- warrantyAdded, full_name, email, phone, preferred_date, product_selection,
  solar_panel_number, payment_total all in app state from previous steps

Session 8 goal - build Step 9 (payment) only:
- Progress bar: Step 9 of 9. Label: "Secure your booking"
- Booking summary recap at top (system, price, date)
- "How would you like to pay?" heading
- Two options: "Pay securely online" (Stripe) / "Spread the cost" (Shermin)
  - Shermin option: links out to Shermin application (placeholder URL for now)
- Stripe Payment Element: Card, Klarna, Revolut Pay
- "Your booking is secure" trust line with padlock icon
- "What happens next?" panel:
  1. Provisional Booking - we hold your slot
  2. Remote Survey - technical review within 48 hours
  3. Final Confirmation - install date confirmed
- Pay button: "Pay £{total}" - solid red pill
- Footer note: "Payments are securely processed by Stripe. No card details are
  stored by LivWarm."
- On successful payment: POST all app state to WordPress AJAX endpoint
  (use placeholder URL /wp-admin/admin-ajax.php?action=livwarm_solar_lead for now)
- On payment failure: show inline error, do not advance
- No VAT shown anywhere
```

**Done when:** Test card processes a payment in Stripe test mode and the success handler fires.

---

### Session 9: Step 10 Confirmation + Payaca Integration - TO BUILD

**Goal:** Confirmation screen and server-side lead handoff to Payaca.

**Prompt:**

```
Read LivWarm_Quote_Forms_Spec.md fully before starting. Steps 1-9 are complete.
Continue the solar flow build - Session 9 goal only.

Context from previous sessions (do not rebuild, just match):
- Progress bar, step label and percentage working across 9 total steps
- Content block max-width 1100px
- Total steps: 9
- All lead data in app state: full_name, email, phone, preferred_date,
  postcode, address_line1, town, latlong, roof_orientation, occupants,
  house_owner_type, house_type, roof_type, house_bedrooms,
  electricity_usage, day_unit_rate, night_unit_rate, rate_type,
  battery_location, battery_location_inside, battery_location_outside,
  has_ev, ev_charging_method, ev_plans, solar_panel_number,
  product_selection, payment_total, warrantyAdded

Session 9 goal - confirmation screen and Payaca integration:

STEP 10 - CONFIRMATION (no progress bar - flow complete):
- "You're all booked in!" headline - 2.25rem, bold, #2D2D2D
- Green tick animation on load (SVG, 64px, #4CAF50)
- System summary: tier name, panel count, battery, date confirmed
- "What happens next?" three-step process:
  1. Installation survey within 48 hours
  2. MCS paperwork and scaffolding arranged
  3. Installation day - typically 1-2 days
- Email confirmation note: "A confirmation has been sent to {email}"
- LivWarm contact details: 0800 222 9494, info@livwarm.co.uk
- QR code section: "Send us photos of your roof and meter cupboard"
  - QR code links to the Payaca follow-up photo submission flow
  - Use a placeholder QR code image for now

PAYACA INTEGRATION:
- Create WordPress AJAX endpoint via Code Snippets plugin (provide the PHP snippet)
- Endpoint creates customer + project in Payaca using the field map in Section 8 of spec
- Field map for solar (form ID 3) - map all available app state fields
- Include roof_orientation and occupants in the payload
- warrantyAdded maps to a custom field "warrantyAdded" in fData
- Handle success and failure responses gracefully - log errors, do not expose to user
- Endpoint URL: /wp-admin/admin-ajax.php?action=livwarm_solar_lead
- The React app POSTs to this endpoint after successful Stripe payment (already wired
  from Session 8 - confirm the endpoint URL matches)
```

**Done when:** Full test journey Steps 1-10 successfully creates a customer and project in Payaca. Confirmation screen displays correctly. PHP snippet is provided ready to paste into Code Snippets.

---

### Session 10: Polish + Mobile + Deploy - TO BUILD

**Goal:** Final polish, mobile testing, deployed to staging for client review.

**Prompt:**

```
Read LivWarm_Quote_Forms_Spec.md fully before starting. The solar flow build is complete.
This is the polish session.

Context from previous sessions (do not rebuild, just match):
- Progress bar, step label and percentage working across 9 total steps
- All steps 1-10 built and functional

Goals:
1. Test full flow on mobile (375px viewport upward) - fix any layout issues
2. Step 8 two-column layout stacks correctly below 768px
3. Carousel cards are swipeable and navigable on touch
4. Add any missing animations, transitions, micro-interactions
5. Check accessibility basics - keyboard navigation, focus states, alt text on images
6. Set up WordPress staging deployment via Code Snippets plugin
7. Remove Vercel domain from Google Maps API key restrictions
8. Document any final TBC items or known issues

No new features. Polish only.
```

**Done when:** Solar flow live on staging URL at deals.livwarm.co.uk, mobile-responsive down to 375px, accessible, ready for client review.

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
