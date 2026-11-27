# Tuinaune Growth Environment — project page

A responsive, accessible, static project-information page. The title is retained from the existing template; this page does **not** verify the identity, registration, mission, location, services, contact details or impact of any real-world organisation.

## Preview locally

No build step or package installation is required. From this directory, run:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000/` in a browser. `index.html` is the main entry point. `mother.html` remains available as a backwards-compatible entry point and renders the same page.

## Honest interactions and data handling

- The mobile navigation supports keyboard use and Escape; FAQ answers use native accessible disclosure controls.
- There is no payment processor, donation or sponsorship workflow, card-data field, contact form, newsletter, or connected backend. Nothing submitted or entered is sent or saved.
- Earlier template donation flows and invented impact, compliance and registration claims have been removed. No fundraising or payment security assurances are made.
- Unverified named child profiles, personal details, needs and fundraising totals have been removed to protect privacy and avoid presenting fictional details as real.
- The three wellbeing cards are general topics, explicitly not claims that services are running. Specific organisational facts are labelled as unverified / to verify.

## Before publishing as an organisation site

Verify the organisation's identity, authority to publish, legal status, location, mission, current services, official contact and any giving channel with a responsible representative and independent evidence. Establish child safeguarding, privacy, consent and image-use procedures before publishing any child-related material. Add only accurate, dated, reviewable claims. Do not enable payments until a legitimate recipient, accountable process and trusted payment integration are established. No contact information was supplied, so none has been guessed.

## Files

- `index.html` — primary page
- `mother.html` — backwards-compatible copy of the primary page
- `styles.css` — responsive styles, focus states, and reduced-motion support
- `script.js` — minimal mobile navigation and current-year enhancement
