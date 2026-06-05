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
| Google Maps API key (Maps JS only) | To set up |
| Shermin Finance integration method | To confirm |
| Panel count lookup table confirmed with UKEM | To confirm |
| Stripe account | To set up |
| Deposit vs full payment confirmed | To confirm |
| Payaca credentials valid | To confirm |

---

## Build Phase

---

### Session 1: Project Setup + Step 1 Qualifier Screens - COMPLETE

**Goal:** Working React app shell with brand styling, progress bar, breadcrumb pills, and Step 1 qualifier questions.

**What was built:**
- File structure: /solar/index.html as self-contained React SPA
- Brand styling: lbrand font, colour variables, typography scale, rounded corners
- Progress bar: bold red, percentage and step name visible, advances per question
- Breadcrumb pills: accumulate above each question, show previous answers with edit icon, centred
- Back button: top-left of step header on all screens except first
- Card interaction system: raised default, sinks on hover with shimmer sweep, two-beat punch-and-rise on click, depressed inset shadow selected state, 60% opacity desaturation on unselected cards, 500ms auto-advance delay
- Dot texture: lower-right corner of all cards, radial gradient, red dots on selected state
- Step 1: homeowner/landlord, property type, roof type, bedrooms
- Dead-ends: Flat property type and Flat roof redirect to /sorry-we-cannot-help. Landlord continues.
- LivWarm logo in header

**Prompt used:**

```
Read LivWarm_Quote_Forms_Spec.md fully before starting. We are building Session 1 of the solar flow.

Your goal for this session is to set up the project structure and build Step 1 of the solar flow only. Specifically:

1. Create the file structure: /solar/index.html as a self-contained React SPA
2. Set up the React shell with brand styling from the spec (colours, lbrand font with @font-face, typography scale, rounded corners)
3. Build the progress bar component - bold red, with percentage and step name visible, advances per question answered
4. Build the answer breadcrumb component - previous answers stack above current question as pill badges with edit icon, centred
5. Back button top-left of step header on all screens except the first
6. Build Step 1: the four qualifier questions (homeowner/landlord, property type, roof type, bedrooms) with the 3-state card interaction defined in the spec
7. Card interaction: raised shadow default, sinks on hover with shimmer sweep, two-beat punch-and-rise animation on click, settles into depressed inset shadow selected state, unselected cards dim to 60% opacity with desaturation, 500ms delay before auto-advancing
8. Dot texture in lower-right corner of all cards (radial-gradient dots, masked to corner, red dots on selected state)
9. Dead-end redirects to /sorry-we-cannot-help for Flat property type and Flat roof only. Landlord is NOT a dead-end - it continues through the flow.
10. LivWarm logo in header
11. Content block max-width 1100px centred. Two-card layouts max-width 860px centred.
12. No Continue buttons on card-based screens - cards auto-advance after 500ms
13. Total steps: 9

Do NOT build any other steps. Do NOT add placeholder content for later steps.
Reference the spec for exact colours, typography, and copy. Ask only if something is genuinely ambiguous.
```

**Done when:** index.html loads in browser, brand-styled qualifier screens work, breadcrumbs accumulate, dead-ends redirect, Landlord continues.

---

### Session 2: Step 2 Electricity Usage (kWh) - COMPLETE

**Goal:** kWh input screen with help modal and national average fallback.

**Prompt used:**

