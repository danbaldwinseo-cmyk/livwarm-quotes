# LivWarm Quote Forms - Build Roadmap

_Companion to LivWarm_Quote_Forms_Spec.md. Use this document to manage the build session by session._

---

## How to Use This Document

Each session below has:
- **Goal** - the single deliverable for that session
- **Pre-session checks** - what you need ready before starting
- **Prompt** - the exact text to paste into Claude Code to start the session
- **Done when** - clear criteria for ending the session

**Golden rule:** One session = one goal. When the goal is met, save the work, end the session, start the next one separately. Resist the urge to "just do a bit more" - long sessions degrade output quality.

**Where each session happens:**
- Pre-build sessions happen in this Claude Project (Sonnet is fine)
- Build sessions happen in Claude Code in VS Code (use Opus)

---

## Pre-Build Phase

### Pre-Session A: Lock the Spec - COMPLETE

Spec and roadmap added to Project Knowledge. Project instructions set.

### Pre-Session B: External Housekeeping (no Claude needed)

**Goal:** All TBC items from the spec resolved or in progress.

**Tasks:**
- [ ] Check IBrand font licence covers web embedding
- [ ] Enable Google Solar API in Google Cloud console
- [ ] Confirm panel count lookup table with UKEM
- [ ] Call Shermin to confirm finance integration method (embed/API/link)
- [ ] Confirm with UKEM whether deposit or full payment at booking step
- [ ] Set up LivWarm Stripe account, get publishable key
- [ ] Get IBrand woff font files ready
- [ ] Confirm Payaca credentials in existing PHP are still valid

---

## Build Phase

### Session 1: Project Setup + Step 1 Qualifier Screens (~60 mins)

**Goal:** Working React app shell with the four qualifier questions, brand styling, progress bar, and answer breadcrumb.

**Pre-session checks:**
- VS Code open with livwarm-quotes folder
- Claude Code panel open in sidebar
- Model set to Opus
- LivWarm_Quote_Forms_Spec.md in project folder
- IBrand woff files in /fonts/ folder (or use Nunito fallback if not yet available)

**Prompt:**

```
Read LivWarm_Quote_Forms_Spec.md fully before starting. We are building Session 1 of the solar flow.

Your goal for this session is to set up the project structure and build Step 1 of the solar flow only. Specifically:

1. Create the file structure as defined in Section 4 of the spec (folder: /solar/, with index.html as a self-contained React SPA)
2. Set up the React shell with the brand styling from Section 3 (colours, IBrand font with @font-face declaration, typography scale, rounded corners)
3. Build the progress bar component - bold red, with percentage and step name visible
4. Build the answer breadcrumb component - previous answers stack above current question as pill badges
5. Build Step 1: the four qualifier questions (homeowner/landlord, property type, roof type, bedrooms) with the 3-state card interaction defined in Section 7
6. Implement the dead-end redirects to /sorry-we-cannot-help for landlords, flats, and flat roofs
7. Add the LivWarm logo to the header

Do NOT build any other steps yet. Do NOT build the styling for screens beyond Step 1. Do NOT add placeholder content for later steps.

Reference the spec for exact colours, typography, card interactions, and copy. Ask me only if something in the spec is ambiguous.
```

**Done when:** You can load index.html in a browser, see the brand-styled qualifier screens, and click through them with breadcrumbs accumulating and dead-ends redirecting correctly.

---

### Session 2: Step 2 Electricity Usage (~45 mins)

**Goal:** Electricity usage screen with national average fallback and help modal.

**Prompt:**

```
Read LivWarm_Quote_Forms_Spec.md. Continue the solar flow build. Step 1 is complete.

Your goal for this session is to build Step 2 only: the electricity usage screen. Specifically:

1. Annual kWh input with placeholder, unit label
2. Unit rate toggle (same day/night vs different) and rate inputs in p/kWh
3. "I'm not sure" link that applies national averages (4,100 kWh/yr, 26.35p/kWh)
4. Help modal showing an annotated example energy bill (use placeholder image for now if needed)
5. State persistence so values are stored in app state and carry through

Do not touch other steps. Match the styling and component patterns established in Session 1.
```

**Done when:** The user can enter kWh and unit rates, use the fallback, view the help modal, and proceed to a placeholder Step 3.

