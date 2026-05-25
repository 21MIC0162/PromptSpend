# PromptSpend

PromptSpend is an AI spend audit platform that helps startups, founders, and engineering teams identify overspending across AI tooling subscriptions such as ChatGPT, Claude, Cursor, GitHub Copilot, Gemini, OpenAI API, and Anthropic API.

Built for the Credex Web Development Intern Assignment, the platform provides instant savings analysis, optimization recommendations, AI-generated summaries, lead capture, and shareable public audit reports with Open Graph previews.

---

# Why PromptSpend?

Most startups pay for AI tooling without understanding whether their plans, seat counts, or API usage are financially optimized.

PromptSpend helps teams benchmark and optimize their AI spend instantly while surfacing practical cost-saving recommendations.

---


# Features

- AI tooling spend analysis
- Monthly and annual savings calculation
- Personalized optimization recommendations
- AI-generated audit summaries
- Shareable public audit URLs
- Open Graph and Twitter preview support
- Lead capture with backend storage
- Transactional email confirmation
- Persistent form state
- Mobile responsive UI
- Graceful AI fallback handling
- Public audit sharing without login

---

# Supported AI Platforms

- ChatGPT
- Claude
- Cursor
- GitHub Copilot
- Gemini
- Anthropic API
- OpenAI API
- Windsurf

---

# Tech Stack

## Frontend
- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui

## Backend & Database
- Supabase

## AI Integration
- Anthropic API

## Email Service
- Resend

## Deployment
- Vercel

---

# Screenshots

## Landing Page
<img width="926" height="466" alt="image" src="https://github.com/user-attachments/assets/c36427a1-3ea3-48ba-bd7d-d93b08653a12" />
<img width="926" height="467" alt="image" src="https://github.com/user-attachments/assets/7ee2df4c-2430-41f4-80fc-2f12511bd3aa" />
<img width="925" height="433" alt="image" src="https://github.com/user-attachments/assets/9edcef40-9bc9-48c8-b2b0-fd77e65afd74" />
<img width="925" height="432" alt="image" src="https://github.com/user-attachments/assets/92141e6a-7475-4ac4-96f5-7ae6fcae2a37" />
<img width="926" height="446" alt="image" src="https://github.com/user-attachments/assets/7a19b907-6620-496c-8ead-78e3b1e2c0e2" />

## Spend Input Form
<img width="926" height="444" alt="image" src="https://github.com/user-attachments/assets/5398b6ca-fbb8-4081-926c-95b3e3be06eb" />
<img width="925" height="437" alt="image" src="https://github.com/user-attachments/assets/69923f39-f84e-45d8-a960-2e4d3a512c09" />

## Audit Results Page
<img width="925" height="383" alt="image" src="https://github.com/user-attachments/assets/a08c4584-0e87-4276-94f6-1590033dea21" />
<img width="925" height="445" alt="image" src="https://github.com/user-attachments/assets/d2ecb0ec-a0a1-4acd-a8a2-bedbd605c303" />
<img width="925" height="416" alt="image" src="https://github.com/user-attachments/assets/17463a06-4d96-44ef-83c0-fe1e85cf691c" />
<img width="925" height="360" alt="image" src="https://github.com/user-attachments/assets/434084d0-820a-47c4-83a4-04bfea40f216" />
<img width="924" height="445" alt="image" src="https://github.com/user-attachments/assets/1f0a1938-ad7c-4197-91a6-001294a465ba" />
<img width="922" height="437" alt="image" src="https://github.com/user-attachments/assets/ef3f2342-22e8-4ce6-8d52-1481bb012838" />
<img width="926" height="445" alt="image" src="https://github.com/user-attachments/assets/a54f4ff5-3bdc-4615-bd05-adad5dfe9180" />

---

# Local Setup

## 1. Clone Repository

```bash
git clone <your-github-repo-url>
cd promptspend
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

Create a `.env.local` file in the project root and add:

```env
NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY= 

ANTHROPIC_API_KEY=

RESEND_API_KEY=

NEXT_PUBLIC_APP_URL=
```

## 4. Run Development Server

```bash
npm run dev
```

Application runs at:

```bash
http://localhost:3000
```

---

# Deployment

The project is deployed using Vercel.

## Live URL

https://prompt-spend.vercel.app/

---

# How The Audit Engine Works

The audit engine evaluates the user's AI tooling stack using deterministic business rules instead of AI-generated financial reasoning.

For every tool submitted, the engine:

- Validates whether the selected plan matches team size and usage
- Detects overpayment scenarios
- Suggests cheaper plans from the same vendor
- Suggests lower-cost alternatives when appropriate
- Calculates total monthly and annual savings
- Generates explanation-based recommendations

The final audit result is stored in Supabase and made shareable through a public URL.

---

# Decisions & Tradeoffs

## 1. Rule-Based Audit Engine Instead of AI-Based Financial Recommendations

The pricing and recommendation engine uses deterministic business logic rather than LLM-generated recommendations. Financial calculations need predictable, explainable, and reproducible outputs without hallucinated pricing advice.

---

## 2. AI Used Only For Personalized Summaries

AI is intentionally restricted to generating personalized audit summaries. Core pricing calculations and optimization logic remain fully rule-based to ensure reliability.

---

## 3. Supabase Over Firebase

Supabase was selected because PostgreSQL querying and relational data modeling fit audit reports and lead capture workflows more naturally than document-based storage.

---

## 4. Public Share URLs Without Authentication

The application avoids mandatory authentication to reduce friction and improve shareability. Personally identifiable information is excluded from public reports for privacy protection.

---

## 5. Next.js App Router For Dynamic Audit Pages

Next.js App Router simplified dynamic routing, metadata generation, server-side rendering, and Open Graph support for public audit URLs.

---

# Future Improvements

- PDF export support
- Benchmark mode
- Team dashboards
- Referral system
- Usage-based API integrations
- Multi-audit history tracking
- AI spend benchmarking by company size

---

# Accessibility Considerations

- Responsive mobile-first layout
- Semantic HTML structure
- Accessible button labels
- Keyboard-friendly interactions
- Sufficient color contrast
- Optimized Lighthouse accessibility practices

---

# Security Considerations

- Environment variables stored securely
- No secrets committed to repository
- Public audit pages exclude personal user data
- Input validation applied
- Basic abuse prevention added to lead capture flow

---

# Project Structure

```bash
/app
/components
/lib
/types
/public
/tests
```

---

# Testing

The project includes automated tests covering:

- Savings calculations
- Plan downgrade recommendations
- Enterprise overpayment detection
- Multi-tool optimization logic
- Optimized-stack detection

Run tests using:

```bash
npm run test
```

---

# Author

## Vasundara Veena K

- GitHub: https://github.com/21MIC0162
- LinkedIn: https://linkedin.com/in/vasundaraveena
