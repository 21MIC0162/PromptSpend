# Automated Tests

The project includes automated tests for the audit engine to validate pricing calculations, optimization recommendations, and savings detection logic.

---

# Test Framework

- Vitest
- Testing Library
- TypeScript

---

# Test Files

## 1. audit-engine.test.ts

### Covers
- Savings calculation correctness
- Annual savings calculation
- Multi-tool optimization handling
- Optimized stack detection
- Recommendation generation

---

## 2. downgrade-recommendations.test.ts

### Covers
- Team plan downgrade logic
- Seat over-allocation detection
- Small-team optimization logic

---

## 3. enterprise-detection.test.ts

### Covers
- Enterprise overpayment detection
- Enterprise-to-business migration recommendations
- High-cost plan analysis

---

## 4. ai-summary-fallback.test.ts

### Covers
- AI summary fallback generation
- Anthropic API failure handling
- Deterministic summary generation

---

## 5. share-url-generation.test.ts

### Covers
- Unique slug generation
- Public audit URL creation
- Metadata-safe public sharing logic

---

# Running Tests

Install dependencies:

```bash
npm install
```

Run all tests:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

---

# Coverage Goals

The current test suite focuses primarily on:
- pricing logic correctness
- recommendation reliability
- deterministic audit outputs

This ensures financial recommendations remain stable and explainable.
