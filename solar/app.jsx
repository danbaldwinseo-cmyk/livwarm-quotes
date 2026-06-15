    const { useState, useCallback, useRef, useLayoutEffect } = React;

    /* ============================================================
       CONFIG
       ============================================================ */
    const DEAD_END_PATH = '/sorry-we-cannot-help';
    // Solar flow has 8 user-facing input steps (Steps 1-6, 8, 9 in the spec;
    // the upsell modal and post-payment confirmation are not progress steps).
    const TOTAL_STEPS = 9;

    /* ============================================================
       ICONS — rounded line icons in brand red (Section 7 #10)
       stroke: currentColor so they inherit the brand colour.
       ============================================================ */
    const Svg = (props) => (
      <svg width={props.size || 32} height={props.size || 32} viewBox="0 0 24 24"
           fill="none" stroke="currentColor" strokeWidth="1.8"
           strokeLinecap="round" strokeLinejoin="round">{props.children}</svg>
    );

    const ICONS = {
      homeowner: <Svg><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v10h14V10" /><path d="M10 20v-5h4v5" /></Svg>,
      landlord: <Svg><path d="M4 21V5l8-2v18" /><path d="M12 21V9l8 2v10" /><path d="M8 8h0M8 12h0M8 16h0M16 13h0M16 17h0" /></Svg>,
      detached: <Svg><path d="M4 11 12 5l8 6" /><path d="M6 10v10h12V10" /><path d="M10 20v-4h4v4" /></Svg>,
      semi: <Svg><path d="M2 11 7 7l5 4" /><path d="M3 10v10h8V10" /><path d="M12 11l5-4 5 4" /><path d="M13 10v10h8V10" /></Svg>,
      terrace: <Svg><path d="M3 9v11h18V9" /><path d="M3 9l3-3 3 3 3-3 3 3 3-3 3 3" /><path d="M8 20v-4h3v4M13 20v-4h3v4" /></Svg>,
      bungalow: <Svg><path d="M3 13 12 7l9 6" /><path d="M5 12v8h14v-8" /><path d="M10 20v-4h4v4" /></Svg>,
      flat: <Svg><rect x="6" y="3" width="12" height="18" rx="1" /><path d="M9 7h0M12 7h0M15 7h0M9 11h0M12 11h0M15 11h0M9 15h0M15 15h0" /><path d="M11 21v-3h2v3" /></Svg>,
      pitched: <Svg><path d="M3 13 12 5l9 8" /><path d="M5 13v6h14v-6" /></Svg>,
      flatroof: <Svg><path d="M4 8h16v3H4z" /><path d="M6 11v8h12v-8" /><path d="M10 19v-4h4v4" /></Svg>,
      bed: <Svg size={28}><path d="M3 17v-5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2" /><path d="M3 17h18v3" /><path d="M21 20v-7a2 2 0 0 0-2-2" /><path d="M7 10V8a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2" /></Svg>,
      sad: <Svg size={56}><circle cx="12" cy="12" r="9" /><path d="M8 15s1.5-2 4-2 4 2 4 2" /><path d="M9 9h.01M15 9h.01" /></Svg>,
      check: <Svg size={18}><path d="m20 6-11 11-5-5" /></Svg>,
      star: <Svg size={16}><path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.2l1-5.8L3.5 9.2l5.9-.9z" /></Svg>,
      shield: <Svg size={16}><path d="M12 3l7 3v6c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z" /><path d="m9 12 2 2 4-4" /></Svg>,
      // Step 4 — battery location
      inside: <Svg><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /><path d="M9 20v-6h6v6" /></Svg>,
      outside: <Svg><circle cx="12" cy="12" r="4" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" /></Svg>,
      unsure: <Svg><circle cx="12" cy="12" r="9" /><path d="M9.2 9.3a3 3 0 0 1 5.6 1.2c0 2-2.8 2.5-2.8 4" /><path d="M12 17.5h.01" /></Svg>,
      garage: <Svg><path d="M3 21V8l9-4 9 4v13" /><path d="M6 21v-8h12v8" /><path d="M6 16h12M6 18.5h12" /></Svg>,
      utility: <Svg><rect x="5" y="3" width="14" height="18" rx="2" /><circle cx="12" cy="13" r="3.5" /><path d="M8 6.5h.01M11 6.5h.01" /></Svg>,
      cupboard: <Svg><rect x="5" y="3" width="14" height="18" rx="1.5" /><path d="M12 3v18" /><path d="M10 10.5h.01M14 10.5h.01" /></Svg>,
      other: <Svg><circle cx="8" cy="12" r="1.2" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" /><circle cx="16" cy="12" r="1.2" fill="currentColor" stroke="none" /></Svg>,
      // Step 5 — EV
      evcharge: <Svg><path d="M13 2 4 14h6l-1 8 9-12h-6z" /></Svg>,
      car: <Svg><path d="M5 12l1.7-5A2 2 0 0 1 8.6 5.6h6.8a2 2 0 0 1 1.9 1.4L19 12" /><path d="M3 12h18v4a1 1 0 0 1-1 1h-1" /><path d="M5 17H4a1 1 0 0 1-1-1v-4" /><circle cx="7.5" cy="17" r="2" /><circle cx="16.5" cy="17" r="2" /><path d="M9.5 17h5" /></Svg>,
      calcheck: <Svg><rect x="3.5" y="5" width="17" height="16" rx="2" /><path d="M3.5 10h17" /><path d="M8 3v4M16 3v4" /><path d="M9 15.5l2 2 4-4" /></Svg>,
      clock: <Svg><circle cx="12" cy="12" r="9" /><path d="M12 7.5V12l3 2" /></Svg>,
      noplan: <Svg><rect x="3.5" y="5" width="17" height="16" rx="2" /><path d="M3.5 10h17" /><path d="M8 3v4M16 3v4" /><path d="M10 14l4 4M14 14l-4 4" /></Svg>,
      backhouse: <Svg><path d="M11 10.5 16 6l5 4.5" /><path d="M12.5 10v8h7v-8" /><path d="M3 14h7" /><path d="M7.5 11.5 10 14l-2.5 2.5" /></Svg>,
      // Step 5 — EV charging method
      homecharge: <Svg><path d="M4 11l8-6 8 6" /><path d="M6 10.5V19h12v-8.5" /><path d="M10.5 12.4v1.6M13.5 12.4v1.6" /><path d="M9.5 14h5v1.4a2.5 2.5 0 0 1-5 0z" /><path d="M12 18.4v-1" /></Svg>,
      homebolt: <Svg><path d="M4 11l8-6 8 6" /><path d="M6 10.5V19h12v-8.5" /><path d="M12.7 11l-2.2 3.4h2.4L12.3 18" /></Svg>,
      chargerarrow: <Svg><rect x="3.5" y="3.5" width="9" height="17" rx="2" /><path d="M3.5 8.5h9" /><path d="M8.3 11l-1.6 3h2l-1.4 3" /><path d="M15 12h5" /><path d="M17.5 9.5 20 12l-2.5 2.5" /></Svg>,
      charger: <Svg><rect x="7" y="3.5" width="10" height="17" rx="2" /><path d="M7 8.5h10" /><path d="M12.8 11l-2.2 3.4h2.4L12.4 18" /></Svg>,
      // Step 6 — orientation confirm
      yescheck: <Svg><circle cx="12" cy="12" r="9" /><path d="m8.3 12 2.6 2.6L15.7 9" /></Svg>,
      compass: <Svg><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2.2 5.3-5.3 2.2 2.2-5.3z" /></Svg>,
      // Step 7 — carousel navigation chevrons
      chevronLeft: <Svg size={20}><path d="M15 18l-6-6 6-6" /></Svg>,
      chevronRight: <Svg size={20}><path d="M9 18l6-6-6-6" /></Svg>,
    };

    /* ============================================================
       STEP 1 QUESTIONS (Section 6 — Step 1 Qualifier)
       deadEnd options redirect to /sorry-we-cannot-help (Section 8)
       ============================================================ */
    const QUESTIONS = [
      {
        key: 'house_owner_type',
        question: 'Are you a homeowner or a landlord?',
        options: [
          { value: 'Homeowner', label: 'Homeowner', icon: 'homeowner' },
          { value: 'Landlord', label: 'Landlord', icon: 'landlord' },
        ],
      },
      {
        key: 'house_type',
        question: 'What type of home do you live in?',
        options: [
          { value: 'Detached', label: 'Detached', icon: 'detached' },
          { value: 'Semi-Detached', label: 'Semi-Detached', icon: 'semi' },
          { value: 'Terrace', label: 'Terrace', icon: 'terrace' },
          { value: 'Bungalow', label: 'Bungalow', icon: 'bungalow' },
          { value: 'Flat', label: 'Flat', icon: 'flat', deadEnd: true },
        ],
      },
      {
        key: 'roof_type',
        question: 'What type of roof do you have?',
        sub: 'Solar panels can only be installed on a pitched (sloping or angled) roof.',
        options: [
          { value: 'Pitched', label: 'Pitched', icon: 'pitched' },
          { value: 'Flat', label: 'Flat', icon: 'flatroof', deadEnd: true },
        ],
      },
      {
        key: 'house_bedrooms',
        question: 'How many bedrooms?',
        options: [
          { value: '1', label: '1', num: true },
          { value: '2', label: '2', num: true },
          { value: '3', label: '3', num: true },
          { value: '4', label: '4', num: true },
          { value: '5+', label: '5+', num: true },
        ],
      },
    ];

    // Step 1 (qualifier) occupies question indices 0..QUESTIONS.length-1.
    // Step 2 = annual usage (kWh); Step 3 = electricity tariff (rate).
    const USAGE_INDEX = QUESTIONS.length;        // 4
    const TARIFF_INDEX = QUESTIONS.length + 1;   // 5
    const BATTERY_INDEX = QUESTIONS.length + 2;  // 6
    const EV_INDEX = QUESTIONS.length + 3;       // 7
    const STEP6_INDEX = QUESTIONS.length + 4;    // 8 — Address & Roof Confirmation (4 internal phases)
    const QUOTE_INDEX = QUESTIONS.length + 5;    // 9 — Step 7 quote screen (Your Solar Potential)

    // Card interaction timings (Section 7 #9): minimum press hold, then settle.
    const PRESS_MS = 80;
    const SELECT_HOLD_MS = 500;

    /* ============================================================
       STEP 6 — geo helpers, maps loader, direction labels
       ============================================================ */
    // Google Maps JS key (Section 5). Domain-restricted to *.deals.livwarm.co.uk
    // and *.vercel.app. On localhost/file:// it may be blocked — components fall
    // back to a "map unavailable" panel and the flow still works.
    const GMAPS_KEY = 'AIzaSyBNkXCoi3mCSo8qSXj-S47cQKDZjzzEP54';

    const DIR_WORDS = {
      N: 'North', NE: 'North-East', E: 'East', SE: 'South-East',
      S: 'South', SW: 'South-West', W: 'West', NW: 'North-West',
    };

    // Initial bearing (degrees, 0=N clockwise) from point 1 to point 2.
    function bearingDeg(lat1, lon1, lat2, lon2) {
      const toRad = (d) => (d * Math.PI) / 180;
      const toDeg = (r) => (r * 180) / Math.PI;
      const dLon = toRad(lon2 - lon1);
      const y = Math.sin(dLon) * Math.cos(toRad(lat2));
      const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2))
              - Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
      return (toDeg(Math.atan2(y, x)) + 360) % 360;
    }

    // Snap a bearing to the nearest 8-point compass direction.
    function degToCompass(deg) {
      const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
      return dirs[Math.round((deg % 360) / 45) % 8];
    }

    // Best-effort front-door direction from the property point (Part C auto-suggestion).
    // Snaps the property to the nearest road via the Google Roads API; the property→road
    // vector approximates which way the front of the house faces. Returns an 8-point
    // direction, or null if it can't be determined — the caller then shows the compass UI.
    //
    // NOTE (technical limitation): the Roads API does NOT support browser CORS, so this
    // fetch will usually fail client-side and return null (→ compass UI shown). To make the
    // auto-suggestion work in production, proxy this lookup through the WordPress AJAX
    // handler (server-side) and return the snapped point to the form.
    async function suggestFrontDoorDir(lat, lng) {
      try {
        const url = 'https://roads.googleapis.com/v1/nearestRoads?points='
          + lat + ',' + lng + '&key=' + GMAPS_KEY;
        const res = await fetch(url);
        if (!res.ok) return null;
        const data = await res.json();
        const sp = data.snappedPoints && data.snappedPoints[0];
        if (!sp || !sp.location) return null;
        const rlat = sp.location.latitude, rlng = sp.location.longitude;
        if (rlat === lat && rlng === lng) return null;
        return degToCompass(bearingDeg(lat, lng, rlat, rlng));
      } catch (e) {
        return null;
      }
    }

    // Google Maps calls window.gm_authFailure when the key is rejected (e.g. the
    // domain isn't on the key's allow-list — the case on localhost/file://). We use
    // it to show our own "map unavailable" panel instead of Google's grey error card.
    let _gmapsAuthFailed = false;
    const _gmapsAuthSubs = new Set();
    window.gm_authFailure = function () {
      _gmapsAuthFailed = true;
      _gmapsAuthSubs.forEach((fn) => { try { fn(); } catch (e) {} });
    };
    function onGmapsAuthFailure(cb) { _gmapsAuthSubs.add(cb); return () => _gmapsAuthSubs.delete(cb); }

    // Singleton loader for the Google Maps JS API. Resolves with google.maps.
    let _gmapsPromise = null;
    function loadGoogleMaps() {
      if (window.google && window.google.maps) return Promise.resolve(window.google.maps);
      if (_gmapsPromise) return _gmapsPromise;
      _gmapsPromise = new Promise((resolve, reject) => {
        const cbName = '__lwGmapsReady';
        window[cbName] = () => resolve(window.google.maps);
        const s = document.createElement('script');
        s.src = 'https://maps.googleapis.com/maps/api/js?key=' + GMAPS_KEY
          + '&callback=' + cbName + '&v=weekly';
        s.async = true;
        s.defer = true;
        s.onerror = () => reject(new Error('Google Maps failed to load'));
        document.head.appendChild(s);
      });
      return _gmapsPromise;
    }

    /* ============================================================
       COMPONENTS
       ============================================================ */

    function Header() {
      return (
        <header className="lw-header">
          <a className="lw-logo" href="/" aria-label="LivWarm home">
            {/* Placeholder wordmark — swap for the official LivWarm SVG/PNG when supplied (Section 3) */}
            <span className="liv">Liv</span><span className="warm">Warm</span><span className="dot">.</span>
          </a>
          <div className="lw-trust-mini" aria-hidden="true">
            <span>{ICONS.shield} MCS Certified</span>
            <span>{ICONS.star} 4.9 Trustpilot</span>
            <span>{ICONS.check} 2yr Warranty</span>
          </div>
        </header>
      );
    }

    function ProgressBar({ percent, stepNumber, stepName, canGoBack, onBack }) {
      const pct = Math.max(0, Math.min(100, Math.round(percent)));
      return (
        <div className="lw-progress-wrap">
          <div className="lw-progress-meta">
            {/* Back button: hidden on the first question (nowhere to go back to),
                but kept in the layout so the step label stays centred. */}
            <button
              type="button"
              className="lw-back-button"
              onClick={onBack}
              aria-label="Go back to the previous question"
              tabIndex={canGoBack ? 0 : -1}
              style={canGoBack ? undefined : { visibility: 'hidden' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <span className="lw-progress-step">
              <span className="lw-step-count">Step {stepNumber} of {TOTAL_STEPS}</span> · {stepName}
            </span>
            <span className="lw-progress-pct">{pct}%</span>
          </div>
          <div className="lw-progress-track" role="progressbar"
               aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100"
               aria-label={`Step ${stepNumber} of ${TOTAL_STEPS}: ${stepName}`}>
            <div className="lw-progress-fill" style={{ width: pct + '%' }} />
          </div>
        </div>
      );
    }

    function Breadcrumbs({ answered, onEdit, expanded, onToggle }) {
      if (answered.length === 0) return null;
      // Collapse once there are more than 6 pills: show a toggle pill (left-most) plus
      // only the most recent answer. X is always the count that would be hidden.
      const collapsible = answered.length > 6;
      const hiddenCount = answered.length - 1;
      const showAll = !collapsible || expanded;
      const visible = showAll ? answered : [answered[answered.length - 1]];
      return (
        <div className="lw-breadcrumbs">
          {collapsible && (
            <button type="button" className="lw-pill lw-pill-toggle"
                    onClick={onToggle} aria-expanded={expanded}
                    title={expanded ? 'Hide previous answers' : 'Show previous answers'}>
              <span className="lw-pill-label">{hiddenCount} previous answers {expanded ? '∧' : '∨'}</span>
            </button>
          )}
          {visible.map((a) => (
            <button key={a.key} className="lw-pill" onClick={() => onEdit(a.index)}
                    title="Click to change this answer">
              <span className="lw-pill-label">{a.shortLabel}:</span>
              <span className="lw-pill-value">{a.value}</span>
              <span className="lw-pill-edit" aria-hidden="true">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
                </svg>
              </span>
            </button>
          ))}
        </div>
      );
    }

    const OptionCard = React.memo(function OptionCard({ option, selected, selectionTick, onPress, lock }) {
      const ref = useRef(null);
      // The ENTIRE press sequence runs via direct DOM class manipulation with NO React
      // setState until the very end — so no card (and none of its siblings) re-renders
      // mid-animation and loses its CSS hover state for a frame. Timers are parked on the
      // element itself. onPress (the single state update) fires only once the full
      // press → settle sequence is visually complete (PRESS_MS + SELECT_HOLD_MS).
      React.useEffect(() => {
        const el = ref.current;
        return () => { if (el) { clearTimeout(el._pressTimer); clearTimeout(el._selectTimer); } };
      }, []);

      const startSeq = (el) => {
        if (!el) return;
        if (lock && lock.current) return;             // another card is mid-sequence
        if (el._pressTimer || el._selectTimer) return;
        if (lock) lock.current = true;
        el.classList.add('is-pressing');              // plays card-press (pure CSS)
        el._pressTimer = setTimeout(() => {
          el._pressTimer = null;
          el.classList.remove('is-pressing');
          el.classList.add('is-settled');             // hold the settled depressed state
          el._selectTimer = setTimeout(() => {
            el._selectTimer = null;
            el.classList.remove('is-settled');
            if (lock) lock.current = false;
            onPress(option);                          // ← the only React state update
          }, SELECT_HOLD_MS);
        }, PRESS_MS);
      };
      // Pointer left the card / touch cancelled before the sequence finished: abort it
      // (clear both timers, drop the transient classes). A normal click/tap keeps the
      // pointer on the card, so the sequence runs to completion and the selection commits.
      const cancelSeq = (el) => {
        if (!el) return;
        clearTimeout(el._pressTimer); el._pressTimer = null;
        clearTimeout(el._selectTimer); el._selectTimer = null;
        el.classList.remove('is-pressing', 'is-settled');
        if (lock) lock.current = false;
      };

      const cls = 'lw-card' + (selected ? ' is-selected' : '');
      // Re-trigger the shimmer every time this card (re)enters the selected state —
      // including deselect/reselect of the same card. Exactly the requested trick:
      // remove the class, force a reflow, re-add it. selectionTick bumps on each
      // selection so this replays even when `selected` was already true.
      useLayoutEffect(() => {
        const el = ref.current;
        if (selected && el) {
          el.classList.remove('is-selected');
          void el.offsetWidth;            // force reflow so the CSS animation restarts
          el.classList.add('is-selected');
        }
      }, [selected, selectionTick]);
      return (
        <button
          ref={ref}
          type="button"
          className={cls}
          onMouseDown={(e) => startSeq(e.currentTarget)}
          onMouseLeave={(e) => cancelSeq(e.currentTarget)}
          onTouchStart={(e) => startSeq(e.currentTarget)}
          onTouchCancel={(e) => cancelSeq(e.currentTarget)}
          /* Keyboard (Enter/Space) drives the same DOM sequence — no onClick, so a
             plain mouse click never commits early or double-fires. */
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); startSeq(ref.current); } }}
          aria-pressed={selected}
        >
          <span className="lw-card-icon">
            {option.num ? <span className="lw-card-num">{option.label}</span> : ICONS[option.icon]}
          </span>
          {option.num
            ? <span className="lw-card-label">{option.value === '1'
                ? (option.unit || 'bedroom')
                : (option.unitPlural || 'bedrooms')}</span>
            : <span className="lw-card-label">{option.label}</span>}
        </button>
      );
    }, (prev, next) => {
      // Custom bail-out so a sibling card NEVER re-renders when another card is selected.
      // selectionTick bumps for the whole grid on every selection — but only the card that
      // is (or is becoming) selected needs it (to replay its shimmer); siblings must ignore
      // it, or they'd re-render and risk losing their CSS hover state for a frame.
      if (prev.selected !== next.selected) return false;                 // selection flipped → re-render
      if (next.selected && prev.selectionTick !== next.selectionTick) return false;  // selected card replays shimmer
      if (prev.option !== next.option) return false;
      if (prev.onPress !== next.onPress) return false;
      if (prev.lock !== next.lock) return false;
      return true;                                                       // otherwise skip the re-render
    });

    function Question({ q, currentValue, selectionTick, onSelect }) {
      const lock = useRef(false);   // one press sequence at a time across this grid
      return (
        <div className="lw-fade-in" key={q.key}>
          <h1 className="lw-question">{q.question}</h1>
          {q.sub && <p className="lw-question-sub">{q.sub}</p>}
          <div className={'lw-card-grid'
            + (q.options.length === 2 ? ' cols-2' : '')
            + (q.options.length === 5 ? ' grid-5' : '')
            + (currentValue ? ' has-selection' : '')}>
            {q.options.map((opt) => (
              <OptionCard
                key={opt.value}
                option={opt}
                selected={currentValue === opt.value}
                selectionTick={selectionTick}
                onPress={onSelect}
                lock={lock}
              />
            ))}
          </div>
        </div>
      );
    }

    // Step 2 — Annual electricity usage (kWh only)
    function UsageStep({ data, onChange, onUseAverages, onContinue, onShowHelp }) {
      const patch = (p) => onChange({ ...data, ...p });
      const cleanInt = (v) => v.replace(/[^0-9,]/g, '');
      const canContinue = String(data.usage).trim() !== '' || !!data.used_national_average_kwh;
      return (
        <div className="lw-fade-in lw-eu">
          <h1 className="lw-question">Your current electricity usage</h1>
          <p className="lw-question-sub">You'll find this on your latest electricity bill.</p>

          <div className="lw-field">
            <label className="lw-field-label" htmlFor="eu-usage">Annual electricity usage</label>
            <div className="lw-input-row">
              <input id="eu-usage" type="text" inputMode="numeric" autoComplete="off"
                     placeholder="e.g. 4,100" value={data.usage}
                     onChange={(e) => patch({ usage: cleanInt(e.target.value), used_national_average_kwh: false })} />
              <span className="lw-input-unit">kWh/yr</span>
            </div>
            <button type="button" className="lw-link" onClick={onShowHelp}>Where do I find this?</button>
          </div>

          <button type="button" className="lw-cta-outline" onClick={onUseAverages}>
            I don't know - use national averages
          </button>

          <button type="button" className="lw-cta" disabled={!canContinue} onClick={onContinue}>
            Continue
          </button>
        </div>
      );
    }

    // Step 3 — Electricity tariff (rate only)
    function TariffStep({ data, onChange, onUseAverages, onContinue, onShowHelp }) {
      const patch = (p) => onChange({ ...data, ...p });
      const cleanDec = (v) => v.replace(/[^0-9.]/g, '');
      const rateFilled = data.rateMode === 'different'
        ? (String(data.dayRate).trim() !== '' && String(data.nightRate).trim() !== '')
        : String(data.dayRate).trim() !== '';
      const canContinue = rateFilled || !!data.used_national_average_rate;
      return (
        <div className="lw-fade-in lw-eu">
          <h1 className="lw-question">How are you charged for electricity?</h1>
          <p className="lw-question-sub">You'll find this on your latest electricity bill.</p>

          <div className="lw-field">
            <div className="lw-toggle" role="group" aria-label="Unit rate type">
              <button type="button"
                      className={'lw-toggle-opt' + (data.rateMode === 'same' ? ' selected' : '')}
                      aria-pressed={data.rateMode === 'same'}
                      onClick={() => patch({ rateMode: 'same' })}>
                <span>I pay the same rate day &amp; night</span>
              </button>
              <button type="button"
                      className={'lw-toggle-opt' + (data.rateMode === 'different' ? ' selected' : '')}
                      aria-pressed={data.rateMode === 'different'}
                      onClick={() => patch({ rateMode: 'different' })}>
                <span>I pay different day &amp; night rates</span>
              </button>
            </div>
          </div>

          {data.rateMode === 'same' ? (
            <div className="lw-field">
              <label className="lw-field-label" htmlFor="eu-rate">Unit rate</label>
              <div className="lw-input-row">
                <input id="eu-rate" type="text" inputMode="decimal" autoComplete="off"
                       placeholder="e.g. 26.35" value={data.dayRate}
                       onChange={(e) => patch({ dayRate: cleanDec(e.target.value), used_national_average_rate: false })} />
                <span className="lw-input-unit">p/kWh</span>
              </div>
              <button type="button" className="lw-link" onClick={onShowHelp}>Where do I find this?</button>
            </div>
          ) : (
            <React.Fragment>
            <div className="lw-field-row">
              <div className="lw-field">
                <label className="lw-field-label" htmlFor="eu-day">Day rate</label>
                <div className="lw-input-row">
                  <input id="eu-day" type="text" inputMode="decimal" autoComplete="off"
                         placeholder="e.g. 28" value={data.dayRate}
                         onChange={(e) => patch({ dayRate: cleanDec(e.target.value), used_national_average_rate: false })} />
                  <span className="lw-input-unit">p/kWh</span>
                </div>
              </div>
              <div className="lw-field">
                <label className="lw-field-label" htmlFor="eu-night">Night rate</label>
                <div className="lw-input-row">
                  <input id="eu-night" type="text" inputMode="decimal" autoComplete="off"
                         placeholder="e.g. 15" value={data.nightRate}
                         onChange={(e) => patch({ nightRate: cleanDec(e.target.value), used_national_average_rate: false })} />
                  <span className="lw-input-unit">p/kWh</span>
                </div>
              </div>
            </div>
            <button type="button" className="lw-link" onClick={onShowHelp}>Where do I find this?</button>
            </React.Fragment>
          )}

          <button type="button" className="lw-cta-outline" onClick={onUseAverages}>
            I don't know - use national averages
          </button>

          <button type="button" className="lw-cta" disabled={!canContinue} onClick={onContinue}>
            Continue
          </button>
        </div>
      );
    }

    function HelpModal({ onClose, caption, highlightField }) {
      React.useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
      }, [onClose]);
      // Only highlight the row relevant to whichever "Where do I find this?" link
      // was clicked (FIX 7): 'usage' → the annual-usage row, 'rate' → the unit-rate row.
      const usageHi = highlightField === 'usage';
      const rateHi = highlightField === 'rate';
      return (
        <div className="lw-modal-overlay" onClick={onClose}>
          <div className="lw-modal" role="dialog" aria-modal="true"
               aria-label="Where to find your usage and unit rate"
               onClick={(e) => e.stopPropagation()}>
            <button className="lw-modal-close" onClick={onClose} aria-label="Close">×</button>
            <h2 className="lw-modal-title">Where to find this on your bill</h2>
            <p className="lw-modal-sub">Both figures appear on your most recent annual electricity statement — usually near the usage summary.</p>
            <div className="lw-bill" aria-hidden="true">
              <div className="lw-bill-head">YOUR ENERGY STATEMENT</div>
              <div className="lw-bill-lines">
                <div className="lw-bill-line"><span>Account number</span><span>•••• 4821</span></div>
                <div className="lw-bill-line"><span>Billing period</span><span>1 Apr – 31 Mar</span></div>
                <div className={'lw-bill-line' + (usageHi ? ' highlight' : '')}><span>Electricity used (annual)</span><span>4,100 kWh</span></div>
                {usageHi && <div className="lw-bill-callout">↑ This is your annual usage in kWh</div>}
                <div className="lw-bill-line"><span>Standing charge</span><span>53.4 p/day</span></div>
                <div className={'lw-bill-line' + (rateHi ? ' highlight' : '')}><span>Unit rate</span><span>26.35 p/kWh</span></div>
                {rateHi && <div className="lw-bill-callout">↑ This is your unit rate in p/kWh</div>}
              </div>
            </div>
            {caption && <p className="lw-modal-caption">{caption}</p>}
          </div>
        </div>
      );
    }

    /* ============================================================
       STEP 4 / 5 — card-question options
       ============================================================ */
    const BATTERY_OPTIONS = [
      { value: 'Inside', label: 'Inside', icon: 'inside' },
      { value: 'Outside', label: 'Outside', icon: 'outside' },
      { value: "I'm not sure", label: "I'm not sure", icon: 'unsure' },
    ];
    const BATTERY_INSIDE_OPTIONS = [
      { value: 'Garage', label: 'Garage', icon: 'garage' },
      { value: 'Utility room', label: 'Utility room', icon: 'utility' },
      { value: 'Cupboard', label: 'Cupboard', icon: 'cupboard' },
      { value: 'Other', label: 'Other', icon: 'other' },
    ];
    const BATTERY_OUTSIDE_OPTIONS = [
      { value: 'Side of the garage', label: 'Side of the garage', icon: 'garage' },
      { value: 'Side of the house', label: 'Side of the house', icon: 'inside' },
      { value: 'Back of the house', label: 'Back of the house', icon: 'backhouse' },
      { value: 'Other', label: 'Other', icon: 'other' },
    ];
    const EV_OPTIONS = [
      { value: 'Yes', label: 'Yes, I have an EV', icon: 'evcharge' },
      { value: 'No', label: "No, I don't", icon: 'car' },
    ];
    const EV_PLANS_OPTIONS = [
      { value: 'within_2_years', label: 'Yes - within 2 years', icon: 'calcheck' },
      { value: 'maybe_2_5_years', label: 'Maybe - 2 to 5 years', icon: 'clock' },
      { value: 'no_plans', label: 'No plans', icon: 'noplan' },
    ];
    const EV_CHARGING_OPTIONS = [
      { value: 'home_established', label: 'At home - over a year now', icon: 'homecharge' },
      { value: 'home_recent', label: 'At home - got my EV recently', icon: 'homebolt' },
      { value: 'elsewhere_wants_charger', label: 'Elsewhere - but I want a home charger', icon: 'chargerarrow' },
      { value: 'elsewhere_staying', label: 'Elsewhere - keeping it that way', icon: 'charger' },
    ];

    // A group of answer cards with the full LivWarm interaction (press → glow →
    // shimmer → dim others) but NO auto-advance — the value is committed via onSelect.
    function CardChoice({ options, value, onSelect, onSettle }) {
      const [tick, setTick] = useState(0);
      const lock = useRef(false);   // one press sequence at a time across this grid
      // Keep the latest callbacks in a ref so `choose` keeps a STABLE identity across
      // re-renders. With a stable onPress, the memo'd OptionCards bail out — so siblings
      // never re-render (and so never flash) when one card is selected.
      const cbRef = useRef();
      cbRef.current = { onSelect, onSettle };
      // OptionCard owns the full press → settle sequence via DOM classes (no re-render
      // during the animation). choose() fires only once that sequence is complete, so it
      // commits + reveals/advances in one go — the hold already happened in the card.
      const choose = useCallback((option) => {
        cbRef.current.onSelect(option.value);              // commit
        setTick((t) => t + 1);                             // replay the select shimmer
        if (cbRef.current.onSettle) cbRef.current.onSettle(option.value); // reveal / advance
      }, []);
      const cls = 'lw-card-grid'
        + (options.length === 2 ? ' cols-2' : '')
        + (options.length === 4 ? ' grid-4' : '')
        + (options.length === 5 ? ' grid-5' : '')
        + (value ? ' has-selection' : '');
      return (
        <div className={cls}>
          {options.map((opt) => (
            <OptionCard key={opt.value} option={opt}
              selected={value === opt.value}
              selectionTick={tick}
              onPress={choose}
              lock={lock} />
          ))}
        </div>
      );
    }

    // Step 4 — Battery installation location (+ conditional "where inside" sub-question)
    function BatteryStep({ location, inside, outside, onSelectLocation, onSelectInside, onSelectOutside, onContinue }) {
      // Sub-question reveals only after the press animation settles (onSettle), not on the
      // initial click. Initialise from the committed answer so back-navigation shows it.
      const [settledLocation, setSettledLocation] = React.useState(location);
      const showInside = settledLocation === 'Inside';
      const showOutside = settledLocation === 'Outside';
      // No Continue button: a no-sub option ("I'm not sure") auto-advances; Inside/Outside
      // reveal a sub-question, and selecting a sub-card auto-advances.
      return (
        <div className="lw-fade-in">
          <h1 className="lw-question">Where would you like your battery installed?</h1>
          <p className="lw-question-sub">Don't worry if you're not sure - our team will confirm the best location with you.</p>
          <CardChoice options={BATTERY_OPTIONS} value={location}
            onSelect={onSelectLocation}
            onSettle={(v) => { setSettledLocation(v); if (v !== 'Inside' && v !== 'Outside') onContinue(); }} />
          {showInside && (
            <div className="lw-subq">
              <h2 className="lw-subq-title">Where inside your home?</h2>
              <p className="lw-question-sub">Don't worry if you're not sure - our team will confirm the best location with you.</p>
              <CardChoice options={BATTERY_INSIDE_OPTIONS} value={inside}
                onSelect={onSelectInside} onSettle={onContinue} />
            </div>
          )}
          {showOutside && (
            <div className="lw-subq">
              <h2 className="lw-subq-title">Where outside your home?</h2>
              <p className="lw-question-sub">For best performance, batteries installed outside should be in a shaded, well-ventilated spot.</p>
              <CardChoice options={BATTERY_OUTSIDE_OPTIONS} value={outside}
                onSelect={onSelectOutside} onSettle={onContinue} />
            </div>
          )}
        </div>
      );
    }

    // Step 5 — EV ownership (+ conditional "planning to get one" sub-question)
    function EvStep({ hasEv, plans, charging, onSelectHasEv, onSelectPlans, onSelectCharging, onContinue }) {
      // Sub-question reveals only after the press animation settles (onSettle), not on the
      // initial click. Initialise from the committed answer so back-navigation shows it.
      const [settledHasEv, setSettledHasEv] = React.useState(hasEv);
      const showCharging = settledHasEv === 'Yes';
      const showPlans = settledHasEv === 'No';
      // No Continue button. Both primary options reveal a sub-question; selecting a
      // sub-card auto-advances. (Yes → charging method, No → planning to get one.)
      return (
        <div className="lw-fade-in">
          <h1 className="lw-question">Do you have an electric vehicle?</h1>
          <CardChoice options={EV_OPTIONS} value={hasEv} onSelect={onSelectHasEv}
            onSettle={(v) => setSettledHasEv(v)} />
          {showCharging && (
            <div className="lw-subq">
              <h2 className="lw-subq-title">How do you currently charge your EV?</h2>
              <CardChoice options={EV_CHARGING_OPTIONS} value={charging}
                onSelect={onSelectCharging} onSettle={onContinue} />
            </div>
          )}
          {showPlans && (
            <div className="lw-subq">
              <h2 className="lw-subq-title">Are you planning to get one?</h2>
              <p className="lw-question-sub">We'll factor this into your system size, so you're ready when you need it.</p>
              <CardChoice options={EV_PLANS_OPTIONS} value={plans}
                onSelect={onSelectPlans} onSettle={onContinue} />
            </div>
          )}
        </div>
      );
    }

    /* ============================================================
       STEP 6 — Address & Roof Confirmation (Parts A–D)
       One step (6 of 9) with four internal phases:
       address → map → orientation → occupancy
       ============================================================ */

    const ORIENT_CONFIRM = [
      { value: 'yes', label: "Yes, that's right", icon: 'yescheck' },
      { value: 'no', label: 'No, let me check', icon: 'compass' },
    ];
    const OCCUPANCY_OPTIONS = [
      { value: '1', label: '1', num: true, unit: 'person', unitPlural: 'people' },
      { value: '2', label: '2', num: true, unit: 'person', unitPlural: 'people' },
      { value: '3', label: '3', num: true, unit: 'person', unitPlural: 'people' },
      { value: '4', label: '4', num: true, unit: 'person', unitPlural: 'people' },
      { value: '5+', label: '5+', num: true, unit: 'person', unitPlural: 'people' },
    ];

    /* ============================================================
       STEP 7 — pricing data + quote calculation engine
       (Section 6 — Step 7. Pricing hardcoded here, not a separate file.)
       ============================================================ */
    const PRICING = {
      basePanels: 6,
      pricePerExtraPanel: 250,
      base: { noB: 4342, b5: 5842, b10: 6842, b15: 7842, pw: 10842 },
    };
    const PANEL_WATT = 445;            // W per panel
    const BASE_GEN_PER_PANEL = 400;    // kWh/yr at south-facing
    const ORIENTATION_MULT = {
      S: 1.00, SE: 0.93, SW: 0.93, E: 0.82, W: 0.82, NE: 0.65, NW: 0.65, N: 0.52,
    };
    const EXPORT_TARIFF = 0.15;        // £/kWh
    const SELF_CONSUMPTION = 0.5;
    const FINANCE_APR = 0.099;
    const FINANCE_MONTHS = 180;
    // battery option key → PRICING.base key
    const BATTERY_PRICE_KEY = { none: 'noB', '5kw': 'b5', '10kw': 'b10', '15kw': 'b15', powerwall: 'pw' };
    // battery option key → display labels
    const BATTERY_NAME = { none: 'No battery storage', '5kw': '5kW battery', '10kw': '10kW battery', '15kw': '15kW battery', powerwall: 'Tesla Powerwall' };
    const BATTERY_INCLUDED = { '5kw': '5kW battery storage', '10kw': '10kW battery storage', '15kw': '15kW battery storage', powerwall: 'Tesla Powerwall battery storage' };
    const BATTERY_DROPDOWN = [
      { value: 'none', label: 'No battery' },
      { value: '5kw', label: '5kW battery' },
      { value: '10kw', label: '10kW battery' },
      { value: '15kw', label: '15kW battery' },
      { value: 'powerwall', label: 'Tesla Powerwall' },
    ];
    // Descriptive tier titles (shared by the carousel card + the expanded spec sheet).
    const TIER_TITLES = { essential: 'Solar Panels Only', performance: 'Our Recommended Package', custom: 'Build Your Own System' };
    // Battery → data-sheet link label (expanded spec sheet).
    const BATTERY_DATASHEET = { '5kw': 'EP6 Battery', '10kw': 'EP12 Battery', '15kw': 'EP18 Battery', powerwall: 'Powerwall' };
    // Product image fallbacks (used by the micro-commitment card if solar-products.json
    // hasn't loaded). Mirror the URLs in solar-products.json / the spec product table.
    const PANEL_IMG = 'https://deals.livwarm.co.uk/wp-content/uploads/2025/10/12-Solar-Panels.webp';
    const INVERTER_IMG = 'https://deals.livwarm.co.uk/wp-content/uploads/2026/06/Fox-H1-G2-Hybrid-Inverter-Gen2-1ph-Edited.png';
    const BATTERY_IMG = {
      '5kw': 'https://deals.livwarm.co.uk/wp-content/uploads/2025/10/Fox-ESS-6kw-Battery.webp',
      '10kw': 'https://deals.livwarm.co.uk/wp-content/uploads/2026/02/foxess-ep12-battery.webp',
      '15kw': 'https://deals.livwarm.co.uk/wp-content/uploads/2025/10/foxess-ep18-battery.webp',
      powerwall: 'https://deals.livwarm.co.uk/wp-content/uploads/2025/10/tesla-powerwall-png-no-background.png',
    };

    // Base panel count from the lookup table (Section 6 — Step 7).
    function basePanelCount(houseType, bedrooms) {
      const n = bedrooms === '5+' ? 5 : (parseInt(bedrooms, 10) || 3);
      switch (houseType) {
        case 'Terrace':       return n <= 2 ? 6 : n === 3 ? 8 : 10;
        case 'Semi-Detached': return n <= 2 ? 8 : n === 3 ? 10 : 12;
        case 'Detached':      return n <= 3 ? 12 : n === 4 ? 14 : 16;
        case 'Bungalow':      return n <= 2 ? 10 : 12;
        default:              return 10;
      }
    }

    // EV adjustment to the Performance panel count.
    function evPanelAdjustment(a) {
      let add = 0;
      if (a.has_ev === 'Yes') add += 2;
      if (a.ev_plans === 'within_2_years') add += 2;
      else if (a.ev_plans === 'maybe_2_5_years') add += 1;
      return add;
    }

    function getPrice(panels, battery) {
      const extra = Math.max(0, panels - PRICING.basePanels);
      return PRICING.base[BATTERY_PRICE_KEY[battery]] + extra * PRICING.pricePerExtraPanel;
    }

    function annualGeneration(panels, orientation) {
      const mult = ORIENTATION_MULT[orientation] != null ? ORIENTATION_MULT[orientation] : ORIENTATION_MULT.S;
      return panels * BASE_GEN_PER_PANEL * mult;
    }

    // Effective grid import rate in £/kWh (defaults to 26.35p if missing/zero).
    function gridImportRate(a) {
      let r = Number(String(a.day_unit_rate || '').replace(/[^0-9.]/g, ''));
      if (!r || r <= 0) r = 26.35;
      return r / 100;
    }

    // Recommended Performance-tier battery from its annual generation.
    function recommendedBattery(gen) {
      if (gen < 4000) return '5kw';
      if (gen <= 6000) return '10kw';
      if (gen <= 8000) return '15kw';
      return 'powerwall';
    }

    // Finance monthly payment: 9.9% APR over 15 years, rounded up to the nearest £.
    function monthlyPayment(systemCost) {
      const r = FINANCE_APR / 12;
      const p = systemCost * (r * Math.pow(1 + r, FINANCE_MONTHS)) / (Math.pow(1 + r, FINANCE_MONTHS) - 1);
      return Math.ceil(p);
    }

    // Shermin/Stax finance: 9.9% APR fixed, any term in months, rounded up to the
    // nearest £. Used by the inline finance calculator (Step 7) and the Step 8 booking
    // summary so both reflect the confirmed 9.9% finance product.
    function financeMonthly(principal, months) {
      if (principal <= 0) return 0;
      const r = 0.099 / 12;
      return Math.ceil(principal * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1));
    }

    // Build a complete tier object (price, generation, savings, finance).
    function buildTier(id, name, panels, battery, badge, orientation, importRate) {
      const price = getPrice(panels, battery);
      const gen = annualGeneration(panels, orientation);
      const annualSaving = (gen * SELF_CONSUMPTION * importRate) + (gen * SELF_CONSUMPTION * EXPORT_TARIFF);
      const breakEvenYear = annualSaving > 0 ? price / annualSaving : 0;
      const saving20yr = Math.max(0, annualSaving * 20 - price);
      const monthlySaving = annualSaving / 12;
      return {
        id, name, panels, battery, badge, price, gen,
        kw: panels * PANEL_WATT / 1000,
        monthly: monthlyPayment(price),
        annualSaving, breakEvenYear, saving20yr, monthlySaving,
      };
    }

    // Derive all three tiers from the collected answers (+ live custom selections).
    function buildTiers(a, custom) {
      const orientation = a.roof_orientation || 'S';
      const importRate = gridImportRate(a);
      const baseCount = basePanelCount(a.house_type, a.house_bedrooms);
      const perfCount = baseCount + evPanelAdjustment(a);
      const perfGen = annualGeneration(perfCount, orientation);
      const perfBattery = recommendedBattery(perfGen);
      return {
        essential: buildTier('essential', 'Essential', baseCount, 'none', null, orientation, importRate),
        performance: buildTier('performance', 'Performance', perfCount, perfBattery, 'RECOMMENDED', orientation, importRate),
        custom: buildTier('custom', 'Custom', custom.panels, custom.battery, null, orientation, importRate),
        defaults: { baseCount, perfCount, perfBattery },
      };
    }

    // Currency: £X,XXX (no decimals). kWh / counts with thousands separators.
    function gbp(n) { return '£' + Math.round(n).toLocaleString('en-GB'); }
    function fmtNum(n) { return Math.round(n).toLocaleString('en-GB'); }
    function fmtKw(kw) {
      const s = kw.toFixed(2);
      return s.replace(/\.?0+$/, '');   // 4.45 → 4.45, 5.00 → 5
    }

    /* ---- Part A: postcode lookup + address entry (postcodes.io) ---- */
    function AddressStep({ state, setState, onContinue }) {
      const s = state;
      const patch = (p) => setState({ ...s, ...p });
      const found = s.lat != null;

      const doLookup = async () => {
        const pc = s.postcode.trim();
        if (!pc) return;
        patch({ looking: true, lookupError: '' });
        try {
          const res = await fetch('https://api.postcodes.io/postcodes/' + encodeURIComponent(pc));
          const data = await res.json();
          if (data.status !== 200 || !data.result) {
            setState({ ...s, looking: false, lat: null, lng: null,
              lookupError: "We couldn't find that postcode. Check it, or enter your address manually." });
            return;
          }
          const r = data.result;
          // postcodes.io has no street-level "post town"; parish (if any) is the most
          // local label, falling back to admin_district then region.
          const town = r.parish || r.admin_district || r.region || '';
          setState({ ...s, looking: false, lookupError: '',
            postcode: r.postcode, town, lat: r.latitude, lng: r.longitude });
        } catch (e) {
          setState({ ...s, looking: false,
            lookupError: 'Lookup failed — check your connection or enter your address manually.' });
        }
      };

      const lookupCanContinue = !!s.address_line1.trim() && s.lat != null;
      const manualCanContinue = !!s.address_line1.trim() && !!s.postcode.trim();

      return (
        <div className="lw-fade-in lw-eu">
          <h1 className="lw-question">Let's identify your roof</h1>
          <p className="lw-question-sub">Enter your postcode and we'll pinpoint your home on the map.</p>

          {!s.manual ? (
            <React.Fragment>
              <div className="lw-field">
                <label className="lw-field-label" htmlFor="s6-pc">Postcode</label>
                <div className="lw-find-row">
                  <div className="lw-input-row">
                    <input id="s6-pc" type="text" autoComplete="postal-code"
                      placeholder="e.g. DY13 8UA" value={s.postcode}
                      onChange={(e) => patch({ postcode: e.target.value.toUpperCase(), lat: null, lng: null, lookupError: '' })}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); doLookup(); } }} />
                  </div>
                  <button type="button" className="lw-find-btn"
                    disabled={s.looking || !s.postcode.trim()} onClick={doLookup}>
                    {s.looking ? 'Finding…' : 'Find'}
                  </button>
                </div>
                {s.lookupError && <p className="lw-input-error">{s.lookupError}</p>}
                <button type="button" className="lw-link"
                  onClick={() => patch({ manual: true, lookupError: '' })}>
                  Can't find your postcode?
                </button>
              </div>

              {found && (
                <div className="lw-subq">
                  <div className="lw-field">
                    <label className="lw-question-sub" htmlFor="s6-a1"
                           style={{ textAlign: 'left', margin: '32px 0 12px', display: 'block', color: 'var(--color-dark)', fontWeight: 600, fontSize: '1.2rem' }}>Now enter your house number and street</label>
                    <div className="lw-input-row">
                      <input id="s6-a1" type="text" autoComplete="address-line1"
                        placeholder="e.g. 5 Almond Way" value={s.address_line1}
                        onChange={(e) => patch({ address_line1: e.target.value })} autoFocus />
                    </div>
                  </div>
                  <div className="lw-field-row">
                    <div className="lw-field">
                      <label className="lw-field-label" htmlFor="s6-town">Town / City</label>
                      <div className="lw-input-row">
                        <input id="s6-town" type="text" value={s.town}
                          onChange={(e) => patch({ town: e.target.value })} />
                      </div>
                    </div>
                    <div className="lw-field">
                      <label className="lw-field-label" htmlFor="s6-pc2">Postcode</label>
                      <div className="lw-input-row lw-input-readonly">
                        <input id="s6-pc2" type="text" value={s.postcode} readOnly />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
          ) : (
            <React.Fragment>
              {/* Manual fallback — every field typed by hand. The postcode is geocoded
                  on Continue so the satellite map still has a centre point. */}
              <div className="lw-field">
                <label className="lw-field-label" htmlFor="s6-ma1">Address line 1</label>
                <div className="lw-input-row">
                  <input id="s6-ma1" type="text" autoComplete="address-line1"
                    placeholder="e.g. 5 Almond Way" value={s.address_line1}
                    onChange={(e) => patch({ address_line1: e.target.value })} />
                </div>
              </div>
              <div className="lw-field-row">
                <div className="lw-field">
                  <label className="lw-field-label" htmlFor="s6-mtown">Town / City</label>
                  <div className="lw-input-row">
                    <input id="s6-mtown" type="text" value={s.town}
                      onChange={(e) => patch({ town: e.target.value })} />
                  </div>
                </div>
                <div className="lw-field">
                  <label className="lw-field-label" htmlFor="s6-mpc">Postcode</label>
                  <div className="lw-input-row">
                    <input id="s6-mpc" type="text" autoComplete="postal-code"
                      placeholder="e.g. DY13 8UA" value={s.postcode}
                      onChange={(e) => patch({ postcode: e.target.value.toUpperCase() })} />
                  </div>
                </div>
              </div>
              {s.lookupError && <p className="lw-input-error">{s.lookupError}</p>}
              <button type="button" className="lw-link"
                onClick={() => patch({ manual: false, lookupError: '' })}>
                Use postcode lookup instead
              </button>
            </React.Fragment>
          )}

          <button type="button" className="lw-cta" style={{ marginTop: 24 }}
            disabled={s.manual ? !manualCanContinue : !lookupCanContinue}
            onClick={onContinue}>
            Continue
          </button>
        </div>
      );
    }

    /* ---- Part B: satellite map confirmation (Google Maps, draggable pin) ---- */
    function MapConfirm({ lat, lng, onPinMove, onConfirm }) {
      const ref = useRef(null);
      const [status, setStatus] = React.useState('loading');  // loading | ready | error
      React.useEffect(() => {
        let cancelled = false, map, marker;
        if (lat == null) { setStatus('error'); return; }
        if (_gmapsAuthFailed) { setStatus('error'); return; }
        const unsub = onGmapsAuthFailure(() => { if (!cancelled) setStatus('error'); });
        loadGoogleMaps().then((maps) => {
          if (cancelled || !ref.current) return;
          map = new maps.Map(ref.current, {
            center: { lat, lng }, zoom: 19, mapTypeId: 'satellite', tilt: 0,
            disableDefaultUI: true, zoomControl: true, gestureHandling: 'greedy',
          });
          marker = new maps.Marker({
            position: { lat, lng }, map, draggable: true, animation: maps.Animation.DROP,
          });
          marker.addListener('dragend', () => {
            const p = marker.getPosition();
            onPinMove(p.lat(), p.lng());
          });
          // Tapping the roof also moves the pin (matches the tooltip copy)
          map.addListener('click', (e) => {
            marker.setPosition(e.latLng);
            onPinMove(e.latLng.lat(), e.latLng.lng());
          });
          setStatus('ready');
        }).catch(() => { if (!cancelled) setStatus('error'); });
        return () => { cancelled = true; unsub(); };
      }, []);

      return (
        <div className="lw-fade-in">
          <h1 className="lw-question">Is this your roof?</h1>
          <p className="lw-question-sub">Maps don't always pin the exact property. Click or tap your roof to move the pin onto the right one.</p>
          <div className="lw-map-wrap">
            {status === 'error'
              ? <div className="lw-map lw-map-fallback">Map preview isn't available here — it will load on the live site. You can still continue.</div>
              : <div className="lw-map" ref={ref} />}
          </div>
          <button type="button" className="lw-cta"
            style={{ maxWidth: 420, margin: '24px auto 0' }} onClick={onConfirm}>
            Confirm location
          </button>
        </div>
      );
    }

    /* ---- Part C: compass — a ring of eight tappable direction segments ----
       Clean, premium circular UI on a frosted-glass disc (no wind-rose illustration).
       Each segment is a 45° annular sector; the label sits at the segment's mid-radius.
       Cardinal labels (N/S/E/W) are larger/bolder; intercardinals smaller. Single-select.
       A red needle sweeps to the hovered/selected direction; segments mirror the
       answer-card 3-state press system (raised → sink → punch → depressed). */
    let _compassPulsed = false;   // module scope: pulse the labels only on the first visit
    function CompassDial({ value, onChange }) {
      const C = 110, Ro = 104, Ri = 60, rL = 82;   // 220×220 viewBox, ring inner/outer + label radius
      const [hover, setHover] = React.useState(null);
      // One-time-per-session pulse on the eight labels to signal interactivity (FIX 1).
      // _compassPulsed (module scope) ensures it doesn't replay on repeat visits.
      const [pulse] = React.useState(() => { if (_compassPulsed) return false; _compassPulsed = true; return true; });
      const dirs = [
        { k: 'N',  a: 0,   card: true },
        { k: 'NE', a: 45,  card: false },
        { k: 'E',  a: 90,  card: true },
        { k: 'SE', a: 135, card: false },
        { k: 'S',  a: 180, card: true },
        { k: 'SW', a: 225, card: false },
        { k: 'W',  a: 270, card: true },
        { k: 'NW', a: 315, card: false },
      ];
      const ANG = { N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315 };
      // Needle target: hovered segment, else selected, else north.
      const targetDir = hover || value || 'N';
      // Track a running (continuous) needle angle so the needle always takes the SHORTEST
      // arc: each step normalises the delta to [-180, 180], so it never travels >180°
      // (e.g. N→NW sweeps -45° anti-clockwise, not +315° the long way round).
      const angleRef = React.useRef(ANG[targetDir]);
      const [needleAngle, setNeedleAngle] = React.useState(ANG[targetDir]);
      React.useEffect(() => {
        let delta = ANG[targetDir] - angleRef.current;
        while (delta > 180) delta -= 360;
        while (delta < -180) delta += 360;
        angleRef.current += delta;
        setNeedleAngle(angleRef.current);
      }, [targetDir]);
      // Compass angle (0 = N, clockwise) → SVG point at radius r.
      const pt = (ang, r) => [C + r * Math.sin(ang * Math.PI / 180), C - r * Math.cos(ang * Math.PI / 180)];
      // Annular sector path between two angles (outer arc CW, inner arc CCW).
      const sector = (a1, a2) => {
        const [ox1, oy1] = pt(a1, Ro), [ox2, oy2] = pt(a2, Ro);
        const [ix2, iy2] = pt(a2, Ri), [ix1, iy1] = pt(a1, Ri);
        return `M ${ox1} ${oy1} A ${Ro} ${Ro} 0 0 1 ${ox2} ${oy2} `
             + `L ${ix2} ${iy2} A ${Ri} ${Ri} 0 0 0 ${ix1} ${iy1} Z`;
      };
      // Bounding box of a sector → anchor the dot-fade at its lower-right corner (like the cards).
      const segBBox = (a) => {
        const ps = [];
        for (let t = -22.5; t <= 22.5; t += 7.5) ps.push(pt(a + t, Ro));
        ps.push(pt(a - 22.5, Ri)); ps.push(pt(a + 22.5, Ri)); ps.push(pt(a, Ri));
        const xs = ps.map((p) => p[0]), ys = ps.map((p) => p[1]);
        const minx = Math.min.apply(null, xs), maxx = Math.max.apply(null, xs);
        const miny = Math.min.apply(null, ys), maxy = Math.max.apply(null, ys);
        return { brx: maxx, bry: maxy, r: Math.hypot(maxx - minx, maxy - miny) * 0.65 };
      };
      return (
        <div className="lw-rose">
          <svg viewBox="0 0 220 220" role="group" aria-label="Choose the direction your front door faces">
            <defs>
              {/* Inner (inset) shadow filters — two stacked insets per state.
                  Hover = clearly sunken; selected = deeply pressed in.
                  Hover builds the shadow from an OPAQUE silhouette (feComponentTransfer
                  boosts SourceAlpha → 1) so it renders at full strength over the
                  translucent (0.06) hover fill — otherwise the shadow alpha gets clipped
                  to the fill's 0.06 and disappears. Params match #segInsetSel so the
                  hover state feels exactly as sunken as the selected state. */}
              <filter id="segInsetHover" x="-50%" y="-50%" width="200%" height="200%">
                <feComponentTransfer in="SourceAlpha" result="solid">
                  <feFuncA type="linear" slope="255" intercept="0" />
                </feComponentTransfer>
                <feOffset in="solid" dx="0" dy="4" result="o1" />
                <feGaussianBlur in="o1" stdDeviation="7" result="b1" />
                <feComposite operator="out" in="solid" in2="b1" result="inv1" />
                <feFlood floodColor="#000000" floodOpacity="0.38" result="c1" />
                <feComposite operator="in" in="c1" in2="inv1" result="s1" />
                <feOffset in="solid" dx="0" dy="2" result="o2" />
                <feGaussianBlur in="o2" stdDeviation="3" result="b2" />
                <feComposite operator="out" in="solid" in2="b2" result="inv2" />
                <feFlood floodColor="#000000" floodOpacity="0.25" result="c2" />
                <feComposite operator="in" in="c2" in2="inv2" result="s2" />
                {/* No in-filter clip needed — the overlay path is clipPath-clipped to the
                    exact pie-slice at render level, which contains any blur bleed. */}
                <feMerge>
                  <feMergeNode in="SourceGraphic" />
                  <feMergeNode in="s1" />
                  <feMergeNode in="s2" />
                </feMerge>
              </filter>
              <filter id="segInsetSel" x="-50%" y="-50%" width="200%" height="200%">
                <feOffset in="SourceAlpha" dx="0" dy="4" result="o1" />
                <feGaussianBlur in="o1" stdDeviation="7" result="b1" />
                <feComposite operator="out" in="SourceGraphic" in2="b1" result="inv1" />
                <feFlood floodColor="#000000" floodOpacity="0.38" result="c1" />
                <feComposite operator="in" in="c1" in2="inv1" result="s1" />
                <feOffset in="SourceAlpha" dx="0" dy="2" result="o2" />
                <feGaussianBlur in="o2" stdDeviation="3" result="b2" />
                <feComposite operator="out" in="SourceGraphic" in2="b2" result="inv2" />
                <feFlood floodColor="#000000" floodOpacity="0.25" result="c2" />
                <feComposite operator="in" in="c2" in2="inv2" result="s2" />
                <feMerge result="merged">
                  <feMergeNode in="SourceGraphic" />
                  <feMergeNode in="s1" />
                  <feMergeNode in="s2" />
                </feMerge>
                {/* Clip output back to the segment shape (opaque red fill, so SourceGraphic is safe here) */}
                <feComposite operator="in" in="merged" in2="SourceGraphic" />
              </filter>
              {/* Needle gradient — dark red edges, bright highlight stripe down the centre */}
              <linearGradient id="needleGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#C0272D" />
                <stop offset="0.5" stopColor="#FF5A5F" />
                <stop offset="1" stopColor="#C0272D" />
              </linearGradient>
              {/* Dot texture (mirrors the answer cards) — grey default, red when selected.
                  Tile 7.6 / dot r0.76 in viewBox units ≈ the cards' 10px grid / 1px dots
                  once the 290px svg scales the 220 viewBox up (×1.318). */}
              <pattern id="lwDots" width="7.6" height="7.6" patternUnits="userSpaceOnUse">
                <circle cx="3.8" cy="3.8" r="0.76" fill="#d8d8d8" />
              </pattern>
              <pattern id="lwDotsRed" width="7.6" height="7.6" patternUnits="userSpaceOnUse">
                <circle cx="3.8" cy="3.8" r="0.76" fill="rgba(232, 50, 58, 0.25)" />
              </pattern>
              {/* Per-segment clip + lower-right corner fade (mirrors the card mask) */}
              {dirs.map((d) => {
                const b = segBBox(d.a);
                return (
                  <React.Fragment key={'tex-' + d.k}>
                    <clipPath id={'segclip-' + d.k}>
                      <path d={sector(d.a - 22.5, d.a + 22.5)} />
                    </clipPath>
                    <radialGradient id={'segfade-' + d.k} gradientUnits="userSpaceOnUse"
                      cx={b.brx} cy={b.bry} r={b.r}>
                      <stop offset="0" stopColor="#ffffff" stopOpacity="0.5" />
                      <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
                    </radialGradient>
                    <mask id={'segmask-' + d.k} maskUnits="userSpaceOnUse" x="0" y="0" width="220" height="220">
                      <rect x="0" y="0" width="220" height="220" fill={'url(#segfade-' + d.k + ')'} />
                    </mask>
                  </React.Fragment>
                );
              })}
            </defs>
            {dirs.map((d, i) => {
              const [lx, ly] = pt(d.a, rL);
              const dim = value && value !== d.k ? ' dim' : '';
              return (
                <g key={d.k}
                   className={'lw-seg' + (value === d.k ? ' selected' : '') + (d.card ? ' card' : ' inter') + dim}
                   role="button" aria-label={DIR_WORDS[d.k]} aria-pressed={value === d.k}
                   tabIndex={0}
                   onClick={() => onChange(d.k)}
                   onMouseEnter={() => setHover(d.k)}
                   onMouseLeave={() => setHover((h) => (h === d.k ? null : h))}
                   onFocus={() => setHover(d.k)}
                   onBlur={() => setHover((h) => (h === d.k ? null : h))}
                   onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChange(d.k); } }}>
                  <path className="seg-fill" d={sector(d.a - 22.5, d.a + 22.5)} />
                  {/* Hover inset overlay — fades in over 150ms; clipPath = pixel-perfect pie-slice
                      (no filter bleed). fill-opacity 0.01 just gives the filter a silhouette to
                      work from; the inset shadow itself is built from the opaque `solid` in the filter. */}
                  <path className="seg-inset" d={sector(d.a - 22.5, d.a + 22.5)}
                        fill="#000000" fillOpacity="0.01" filter="url(#segInsetHover)"
                        clipPath={'url(#segclip-' + d.k + ')'} />
                  <rect className="seg-dots" x="0" y="0" width="220" height="220"
                        fill={value === d.k ? 'url(#lwDotsRed)' : 'url(#lwDots)'}
                        clipPath={'url(#segclip-' + d.k + ')'} mask={'url(#segmask-' + d.k + ')'} />
                  <text className={'seg-label' + (pulse ? ' lw-pulse' : '')} x={lx} y={ly}
                        textAnchor="middle" dominantBaseline="central"
                        style={pulse ? { animationDelay: (i * 100) + 'ms' } : undefined}
                        fontSize={d.card ? 17 : 13} fontWeight={d.card ? 700 : 500}>{d.k}</text>
                </g>
              );
            })}
            {/* thin divider lines at each segment boundary */}
            {dirs.map((d) => {
              const [x1, y1] = pt(d.a + 22.5, Ri), [x2, y2] = pt(d.a + 22.5, Ro);
              return <line key={'div-' + d.k} className="lw-seg-divider" x1={x1} y1={y1} x2={x2} y2={y2} />;
            })}
            {/* Faint engraved compass rose — long N/S/E/W points + short diagonals,
                ~85% of the central disc. Behind the needle/hub; non-interactive. */}
            <polygon className="lw-star" fill="#808080" opacity="0.08" pointerEvents="none"
              points={Array.from({ length: 8 }, (_, i) => {
                const tip = pt(i * 45, i % 2 === 0 ? 51 : 27);
                const valley = pt(i * 45 + 22.5, 7);
                return tip[0].toFixed(2) + ',' + tip[1].toFixed(2) + ' '
                     + valley[0].toFixed(2) + ',' + valley[1].toFixed(2);
              }).join(' ')} />
            {/* red needle (points north at rest) — rotated to the active direction */}
            <polygon className="lw-needle" points={`${C},52 ${C + 3},${C - 2} ${C - 3},${C - 2}`}
                     fill="url(#needleGrad)"
                     style={{ transform: `rotate(${needleAngle}deg)` }} />
          </svg>
          {/* raised dome hub (HTML so it can carry a box-shadow + inset highlight) */}
          <div className="lw-hub" />
        </div>
      );
    }

    /* ---- Part C: orientation compass screen — compass overlaid on the map ---- */
    function CompassScreen({ lat, lng, value, onChange, onContinue, isFinal }) {
      const ref = useRef(null);
      const [status, setStatus] = React.useState('loading');
      React.useEffect(() => {
        let cancelled = false, map;
        if (lat == null) { setStatus('error'); return; }
        if (_gmapsAuthFailed) { setStatus('error'); return; }
        const unsub = onGmapsAuthFailure(() => { if (!cancelled) setStatus('error'); });
        loadGoogleMaps().then((maps) => {
          if (cancelled || !ref.current) return;
          // Static close-up — visual reference only: no controls, no gestures.
          // Tight zoom so the target property dominates the (clear) left half.
          map = new maps.Map(ref.current, {
            center: { lat, lng }, zoom: 21, mapTypeId: 'satellite', tilt: 0,
            disableDefaultUI: true, gestureHandling: 'none', draggable: false,
            keyboardShortcuts: false, clickableIcons: false,
          });
          // Static standard pin at the confirmed location (same default style as the
          // address-confirmation map). Not draggable, no listeners; the compass HTML
          // overlay sits above the map div so the pin never interferes with it.
          new maps.Marker({ position: { lat, lng }, map });
          setStatus('ready');
        }).catch(() => { if (!cancelled) setStatus('error'); });
        return () => { cancelled = true; unsub(); };
      }, []);

      return (
        <div className="lw-fade-in">
          <h1 className="lw-question">If you look out of your front door, which direction are you facing?</h1>
          <p className="lw-question-sub">Your roof's orientation affects how much energy your panels will generate.</p>
          <div className="lw-map-wrap">
            {status === 'error'
              ? <div className="lw-map lw-map-fallback">Map preview isn't available here — it will load on the live site.</div>
              : <div className="lw-map" ref={ref} />}
            {/* Compass rose overlaid on the right half; left half stays clear */}
            <CompassDial value={value} onChange={onChange} />
            {/* Instruction as a frosted overlay label at the map's lower edge */}
            <div className="lw-map-label">
              <span className="lw-instr-wide">Tap your direction on the compass to the right</span>
              <span className="lw-instr-narrow">Tap your direction on the compass below</span>
            </div>
          </div>
          {value && <p className="lw-orient-facing">Facing: {DIR_WORDS[value]}</p>}
          <div className="lw-orient-actions">
            <button type="button" className={isFinal ? 'lw-cta lw-cta-green' : 'lw-cta'} disabled={!value} onClick={onContinue}>
              {isFinal ? 'Prepare my quote →' : 'Continue'}
            </button>
          </div>
        </div>
      );
    }

    /* ---- Part C: orientation — auto-suggestion (if any) then compass ---- */
    function OrientationStep({ lat, lng, suggestedDir, value, onChange, onContinue, isFinal }) {
      // Show the Yes/No confirmation only when a bearing was derived; otherwise
      // (the usual case in-browser — see suggestFrontDoorDir) go straight to the compass.
      const [mode, setMode] = React.useState(suggestedDir ? 'confirm' : 'compass');
      if (mode === 'confirm') {
        return (
          <div className="lw-fade-in">
            <h1 className="lw-question">Based on your address, your front door appears to face {DIR_WORDS[suggestedDir]}.</h1>
            <p className="lw-question-sub">Does that sound right?</p>
            <CardChoice options={ORIENT_CONFIRM} value={null}
              onSelect={(v) => { if (v === 'yes') onChange(suggestedDir); else setMode('compass'); }}
              onSettle={(v) => { if (v === 'yes') onContinue(); }} />
          </div>
        );
      }
      return <CompassScreen lat={lat} lng={lng} value={value} onChange={onChange} onContinue={onContinue} isFinal={isFinal} />;
    }

    /* ---- Part D: occupancy ---- */
    function OccupancyStep({ value, onSelect, onContinue }) {
      // Final phase of Step 6: cards no longer auto-advance — a green
      // "Prepare my quote" button triggers the transition overlay (Improvement 5).
      return (
        <div className="lw-fade-in lw-occ">
          <h1 className="lw-question">How many people live in your home?</h1>
          <p className="lw-question-sub">This helps us size your system to match your day-to-day energy use.</p>
          <CardChoice options={OCCUPANCY_OPTIONS} value={value} onSelect={onSelect} />
          <button type="button" className="lw-cta lw-cta-green" disabled={!value} onClick={onContinue}>
            Prepare my quote →
          </button>
        </div>
      );
    }

    /* ---- "Preparing your quote" transition overlay (Step 6 → Step 7) ----
       Pure setTimeout choreography — no real work happens here; the quote is
       already computed from app state. Runs for ~4s, then dissolves away. */
    function PrepareOverlay({ onReveal, onDone }) {
      const MESSAGES = [
        'Analysing your property and roof orientation...',
        'Calculating your solar generation potential...',
        'Checking current energy rates and export tariffs...',
        'Matching you to the best available systems...',
        'Finalising your personalised quote...',
      ];
      const [msg, setMsg] = useState(0);
      const [full, setFull] = useState(false);
      const [leaving, setLeaving] = useState(false);
      React.useEffect(() => {
        const t = [];
        t.push(setTimeout(() => setFull(true), 50));            // kick off the 4s bar fill
        t.push(setTimeout(() => setMsg(1), 1200));
        t.push(setTimeout(() => setMsg(2), 2400));
        t.push(setTimeout(() => setMsg(3), 3600));
        t.push(setTimeout(() => setMsg(4), 4800));
        t.push(setTimeout(() => { setLeaving(true); onReveal(); }, 6000)); // reveal quote behind + fade out
        t.push(setTimeout(() => onDone(), 6500));               // unmount overlay
        return () => t.forEach(clearTimeout);
      }, []);
      return (
        <div className={'lw-prep' + (leaving ? ' is-leaving' : '')} role="status" aria-live="polite">
          <div className="lw-prep-logo lw-logo" aria-label="LivWarm">
            <span className="liv">Liv</span><span className="warm">Warm</span><span className="dot">.</span>
          </div>
          <svg className="lw-prep-sun" width="56" height="56" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M19.4 4.6l-2.1 2.1M6.7 17.3l-2.1 2.1" />
          </svg>
          <h2 className="lw-prep-title">Preparing your quote</h2>
          <div className="lw-prep-bar">
            <div className={'lw-prep-bar-fill' + (full ? ' is-full' : '')} />
          </div>
          <p className="lw-prep-msg" key={msg}>{MESSAGES[msg]}</p>
        </div>
      );
    }

    /* ---- Step 6 orchestrator — routes the four phases ---- */
    function Step6({ state, setState, onAddressContinue, onPinMove, onConfirmPin,
                     onSetOrientation, onSetOccupants, onComplete, usedKwhFallback }) {
      const s = state;
      if (s.phase === 'address') {
        return <AddressStep state={s} setState={setState} onContinue={onAddressContinue} />;
      }
      if (s.phase === 'map') {
        return <MapConfirm lat={s.lat} lng={s.lng} onPinMove={onPinMove} onConfirm={onConfirmPin} />;
      }
      if (s.phase === 'orientation') {
        // IMPROVEMENT 2 — occupancy only for national-average kWh users; otherwise
        // orientation is the final action (its button becomes "Prepare my quote").
        return <OrientationStep lat={s.lat} lng={s.lng} suggestedDir={s.suggestedDir}
                 value={s.roof_orientation} onChange={onSetOrientation} isFinal={!usedKwhFallback}
                 onContinue={() => { if (usedKwhFallback) setState({ ...s, phase: 'occupancy' }); else onComplete(); }} />;
      }
      return <OccupancyStep value={s.occupants} onSelect={onSetOccupants} onContinue={onComplete} />;
    }

    /* ============================================================
       STEP 7 — Quote screen
       ============================================================ */
    // Capacity number → label without trailing zeros (11.52 → "11.52kWh", 6 → "6kWh").
    function fmtCap(c) { return (Number(c) % 1 === 0 ? String(Number(c)) : String(c)) + 'kWh'; }

    // Staged-reveal wrapper (FIX 2): starts hidden, fades up after `delay` ms — once, on
    // mount. Since QuoteStep stays mounted across tier switches, switching never re-animates.
    function Reveal({ delay, hero, className, children }) {
      const [shown, setShown] = useState(false);
      React.useEffect(() => {
        const t = setTimeout(() => setShown(true), delay || 0);
        return () => clearTimeout(t);
      }, []);
      return (
        <div className={'lw-reveal' + (hero ? ' lw-reveal--hero' : '') + (shown ? ' is-in' : '') + (className ? ' ' + className : '')}>
          {children}
        </div>
      );
    }

    // Count-up via requestAnimationFrame (FIX 4): animates 0 → target once when `active`
    // first turns true, then returns the live target so tier switches update instantly.
    function useCountUp(target, active, duration) {
      duration = duration || 800;
      const [val, setVal] = useState(0);
      const done = useRef(false);
      React.useEffect(() => {
        if (!active || done.current) return;
        const tgt = target;
        let raf, start = null;
        const step = (ts) => {
          if (start === null) start = ts;
          const p = Math.min(1, (ts - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);   // easeOutCubic
          setVal(tgt * eased);
          if (p < 1) raf = requestAnimationFrame(step);
          else done.current = true;
        };
        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
      }, [active]);
      return done.current ? target : val;
    }

    // A single product-showcase card for the carousel. The active card shows the full
    // layout; inactive (peek) cards render the same markup, clipped + faded by the carousel.
    function CarouselCard({ data, products, custom, onCustomChange, isActive, currentBill, onExploreFinance }) {
      const isCustom = data.id === 'custom';
      const hasBattery = data.battery !== 'none';
      const hideImg = (e) => { e.currentTarget.style.display = 'none'; };
      const billAfterSolar = Math.max(0, (currentBill || 0) - Math.round(data.monthlySaving));

      const tierMeta = products && products.tiers ? products.tiers[data.id] : null;
      const tagline = tierMeta ? tierMeta.tagline : '';
      const whoFor = tierMeta ? tierMeta.who_for : null;
      const panel = products && products.panels ? products.panels.standard : null;
      const inverter = products && products.inverter ? products.inverter : null;
      const battery = products && products.batteries ? products.batteries[data.battery] : null;
      const batteryName = (battery && battery.name) || BATTERY_NAME[data.battery];
      const batteryCap = battery && battery.capacity_kwh ? battery.capacity_kwh : 0;

      const panelsCost = getPrice(data.panels, 'none');
      const batteryCost = data.price - panelsCost;

      // Condensed "What's included" list, per tier.
      const batteryIncl = hasBattery ? BATTERY_INCLUDED[data.battery] : null;
      const inclItems = data.id === 'essential'
        ? [data.panels + ' × ' + PANEL_WATT + 'W solar panels', 'Fox ESS H1 G2 hybrid inverter', 'MCS certified installation', 'Smart monitoring app', 'Manufacturer warranty']
        : [data.panels + ' × ' + PANEL_WATT + 'W solar panels', ...(batteryIncl ? [batteryIncl] : []), 'Fox ESS H1 G2 hybrid inverter', 'MCS certified installation', 'Smart monitoring app', 'Manufacturer warranty'];

      const cardCls = 'lw-show-card lw-show-card--' + data.id + (isActive ? ' is-active' : '');

      // Descriptive heading + subtitle per tier. The Performance subtitle names the
      // battery (trailing "Battery" stripped so it doesn't read "… Battery battery storage").
      const subBatteryName = batteryName.replace(/\s*battery\s*$/i, '');
      const subs = {
        essential: 'Clean energy, no battery storage',
        performance: 'Panels + ' + subBatteryName + ' battery storage',
        custom: 'Choose your panel count and battery size',
      };
      const head = { title: TIER_TITLES[data.id] || data.name, sub: subs[data.id] || '' };

      return (
        <div className={cardCls}>
          {data.badge && <div className="lw-show-ribbon">★ Top Pick</div>}
          {/* header */}
          <div className="lw-show-head">
            <div className="lw-show-title">{head.title}</div>
            <div className="lw-show-sub">{head.sub}</div>
          </div>

          {/* three components — image left, text right */}
          <div className="lw-comp-row">
            <div className="lw-comp">
              {panel && panel.image && <img className="lw-comp-img" src={panel.image} alt="" onError={hideImg} />}
              <div className="lw-comp-text">
                <div className="lw-comp-name">{data.panels} × 445W Solar Panels</div>
                <div className="lw-comp-spec">{fmtKw(data.kw)}kW · ~{fmtNum(data.gen)} kWh/yr</div>
              </div>
            </div>
            <div className="lw-comp">
              {inverter && inverter.image && <img className="lw-comp-img" src={inverter.image} alt="" onError={hideImg} />}
              <div className="lw-comp-text">
                <div className="lw-comp-name">Fox ESS H1 G2 Hybrid Inverter</div>
                <div className="lw-comp-spec">Hybrid inverter, smart monitoring</div>
              </div>
            </div>
            <div className="lw-comp">
              {data.battery === 'none'
                ? <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '90px', width: '100%' }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                      stroke="#E8323A" strokeWidth="2.5" strokeLinecap="round"
                      strokeLinejoin="round" aria-hidden="true">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </div>
                : (battery && battery.image && <img className="lw-comp-img" src={battery.image} alt="" onError={hideImg} />)}
              <div className="lw-comp-text">
                <div className="lw-comp-name">{hasBattery ? batteryName : 'No Battery Storage'}</div>
                <div className="lw-comp-spec">{hasBattery ? (batteryCap ? batteryCap + 'kWh storage' : 'Battery storage') : 'Add storage anytime'}</div>
              </div>
            </div>
          </div>

          <hr className="lw-show-div" />

          {/* FIX 3 — branded savings bar (Essential & Performance only; Custom shows dropdowns) */}
          {data.id !== 'custom' && (
            <div style={{
              background: 'linear-gradient(115deg, #E8323A 45%, #d44a2a 100%)',
              borderRadius: '8px',
              padding: '12px 20px',
              position: 'relative',
              overflow: 'hidden',
              marginBottom: '4px'
            }}>
              <div style={{
                position: 'absolute', bottom: 0, right: 0,
                width: '65%', height: '65%',
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
                backgroundSize: '10px 10px',
                WebkitMaskImage: 'radial-gradient(ellipse at 100% 100%, rgba(0,0,0,0.5) 0%, transparent 100%)',
                maskImage: 'radial-gradient(ellipse at 100% 100%, rgba(0,0,0,0.5) 0%, transparent 100%)',
                pointerEvents: 'none'
              }} />
              <div style={{
                fontSize: '0.95rem', fontWeight: 700, color: '#fff',
                textAlign: 'center', marginBottom: '10px',
                position: 'relative', zIndex: 1
              }}>
                Your estimated savings
              </div>
              <div style={{
                display: 'flex', gap: '0', position: 'relative', zIndex: 1
              }}>
                <div style={{ flex: 1, textAlign: 'center', padding: '0 8px' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>
                    {gbp(data.monthlySaving)}/mo <span style={{ fontSize: '0.75rem', fontWeight: 400, opacity: 0.85 }}>est.</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.85)', marginTop: '4px' }}>
                    Monthly bill reduction
                  </div>
                </div>
                <div style={{ width: '1px', background: 'rgba(255,255,255,0.25)', flexShrink: 0, margin: '4px 0' }} />
                <div style={{ flex: 1, textAlign: 'center', padding: '0 8px' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>
                    {gbp(data.saving20yr)} <span style={{ fontSize: '0.75rem', fontWeight: 400, opacity: 0.85 }}>est.</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.85)', marginTop: '4px' }}>
                    Estimated over 20 years
                  </div>
                </div>
                <div style={{ width: '1px', background: 'rgba(255,255,255,0.25)', flexShrink: 0, margin: '4px 0' }} />
                <div style={{ flex: 1, textAlign: 'center', padding: '0 8px' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>
                    {Math.round(data.breakEvenYear)} yrs <span style={{ fontSize: '0.75rem', fontWeight: 400, opacity: 0.85 }}>est.</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.85)', marginTop: '4px' }}>
                    Estimated break-even
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* custom dropdowns */}
          {isCustom && (
            <div className="lw-tier-custom" onClick={(e) => e.stopPropagation()}>
              <label className="lw-tier-field">
                <span>Number of panels</span>
                <select value={custom.panels} onChange={(e) => onCustomChange({ panels: Number(e.target.value) })}>
                  {Array.from({ length: 17 }, (_, i) => i + 6).map((n) => <option key={n} value={n}>{n} panels</option>)}
                </select>
              </label>
              <label className="lw-tier-field">
                <span>Battery storage</span>
                <select value={custom.battery} onChange={(e) => onCustomChange({ battery: e.target.value })}>
                  {BATTERY_DROPDOWN.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
                </select>
              </label>
            </div>
          )}

          <div className="lw-show-incl-wrap">
            <div className="lw-show-incl-head">What's included:</div>
            <div className="lw-show-incl">
              {inclItems.map((it, i) => (
                <div className="lw-show-incl-row" key={i}>{ICONS.check}<span>{it}</span></div>
              ))}
            </div>
          </div>

          {/* summary + details (left) · monthly-price hero (right) */}
          <div className="lw-show-foot">
            <div className="lw-show-summary">
              <div className="lw-show-summary-label">Summary:</div>
              {whoFor && <p className="lw-show-summary-text">{whoFor}</p>}
              <div className="lw-show-datasheets">
                <span className="lw-show-ds-label">Data sheets:</span>{' '}
                {hasBattery && <React.Fragment><a className="lw-show-ds-link" href="#">{batteryName}</a> · </React.Fragment>}
                <a className="lw-show-ds-link" href="#">Fox ESS H1 G2 Inverter</a>
              </div>
            </div>
            <div className="lw-show-price-block">
              <div style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: 'var(--color-primary)',
                marginBottom: '8px'
              }}>
                Your price
              </div>
              <div className="lw-show-price-hero">£{data.monthly}/mo</div>
              <div className="lw-show-price-cash">or pay in full: {gbp(data.price)}</div>
              <button type="button" className="lw-show-finbtn"
                      onClick={(e) => { e.stopPropagation(); onExploreFinance({ systemPrice: data.price, annualSaving: data.annualSaving, annualGeneration: data.gen, breakEvenYear: data.breakEvenYear }); }}>
                Explore finance options
              </button>
            </div>
          </div>
        </div>
      );
    }

    /* ============================================================
       STEP 7 — Finance options modal (Shermin/Stax placeholder)
       Opened from a tier card footer; reflects that tier's system price.
       Mounted fresh on each open, so it resets and picks up the new price.
       ============================================================ */
    // Loan term (months) → year label for the FCA representative example.
    const TERM_YEARS = { 36: '3 years', 48: '4 years', 60: '5 years', 84: '7 years', 120: '10 years', 180: '15 years' };
    function FinanceModal({ systemPrice, annualSaving, annualGeneration, breakEvenYear, onClose, onSelectFinance }) {
      const [mode, setMode] = useState('monthly');     // 'monthly' | 'full'
      const [term, setTerm] = useState(180);           // months; default 15 years
      const [deposit, setDeposit] = useState(0);
      const [confirmed, setConfirmed] = useState(false);  // brief "selected ✓" before closing
      const TERMS = [36, 48, 60, 84, 120, 180];

      // Deposit cap: largest clean £500 multiple that satisfies BOTH Shermin constraints —
      // at most 50% of the system price AND leaving at least £1,000 of loan remaining
      // (whichever is more restrictive wins). The slider max is set to this value.
      const maxDeposit = Math.floor(
        Math.min(systemPrice * 0.5, systemPrice - 1000) / 500
      ) * 500;
      // If the active tier (and thus the max) shrinks, clamp the deposit to the new max.
      React.useEffect(() => { if (deposit > maxDeposit) setDeposit(maxDeposit); }, [maxDeposit]);

      const depositPct = Math.round((deposit / systemPrice) * 100);
      const financeAmount = Math.max(0, systemPrice - deposit);
      const monthly = financeMonthly(financeAmount, term);
      const totalRepayable = monthly * term;            // total repayable on the borrowed sum
      const termYears = TERM_YEARS[term] || (Math.round(term / 12) + ' years');
      const overMaxLoan = financeAmount > 25000;        // max loan £25,000 (defensive)

      // Savings case over the selected term (annual figures × years; not affected by deposit).
      const billSavings = annualSaving * term / 12;
      const genTotalK = Math.round(annualGeneration * term / 12 / 1000);  // total kWh, in thousands
      const netCost = Math.max(0, totalRepayable - billSavings);
      const paidOff = totalRepayable - billSavings <= 0;
      const withinTerm = breakEvenYear <= term / 12;

      // Saving from paying in full vs financing the full price over 15 years.
      const full15Monthly = financeMonthly(systemPrice, 180);
      const financeSavingVsTotal = Math.max(0, full15Monthly * 180 - systemPrice);

      // Commit the selected finance terms to app state, confirm briefly, then close.
      const selectFinance = () => {
        onSelectFinance({
          financeSelected: true,
          financeDeposit: deposit,
          financeDepositPct: depositPct,
          financeTerm: term,
          financeMonthly: monthly,
          financeTotalRepayable: totalRepayable,
        });
        setConfirmed(true);
        setTimeout(onClose, 1500);
      };
      // Choose cash purchase: clear any finance selection and close.
      const selectCash = () => {
        onSelectFinance({ financeSelected: false });
        onClose();
      };

      return (
        <div className="lw-modal-overlay" onClick={onClose}>
          <div className="lw-modal lw-modal--finance" role="dialog" aria-modal="true"
               aria-label="Finance options" onClick={(e) => e.stopPropagation()}>
            <button className="lw-finmodal-close" onClick={onClose} aria-label="Close">×</button>
            <h2 className="lw-finmodal-title">Finance options</h2>

            {/* Pay monthly / Pay in full toggle */}
            <div className="lw-fin-modes">
              <button type="button" className={'lw-fin-mode' + (mode === 'monthly' ? ' is-on' : '')}
                      onClick={() => setMode('monthly')}>Pay monthly</button>
              <button type="button" className={'lw-fin-mode' + (mode === 'full' ? ' is-on' : '')}
                      onClick={() => setMode('full')}>Pay in full</button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, padding: '0 0 24px' }}>
            {mode === 'monthly' ? (
              <div className="lw-fin-body">
                <label className="lw-fin-label">Your deposit</label>
                <input type="range" className="lw-fin-slider" min={0} max={maxDeposit} step={500}
                       value={deposit} onChange={(e) => setDeposit(Number(e.target.value))}
                       aria-label="Deposit amount" />
                <div className="lw-fin-deposit">
                  <span className="lw-fin-deposit-amt">{gbp(deposit)}</span>
                  <span className="lw-fin-deposit-pct">({depositPct}%)</span>
                </div>
                {overMaxLoan && (
                  <p className="lw-fin-note">This system exceeds the £25,000 finance maximum - please pay in full or call us to discuss.</p>
                )}

                <label className="lw-fin-label">Loan term</label>
                <div className="lw-fin-terms">
                  {TERMS.map((t) => (
                    <button key={t} type="button"
                            className={'lw-fin-term' + (t === term ? ' is-on' : '')}
                            onClick={() => setTerm(t)}>
                      <span className="lw-fin-term-mo">{t}mo</span>
                      <span className="lw-fin-term-yr">{Math.round(t / 12)} yrs</span>
                    </button>
                  ))}
                </div>

                <div className="lw-fin-payment">
                  <span className="lw-fin-payment-fig">£{monthly}</span>
                  <span className="lw-fin-payment-unit">/mo</span>
                </div>
                <div className="lw-fin-total">Total repayable: {gbp(totalRepayable)}</div>

                {/* Estimated savings case over the selected term (moved above the FCA example) */}
                <div className="lw-fin-sav">
                  <div className="lw-fin-sav-h">Your estimated savings over {termYears}</div>
                  <div className="lw-fin-sav-grid">
                    <div className="lw-fin-sav-cell">
                      <div className="lw-fin-sav-label">Bill savings</div>
                      <div className="lw-fin-sav-val lw-fin-sav-val--green">{gbp(billSavings)} est.</div>
                    </div>
                    <div className="lw-fin-sav-cell">
                      <div className="lw-fin-sav-label">Electricity generated</div>
                      <div className="lw-fin-sav-val">{genTotalK}k kWh est.</div>
                    </div>
                    <div className="lw-fin-sav-cell">
                      <div className="lw-fin-sav-label">Net cost after savings</div>
                      {paidOff
                        ? <div className="lw-fin-sav-val lw-fin-sav-val--green">System pays for itself</div>
                        : <div className="lw-fin-sav-val">{gbp(netCost)} est.</div>}
                    </div>
                    <div className="lw-fin-sav-cell">
                      {withinTerm
                        ? <div className="lw-fin-sav-label lw-fin-sav-label--green">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                 strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                            Pays off within term
                          </div>
                        : <div className="lw-fin-sav-label">Break-even</div>}
                      <div className={'lw-fin-sav-val' + (withinTerm ? ' lw-fin-sav-val--green' : '')}>Year {Math.ceil(breakEvenYear)} est.</div>
                    </div>
                  </div>
                  <p className="lw-fin-sav-note">Savings estimates are based on current energy prices and your usage data. Actual savings may vary.</p>
                </div>

                <p className="lw-fin-rep">
                  Representative example: Borrowing {gbp(financeAmount)} over {termYears} at 9.9% APR (fixed).
                  Monthly repayments of £{monthly}. Total amount repayable: {gbp(totalRepayable)}.
                  Credit is subject to status and affordability.
                </p>

                {/* SHERMIN_INTEGRATION_POINT — the live Shermin/Stax application embed drops
                    in once credentials are confirmed; for now the user selects the quote. */}
                {confirmed
                  ? <p className="lw-fin-confirm">Finance quote selected ✓</p>
                  : <button type="button" className="lw-fin-select" onClick={selectFinance}>
                      Select this finance quote →
                    </button>}
              </div>
            ) : (
              <div className="lw-fin-body lw-fin-full">
                <div className="lw-fin-full-price">{gbp(systemPrice)}</div>
                <div className="lw-fin-full-save">
                  Save {gbp(financeSavingVsTotal)} compared to paying monthly over 15 years
                </div>
                <button type="button" className="lw-fin-select lw-fin-select--cash" onClick={selectCash}>
                  Pay in full →
                </button>
              </div>
            )}
            </div>
          </div>
        </div>
      );
    }

    /* ============================================================
       STEP 6 → 7 transition — "Where shall we send your quote?"
       Lightweight name + email capture shown after "Prepare my quote →" and
       before the loading overlay. Stays on Step 6 (no progress increment).
       The draft is lifted to App state so back/forward preserves what was typed.
       ============================================================ */
    function EmailGate({ data, onChange, onSubmit, onSkip }) {
      const firstName = data.first_name || '';
      const email = data.email || '';
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
      const canSend = firstName.trim().length > 0 && emailValid;

      const handleSubmit = (e) => { e.preventDefault(); if (canSend) onSubmit(); };

      return (
        <div className="lw-fade-in lw-egate">
          <form onSubmit={handleSubmit}>
            <h1 className="lw-egate-h1">Where shall we send your quote?</h1>
            <p className="lw-egate-sub">We'll show you your quote now and email you a copy to review any time - no commitment required.</p>
            <input type="text" name="lw_first_name" autoComplete="given-name" className="lw-egate-input" placeholder="First name"
                   value={firstName} onChange={(e) => onChange({ ...data, first_name: e.target.value })}
                   aria-label="First name" />
            <input type="email" name="lw_email" autoComplete="email" className="lw-egate-input" placeholder="Email address"
                   value={email} onChange={(e) => onChange({ ...data, email: e.target.value })}
                   aria-label="Email address" />
            <button type="submit" className="lw-cta lw-cta-green" disabled={!canSend}>
              Show me my quote →
            </button>
          </form>
          <button type="button" className="lw-egate-skip" onClick={onSkip}>
            No thanks, just show me my quote →
          </button>
        </div>
      );
    }

    function QuoteStep({ answers, onContinue, onSelectFinance }) {
      // Sensible initial Custom selection: the Performance system, clamped to 6–22.
      const init = buildTiers(answers, { panels: 6, battery: 'none' }).defaults;
      const [custom, setCustom] = useState({
        panels: Math.min(22, Math.max(6, init.perfCount)),
        battery: init.perfBattery,
      });
      const order = ['essential', 'performance', 'custom'];
      const [activeCard, setActiveCard] = useState(1);   // 0 Essential · 1 Performance · 2 Custom
      // Finance modal — holds the selected tier's finance inputs (price + savings data)
      // for whichever footer button was clicked (null = closed). Reopening from another
      // tier passes that tier's data.
      const [financeData, setFinanceData] = useState(null);

      // IMPROVEMENT 1 — product data (brand names, capacities, images, who_for).
      // Silent fallback to the hardcoded values if the fetch fails.
      const [products, setProducts] = useState(null);
      const [prodStatus, setProdStatus] = useState('loading'); // loading | ready | error
      React.useEffect(() => {
        let alive = true;
        fetch('/solar/solar-products.json')
          .then((r) => { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
          .then((d) => { if (alive) { setProducts(d); setProdStatus('ready'); } })
          .catch(() => { if (alive) setProdStatus('error'); });
        return () => { alive = false; };
      }, []);

      const tiers = buildTiers(answers, custom);
      const active = tiers[order[activeCard]];

      // IMPROVEMENT 4 — headline price breakdown for the active tier.
      const activePanelsCost = getPrice(active.panels, 'none');
      const activeBatteryCost = active.price - activePanelsCost;
      const breakdownLine = active.battery !== 'none'
        ? gbp(activePanelsCost) + ' panels + ' + gbp(activeBatteryCost) + ' battery storage'
        : gbp(active.price) + ' panels only';

      // Current monthly bill (before solar) — same for every tier; passed to each card
      // so the bill-drop + payback detail can render there (not in the headline).
      const usageKwh = Number(String(answers.electricity_usage || '').replace(/[^0-9.]/g, '')) || 0;
      const rateP = Number(String(answers.day_unit_rate || '').replace(/[^0-9.]/g, '')) || 26.35;
      let currentBill = Math.round((usageKwh / 12) * (rateP / 100));
      if (currentBill < 20) currentBill = 120;            // guard against missing/zero usage

      // FIX 3 — system summary line under the address.
      const sumBattery = products && products.batteries ? products.batteries[active.battery] : null;
      const sumBatteryName = (sumBattery && sumBattery.name) || BATTERY_NAME[active.battery];
      const sumBatteryCap = sumBattery && sumBattery.capacity_kwh ? sumBattery.capacity_kwh : 0;
      const summaryLine = active.battery === 'none'
        ? active.panels + ' panels (' + fmtKw(active.kw) + 'kW system) · No battery storage'
        : active.panels + ' panels (' + fmtKw(active.kw) + 'kW system) · ' + sumBatteryName
          + (sumBatteryCap ? ' · ' + fmtCap(sumBatteryCap) : '');

      // FIX 3 — savings figures count up together on mount (once).
      const [counting, setCounting] = useState(false);
      React.useEffect(() => { setCounting(true); }, []);
      const countMonthly = useCountUp(active.monthlySaving, counting);
      const count20yr = useCountUp(active.saving20yr, counting);

      const onCustomChange = (patch) => {
        setCustom((c) => ({ ...c, ...patch }));
        setActiveCard(2);   // editing Custom brings it to centre
      };

      // Carousel geometry — measure the container so the active slide is always centred,
      // with a fixed peek of the neighbours on each side (smaller peek on mobile).
      const carRef = useRef(null);
      const [carW, setCarW] = useState(0);
      useLayoutEffect(() => {
        const el = carRef.current;
        if (!el) return;
        const measure = () => setCarW(el.clientWidth);
        measure();
        // Re-measure once the real width settles (the carousel mounts inside a staged
        // Reveal / behind the prepare overlay, so the first measure can be premature).
        let ro;
        if (typeof ResizeObserver !== 'undefined') {
          ro = new ResizeObserver(measure);
          ro.observe(el);
        }
        window.addEventListener('resize', measure);
        return () => { window.removeEventListener('resize', measure); if (ro) ro.disconnect(); };
      }, []);
      const CAR_GAP = 16;
      const peek = carW && carW < 560 ? 32 : 120;
      const slideW = Math.max(0, Math.min(700, carW - 2 * peek));
      const trackX = carW ? (carW / 2 - slideW / 2 - activeCard * (slideW + CAR_GAP)) : 0;

      // Swipe (mobile): ≥50px horizontal advances the carousel.
      const touchX = useRef(null);
      const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
      const onTouchEnd = (e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (dx <= -50 && activeCard < 2) setActiveCard(activeCard + 1);
        else if (dx >= 50 && activeCard > 0) setActiveCard(activeCard - 1);
        touchX.current = null;
      };

      const addressLine = [answers.address_line1, answers.town].filter(Boolean).join(', ');

      // What's-included list for the active tier.
      const included = [
        `${active.panels} × ${PANEL_WATT}W solar panels`,
        ...(active.battery !== 'none' ? [BATTERY_INCLUDED[active.battery]] : []),
        'Solar inverter',
        'Smart monitoring app',
        'Professional installation',
        'MCS certified installation',
        'Manufacturer warranty',
      ];

      // Panel + battery summary line for the micro-commitment screen
      // (e.g. "10 × 445W panels + Fox ESS EP12 battery").
      const microBatteryName = active.battery === 'none' ? null : (() => {
        let bn = sumBatteryName;
        if (!/battery|powerwall/i.test(bn)) bn += ' battery';
        return bn;
      })();
      const panelBatteryLine = active.panels + ' × ' + PANEL_WATT + 'W panels'
        + (microBatteryName ? ' + ' + microBatteryName : '');

      const handleContinue = () => {
        // "What's included" list for the active tier (mirrors the carousel card).
        const batteryIncl = active.battery !== 'none' ? BATTERY_INCLUDED[active.battery] : null;
        const inclItems = active.id === 'essential'
          ? [active.panels + ' × ' + PANEL_WATT + 'W solar panels', 'Fox ESS H1 G2 hybrid inverter', 'MCS certified installation', 'Smart monitoring app', 'Manufacturer warranty']
          : [active.panels + ' × ' + PANEL_WATT + 'W solar panels', ...(batteryIncl ? [batteryIncl] : []), 'Fox ESS H1 G2 hybrid inverter', 'MCS certified installation', 'Smart monitoring app', 'Manufacturer warranty'];
        // Product images (from solar-products.json, with hardcoded fallbacks).
        const panelImg = (products && products.panels && products.panels.standard && products.panels.standard.image) || PANEL_IMG;
        const inverterImg = (products && products.inverter && products.inverter.image) || INVERTER_IMG;
        const batteryObj = products && products.batteries ? products.batteries[active.battery] : null;
        const batteryImg = active.battery === 'none' ? null : ((batteryObj && batteryObj.image) || BATTERY_IMG[active.battery] || null);

        // Opens the upsell modal (handled by the parent) — does not advance the step.
        onContinue({
          product_selection: `${active.name} Solar PV System`,
          solar_panel_number: String(active.panels),
          battery: BATTERY_NAME[active.battery],
          // extra fields the upsell modal + micro-commitment screen need
          tierTitle: TIER_TITLES[active.id] || active.name,
          tierName: active.name,
          panelBatteryLine,
          price: active.price,        // base cash price (number, ex any add-ons)
          monthly: active.monthly,    // finance monthly (number)
          // savings figures carried through to the Step 8 booking summary
          monthlySaving: active.monthlySaving,
          saving20yr: active.saving20yr,
          // micro-commitment product card
          batteryKey: active.battery,
          included: inclItems,
          images: { panel: panelImg, inverter: inverterImg, battery: batteryImg },
        });
      };

      return (
        <div className="lw-quote">
          {/* Compact price/summary block (savings moved into the tier cards below) */}
          <Reveal delay={0}>
            <div className="lw-quote-top">
              <div className="lw-qt-heading">Your instant quote</div>
              <div className="lw-qt-priceline">
                <span className="lw-qt-cash">{gbp(active.price)}</span>
                <span className="lw-qt-monthly"><span className="lw-qt-or">or</span> £{active.monthly}/mo</span>
              </div>
              <p className="lw-qt-summary">{summaryLine}</p>
              <p className="lw-qt-survey">Subject to survey and final system confirmation</p>
            </div>
          </Reveal>

          {/* Section heading above tier cards */}
          <Reveal delay={400}>
            <div className="lw-tier-heading-wrap">
              <h2 className="lw-tier-heading">Choose your system</h2>
            </div>
          </Reveal>

          {/* Tier carousel (Performance centred on load) */}
          <Reveal delay={500}>
            <div className="lw-carousel-nav">
              {order.map((id, i) => (
                <button key={id} type="button"
                  className={'lw-carousel-ind' + (i === activeCard ? ' is-active' : '')}
                  aria-label={tiers[id].name} onClick={() => setActiveCard(i)}>
                  <span className="lw-ind-dot" />
                </button>
              ))}
            </div>
            <div className="lw-carousel-wrap">
              <div className="lw-carousel" ref={carRef} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
                <div className="lw-carousel-track" style={{ transform: 'translateX(' + trackX + 'px)' }}>
                  {order.map((id, i) => (
                    <div key={id}
                         className={'lw-carousel-slide' + (i === activeCard ? ' is-active' : '')}
                         style={{ width: slideW + 'px' }}
                         onClick={() => { if (i !== activeCard) setActiveCard(i); }}>
                      <CarouselCard data={tiers[id]} products={products} currentBill={currentBill}
                        custom={custom} onCustomChange={onCustomChange} isActive={i === activeCard}
                        onExploreFinance={setFinanceData} />
                    </div>
                  ))}
                </div>
                <div className="lw-carousel-fade lw-carousel-fade--l" style={{ width: peek + 'px' }} />
                <div className="lw-carousel-fade lw-carousel-fade--r" style={{ width: peek + 'px' }} />
                {activeCard > 0 && (
                  <button type="button" className="lw-carousel-arrow lw-carousel-arrow--l"
                    style={{ left: (peek - 26) + 'px' }}
                    aria-label="Previous system" onClick={() => setActiveCard(activeCard - 1)}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                  </button>
                )}
                {activeCard < 2 && (
                  <button type="button" className="lw-carousel-arrow lw-carousel-arrow--r"
                    style={{ right: (peek - 26) + 'px' }}
                    aria-label="Next system" onClick={() => setActiveCard(activeCard + 1)}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                  </button>
                )}
              </div>
            </div>
          </Reveal>

          {/* CTA */}
          <Reveal delay={900}>
            <button type="button" className="lw-cta lw-cta-quote" onClick={handleContinue}>
              Continue with this system →
            </button>
          </Reveal>

          {/* Finance options modal — reflects the tier whose footer button was clicked */}
          {financeData != null && (
            <FinanceModal systemPrice={financeData.systemPrice}
              annualSaving={financeData.annualSaving}
              annualGeneration={financeData.annualGeneration}
              breakEvenYear={financeData.breakEvenYear}
              onClose={() => setFinanceData(null)}
              onSelectFinance={onSelectFinance} />
          )}
        </div>
      );
    }

    /* ============================================================
       STEP 7A — Upsell modal (overlay; does NOT advance the step)
       ============================================================ */
    function UpsellModal({ answers, sel, warrantyAdded, evChargerInterest, busGrantInterest,
                           onToggleWarranty, onToggleEv, onToggleBus, onClose, onContinue }) {
      // EV row only shows if they have an EV, or plan one within 5 years.
      const showEv = answers.has_ev === 'Yes'
        || answers.ev_plans === 'within_2_years'
        || answers.ev_plans === 'maybe_2_5_years';
      const anySelected = warrantyAdded || evChargerInterest || busGrantInterest;

      return (
        <div className="lw-modal-overlay" onClick={onClose}>
          <div className="lw-modal lw-modal--upsell" role="dialog" aria-modal="true"
               aria-label="Enhance Your System" onClick={(e) => e.stopPropagation()}>
            <button className="lw-modal-close" onClick={onClose} aria-label="Close">×</button>
            <h2 className="lw-upsell-title">Enhance Your System</h2>
            <p className="lw-upsell-sub">Optional add-ons for your installation</p>

            {/* 1 - EV Charger (conditional) */}
            {showEv && (
              <button type="button"
                className={'lw-addon-row' + (evChargerInterest ? ' is-on' : '')}
                onClick={onToggleEv} aria-pressed={evChargerInterest}>
                <div className="lw-addon-text">
                  <div className="lw-addon-label">EV Charger &amp; Installation</div>
                  <div className="lw-addon-desc">Home charging added alongside your solar install.</div>
                </div>
                <div className="lw-addon-right">
                  <div className="lw-addon-pricearea"><span className="lw-addon-price--enquire">Enquire</span></div>
                  <span className={'lw-switch' + (evChargerInterest ? ' is-on' : '')} aria-hidden="true" />
                </div>
                <div className="lw-addon-sell">No more public charging queues. Wake up to a full battery every morning, powered by your own solar panels. Added alongside your solar install with no extra disruption.</div>
              </button>
            )}

            {/* 2 - Extended Warranty */}
            <button type="button"
              className={'lw-addon-row' + (warrantyAdded ? ' is-on' : '')}
              onClick={onToggleWarranty} aria-pressed={warrantyAdded}>
              <div className="lw-addon-text">
                <div className="lw-addon-label">Extended Warranty</div>
                <div className="lw-addon-desc">5-year workmanship guarantee</div>
              </div>
              <div className="lw-addon-right">
                <div className="lw-addon-pricearea"><span className="lw-addon-price">+£199</span></div>
                <span className={'lw-switch' + (warrantyAdded ? ' is-on' : '')} aria-hidden="true" />
              </div>
              <div className="lw-addon-sell">Extend your workmanship warranty from 2 years to 5 years for complete peace of mind. Covers all labour and installation work - included in your finance payments if you choose to spread the cost.</div>
            </button>

            {/* 3 - Heat Pump Government Grant */}
            <button type="button"
              className={'lw-addon-row lw-addon-bus' + (busGrantInterest ? ' is-on' : '')}
              onClick={onToggleBus} aria-pressed={busGrantInterest}>
              <div className="lw-addon-text">
                <div className="lw-addon-label">Heat Pump Government Grant<span className="lw-addon-label-grant"> – Get £7,500</span></div>
                <div className="lw-addon-desc">You could get a £7,500 government grant towards a heat pump - want to know more?</div>
              </div>
              <div className="lw-addon-right">
                <div className="lw-addon-pricearea">
                  <div className="lw-addon-grant-val">£7,500</div>
                  <div className="lw-addon-grant-sub">Grant</div>
                </div>
                <span
                  className={'lw-switch' + (busGrantInterest ? ' is-on' : '')}
                  style={busGrantInterest ? { background: '#4CAF50' } : undefined}
                  aria-hidden="true"
                />
              </div>
              <div className="lw-addon-sell">Replace your boiler with a heat pump and get up to £7,500 back from the government. Many solar customers qualify - our team will check your eligibility after your solar booking.</div>
            </button>

            <div className="lw-upsell-btns">
              <button type="button" className="lw-upsell-decline" onClick={onContinue}>Not this time</button>
              <button type="button" className="lw-upsell-go" onClick={onContinue}>
                {anySelected ? 'Continue: Add Selected →' : 'Continue →'}
              </button>
            </div>
          </div>
        </div>
      );
    }

    /* ============================================================
       STEP 7A — Micro-commitment screen (system summary; no progress increment)
       ============================================================ */
    function MicroCommitment({ sel, warrantyAdded, evChargerInterest, busGrantInterest, financeChoice, onContinue, onEdit }) {
      const total = sel.price + (warrantyAdded ? 199 : 0);
      const fin = financeChoice && financeChoice.financeSelected ? financeChoice : null;
      // Payment preference selected in the finance modal; default 'finance' (modal skipped).
      const paymentMethod = financeChoice && financeChoice.financeSelected === false ? 'cash' : 'finance';
      const hideImg = (e) => { e.currentTarget.style.display = 'none'; };
      const images = sel.images || {};
      const included = sel.included || [];
      const hasBattery = sel.batteryKey && sel.batteryKey !== 'none';
      const tick = (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
             strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
      );
      return (
        <div className="lw-mc lw-fade-in">
          {/* Header */}
          <svg className="lw-mc-tick" width="48" height="48" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="M8 12l3 3 5-6" />
          </svg>
          <h2 className="lw-mc-h">Here's your system</h2>
          <p className="lw-mc-sub">Review your selection before booking your free survey.</p>

          {/* Premium product card */}
          <div className="lw-mc-card">
            <div className="lw-mc-dots" />

            {/* Product images row */}
            <div className="lw-mc-imgs">
              <div className="lw-mc-cell">
                {images.panel && <img src={images.panel} alt="Solar panels" onError={hideImg} />}
              </div>
              <div className="lw-mc-cell">
                {images.inverter && <img src={images.inverter} alt="Inverter" onError={hideImg} />}
              </div>
              <div className="lw-mc-cell">
                {hasBattery && images.battery
                  ? <img src={images.battery} alt="Battery" onError={hideImg} />
                  : <span className="lw-mc-cell-empty">No battery</span>}
              </div>
            </div>

            <div className="lw-mc-body">
              {/* Row 1 — tier + summary */}
              <div className="lw-mc-pill">{sel.tierName || sel.tierTitle}</div>
              <div className="lw-mc-spec">{sel.panelBatteryLine}</div>

              {/* Row 2 — what's included */}
              <div className="lw-mc-incl">
                {included.map((it, i) => (
                  <div className="lw-mc-incl-row" key={i}>{tick}<span>{it}</span></div>
                ))}
              </div>

              {/* Row 3 — add-ons (only if any selected) */}
              {(warrantyAdded || busGrantInterest || evChargerInterest) && (
                <div className="lw-mc-addons">
                  <div className="lw-mc-addons-h">Added to your system</div>
                  {warrantyAdded && (
                    <div className="lw-mc-addon">{tick}<span>5-Year Workmanship Guarantee included</span></div>
                  )}
                  {busGrantInterest && (
                    <div className="lw-mc-addon">{tick}<span>BUS Heat Pump Grant - we'll be in touch</span></div>
                  )}
                  {evChargerInterest && (
                    <div className="lw-mc-addon">{tick}<span>EV Charger enquiry registered</span></div>
                  )}
                </div>
              )}

              <hr className="lw-mc-div" />

              {/* Row 4 — price block (reflects the selected payment method) */}
              <div className="lw-mc-price-label">Your price</div>
              {paymentMethod === 'cash' ? (
                <React.Fragment>
                  <div className="lw-mc-monthly">{gbp(total)}</div>
                  <div className="lw-mc-cash lw-mc-cash--deemph">or from £{sel.monthly}/mo with finance</div>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div className="lw-mc-monthly">£{fin ? fin.financeMonthly : sel.monthly}/mo</div>
                  <div className="lw-mc-cash lw-mc-cash--deemph">or pay in full: {gbp(total)}</div>
                  <div className="lw-mc-finterms">{gbp(fin ? fin.financeDeposit : 0)} deposit · {fin ? fin.financeTerm : 180} months · 9.9% APR</div>
                </React.Fragment>
              )}
              <div className="lw-mc-vat">All prices include VAT</div>
            </div>
          </div>

          <p className="lw-mc-note">Prices subject to survey and final system confirmation.</p>

          <button type="button" className="lw-cta lw-mc-cta" onClick={onContinue}>
            Confirm this system →
          </button>
          <button type="button" className="lw-mc-edit" onClick={onEdit}>← Change system</button>
        </div>
      );
    }

    function StepComplete({ answers, onRestart }) {
      return (
        <div className="lw-complete lw-fade-in">
          <h2>Great — that's the basics covered.</h2>
          <p>Here's what you've told us so far:</p>
          <div className="lw-summary-pills">
            {QUESTIONS.map((q) => (
              <span key={q.key} className="lw-pill" style={{ cursor: 'default' }}>
                <span className="lw-pill-label">{shortLabel(q.key)}:</span>
                <span className="lw-pill-value">{answers[q.key]}</span>
              </span>
            ))}
            {answers.electricity_usage && (
              <span className="lw-pill" style={{ cursor: 'default' }}>
                <span className="lw-pill-label">Usage:</span>
                <span className="lw-pill-value">{formatKwh(answers.electricity_usage)} kWh</span>
              </span>
            )}
            {answers.day_unit_rate && (
              <span className="lw-pill" style={{ cursor: 'default' }}>
                <span className="lw-pill-label">Rate:</span>
                <span className="lw-pill-value">{formatRate(answers)}</span>
              </span>
            )}
            {answers.battery_location && (
              <span className="lw-pill" style={{ cursor: 'default' }}>
                <span className="lw-pill-label">Battery:</span>
                <span className="lw-pill-value">{formatBattery(answers)}</span>
              </span>
            )}
            {answers.has_ev && (
              <span className="lw-pill" style={{ cursor: 'default' }}>
                <span className="lw-pill-label">EV:</span>
                <span className="lw-pill-value">{formatEv(answers)}</span>
              </span>
            )}
            {answers.address_full && (
              <span className="lw-pill" style={{ cursor: 'default' }}>
                <span className="lw-pill-label">Address:</span>
                <span className="lw-pill-value">{answers.address_line1 || answers.postcode}</span>
              </span>
            )}
            {answers.roof_orientation && (
              <span className="lw-pill" style={{ cursor: 'default' }}>
                <span className="lw-pill-label">Faces:</span>
                <span className="lw-pill-value">{DIR_WORDS[answers.roof_orientation]}</span>
              </span>
            )}
            {answers.occupants && (
              <span className="lw-pill" style={{ cursor: 'default' }}>
                <span className="lw-pill-label">Household:</span>
                <span className="lw-pill-value">{formatOccupants(answers.occupants)}</span>
              </span>
            )}
            {answers.product_selection && (
              <span className="lw-pill" style={{ cursor: 'default' }}>
                <span className="lw-pill-label">System:</span>
                <span className="lw-pill-value">{answers.product_selection} · {answers.solar_panel_number} panels · {gbp(Number(answers.payment_total))}</span>
              </span>
            )}
          </div>
          <p className="lw-next-note">Step 8 coming soon — upsell &amp; your details are built in the next session.</p>
          <div style={{ marginTop: 8 }}>
            <button className="lw-btn lw-btn-ghost" onClick={onRestart}>Start over</button>
          </div>
        </div>
      );
    }

    function DeadEnd({ reason, onBack }) {
      // On the live site this is a real WordPress page; redirect there in production.
      // Locally that path 404s, so we render the in-app dead-end screen for testing.
      React.useEffect(() => {
        const host = window.location.hostname;
        const isProd = /livwarm/i.test(host);
        if (isProd) window.location.assign(DEAD_END_PATH);
      }, []);
      return (
        <div className="lw-deadend lw-fade-in">
          <div className="lw-deadend-icon">{ICONS.sad}</div>
          <h1>Sorry, we can't help with this one</h1>
          <p>{reason}</p>
          <button className="lw-btn lw-btn-primary" onClick={onBack}>Go back</button>
        </div>
      );
    }

    function Footer() {
      return (
        <footer className="lw-footer">
          <div className="lw-trust-row">
            <span>{ICONS.shield} MCS Certified</span>
            <span>{ICONS.star} Rated 4.9 on Trustpilot</span>
            <span>{ICONS.check} 2-Year Workmanship Warranty</span>
          </div>
        </footer>
      );
    }

    /* format a kWh value with thousands separators for display (e.g. 4100 → "4,100") */
    function formatKwh(v) {
      const n = String(v == null ? '' : v).replace(/[^0-9.]/g, '');
      if (n === '') return '';
      const num = Number(n);
      return Number.isFinite(num) ? num.toLocaleString('en-GB') : n;
    }

    /* format the tariff for display: "27p/kWh" (single) or "28p/15p (E7)" (different) */
    function formatRate(answers) {
      const day = String(answers.day_unit_rate || '').replace(/[^0-9.]/g, '');
      const night = String(answers.night_unit_rate || '').replace(/[^0-9.]/g, '');
      if (!day) return '';
      return night ? `${day}p/${night}p (E7)` : `${day}p/kWh`;
    }

    /* tariff/battery/EV breadcrumb value formatters */
    function formatBattery(a) {
      if (a.battery_location === 'Inside') return 'Inside - ' + (a.battery_location_inside || '');
      if (a.battery_location === 'Outside') return 'Outside - ' + (a.battery_location_outside || '');
      if (a.battery_location) return 'Not sure';
      return '';
    }
    function formatEv(a) {
      if (a.has_ev === 'Yes') {
        if (a.ev_charging === 'home_established') return 'Yes - at home (1yr+)';
        if (a.ev_charging === 'home_recent') return 'Yes - at home (new)';
        if (a.ev_charging === 'elsewhere_wants_charger') return 'Yes - wants charger';
        if (a.ev_charging === 'elsewhere_staying') return 'Yes - charges elsewhere';
        return 'Yes';
      }
      if (a.has_ev === 'No') {
        if (a.ev_plans === 'within_2_years') return 'No - within 2 years';
        if (a.ev_plans === 'maybe_2_5_years') return 'No - 2 to 5 years';
        if (a.ev_plans === 'no_plans') return 'No plans';
        return 'No';
      }
      return '';
    }

    /* occupancy breadcrumb value: "3 people" / "1 person" */
    function formatOccupants(v) {
      if (!v) return '';
      return v + (v === '1' ? ' person' : ' people');
    }

    /* short labels for breadcrumb pills */
    function shortLabel(key) {
      switch (key) {
        case 'house_owner_type': return 'You are';
        case 'house_type': return 'Home';
        case 'roof_type': return 'Roof';
        case 'house_bedrooms': return 'Bedrooms';
        default: return key;
      }
    }

    const DEAD_END_REASONS = {
      Flat: "Flats and apartments aren't suitable for our solar installations, as you'd typically need shared roof access and freeholder permission.",
      'Flat roof': "Our solar panels are designed for pitched roofs. Flat roofs need a different mounting system we don't currently install.",
    };

    /* ============================================================
       STEP 8 — Custom weekday-only calendar picker
       ============================================================ */
    const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    const DOW_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    function isoDate(y, m, d) {
      return y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
    }
    function formatIsoLong(iso) {
      if (!iso) return '';
      const [y, m, d] = iso.split('-');
      return Number(d) + ' ' + MONTH_NAMES[Number(m) - 1] + ' ' + y;
    }

    function CalendarPicker({ value, onSelect }) {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const minDate = new Date(today.getTime()); minDate.setDate(minDate.getDate() + 14);  // earliest = 14 days out
      const [view, setView] = useState({ y: minDate.getFullYear(), m: minDate.getMonth() });

      // On mount: if the opening month has fewer than 5 selectable weekdays remaining
      // after the 14-day cutoff, advance to the next month so it doesn't open near-empty.
      React.useEffect(() => {
        const dim = new Date(view.y, view.m + 1, 0).getDate();
        let selectable = 0;
        for (let d = 1; d <= dim; d++) {
          const dt = new Date(view.y, view.m, d); dt.setHours(0, 0, 0, 0);
          const dow = dt.getDay();
          if (dt >= minDate && dow !== 0 && dow !== 6) selectable++;
        }
        if (selectable < 5) setView((v) => v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 });
      }, []);

      const firstOfMonth = new Date(view.y, view.m, 1);
      const startOffset = (firstOfMonth.getDay() + 6) % 7;          // Monday-based leading blanks
      const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
      const todayIso = isoDate(today.getFullYear(), today.getMonth(), today.getDate());

      // Don't page back into a month that's entirely before the earliest selectable date.
      const canPrev = (view.y > minDate.getFullYear())
        || (view.y === minDate.getFullYear() && view.m > minDate.getMonth());
      const prevMonth = () => { if (canPrev) setView((v) => v.m === 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 }); };
      const nextMonth = () => setView((v) => v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 });

      const cells = [];
      for (let i = 0; i < startOffset; i++) cells.push(null);
      for (let d = 1; d <= daysInMonth; d++) cells.push(d);

      return (
        <div className="lw-cal">
          <div className="lw-cal-head">
            <button type="button" className="lw-cal-nav" onClick={prevMonth} disabled={!canPrev}
                    aria-label="Previous month">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <span className="lw-cal-title">{MONTH_NAMES[view.m]} {view.y}</span>
            <button type="button" className="lw-cal-nav" onClick={nextMonth} aria-label="Next month">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>
          <div className="lw-cal-grid lw-cal-dow">
            {DOW_LABELS.map((d) => <span key={d} className="lw-cal-dowcell">{d}</span>)}
          </div>
          <div className="lw-cal-grid">
            {cells.map((d, i) => {
              if (d == null) return <span key={'e' + i} className="lw-cal-cell is-empty" />;
              const dow = (startOffset + d - 1) % 7;                 // 0=Mon .. 6=Sun
              const isWeekend = dow >= 5;
              const cellDate = new Date(view.y, view.m, d); cellDate.setHours(0, 0, 0, 0);
              const iso = isoDate(view.y, view.m, d);
              const disabled = isWeekend || cellDate < minDate;
              const isSel = value === iso;
              const isToday = iso === todayIso;
              const cls = 'lw-cal-cell'
                + (disabled ? ' is-disabled' : '')
                + (isWeekend ? ' is-weekend' : '')
                + (isSel ? ' is-selected' : '')
                + (isToday && !isSel ? ' is-today' : '');
              return (
                <button key={iso} type="button" className={cls} disabled={disabled}
                        onClick={() => onSelect(iso)}>{d}</button>
              );
            })}
          </div>
        </div>
      );
    }

    /* ============================================================
       STEP 8 — Your details + booking summary
       ============================================================ */
    function ContactDetails({ sel, warrantyAdded, financeChoice, leadFirstName, leadEmail, onSubmit }) {
      const fin = financeChoice && financeChoice.financeSelected ? financeChoice : null;
      // Payment preference selected in the finance modal; default 'finance' (modal skipped).
      const paymentMethod = financeChoice && financeChoice.financeSelected === false ? 'cash' : 'finance';
      // Pre-populate from the email-capture gate: if a lead name/email was provided
      // there, seed the matching field (otherwise blank — e.g. the user skipped).
      const [firstName, setFirstName] = useState(leadFirstName || '');
      const [surname, setSurname] = useState('');
      const [email, setEmail] = useState(leadEmail || '');
      const [phone, setPhone] = useState('');
      const [date, setDate] = useState('');
      const [touched, setTouched] = useState(false);

      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
      const phoneValid = /^(?:\+?44|0)\d{9,10}$/.test(phone.replace(/[^0-9+]/g, ''));
      const allValid = firstName.trim() && surname.trim() && emailValid && phoneValid && !!date;

      const total = sel.price + (warrantyAdded ? 199 : 0);
      const monthly = financeMonthly(total, 180);

      const handleBook = () => {
        setTouched(true);
        if (!allValid) return;
        onSubmit({
          full_name: (firstName.trim() + ' ' + surname.trim()).trim(),
          email: email.trim(),
          phone: phone.trim(),
          preferred_date: date,
        });
      };

      const NEXT = [
        { n: 1, label: 'Survey booked', desc: "We'll confirm your slot within 24 hours" },
        { n: 2, label: 'Remote design', desc: 'Our engineers review your roof and design your system' },
        { n: 3, label: 'Installation day', desc: 'Your system is fitted by our MCS-certified team' },
      ];

      return (
        <div className="lw-contact lw-fade-in">
          <div className="lw-contact-grid">
            {/* LEFT — form */}
            <div className="lw-cd-left">
              <h1 className="lw-cd-h1">Secure your free survey</h1>
              <p className="lw-cd-subh">No payment today. Our team will contact you within 24 hours to confirm your installation date.</p>

              {/* CARD 1 — What happens next? */}
              <div className="lw-cd-card">
                <div className="lw-cd-cardhead">
                  <span className="lw-cd-num">1</span>
                  <span className="lw-cd-cardlabel">What happens next?</span>
                </div>
                <div className="lw-next3">
                  {NEXT.map((s) => (
                    <div key={s.n} className="lw-next3-item">
                      <span className="lw-next3-num">{s.n}</span>
                      <div className="lw-next3-body">
                        <div className="lw-next3-label">{s.label}</div>
                        <div className="lw-next3-desc">{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD 2 — Your details */}
              <div className="lw-cd-card">
                <div className="lw-cd-cardhead">
                  <span className="lw-cd-num">2</span>
                  <span className="lw-cd-cardlabel">Your details</span>
                </div>
                <div className="lw-cd-row">
                  <div className="lw-cd-field">
                    <label className="lw-cd-label" htmlFor="cd-first">First name</label>
                    <input id="cd-first" className="lw-cd-input" type="text" value={firstName}
                           onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div className="lw-cd-field">
                    <label className="lw-cd-label" htmlFor="cd-surname">Surname</label>
                    <input id="cd-surname" className="lw-cd-input" type="text" value={surname}
                           onChange={(e) => setSurname(e.target.value)} />
                  </div>
                </div>
                <div className="lw-cd-field">
                  <label className="lw-cd-label" htmlFor="cd-email">Email address</label>
                  <input id="cd-email" className="lw-cd-input" type="email" value={email}
                         onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="lw-cd-field">
                  <label className="lw-cd-label" htmlFor="cd-phone">Phone number</label>
                  <input id="cd-phone" className="lw-cd-input" type="tel" value={phone}
                         onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>

              {/* CARD 3 — Preferred survey date */}
              <div className="lw-cd-card">
                <div className="lw-cd-cardhead">
                  <span className="lw-cd-num">3</span>
                  <span className="lw-cd-cardlabel">Preferred survey date</span>
                </div>
                <p className="lw-cd-hint">Weekdays only. Our team will confirm availability after your technical review.</p>
                <CalendarPicker value={date} onSelect={setDate} />
                {date && <p className="lw-cd-chosen">Selected: {formatIsoLong(date)}</p>}
              </div>

              <button type="button" className="lw-cta lw-cd-cta" disabled={!allValid} onClick={handleBook}>
                Book my free survey →
              </button>
              {touched && !allValid && (
                <p className="lw-cd-err">Please complete all fields with a valid email, UK phone number and a chosen date.</p>
              )}
            </div>

            {/* RIGHT — sticky booking summary */}
            <aside className="lw-cd-right">
              <div className="lw-bsum">
                {sel.images && (
                  <div className="lw-bsum-imgs">
                    <div className="lw-bsum-cell">
                      {sel.images.panel && <img src={sel.images.panel} alt=""
                        onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
                    </div>
                    <div className="lw-bsum-cell">
                      {sel.images.inverter && <img src={sel.images.inverter} alt=""
                        onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
                    </div>
                    <div className="lw-bsum-cell">
                      {sel.images.battery
                        ? <img src={sel.images.battery} alt=""
                            onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        : <img src={BATTERY_IMG['5kw']} alt=""
                            style={{ filter: 'grayscale(100%) opacity(0.25)' }}
                            onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
                    </div>
                  </div>
                )}
                <h2 className="lw-bsum-h">Your booking summary</h2>

                <div className="lw-bsum-tier">{sel.tierTitle}</div>
                <div className="lw-bsum-spec">{sel.panelBatteryLine}</div>
                {warrantyAdded && (
                  <div className="lw-bsum-warr">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                    5-Year Workmanship Guarantee
                  </div>
                )}

                <hr className="lw-bsum-div" />

                {paymentMethod === 'cash' ? (
                  <React.Fragment>
                    <div className="lw-bsum-line">
                      <span className="lw-bsum-k">Cash price</span>
                      <span className="lw-bsum-cashv">{gbp(total)}</span>
                    </div>
                    <div className="lw-bsum-cashnote">or from £{monthly}/mo with finance</div>
                  </React.Fragment>
                ) : fin ? (
                  <React.Fragment>
                    <div className="lw-bsum-mplabel">Monthly payment</div>
                    <div className="lw-bsum-mpfig">£{fin.financeMonthly}/mo</div>
                    <div className="lw-bsum-line">
                      <span className="lw-bsum-k">Deposit</span>
                      <span className="lw-bsum-k">{gbp(fin.financeDeposit)} ({fin.financeDepositPct}%)</span>
                    </div>
                    <div className="lw-bsum-line">
                      <span className="lw-bsum-k">Term</span>
                      <span className="lw-bsum-k">{fin.financeTerm} months ({TERM_YEARS[fin.financeTerm] || (Math.round(fin.financeTerm / 12) + ' years')}) · 9.9% APR</span>
                    </div>
                    <div className="lw-bsum-line">
                      <span className="lw-bsum-k">Total repayable</span>
                      <span className="lw-bsum-tr">{gbp(fin.financeTotalRepayable)}</span>
                    </div>
                    <hr className="lw-bsum-div" />
                    <div className="lw-bsum-line">
                      <span className="lw-bsum-cash">Cash price</span>
                      <span className="lw-bsum-cash">{gbp(total)}</span>
                    </div>
                    <p className="lw-bsum-finnote">Your finance application will be submitted after your free survey. Our team will confirm your terms before any commitment is made.</p>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <div className="lw-bsum-line">
                      <span className="lw-bsum-k">System price</span>
                      <span className="lw-bsum-v">{gbp(total)}</span>
                    </div>
                    {warrantyAdded && <div className="lw-bsum-item">+£199 warranty</div>}
                    <div className="lw-bsum-monthly">or £{monthly}/mo</div>
                    <div className="lw-bsum-apr">at 9.9% APR, 15-year term</div>
                  </React.Fragment>
                )}

                <hr className="lw-bsum-div" />

                <div className="lw-bsum-line">
                  <span className="lw-bsum-k2">Monthly bill reduction</span>
                  <span className="lw-bsum-v2 lw-bsum-v2--red">{gbp(sel.monthlySaving)} est./mo</span>
                </div>
                <div className="lw-bsum-line">
                  <span className="lw-bsum-k2">20-year saving</span>
                  <span className="lw-bsum-v2">{gbp(sel.saving20yr)} est.</span>
                </div>

                <hr className="lw-bsum-div" />

                <div className="lw-bsum-badges">
                  <span>{ICONS.shield} MCS Certified</span>
                  <span>{ICONS.star} Trustpilot 4.9</span>
                  <span>HIES Member</span>
                </div>
                <div className="lw-bsum-vat">All prices include VAT</div>
              </div>
            </aside>
          </div>
        </div>
      );
    }

    /* ============================================================
       APP
       ============================================================ */
    function App() {
      const [answers, setAnswers] = useState({});   // { house_owner_type: 'Homeowner', ... }
      const [currentIndex, setCurrentIndex] = useState(0);
      const [deadEnd, setDeadEnd] = useState(null);  // { reason }
      const [selectionTick, setSelectionTick] = useState(0); // bumps on each selection to replay the shimmer
      // Step 2 — electricity usage form state (kept in App so it persists across navigation)
      const [electricity, setElectricity] = useState({ usage: '', rateMode: 'same', dayRate: '', nightRate: '', used_national_average_kwh: false, used_national_average_rate: false });
      const [showHelp, setShowHelp] = useState(null); // null = closed; { caption? } = open
      // Step 6 — address/map/orientation/occupancy working state (lifted so it persists across navigation)
      const [step6, setStep6] = useState({
        phase: 'address',                 // address | map | orientation | occupancy
        postcode: '', address_line1: '', town: '',
        lat: null, lng: null,
        manual: false, looking: false, lookupError: '',
        suggestedDir: null, roof_orientation: '', occupants: '',
      });
      // Breadcrumb collapse (FIX 1): collapsed by default; expands on toggle. Stays
      // expanded through an edit excursion, and auto-collapses when the user returns
      // to the furthest step reached (the "current step" frontier).
      const [bcExpanded, setBcExpanded] = useState(false);
      const frontierRef = useRef(0);
      // Step 6 → Step 7 "Preparing your quote" transition overlay (Improvement 5).
      const [preparing, setPreparing] = useState(false);
      // Step 6 → Step 7 email-capture gate ("Where shall we send your quote?").
      // Shown after "Prepare my quote →", before the loading overlay. Stays on Step 6.
      const [emailGate, setEmailGate] = useState(false);
      const [leadForm, setLeadForm] = useState({ first_name: '', email: '' });
      // Step 7A — upsell modal + micro-commitment screen (both overlay Step 7,
      // no progress increment). quoteSel holds the chosen system for both.
      const [quoteSel, setQuoteSel] = useState(null);
      const [upsellOpen, setUpsellOpen] = useState(false);
      const [microCommit, setMicroCommit] = useState(false);
      // Finance choice from the finance modal: null = not engaged, else the selected
      // terms object (or { financeSelected: false } for a cash purchase).
      const [financeChoice, setFinanceChoice] = useState(null);
      React.useEffect(() => {
        if (currentIndex >= frontierRef.current) {
          frontierRef.current = currentIndex;   // at/forward of the frontier → collapse
          setBcExpanded(false);
        }
      }, [currentIndex]);
      const handleToggleBreadcrumbs = useCallback(() => setBcExpanded((x) => !x), []);

      // OptionCard drives the entire press → settle sequence via DOM classes (no
      // re-render during the animation). This fires only AFTER that sequence is visually
      // complete (PRESS_MS + SELECT_HOLD_MS), so it just commits the answer and advances.
      const handleSelect = useCallback((option) => {
        const q = QUESTIONS[currentIndex];
        if (option.deadEnd) {
          const label = q.key === 'roof_type' && option.value === 'Flat' ? 'Flat roof' : option.value;
          setDeadEnd({ reason: DEAD_END_REASONS[label] || "Based on your answer, we're unable to proceed." });
          return;
        }
        setAnswers((prev) => ({ ...prev, [q.key]: option.value }));
        setSelectionTick((t) => t + 1);           // replay shimmer even if reselecting the same card
        setCurrentIndex((i) => i + 1);
      }, [currentIndex]);

      const handleEdit = useCallback((index) => {
        // Step 6 pills jump back into the address phase of Step 6.
        if (index === STEP6_INDEX) {
          setCurrentIndex(STEP6_INDEX);
          setStep6((s) => ({ ...s, phase: 'address' }));
          return;
        }
        // Jump back to an answered question. Keep its own answer so the chosen
        // card shows its selected (pressed) state; clear everything after it,
        // since changing an earlier answer can invalidate later ones.
        setAnswers((prev) => {
          const next = { ...prev };
          QUESTIONS.slice(index + 1).forEach((q) => { delete next[q.key]; });
          return next;
        });
        setCurrentIndex(index);
      }, []);

      const handleBackFromDeadEnd = useCallback(() => { setDeadEnd(null); }, []);

      // Back button — within Step 6 step back through its phases; otherwise to the
      // previous question/step (answers persist).
      const PREV_PHASE = { occupancy: 'orientation', orientation: 'map', map: 'address' };
      const handleBack = useCallback(() => {
        // On the micro-commitment screen, back returns to the quote carousel (Step 7),
        // not to Step 6.
        if (currentIndex === QUOTE_INDEX && microCommit) {
          setMicroCommit(false);
          setUpsellOpen(false);
          return;
        }
        // From the email-capture gate, back returns to Step 6 occupancy.
        if (currentIndex === STEP6_INDEX && emailGate) {
          setEmailGate(false);
          return;
        }
        if (currentIndex === STEP6_INDEX && step6.phase !== 'address') {
          setStep6((s) => ({ ...s, phase: PREV_PHASE[s.phase] || 'address' }));
          return;
        }
        setCurrentIndex((i) => Math.max(0, i - 1));
      }, [currentIndex, step6.phase, microCommit, emailGate]);

      const handleRestart = useCallback(() => {
        setAnswers({});
        setCurrentIndex(0);
        setDeadEnd(null);
        setElectricity({ usage: '', rateMode: 'same', dayRate: '', nightRate: '', used_national_average_kwh: false, used_national_average_rate: false });
        setShowHelp(null);
        setStep6({ phase: 'address', postcode: '', address_line1: '', town: '', lat: null, lng: null, manual: false, looking: false, lookupError: '', suggestedDir: null, roof_orientation: '', occupants: '' });
        setBcExpanded(false);
        setPreparing(false);
        setEmailGate(false);
        setLeadForm({ first_name: '', email: '' });
        setQuoteSel(null);
        setUpsellOpen(false);
        setMicroCommit(false);
        setFinanceChoice(null);
        frontierRef.current = 0;
      }, []);

      // Step 2 (usage) — national average populates 4,100 kWh/yr and flags it.
      const handleUsageAverages = useCallback(() => {
        setElectricity((eu) => ({ ...eu, usage: '4,100', used_national_average_kwh: true }));
      }, []);

      // Step 2 (usage) — commit kWh into shared answers and advance to the tariff step.
      const handleUsageContinue = useCallback(() => {
        setAnswers((prev) => ({
          ...prev,
          electricity_usage: String(electricity.usage).replace(/[^0-9.]/g, ''),
          used_national_average_kwh: !!electricity.used_national_average_kwh,
          // IMPROVEMENT 2 — drives whether the occupancy sub-question appears in Step 6
          usedKwhFallback: !!electricity.used_national_average_kwh,
        }));
        setCurrentIndex(TARIFF_INDEX);
      }, [electricity]);

      // Step 3 (tariff) — national averages: 26.35p single, or 28p day / 15p night for Economy 7.
      const handleTariffAverages = useCallback(() => {
        setElectricity((eu) => eu.rateMode === 'different'
          ? { ...eu, dayRate: '28', nightRate: '15', used_national_average_rate: true }
          : { ...eu, dayRate: '26.35', used_national_average_rate: true });
      }, []);

      // Step 3 (tariff) — commit rate(s) into shared answers (Payaca field names) and advance.
      const handleTariffContinue = useCallback(() => {
        setAnswers((prev) => ({
          ...prev,
          day_unit_rate: String(electricity.dayRate).replace(/[^0-9.]/g, ''),
          night_unit_rate: electricity.rateMode === 'different'
            ? String(electricity.nightRate).replace(/[^0-9.]/g, '') : '',
          used_national_average_rate: !!electricity.used_national_average_rate,
        }));
        setCurrentIndex(TARIFF_INDEX + 1);
      }, [electricity]);

      // Step 4 (battery) — select location; clear the sub-answer when not "Inside".
      const handleBatteryLocation = useCallback((val) => {
        setAnswers((prev) => {
          const next = { ...prev, battery_location: val };
          if (val !== 'Inside') delete next.battery_location_inside;
          if (val !== 'Outside') delete next.battery_location_outside;
          return next;
        });
      }, []);
      const handleBatteryInside = useCallback((val) => {
        setAnswers((prev) => ({ ...prev, battery_location_inside: val }));
      }, []);
      const handleBatteryOutside = useCallback((val) => {
        setAnswers((prev) => ({ ...prev, battery_location_outside: val }));
      }, []);
      const handleBatteryContinue = useCallback(() => setCurrentIndex(EV_INDEX), []);

      // Step 5 (EV) — select ownership; clear plans when they DO have an EV.
      const handleHasEv = useCallback((val) => {
        setAnswers((prev) => {
          const next = { ...prev, has_ev: val };
          if (val !== 'No') delete next.ev_plans;       // No → planning sub-question
          if (val !== 'Yes') delete next.ev_charging;   // Yes → charging sub-question
          return next;
        });
      }, []);
      const handleEvPlans = useCallback((val) => {
        setAnswers((prev) => ({ ...prev, ev_plans: val }));
      }, []);
      const handleEvCharging = useCallback((val) => {
        setAnswers((prev) => ({ ...prev, ev_charging: val }));
      }, []);
      const handleEvContinue = useCallback(() => setCurrentIndex(EV_INDEX + 1), []);

      // Step 6 Part A — commit address into shared answers, then go to the map.
      // In manual mode (or if lookup was skipped) geocode the postcode here so the
      // map still has a centre; if that fails we skip the map and go to orientation.
      const handleAddressContinue = useCallback(async () => {
        let { lat, lng, postcode, town, address_line1 } = step6;
        if (lat == null && postcode.trim()) {
          try {
            const res = await fetch('https://api.postcodes.io/postcodes/' + encodeURIComponent(postcode.trim()));
            const data = await res.json();
            if (data.status === 200 && data.result) {
              lat = data.result.latitude; lng = data.result.longitude;
              if (!town) town = data.result.parish || data.result.admin_district || '';
            }
          } catch (e) { /* geocode failed — fall through with lat null */ }
        }
        const latlong = (lat != null && lng != null) ? lat.toFixed(6) + ',' + lng.toFixed(6) : '';
        const address_full = [address_line1, town, postcode].filter(Boolean).join(', ');
        setAnswers((prev) => ({ ...prev, postcode, address_line1, town, address_full, latlong }));
        setStep6((s) => ({ ...s, lat, lng, town, phase: lat != null ? 'map' : 'orientation' }));
      }, [step6]);

      // Step 6 Part B — pin drag/tap updates the stored lat/long live.
      const handlePinMove = useCallback((lat, lng) => {
        setStep6((s) => ({ ...s, lat, lng }));
        setAnswers((prev) => ({ ...prev, latlong: lat.toFixed(6) + ',' + lng.toFixed(6) }));
      }, []);

      // Step 6 Part B → C — confirm the pin, derive a suggested front-door direction
      // (null in-browser → compass UI shown), advance to orientation.
      const handleConfirmPin = useCallback(async () => {
        const { lat, lng } = step6;
        let dir = null;
        if (lat != null) {
          setAnswers((prev) => ({ ...prev, latlong: lat.toFixed(6) + ',' + lng.toFixed(6) }));
          dir = await suggestFrontDoorDir(lat, lng);
        }
        setStep6((s) => ({ ...s, suggestedDir: dir, phase: 'orientation' }));
      }, [step6]);

      // Step 6 Part C — store the front-door direction (front door faces the street;
      // Step 7 derives the rear/best-facing slope for panel placement).
      const handleSetOrientation = useCallback((dir) => {
        setStep6((s) => ({ ...s, roof_orientation: dir }));
        setAnswers((prev) => ({ ...prev, roof_orientation: dir }));
      }, []);

      // Step 6 Part D — store occupancy.
      const handleSetOccupants = useCallback((val) => {
        setStep6((s) => ({ ...s, occupants: val }));
        setAnswers((prev) => ({ ...prev, occupants: val }));
      }, []);
      // End of Step 6 — show the email-capture gate; submitting or skipping it then
      // plays the loading overlay, which reveals Step 7.
      const handleStep6Complete = useCallback(() => setEmailGate(true), []);

      // Step 7 (quote) — "Continue with this system" commits the chosen system
      // (Payaca field names) and opens the upsell modal. The progress bar does NOT
      // increment here; the modal is an overlay on Step 7.
      const handleQuoteContinue = useCallback((sel) => {
        setQuoteSel(sel);
        setAnswers((prev) => {
          const next = {
            ...prev,
            product_selection: sel.product_selection,
            solar_panel_number: sel.solar_panel_number,
            // base cash price + warranty add-on (£199) if it was previously toggled on
            payment_total: (sel.price + (prev.warrantyAdded ? 199 : 0)).toFixed(2),
          };
          console.log('[LivWarm] Step 7 selection committed:', next);
          return next;
        });
        setUpsellOpen(true);
      }, []);

      // Email-capture gate — "Send me my quote →". Store the lead, flag it for the
      // Payaca payload + Step 8 pre-population, then play the loading overlay.
      const handleLeadSubmit = useCallback(() => {
        setAnswers((prev) => ({
          ...prev,
          quote_email_captured: true,
          lead_first_name: leadForm.first_name.trim(),
          lead_email: leadForm.email.trim(),
        }));
        setEmailGate(false);
        setPreparing(true);
      }, [leadForm]);

      // Email-capture gate — "No thanks, just show me my quote →". Store nothing,
      // clear any prior lead + the draft, then play the loading overlay.
      const handleLeadSkip = useCallback(() => {
        setAnswers((prev) => ({ ...prev, quote_email_captured: false, lead_first_name: '', lead_email: '' }));
        setLeadForm({ first_name: '', email: '' });
        setEmailGate(false);
        setPreparing(true);
      }, []);

      // Step 8 — commit contact details + preferred date, then advance to Step 9.
      const handleContactContinue = useCallback((data) => {
        setAnswers((prev) => ({
          ...prev,
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          preferred_date: data.preferred_date,
        }));
        setCurrentIndex((i) => i + 1);
      }, []);

      // Upsell toggles — warranty affects the cash total; EV charger + BUS grant are
      // interest flags only. All three persist into answers (Payaca payload).
      const handleToggleWarranty = useCallback(() => {
        setAnswers((prev) => {
          const on = !prev.warrantyAdded;
          const base = quoteSel ? quoteSel.price : (Number(prev.payment_total) || 0);
          return { ...prev, warrantyAdded: on, payment_total: (base + (on ? 199 : 0)).toFixed(2) };
        });
      }, [quoteSel]);
      const handleToggleEvCharger = useCallback(() => {
        setAnswers((prev) => ({ ...prev, evChargerInterest: !prev.evChargerInterest }));
      }, []);
      const handleToggleBusGrant = useCallback(() => {
        setAnswers((prev) => ({ ...prev, busGrantInterest: !prev.busGrantInterest }));
      }, []);

      // Both modal buttons close the modal and show the micro-commitment screen.
      const handleUpsellDone = useCallback(() => {
        setUpsellOpen(false);
        setMicroCommit(true);
      }, []);

      // Micro-commitment — "This looks right" advances to Step 8 (progress increments).
      const handleMicroContinue = useCallback(() => {
        setMicroCommit(false);
        setCurrentIndex(QUOTE_INDEX + 1);
      }, []);
      // "← Change system" returns to the quote carousel.
      const handleMicroEdit = useCallback(() => {
        setMicroCommit(false);
        setUpsellOpen(false);
      }, []);

      // Screen routing across steps.
      const inQualifier = currentIndex < USAGE_INDEX;     // Step 1 question screens
      const onUsage = currentIndex === USAGE_INDEX;       // Step 2 annual usage (kWh)
      const onTariff = currentIndex === TARIFF_INDEX;     // Step 3 electricity tariff (rate)
      const onBattery = currentIndex === BATTERY_INDEX;   // Step 4 battery location
      const onEv = currentIndex === EV_INDEX;             // Step 5 EV details
      const onStep6 = currentIndex === STEP6_INDEX;       // Step 6 address & roof confirmation
      const onQuote = currentIndex === QUOTE_INDEX;       // Step 7 quote screen
      const onContact = currentIndex === QUOTE_INDEX + 1; // Step 8 contact details
      const isComplete = currentIndex > QUOTE_INDEX + 1;  // handover (placeholder for Step 9)
      const currentQuestion = inQualifier ? QUESTIONS[currentIndex] : null;
      const step = inQualifier ? { number: 1, name: 'Home Details' }
        : onUsage ? { number: 2, name: 'Electricity Usage' }
        : onTariff ? { number: 3, name: 'Electricity Tariff' }
        : onBattery ? { number: 4, name: 'Battery Details' }
        : onEv ? { number: 5, name: 'EV Details' }
        : onStep6 ? { number: 6, name: 'Address & Roof' }
        : onQuote ? { number: 7, name: 'Your Solar Potential' }
        : onContact ? { number: 8, name: 'Your details' }
        : { number: 9, name: 'Secure Your Booking' };

      // Breadcrumb pills: answers for screens *before* the current one (so the current
      // screen's value shows in-place rather than duplicated as a pill above).
      const breadcrumbItems = QUESTIONS
        .map((q, index) => ({ key: q.key, index, shortLabel: shortLabel(q.key), value: answers[q.key] }))
        .filter((a) => a.value != null && a.index < currentIndex);
      if (answers.electricity_usage && USAGE_INDEX < currentIndex) {
        breadcrumbItems.push({
          key: 'electricity_usage', index: USAGE_INDEX,
          shortLabel: 'Usage', value: formatKwh(answers.electricity_usage) + ' kWh',
        });
      }
      if (answers.day_unit_rate && TARIFF_INDEX < currentIndex) {
        breadcrumbItems.push({
          key: 'rate', index: TARIFF_INDEX, shortLabel: 'Rate', value: formatRate(answers),
        });
      }
      if (answers.battery_location && BATTERY_INDEX < currentIndex) {
        breadcrumbItems.push({
          key: 'battery', index: BATTERY_INDEX, shortLabel: 'Battery', value: formatBattery(answers),
        });
      }
      if (answers.has_ev && EV_INDEX < currentIndex) {
        breadcrumbItems.push({
          key: 'ev', index: EV_INDEX, shortLabel: 'EV', value: formatEv(answers),
        });
      }
      // Step 6 pills accumulate as its phases complete (and once past Step 6)
      const pastAddress = currentIndex > STEP6_INDEX || (onStep6 && step6.phase !== 'address');
      const pastOrientation = currentIndex > STEP6_INDEX || (onStep6 && step6.phase === 'occupancy');
      if (answers.address_full && pastAddress) {
        breadcrumbItems.push({
          key: 'address', index: STEP6_INDEX, shortLabel: 'Address',
          value: answers.address_line1 || answers.postcode,
        });
      }
      if (answers.roof_orientation && pastOrientation) {
        breadcrumbItems.push({
          key: 'orientation', index: STEP6_INDEX, shortLabel: 'Faces',
          value: DIR_WORDS[answers.roof_orientation],
        });
      }
      if (answers.occupants && currentIndex > STEP6_INDEX) {
        breadcrumbItems.push({
          key: 'occupants', index: STEP6_INDEX, shortLabel: 'Household',
          value: formatOccupants(answers.occupants),
        });
      }

      // Progress: each step fills one segment (1/TOTAL_STEPS).
      const segment = 100 / TOTAL_STEPS;
      const qualifierAnswered = breadcrumbItems.filter((a) => a.index < USAGE_INDEX).length;
      let percent;
      if (inQualifier) {
        percent = (qualifierAnswered / USAGE_INDEX) * segment;   // Step 1 fills as qualifiers are answered
      } else if (onUsage) {
        percent = segment;                                       // Step 1 done
      } else if (onTariff) {
        percent = 2 * segment;                                   // Steps 1–2 done
      } else if (onBattery) {
        percent = 3 * segment;                                   // Steps 1–3 done
      } else if (onEv) {
        percent = 4 * segment;                                   // Steps 1–4 done
      } else if (onStep6) {
        // Steps 1–5 done; fill within Step 6 as its four phases complete
        const phaseIdx = { address: 0, map: 1, orientation: 2, occupancy: 3 }[step6.phase] || 0;
        percent = 5 * segment + (phaseIdx / 4) * segment;
      } else if (onQuote) {
        percent = 6 * segment;                                   // Steps 1–6 done; on the quote screen
      } else if (onContact) {
        percent = 7 * segment;                                   // Steps 1–7 done; on contact details
      } else {
        percent = 8 * segment;                                   // Steps 1–8 done
      }

      return (
        <div className="lw-app">
          <Header />
          <main className="lw-main">
            <div className="lw-content">
              {deadEnd ? (
                <DeadEnd reason={deadEnd.reason} onBack={handleBackFromDeadEnd} />
              ) : (
                <React.Fragment>
                  <ProgressBar
                    percent={percent}
                    stepNumber={step.number}
                    stepName={step.name}
                    canGoBack={!isComplete && currentIndex > 0}
                    onBack={handleBack}
                  />
                  {!isComplete && !onQuote && !onContact && !emailGate && <Breadcrumbs answered={breadcrumbItems} onEdit={handleEdit}
                    expanded={bcExpanded} onToggle={handleToggleBreadcrumbs} />}
                  {inQualifier && (
                    <Question
                      q={currentQuestion}
                      currentValue={answers[currentQuestion.key]}
                      selectionTick={selectionTick}
                      onSelect={handleSelect}
                    />
                  )}
                  {onUsage && (
                    <UsageStep
                      data={electricity}
                      onChange={setElectricity}
                      onUseAverages={handleUsageAverages}
                      onContinue={handleUsageContinue}
                      onShowHelp={() => setShowHelp({ highlightField: 'usage' })}
                    />
                  )}
                  {onTariff && (
                    <TariffStep
                      data={electricity}
                      onChange={setElectricity}
                      onUseAverages={handleTariffAverages}
                      onContinue={handleTariffContinue}
                      onShowHelp={() => setShowHelp({ highlightField: 'rate', caption: "Your unit rate is shown in pence per kWh - look for 'unit rate' or 'rate' in the charges section of your bill." })}
                    />
                  )}
                  {onBattery && (
                    <BatteryStep
                      location={answers.battery_location}
                      inside={answers.battery_location_inside}
                      outside={answers.battery_location_outside}
                      onSelectLocation={handleBatteryLocation}
                      onSelectInside={handleBatteryInside}
                      onSelectOutside={handleBatteryOutside}
                      onContinue={handleBatteryContinue}
                    />
                  )}
                  {onEv && (
                    <EvStep
                      hasEv={answers.has_ev}
                      plans={answers.ev_plans}
                      charging={answers.ev_charging}
                      onSelectHasEv={handleHasEv}
                      onSelectPlans={handleEvPlans}
                      onSelectCharging={handleEvCharging}
                      onContinue={handleEvContinue}
                    />
                  )}
                  {onStep6 && !emailGate && (
                    <Step6
                      state={step6}
                      setState={setStep6}
                      onAddressContinue={handleAddressContinue}
                      onPinMove={handlePinMove}
                      onConfirmPin={handleConfirmPin}
                      onSetOrientation={handleSetOrientation}
                      onSetOccupants={handleSetOccupants}
                      onComplete={handleStep6Complete}
                      usedKwhFallback={!!answers.usedKwhFallback}
                    />
                  )}
                  {onStep6 && emailGate && (
                    <EmailGate
                      data={leadForm}
                      onChange={setLeadForm}
                      onSubmit={handleLeadSubmit}
                      onSkip={handleLeadSkip}
                    />
                  )}
                  {onQuote && !microCommit && (
                    <QuoteStep answers={answers} onContinue={handleQuoteContinue}
                      onSelectFinance={setFinanceChoice} />
                  )}
                  {onQuote && microCommit && quoteSel && (
                    <MicroCommitment
                      sel={quoteSel}
                      warrantyAdded={!!answers.warrantyAdded}
                      evChargerInterest={!!answers.evChargerInterest}
                      busGrantInterest={!!answers.busGrantInterest}
                      financeChoice={financeChoice}
                      onContinue={handleMicroContinue}
                      onEdit={handleMicroEdit}
                    />
                  )}
                  {onContact && quoteSel && (
                    <ContactDetails
                      sel={quoteSel}
                      warrantyAdded={!!answers.warrantyAdded}
                      financeChoice={financeChoice}
                      leadFirstName={answers.lead_first_name}
                      leadEmail={answers.lead_email}
                      onSubmit={handleContactContinue}
                    />
                  )}
                  {isComplete && <StepComplete answers={answers} onRestart={handleRestart} />}
                </React.Fragment>
              )}
            </div>
          </main>
          <Footer />
          {showHelp && <HelpModal caption={showHelp.caption} highlightField={showHelp.highlightField} onClose={() => setShowHelp(null)} />}
          {upsellOpen && quoteSel && (
            <UpsellModal
              answers={answers}
              sel={quoteSel}
              warrantyAdded={!!answers.warrantyAdded}
              evChargerInterest={!!answers.evChargerInterest}
              busGrantInterest={!!answers.busGrantInterest}
              onToggleWarranty={handleToggleWarranty}
              onToggleEv={handleToggleEvCharger}
              onToggleBus={handleToggleBusGrant}
              onClose={() => setUpsellOpen(false)}
              onContinue={handleUpsellDone}
            />
          )}
          {preparing && (
            <PrepareOverlay
              onReveal={() => setCurrentIndex(QUOTE_INDEX)}
              onDone={() => setPreparing(false)}
            />
          )}
        </div>
      );
    }

    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