---

### Session 3: Steps 3 + 4 Battery and EV Details (~45 mins)

**Goal:** Battery location and EV cross-sell questions.

**Prompt:**

```
Read LivWarm_Quote_Forms_Spec.md. Continue the solar flow build. Steps 1-2 are complete.

Your goal for this session is to build Steps 3 and 4:

Step 3 - Battery Details: Where would you like your battery installed (Inside/Outside/I'm not sure)? If Inside: Garage/Utility room/Cupboard/Other.

Step 4 - EV Details: Do you have an EV? If No: Are you planning to get one (Yes within 2 years / Maybe 2-5 years / No plans)?

Use the card interaction pattern from Session 1. The EV answers must be stored for later use in panel sizing logic.
```

**Done when:** Both steps work, answers persist, user can navigate through to a placeholder Step 5.

---

### Session 4: Step 5 Address Lookup + Satellite + Solar API (~90 mins)

**Goal:** Postcode lookup, Google Maps satellite confirmation, Solar API call returning roof data.

**Pre-session checks:**
- Google Solar API enabled in Google Cloud
- API key restrictions allow deals.livwarm.co.uk
- API key available to use

**Prompt:**

```
Read LivWarm_Quote_Forms_Spec.md. Continue the solar flow build. Steps 1-4 are complete.

Your goal for this session is to build Step 5 only: address lookup and roof confirmation. Specifically:

1. Postcode input + "Find Addresses" button using Google Places API
2. Address dropdown populated from postcode lookup
3. "Can't find your address? Enter manually" fallback
4. On address selection: full-screen Google Maps satellite view with pin on the property
5. Tooltip: "Is this the roof where you want the panels installed? Confirm, or reposition the pin by tapping your roof."
6. Confirm button triggers Google Solar API call with lat/long
7. Store the Solar API response (roof area, sunshine hours, panel capacity) for use on the quote screen
8. Implement the fallback panel sizing table from Section 6 if the Solar API returns no data

This is the most technically complex step. Test thoroughly before declaring done.
```

**Done when:** A real postcode (like DY13 8UA) returns addresses, the satellite map shows the correct property, the pin is moveable, and the Solar API returns real roof data stored in app state.

---

### Session 5: Step 6 Quote Screen (~120 mins)

**Goal:** The quote screen - the most important screen in the flow.

**Prompt:**

```
Read LivWarm_Quote_Forms_Spec.md. Continue the solar flow build. Steps 1-5 are complete.

Your goal for this session is to build Step 6: the quote screen. This is the conversion centrepiece - get the details right.

Follow Section 7 of the spec exactly for the reading order: price headline first, three savings figures second, tier cards third, what's included fourth, trust signals fifth, single CTA sixth. The satellite map does NOT appear on this screen.

Specifically:
1. Price headline - large, prominent, above the fold
2. Three scannable savings figures - monthly saving, 20-year saving, break-even year
3. Three tier cards - Essential, Performance (RECOMMENDED badge), Custom
4. Live price update when user switches tiers - smooth transition
5. What's included list - panel count, battery, inverter, monitoring, installation
6. Trust signals - MCS Certified, Trustpilot 4.9, partner logos
7. 20-year financial chart with adjustable projection slider (1-25 years)
8. Apply the financial projection calculations from Section 6 using national averages
9. Apply the panel sizing logic from Section 6 using the Solar API data from Step 5

Use the 3-state card interaction defined in Section 7 - default shadow, lift on hover, press on selected.
```

**Done when:** A real user journey produces a real quote with accurate pricing, savings figures, and the user can switch between tiers seeing live updates.

---

### Session 6: Step 7 Upsell Modal + Step 8 Contact + Finance Calculator (~90 mins)

**Goal:** Upsell modal, contact details screen, finance calculator.

**Pre-session checks:**
- Shermin finance integration method confirmed (embed/API/link)

**Prompt:**

