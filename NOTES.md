# Internal notes (never deployed)

Review list for Ahmad. Nothing here is shown on the sites; the pages carry no draft banner.

## Confirmed by Ahmad (2026-11-09)

- Marketing service list (strategy, content and production, advertising, customer conversations) and its benefits (faster production, clear numbers).
- Design service list (interior, exterior, decor and pre-decor design in software, full execution, carpentry, kitchens, furniture) and its capabilities as service (realistic images from photos, early cost in EGP, WhatsApp updates and approvals, cut lists, walkthrough videos).
- Events scope: every kind of event except weddings and birthdays (corporate events, conferences, product launches, exhibitions, seminars and workshops, company and community gatherings). Weddings only as support services (flowers, photography, videography). Capabilities as service (WhatsApp invitations, RSVP and reminders, event page and tickets, QR check-in with badges, run of show and budget, photo wall and highlight reel, vendor coordination, post-event follow-up).
- Accents: Marketing silver/platinum, Design brass/bronze, Events Ebda gold.

## DRAFT: authored copy to confirm

- DRAFT: Arabic names ابدأ ماركتنج / ابدأ ديزاين / ابدأ إيفنتس (follow the ابدأ ستور / ابدأ شات pattern).
- DRAFT: every FAQ answer on all three sites (pricing is described only as "written quote in EGP after the first call"; no prices, timelines or guarantees).
- DRAFT: "outside Cairo" answers (Marketing FAQ) assume the team is Cairo-based and travels.
- DRAFT: process steps (5 per site) and the "what you get" lists, incl. "one person/engineer responsible for your project".
- DRAFT: "Why us" points and the "what we will not do" lists (e.g. no bought followers, no vendor contract without approval, attendee data used for the event only).
- DRAFT: Marketing "Ads linked to conversations" and "Clear reports" items (derived from "clear numbers").
- DRAFT: Design "an engineer follows the work on site" and the extra item "Pre-decor design: layout, electrics and plumbing".
- DRAFT: Events "Seminars and workshops: materials ready", "feedback survey" in follow-up, "named badges collected on the spot".
- DRAFT: contact "what happens next" steps (reply by a person, short call, written proposal in EGP).

## Imagery

All photographs are generated (no people, no text, no logos) and captioned on the page as illustrative. Prompts: `scripts/image-prompts.json`. Replace with real project photos once they exist.

## Design critique (impeccable, 2026-11-09): applied and open

Applied: per-brand path module on each home (marketing ad to sale, design photo to home, events before to after); stronger
silver for Marketing; inert service chips turned into plain text; contact form now includes the chosen service and shows a
"message ready, press send" status; shorter Events lead and English hero size; 44px targets on home service links and footer.

- Ruling SUBBRANDS-V2-1 - No phone/WhatsApp contact link on the sites. No studio WhatsApp number exists in BRAND, and inventing one is not allowed. Cost if wrong: Egyptian visitors who prefer WhatsApp must use email until Ahmad supplies a number (one-line add in lib/render.mjs).
- Ruling SUBBRANDS-V2-2 - No "we reply the same day" promise, no portfolio/credentials block. Neither is confirmed; claims stay uninventable. Cost if wrong: weaker trust for corporate buyers until real proof exists.
- Ruling SUBBRANDS-V2-3 - Detector "cramped-padding" on hairline-ruled sections/rows and "overused-font: Geist" left as is. The sections have 48-112px padding (detector measures the hairline), and Geist + IBM Plex Sans Arabic are the pinned Ebda brand fonts. Cost if wrong: none visible; the brief pins the fonts.