```
Read LivWarm_Quote_Forms_Spec.md fully before starting. Step 1 is complete and deployed. Continue the solar flow build - Session 2 goal only.

Context from Session 1 (do not rebuild these, just match them):
- Progress bar, step label and percentage are working and advance per question
- Answer breadcrumb pills accumulate above each question showing previous answers with an edit icon
- Back button sits top-left of the step header on all screens except the first
- Card interaction: raised shadow by default, sinks on hover, presses on click, settles into inset shadow depressed selected state with dark shimmer sweep on click
- Unselected cards dim to 60% opacity with desaturation after a selection is made
- 500ms delay before advancing to the next question after selection
- Content block is max-width 1100px, centred, vertically positioned at roughly 45% from top
- Two-card layouts are constrained to max-width 860px and centred
- No Continue buttons on card-based screens - cards auto-advance. Continue button only on input screens
- Total steps: 9
- No per-step summary screens - single consolidated review screen after all steps complete

Session 2 goal - build the electricity usage screen only:
- Annual kWh input with placeholder ("e.g. 4,100"), unit label ("kWh/yr"), styled to match the existing input patterns in the spec
- "Where do I find this?" link triggering a help modal - shows an annotated placeholder image of an energy bill with a caption explaining where to find annual kWh usage
- "I'm not sure - use national averages" link below the inputs that populates the fields with 4,100 kWh/yr and allows the user to proceed without manually entering values
- Continue button that only activates once the kWh field is populated - styled as a solid red pill button, full width of the content block, with neutral dark drop shadow that reduces and darkens on hover, presses down on active. No red glow on the shadow.
- Breadcrumb pill for this step shows the kWh value once confirmed e.g. "Usage: 4,100 kWh"
- State persistence - all values stored in app state and carried through to subsequent steps

Do not touch Step 1 or any other screens. Match all styling, spacing, typography and interaction patterns from Session 1 exactly.
```

**Done when:** User can enter kWh, use the fallback, view the help modal, and proceed to a placeholder Step 3.

---

### Session 3: Step 3 Electricity Tariff - COMPLETE

**Goal:** Tariff screen with toggle cards, rate inputs, and national average fallback.

**Prompt used:**

```
Read LivWarm_Quote_Forms_Spec.md fully before starting. Steps 1 and 2 are complete. Continue the solar flow build - Session 3 goal only.

Context from previous sessions (do not rebuild, just match):
- Progress bar, step label and percentage working across 9 total steps
- Breadcrumb pills accumulate above each question showing previous answers with edit icon, centred
- Back button top-left of step header on all screens except the first
- Answer cards: raised shadow default, sinks on hover with shimmer sweep, two-beat punch-and-rise animation on click, settles into depressed inset shadow selected state, unselected cards dim to 60% opacity with desaturation after selection, 500ms delay before advancing
- Dot texture in lower right corner of all cards - radial-gradient(circle, #d8d8d8 1px, transparent 1px) at 10px 10px spacing, masked with radial-gradient(ellipse at 100% 100%, rgba(0,0,0,0.5) 0%, transparent 100%), 65% width and height. Selected state uses rgba(232,50,58,0.25) red dots
- Continue button: neutral dark drop shadow default, darkens and shadow reduces on hover, presses down on active - no red glow
- Content block max-width 1100px centred, two-card layouts constrained to 860px centred
- No Continue buttons on card-based screens - cards auto-advance after 500ms
- No per-step summary screens - single consolidated review screen after all steps complete
- Total steps: 9

Session 3 goal - build the electricity tariff screen only:
- Screen title: "How are you charged for electricity?"
- Subtitle: "You'll find this on your latest electricity bill."
- Tariff toggles styled as mini answer cards - rectangular, rounded corners, dot texture in lower right corner. Selected state uses illuminated red glow: background: rgba(232,50,58,0.04), border: 1.5px solid rgba(232,50,58,0.9), red text, soft red bloom box-shadow. Selected dot texture uses rgba(232,50,58,0.25) red dots.
- If same rate selected: single unit rate input in p/kWh with "Where do I find this?" help modal
- If different rates selected: two inputs - Day rate (p/kWh) and Night rate (p/kWh) both with help links
- "I'm not sure - use national averages" link that populates 26.35p/kWh for single rate or 28p day / 15p night for economy 7
- Continue button - same styling as Session 2
- Breadcrumb pill: "Rate: 27p/kWh" or "Rate: 28p/15p (E7)"
- State persistence - all values stored in app state

Do not touch any previously built screens. Match all styling, spacing, typography and interaction patterns from existing screens exactly.
```

**Done when:** Tariff toggle cards work, rate inputs show correctly per selection, fallback populates correctly, breadcrumb shows rate value.