```
Read LivWarm_Quote_Forms_Spec.md. Continue the solar flow build. Steps 1-6 are complete.

Your goal for this session is to build Steps 7 and 8:

Step 7 - Upsell Modal: "Enhance Your System" with Extended Warranty (+£199) toggle and BUS Heat Pump Grant cross-sell card. "Not this time" and "Continue: Add Selected" buttons.

Step 8 - Your Details: Full dedicated screen (NOT a modal) with contact form (first name, surname, email, phone), preferred installation date picker, booking summary panel, finance options link/calculator.

Include the micro-commitment confirmation step before contact details, as defined in Section 7 of the spec.

For the finance calculator, use the approach confirmed with Shermin (embed/API/link-out).
```

**Done when:** User flows from quote screen → upsell modal → micro-commitment → contact details → finance calculator works.

---

### Session 7: Step 9 Payment via Stripe (~90 mins)

**Goal:** Stripe Payment Element integration with Card, Klarna, Revolut Pay.

**Pre-session checks:**
- LivWarm Stripe account set up
- Publishable key available
- Confirmed: full payment or deposit at this step

**Prompt:**

```
Read LivWarm_Quote_Forms_Spec.md. Continue the solar flow build. Steps 1-8 are complete.

Your goal for this session is to build Step 9: the payment step. Specifically:

1. Booking summary recap at the top
2. "How would you like to pay?" with two options: Pay securely online (Stripe) vs Spread the cost with finance (Shermin)
3. Stripe Payment Element handling Card, Klarna, Revolut Pay through one component
4. "Your booking is secure" trust line
5. "What happens next?" panel with the 3-step process (Provisional Booking, Remote Survey, Final Confirmation)
6. Pay button showing the amount
7. Footer note: "Payments are securely processed by Stripe"

Use the LivWarm Stripe publishable key. Server-side payment confirmation handled by the WordPress AJAX endpoint to be built in Session 8.
```

**Done when:** A test card processes a payment successfully via Stripe in test mode.

---

### Session 8: Step 10 Confirmation + WordPress AJAX Handler + Payaca Integration (~90 mins)

**Goal:** Confirmation screen and server-side lead handoff to Payaca.

**Prompt:**

```
Read LivWarm_Quote_Forms_Spec.md. Continue the solar flow build. Steps 1-9 are complete.

Your goal for this session is to build the confirmation step AND the server-side Payaca integration.

Step 10 - Confirmation: "You're all booked in!" headline, system summary, preferred date confirmed, "What happens next" 3-step process, QR code for photo submission, email confirmation note.

Payaca integration:
1. Create a WordPress AJAX endpoint via Code Snippets plugin
2. The endpoint receives the full form data, calls the Payaca API server-side using the existing credentials and field map (Section 8 of the spec)
3. On successful Stripe payment, the React form POSTs the lead data to this endpoint
4. Handle success and failure states gracefully

This completes the solar flow end-to-end.
```

**Done when:** A test journey from Step 1 to Step 10 successfully creates a customer and project in Payaca.

---

### Session 9: Polish + Mobile + Staging Deploy (~60 mins)

**Goal:** Final polish, mobile testing, deployed to staging for client review.

**Prompt:**

```
Read LivWarm_Quote_Forms_Spec.md. The solar flow build is complete. This is the polish session.

Your goals:
1. Test the full flow on mobile (375px viewport upward) - fix any layout issues
2. Add any missing animations, transitions, micro-interactions
3. Check accessibility basics - keyboard navigation, focus states, alt text on images
4. Set up the WordPress staging deployment via Code Snippets plugin
5. Document any final TBC items or known issues

No new features. Polish only.
```

**Done when:** The solar flow is live on a staging URL, mobile-responsive, accessible, and ready for client review.

---

## Subsequent Flows

Once the solar flow is live and approved:

| Flow | Sessions | Notes |
|---|---|---|
| EV Charger | 2-3 | Simplest flow |
| Heat Pump / ASHP | 3-4 | Similar complexity to solar without satellite/Solar API |
| Boiler Upgrade | 4-5 | Most questions, BUS grant logic |

Each will need its own pricing data extracted from the UKEM spreadsheet and the same Payaca field map approach (using form IDs already in existing PHP).

---

## Roadmap Maintenance

At the end of every build session, ask Claude Code:

```
Write a session handover note covering: what was completed, what was not, any TBC items raised, and what the next session should focus on. Add it to Section 10 of LivWarm_Quote_Forms_Spec.md.
```
