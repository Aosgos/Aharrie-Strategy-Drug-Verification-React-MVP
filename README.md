# Aharrie — Strategy Drug Verification (React MVP)

> Verified or Coun*er*eit
>
> A lean, privacy-respecting React/TypeScript MVP to help verify pharmaceutical products and flag potential counterfeits with a focus on usability, clarity, and speed.

[![Language: TypeScript](https://img.shields.io/badge/language-TypeScript-blue?logo=typescript)]()
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)]()
[![Status: MVP](https://img.shields.io/badge/status-MVP-yellow.svg)]()

---

Table of contents
- [Vision](#vision)
- [Why Aharrie?](#why-aharrie)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture at a glance](#architecture-at-a-glance)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Install](#install)
  - [Environment variables](#environment-variables)
  - [Run (dev)](#run-dev)
  - [Build and Serve (production)](#build-and-serve-production)
- [Usage](#usage)
- [Testing & Quality](#testing--quality)
- [Docker (optional)](#docker-optional)
- [Deployment suggestions](#deployment-suggestions)
- [Roadmap](#roadmap)
- [Security & Privacy](#security--privacy)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)
- [Contact](#contact)
- [FAQ](#faq)

---

Vision
------
Aharrie is a fast, accessible frontend MVP focused on giving users a simple, trustworthy interface to verify medicines and quickly identify suspicious or counterfeit indicators. The app is designed to integrate with back-end verification services (APIs, blockchain registries, or manual databases) while remaining lightweight and privacy-conscious.

Why Aharrie?
------------
Counterfeit medicines are a global problem. Aharrie aims to make verification approachable: scan or enter product details, get a human-friendly result, and know the next steps. This repo is a React + TypeScript MVP that demonstrates the UI/UX, verification flows, and integration points for production services.

Features
--------
- Clean, responsive UI built with TypeScript and React.
- Simple verification flow: scan QR / enter batch & serial → check → human-readable result
- Trust indicators (verified, unverified, suspicious) with explanation text
- Accessibility-first: keyboard navigation and screen-reader friendly components
- Modular services layer — easily swap/mock back-end verification providers
- Config-driven: feature flags and environment-based toggles for staging/production
- Tests and linters to maintain quality

Tech stack
----------
- Frontend: React + TypeScript
- Bundler: Vite (recommended) or CRA (adjust if needed)
- Styling: CSS Modules / Tailwind (adjust to your choice)
- Testing: Vitest / React Testing Library (or Jest)
- Linting & formatting: ESLint + Prettier
- Optional: Docker for easy local production testing

Architecture at a glance
------------------------
- /src
  - /components — presentational UI components
  - /pages — route-level views (Home, Verify, Results, Help)
  - /services — API/adapters for verification providers (mock & real)
  - /hooks — reusable React hooks (useScanner, useVerification)
  - /utils — helpers & validators
  - /tests — unit & integration tests
- Config is environment-driven; switch providers by changing variables or using feature flags.

Getting Started
---------------
These instructions will get you a copy of the project up and running on your local machine for development and testing.

Prerequisites
- Node.js >= 18 (LTS recommended)
- npm >= 8 or yarn or pnpm
- Optional: Docker & Docker Compose (for containerized runs)

Install
1. Clone the repo
   git clone https://github.com/Aosgos/Aharrie-Strategy-Drug-Verification-React-MVP.git
2. Install dependencies
   npm install
   # or
   yarn
   # or
   pnpm install

Environment variables
Create a .env file in the project root (see .env.example) with the minimum keys:

- VITE_API_BASE_URL=https://api.example.org
- VITE_VERIFY_PROVIDER=mock | remote | ledger
- VITE_FEATURE_SCAN=true
- VITE_APP_ENV=development

(Using the Vite prefix ensures env vars are available in client code.)

Run (dev)
- Start the dev server:
  npm run dev
- Open http://localhost:5173 (or the port Vite reports).

Build and Serve (production)
- Build:
  npm run build
- Serve locally (optional):
  npm run preview

Usage
-----
Core flows:
- Manual verify: navigate to Verify → enter product name, batch, serial → Submit.
- QR/Barcode scan: use camera scan (if enabled) to populate fields.
- Results page explains the verification status and recommended actions.

Extending providers:
- services/verification.ts exports an interface. Add provider implementations and wire via VITE_VERIFY_PROVIDER.

Testing & Quality
-----------------
- Run unit tests:
  npm run test
- Run coverage:
  npm run test:coverage
- Lint:
  npm run lint
- Format:
  npm run format

Suggested test coverage targets (MVP): >70% for critical verification logic.

Docker (optional)
-----------------
Build an image:
docker build -t aharrie-web:latest .
Run:
docker run -it --rm -p 8080:80 aharrie-web:latest

(Adjust your Dockerfile and base image as appropriate — use a multi-stage build for small production images.)

Deployment suggestions
----------------------
- Static hosting: Vercel, Netlify, or GitHub Pages for frontend-only deployments.
- When paired with an API, deploy backend to AWS/GCP/Azure; use HTTPS & CORS with strict origins.
- Use feature flags and a staged rollout for verification provider changes.
- Add CI (GitHub Actions) to run tests and lint on pull requests.

Roadmap
-------
Planned additions:
- Back-end connector templates (example API & mock server)
- Improved scanner with multiple barcode formats
- Audit logging (opt-in) for verification events
- Mobile-friendly PWA mode with offline support for cached verification references
- Internationalization (i18n) and improved accessibility auditing

Security & Privacy
-----------------
- The MVP does not store personal data by default. If you add logging, ensure PII is redacted.
- Use HTTPS and secure API keys (do not embed secrets in the client).
- For production, follow best practices: CSP, secure cookies (if any), and rate-limiting on APIs.
- If storing verification results, provide a retention policy and opt-in choices.

Contributing
------------
Thanks for wanting to contribute — your help makes Aharrie better!

- Fork the repo and create a feature branch:
  git checkout -b feat/your-feature
- Follow the existing code style and add tests for new behavior
- Open a pull request describing your changes and the problem being solved

Please see CONTRIBUTING.md (create one if you like) for more detailed guidelines including commit message format and review expectations.

License
-------
This project is open-source and available under the MIT License. See LICENSE for details.

Acknowledgements
----------------
- Inspired by public health and safety initiatives.
- Thanks to creators of React, TypeScript, and the open-source ecosystem.

Contact
-------
- Repo: https://github.com/Aosgos/Aharrie-Strategy-Drug-Verification-React-MVP
- Author: Aosgos (Aosgos on GitHub)
- For donations, support, or collaboration ideas, open an issue or reach out via GitHub.

FAQ
---
Q: Is this a finished product?
A: No — this is an MVP meant to demonstrate UI/UX and verification flow patterns. Replace/mock the provider as needed.

Q: Can this detect 100% of counterfeit products?
A: No. Aharrie indicates suspicious patterns and integrates verification sources; it supplements, not replaces, official regulatory checks.

Q: How do I connect my own verification API?
A: Implement the provider interface in src/services and set VITE_VERIFY_PROVIDER to your provider id; add the base URL to VITE_API_BASE_URL.

---

If you want, I can:
- Add a CONTRIBUTING.md and CODE_OF_CONDUCT.md
- Create a .github/workflows/ci.yml for CI with tests & lint
- Produce a small mock verification API so local testing matches prod behavior

Happy to continue — tell me which of the above you'd like next.
