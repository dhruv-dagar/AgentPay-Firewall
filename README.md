# AgentPay Firewall

> **AI interprets intent. Deterministic controls authorize money.**

AgentPay Firewall is a server-side financial control plane for autonomous AI payment agents. It sits between an AI agent and a payment API, translating natural-language spending policies into enforceable controls and deciding whether each transaction is **ALLOW**, **REVIEW**, or **BLOCK** before payment execution.

## Why this exists

Autonomous agents can interpret user intent, but they should not receive unrestricted authority over money. A prompt injection, hallucination, compromised agent, or overly broad instruction should not be able to bypass transaction limits or approval requirements.

AgentPay Firewall deliberately separates **AI interpretation** from **financial authorization**:

```text
AI Agent
   |
   v
Natural-language spending policy
   |
   v
AI / deterministic policy interpretation
   |
   v
+----------------------------------+
|       AGENTPAY FIREWALL          |
| transaction limits               |
| category rules                   |
| merchant trust                   |
| risk controls                    |
| approval requirements            |
| budget controls                  |
+----------------+-----------------+
                 |
        +--------+--------+
        |        |        |
       ALLOW   REVIEW    BLOCK
        |        |        |
        |     Human gate  STOP
        |        |        |
        +--------+--------+
                 |
                 v
        Server-side re-check
                 |
                 v
        Razorpay Test Mode
                 |
                 v
           Audit trail
```

### Core security principle

**The AI never gets authority to move the money.**

The browser is not trusted either. Before a Razorpay order is created, the server independently compiles the policy and evaluates the transaction.

## Key capabilities

- Natural-language spending policy interpretation
- Deterministic server-side policy enforcement
- Three-way authorization: `ALLOW` / `REVIEW` / `BLOCK`
- Human approval gate for review-required payments
- Razorpay Test Mode Orders API integration
- Server-side re-evaluation before payment execution
- Tamper-resistance demonstration against a forged frontend `ALLOW`
- Explainable policy decisions and audit events
- Batch simulation across 120 synthetic transactions
- What-if policy analysis
- Quantitative firewall performance metrics
- Optional local Ollama integration with deterministic fallback

## Example policy

```text
Let my agent automatically spend up to ₹2,000 on groceries from trusted merchants.
Electronics require approval.
Never let autonomous spending exceed ₹5,000 per transaction and ₹25,000 per month.
```

## Decision model

### ALLOW

The transaction satisfies the configured controls and can be executed autonomously.

### REVIEW

The transaction is not automatically permitted, but it may proceed after explicit human approval.

### BLOCK

The transaction violates an absolute safety constraint. The payment provider is not called.

## Payment execution

Approved transactions are sent to Razorpay Test Mode through the Orders API. Test Mode is used intentionally: the demo creates simulated payment orders and does not move real money.

The server records execution metadata including the firewall decision, execution mode, human-approval state, merchant, category, risk score, and Razorpay test order identifier.

## Security model

The project treats both the LLM and browser as untrusted inputs.

1. The LLM can help interpret natural-language policy.
2. Deterministic policy logic remains the authorization boundary.
3. The server recompiles and evaluates the policy for payment execution.
4. A browser-supplied decision is never sufficient to authorize a payment.
5. `REVIEW` requires an explicit human approval signal.
6. `BLOCK` prevents the Razorpay call.
7. Important decisions and executions are recorded in the audit trail.

### Tamper-resistance demonstration

The application includes a server-side integrity test that intentionally claims `ALLOW` for a transaction that the server evaluates as `BLOCK`.

```text
Frontend claim:  ALLOW
Server decision: BLOCK
Tampering:       DETECTED
Razorpay called: NO
```

This is a **decision-integrity demonstration**, not a claim of complete penetration testing or production security certification.

## Evaluation

The built-in simulation evaluates 120 synthetic transactions under the example policy. The current deterministic dataset produces:

| Metric | Result |
|---|---:|
| Transactions analyzed | 120 |
| Autonomous approvals | 17 |
| Human review | 42 |
| Blocked | 61 |
| Autonomous approval rate | 14.2% |
| Human review rate | 35.0% |
| Block rate | 50.8% |
| Intervention rate | 85.8% |
| Designated high-risk transactions | 31 |
| High-risk transactions blocked | 31 |
| High-risk containment rate | 100% |
| Simulated value kept out of autonomous execution | ₹4,96,998 |

**Metric definitions:**

- **Intervention rate** = `(REVIEW + BLOCK) / total transactions`.
- **High-risk containment rate** = `designated high-risk transactions blocked / designated high-risk transactions`.
- **Protected value** means simulated transaction value kept out of autonomous execution through `REVIEW` or `BLOCK`; it is not real money saved or recovered.

These figures describe the included synthetic test policy and dataset; they are not production fraud-detection benchmarks.

## Automated tests

The deterministic authorization layer is covered by Node test cases for safe approvals, human-review gates, absolute transaction caps, risk thresholds, monthly budget violations, explicitly blocked categories, and precedence of hard safety failures over approval requests.

Run locally with:

```bash
npm install
npm test
```

GitHub Actions also runs the test suite and production build on pushes to `main` and pull requests.

## Tech stack

- **Frontend:** Next.js 14, React, TypeScript, CSS
- **Backend:** Next.js API routes, TypeScript
- **AI:** Optional local Ollama model + deterministic policy compiler fallback
- **Payments:** Razorpay Test Mode Orders API
- **Security:** Server-side authorization, human approval gate, audit logging, integrity testing

## Project structure

```text
app/
  api/
    audit/             # bounded audit-event API
    evaluate/          # policy + transaction evaluation
    interpret/         # AI/deterministic policy interpretation
    razorpay/order/    # server-side Razorpay Test Mode execution
    security-test/     # decision-integrity test
    simulate/          # batch simulation + metrics
    whatif/            # alternative-policy comparison
  globals.css          # application styling
  layout.tsx           # application metadata/layout
  page.tsx             # application UI
lib/
  policy.ts            # deterministic policy compiler/evaluator
tests/
  policy.test.ts       # authorization-layer tests
docs/
  ARCHITECTURE.md      # system architecture and lifecycle
  SECURITY.md          # threat model and security controls
```

## Running locally

### Requirements

- Node.js 18+
- npm
- Razorpay Test Mode credentials for payment execution
- Optional: Ollama for local LLM policy interpretation

### Install

```bash
npm install
```

### Environment

Create `.env.local` locally:

```env
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_test_secret
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

**Never commit `.env.local` or real API secrets.** Razorpay credentials must remain server-side.

### Start

```bash
npm run dev
```

Open `http://localhost:3000`.

### Production build

```bash
npm run build
npm start
```

## Recommended project walkthrough

1. Show the natural-language policy and its interpretation.
2. Run a safe grocery transaction → `ALLOW` → Razorpay Test Mode order.
3. Run an electronics transaction → `REVIEW` → human approval → Razorpay Test Mode order.
4. Run an over-limit/high-risk transaction → `BLOCK` → Razorpay is not called.
5. Run the firewall integrity test → forged frontend `ALLOW` is rejected by the server.
6. Run the 120-transaction simulation and explain the measured metrics.

## Limitations and production roadmap

This is a portfolio/research prototype rather than a production payment authorization platform. The audit store is bounded in-memory storage for demonstration, the policy language is intentionally limited, and the simulation uses synthetic data.

A production version would add persistent tamper-evident audit storage, authenticated agent identities, stronger policy schemas/versioning, persistent budget accounting, replay/idempotency controls, comprehensive automated security testing, observability, rate limiting, and production-grade secret management.

## License

This project is provided as an educational portfolio and research prototype.