---

### Session 4: Steps 4 + 5 Battery and EV Details - COMPLETE

**Goal:** Battery location and EV cross-sell questions, including all sub-questions.

**What was built:**
- Step 4: Battery location (Inside / Outside / I'm not sure) with sub-locations
  - Inside: Garage / Utility room / Cupboard / Other
  - Outside: Side of the garage / Side of the house / Back of the house / Other
- Step 5: EV ownership (Yes / No)
  - Yes: charging method sub-question (Home charger / Public charger / Both)
  - No: planning sub-question (Yes within 2 years / Maybe 2-5 years / No plans)

**Prompt used:**

```
Read LivWarm_Quote_Forms_Spec.md fully before starting. Steps 1, 2 and 3 are complete and deployed. Continue the solar flow build - Session 4 goal only.

Context from previous sessions (do not rebuild, just match):
- Progress bar, step label and percentage working across 9 total steps
- Breadcrumb pills accumulate above each question showing previous answers with edit icon, centred
- Back button top-left of step header on all screens except the first
- Answer cards: raised shadow default, sinks on hover with shimmer sweep, two-beat punch-and-rise animation on click, settles into depressed inset shadow selected state, unselected cards dim to 60% opacity with desaturation after selection, 500ms delay before advancing
- Dot texture in lower right corner of all cards - radial-gradient(circle, #d8d8d8 1px, transparent 1px) at 10px 10px spacing, masked with radial-gradient(ellipse at 100% 100%, rgba(0,0,0,0.5) 0%, transparent 100%), 65% width and height. Selected state uses rgba(232,50,58,0.25) red dots
- Tariff toggles styled as mini answer cards with red glow selected state
- Continue button: neutral dark drop shadow default, darkens and shadow reduces on hover, presses down on active - no red glow
- Content block max-width 1100px centred, two-card layouts constrained to 860px centred
- No Continue buttons on card-based screens - cards auto-advance after 500ms
- No per-step summary screens - single consolidated review screen after all steps complete
- Total steps: 9

Session 4 goal - build Steps 4 and 5 only:

Step 4 - Battery Details:
- "Where would you like your battery installed?" - Inside / Outside / I'm not sure
- If Inside: "Where inside?" - Garage / Utility room / Cupboard / Other
- If Outside: "Where outside?" - Side of the garage / Side of the house / Back of the house / Other
- Sub-questions appear as the next accordion question, not a new step
- All answers stored in app state: battery_location, battery_location_inside, battery_location_outside

Step 5 - EV Details:
- "Do you have an electric vehicle?" - Yes / No
- If Yes: "How do you currently charge it?" - Home charger / Public charger / Both
- If No: "Are you planning to get one?" - Yes, within 2 years / Maybe in 2-5 years / No plans currently
- EV answers stored for use in panel sizing logic: has_ev, ev_charging_method, ev_plans

Use the card interaction pattern from previous sessions exactly. Do not touch any previously built screens.
```

**Done when:** Both steps work with all sub-questions, answers persist, user can navigate through to a placeholder Step 6.

---

### Session 5: Step 6 Address Lookup + Satellite Map + Orientation + Occupancy - TO BUILD

**Goal:** Postcode lookup, satellite map confirmation, roof orientation compass, occupancy question.

**Pre-session checks:**
- Ideal Postcodes API key available (confirm LivWarm account exists or create one)
- Google Maps JavaScript API key available with domain restrictions set for Vercel and deals.livwarm.co.uk
- Both keys to hand before starting

**Prompt:**

```
Read LivWarm_Quote_Forms_Spec.md fully before starting. Steps 1-5 are complete and deployed at livwarm-quotes.vercel.app/solar. Continue the solar flow build - Session 5 goal only.

Context from previous sessions (do not rebuild, just match):
- Progress bar, step label and percentage working across 9 total steps
- Breadcrumb pills accumulate above each question showing previous answers with edit icon, centred
- Back button top-left of step header on all screens except the first
- Answer cards: raised shadow default, sinks on hover with shimmer sweep, two-beat punch-and-rise animation on click, settles into depressed inset shadow selected state, unselected cards dim to 60% opacity with desaturation after selection, 500ms delay before advancing
- Dot texture in lower right corner of all cards - radial-gradient(circle, #d8d8d8 1px, transparent 1px) at 10px 10px spacing, masked with radial-gradient(ellipse at 100% 100%, rgba(0,0,0,0.5) 0%, transparent 100%), 65% width and height. Selected state uses rgba(232,50,58,0.25) red dots
- Tariff toggles styled as mini answer cards with red glow selected state
- Continue button: neutral dark drop shadow default, darkens and shadow reduces on hover, presses down on active - no red glow
- Content block max-width 1100px centred, two-card layouts constrained to 860px centred
- No Continue buttons on card-based screens - cards auto-advance after 500ms
- No per-step summary screens - single consolidated review screen after all steps complete
- Total steps: 9

Session 5 goal - build Step 6 only. This step has four parts - build all four:

PART A: Postcode lookup
- Heading: "Let's identify your roof"
- Postcode input + "Find Addresses" button using Ideal Postcodes API (api.ideal-postcodes.co.uk)
- Address dropdown populated from postcode lookup results
- "Can't find your address? Enter manually" fallback - shows individual address line inputs
- On address selection: store full address, lat/long, and calculate street bearing from the address geometry (bearing between this address lat/long and the next address in the same postcode to determine street orientation)
- Store: postcode, address_full, latlong, street_bearing

PART B: Satellite map confirmation
- On address selection, load full-screen Google Maps satellite view centred on the lat/long
- Pin drops on the selected property
- Tooltip overlay: "Is this the roof where you want the panels installed? Confirm, or reposition the pin by tapping your roof."
- Pin is draggable - if user repositions it, update stored lat/long
- Confirm button at bottom
- The satellite map is visual confirmation only - no data is extracted from it

PART C: Roof orientation
After satellite map confirmation, show the orientation screen:

- Auto-calculate a suggested front-door direction from the street bearing stored in Part A
- Show: "Based on your address, your front door appears to face [Direction]. Does that sound right?"
- Two cards: "Yes, that's right" / "No, let me check"
- If Yes: store orientation, advance to Part D
- If No: show the interactive compass UI:
  - Satellite map zoomed in close to the property (tighter than Part B)
  - Compass rose SVG overlaid top-right of the map - always north-up. If user rotates the map, compass rotates to maintain true north (listen for Maps JS heading_changed event)
  - Below the map: prompt "If you look out of your front door, which direction are you facing?"
  - Eight-point interactive compass graphic: N / NE / E / SE / S / SW / W / NW
  - User taps a direction - it highlights in LivWarm red (#E8323A)
  - Selected direction confirmed as text below the compass
  - Continue button

Store: roof_orientation (one of N/NE/E/SE/S/SW/W/NW)

PART D: Occupancy
- Card question: "How many people live in your home?"
- Cards: 1 / 2 / 3 / 4 / 5+
- Auto-advances after 500ms as per all card screens
- Breadcrumb pill: "3 people"
- Store: occupants

Note: if the user entered their own kWh in Step 2 (rather than using the national average fallback), occupancy is collected for data purposes but does not override their stated usage value.

This is the most complex step in the build. Test each part thoroughly before declaring done. Use placeholder API keys during build if needed, with clear comments where keys need inserting.

Done when: A real postcode returns addresses, satellite map shows the correct property, pin is moveable, orientation suggestion works and the compass UI is functional, occupancy question works and all values are stored in app state.
```

**Done when:** All four parts working end-to-end. Real postcode returns addresses, map shows property, orientation captured, occupancy captured, all values in app state.

---

### Session 6: Step 7 Quote Screen - TO BUILD

**Goal:** The quote screen - the conversion centrepiece.

**Pre-session checks:**
- Panel count lookup table confirmed with UKEM
- Pricing data in pricing.json

**Prompt:**

```
Read LivWarm_Quote_Forms_Spec.md fully before starting. Steps 1-6 are complete. Continue the solar flow build - Session 6 goal only.

Context from previous sessions (do not rebuild, just match):
- Progress bar, step label and percentage working across 9 total steps
- Breadcrumb pills accumulate above each question showing previous answers with edit icon, centred
- Back button top-left of step header on all screens except the first
- Answer cards: raised shadow default, sinks on hover with shimmer sweep, two-beat punch-and-rise animation on click, settles into depressed inset shadow selected state, unselected cards dim to 60% opacity with desaturation after selection, 500ms delay before advancing
- Dot texture in lower right corner of all cards - radial-gradient(circle, #d8d8d8 1px, transparent 1px) at 10px 10px spacing, masked with radial-gradient(ellipse at 100% 100%, rgba(0,0,0,0.5) 0%, transparent 100%), 65% width and height. Selected state uses rgba(232,50,58,0.25) red dots
- Continue button: neutral dark drop shadow default, darkens and shadow reduces on hover, presses down on active - no red glow
- Content block max-width 1100px centred, two-card layouts constrained to 860px centred
- Total steps: 9

Session 6 goal - build Step 7 (the quote screen) only.

Follow the reading order from the spec exactly - content top to bottom:
1. Price headline - "£17,069 or from £182/month" - large, prominent, above the fold
2. Three scannable savings figures - Monthly saving / 20-year saving / Break-even year - immediately below price, readable in 2 seconds
3. Three tier cards - Essential / Performance (RECOMMENDED badge) / Custom - live price and savings update when user switches tiers, smooth transition
4. What's included - panel count, battery, inverter, monitoring, installation
5. Trust signals - MCS Certified, Trustpilot 4.9, partner logos
6. Single CTA - "Continue with this system" - prominent, full-width

The satellite map does NOT appear on this screen.

Panel sizing logic (from app state collected in previous steps):
- Base panel count from property type + bedrooms lookup table (see spec Section 6)
- EV adjustments: has_ev=true add 2 panels, ev_plans=within_2_years add 2 panels, ev_plans=maybe_2_5_years add 1 panel
- Annual generation = base generation × orientation multiplier (S=1.0, SE/SW=0.93, E/W=0.82, NE/NW=0.65, N=0.52)

Financial projection calculations (from spec Section 6):
- Use user-entered kWh and rate from Steps 2-3, or occupancy-derived estimate if national average was used
- export_tariff = 15p/kWh
- self_consumption_rate = 0.5
- annual_saving = (annual_generation × 0.5 × grid_import_rate) + (annual_generation × 0.5 × export_tariff)
- break_even_year = system_cost / annual_saving
- 20_year_saving = (annual_saving × 20) - system_cost

Battery sizing for Performance tier (from spec Section 6).
Custom tier: user-selectable panel count and battery from dropdowns.

Use the 3-state card interaction on tier cards - same system as answer cards.
```

**Done when:** Real user journey produces accurate quote with pricing from pricing.json, savings figures calculate correctly, tier switching updates price and savings live.

---

### Session 7: Step 8 Upsell + Micro-commitment + Contact Details - TO BUILD

**Goal:** Upsell modal, micro-commitment step, contact details screen, finance calculator.

**Pre-session checks:**
- Shermin finance integration method confirmed

**Prompt:**

```
Read LivWarm_Quote_Forms_Spec.md fully before starting. Steps 1-7 are complete. Continue the solar flow build - Session 7 goal only.

[Insert full context block from previous sessions here - copy from Session 6 prompt]

Session 7 goal - build the upsell modal, micro-commitment step, and Step 8 contact details screen:

UPSELL MODAL (triggered on Continue from quote screen):
- "Enhance Your System" heading
- Extended Warranty toggle: 5-year workmanship guarantee (+£199)
- BUS Heat Pump Grant cross-sell card (orange highlight): £7,500 grant available - "click to enquire"
- "Not this time" / "Continue: Add Selected" buttons

MICRO-COMMITMENT STEP (after upsell modal):
- Summary of selected tier: name, panel count, battery, price
- Single button: "This looks right - get my full quote"
- This is a brief confirmation screen, not a full step - no progress bar increment

STEP 8 - CONTACT DETAILS (full dedicated screen, NOT a modal):
- Left side: contact form - First name, Surname, Email, Phone
- Preferred installation date: calendar picker, weekdays only, with "Weekdays only" note visible
- Copy near date picker: "Select your preferred date. Our team will confirm availability after your technical review."
- Right side: Booking summary panel showing selected system, price breakdown, savings estimates, trust badges
- "Explore finance options" link opens finance modal
- Finance modal: toggle Pay monthly/Cash, loan term dropdown (up to 15 years), APR from Shermin, deposit slider (0-30%), live monthly payment calculation, representative example (FCA compliant)

Use Shermin Finance integration method confirmed in pre-session checks.
```

**Done when:** Upsell modal works, micro-commitment shows correctly, contact form collects all fields, date picker works weekdays only, finance modal calculates live.

---

### Session 8: Step 9 Payment via Stripe - TO BUILD

**Goal:** Stripe Payment Element with Card, Klarna, Revolut Pay.

**Pre-session checks:**
- LivWarm Stripe account set up, publishable key available
- Deposit vs full payment confirmed by client

**Prompt:**

```
Read LivWarm_Quote_Forms_Spec.md fully before starting. Steps 1-8 are complete. Continue the solar flow build - Session 8 goal only.

[Insert full context block from previous sessions here]

Session 8 goal - build Step 9 (payment) only:
- Booking summary recap at top
- "How would you like to pay?" - Pay securely online (Stripe) vs Spread the cost (Shermin)
- Stripe Payment Element handling Card, Klarna, Revolut Pay in one component
- "Your booking is secure" trust line
- "What happens next?" panel: Provisional Booking / Remote Survey / Final Confirmation
- Pay button showing the amount: "Pay £X,XXX.00"
- Footer: "Payments are securely processed by Stripe"
- On successful payment: POST lead data to WordPress AJAX endpoint (placeholder - endpoint built in Session 9)

Use the LivWarm Stripe publishable key.
```

**Done when:** Test card processes payment in Stripe test mode.

---

### Session 9: Step 10 Confirmation + Payaca Integration - TO BUILD

**Goal:** Confirmation screen and server-side lead handoff to Payaca.

**Prompt:**

```
Read LivWarm_Quote_Forms_Spec.md fully before starting. Steps 1-9 are complete. Continue the solar flow build - Session 9 goal only.

[Insert full context block from previous sessions here]

Session 9 goal - confirmation screen and Payaca integration:

STEP 10 - CONFIRMATION:
- "You're all booked in!" headline - warm, relationship-starting tone
- Summary of selected system
- Preferred date confirmed
- "What happens next" 3-step process
- QR code for photo submission
- Email confirmation note
- LivWarm contact details visible

PAYACA INTEGRATION:
- Create WordPress AJAX endpoint via Code Snippets plugin
- Endpoint receives full form data, calls Payaca API server-side using existing credentials and field map (Section 8 of spec)
- On successful Stripe payment, React form POSTs lead data to this endpoint
- Payload must include roof_orientation and occupants fields (new fields added to spec)
- Handle success and failure states gracefully

This completes the solar flow end-to-end.
```

**Done when:** Full test journey Steps 1-10 successfully creates a customer and project in Payaca.

---

### Session 10: Polish + Mobile + Deploy - TO BUILD

**Goal:** Final polish, mobile testing, deployed to staging for client review.

**Prompt:**

```
Read LivWarm_Quote_Forms_Spec.md fully before starting. The solar flow build is complete. This is the polish session.

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

Each needs its own pricing.json from the UKEM spreadsheet and the same Payaca field map approach.

---

## Roadmap Maintenance

At the end of every build session, ask Claude Code:

```
Write a session handover note covering: what was completed, what was not, any
TBC items raised, and what the next session should focus on. Add it to Section 11
of the spec document.
```
