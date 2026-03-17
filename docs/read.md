Build a premium native mobile UI for "KINDRED" (React Native).

IMPORTANT:
This must feel like a high-end mobile app (iOS/Android), NOT a web app.
Use native layout patterns, spacing, and interactions.

---

CORE UX PRINCIPLE:
KINDRED is an AI hedge fund agent.
The UI must feel:
- Alive (AI is working in background)
- Calm (not cluttered)
- Trustworthy (clear + transparent)

---

UI PRIORITY (STRICT ORDER):
1. What the AI is doing (real-time activity)
2. User’s net worth (clean + prominent)
3. User control (simple actions)
4. Deep data (only on demand, not default)

---

LAYOUT RULES (VERY IMPORTANT):

- Follow 8pt spacing system
- Max 3 sections per screen
- Use vertical rhythm (clear spacing between blocks)
- Always respect safe areas (top/bottom)
- Thumb-friendly zones (important actions near bottom)

Avoid:
- center-heavy layouts like websites
- full-width flat blocks without depth

---

DESIGN SYSTEM:

Theme:
- Background: #020202
- Surface: #0D0D0D
- Borders: subtle (#FFFFFF10)

Depth:
- Use soft shadows + elevation
- Layer cards (no flat UI)

Corners:
- 16–24 radius (not sharp)

Colors:
- Emerald (#00FFA3) → success/growth
- Cyan (#00E0FF) → trust/system activity

---

MOTION (CRITICAL DIFFERENCE FROM YOUR OLD RESULT):

- Use subtle micro-interactions ONLY
- Press feedback: scale 0.96 + slight opacity change
- Transitions: 150–250ms (fast & smooth)
- Use spring physics ONLY for important elements

DO NOT:
- add random animations
- use looping flashy effects
- overuse glow

---

COMPONENT BEHAVIOR (THIS FIXES “WEB LOOK”):

- Cards must feel touchable (shadow + press state)
- Lists must use smooth scrolling (FlashList style)
- Use bottom sheets instead of new pages where possible
- Use gesture interactions (swipe, pull)

---

SCREEN REFINEMENT:

1. HOME (MOST IMPORTANT)

Structure:
- Top: Net Worth (large, bold, clean)
- Middle: AI Activity (live feed, 1–2 lines per item)
- Bottom: Quick Actions (sticky or floating)

AI Activity examples:
- “Rebalancing ETH → USDC”
- “Yield opportunity detected (+8.2%)”

IMPORTANT:
This screen should feel alive but NOT busy.

---

2. AI CHAT (CONTROL CENTER)

- Primary interaction = chat
- Clean message bubbles (no clutter)
- Add quick action chips (below input)

Optional:
- Voice input button

Logs:
- Hidden behind “View Details” (not default)

---

3. PORTFOLIO

- Simple allocation chart (donut)
- Clean asset list (no trading complexity)
- Show roles:
  - ETH → Growth
  - USDC → Stability

---

4. TRUST / SECURITY

- Show reasoning behind AI decisions
- Show:
  - “Why this action was taken”
  - Privacy status (FHE active)
  - Identity verified

Interactions:
- “Hold to reveal data”
- Expandable logs

---

INTERACTION DETAILS (IMPORTANT):

- Every button → haptic feedback
- Every important action → visual confirmation
- Use loading states (skeleton / shimmer)

---

STRICTLY AVOID:

- Web-style UI (div-like stacking, no depth)
- Too many visible elements at once
- Complex dashboards
- Tiny unreadable text
- Over-designed glowing effects

---

FINAL EXPERIENCE GOAL:

User should feel:
“I don’t manage money anymore. KINDRED does it for me.”

The UI should feel calm, intelligent, and powerful — not flashy.