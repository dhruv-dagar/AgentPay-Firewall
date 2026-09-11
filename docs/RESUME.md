# Resume / Interview Positioning

## One-line description

Server-authoritative financial control plane that lets AI agents interpret spending intent while deterministic controls retain authorization over payment execution.

## Resume bullets

- Built a server-authoritative financial control plane for autonomous AI payment agents using Next.js, TypeScript, deterministic policy evaluation, and Razorpay Test Mode.
- Designed an `ALLOW` / `REVIEW` / `BLOCK` authorization engine with transaction caps, category policies, risk thresholds, merchant trust, budget controls, and explicit human approval gates.
- Separated LLM policy interpretation from financial authorization; the payment endpoint recompiles and re-evaluates policy server-side before reaching the payment provider.
- Added adversarial decision-integrity testing, automated authorization tests, audit events, batch simulation, and policy what-if analysis to quantify control behavior.

## Strongest measurable evidence

The included deterministic simulation evaluates 120 synthetic transactions and reports 14.2% autonomous approval, 35.0% human review, 50.8% blocking, and 100% containment of designated high-risk transactions for the included workload.

Do not present these synthetic results as production fraud-detection accuracy or real money saved.

## Interview thesis

> AI interprets intent. Deterministic controls authorize money.

The key design decision is that neither the LLM nor the browser is trusted to authorize a payment. The server owns the final authorization decision.

## Skills demonstrated

TypeScript, React, Next.js, Node.js API design, deterministic policy engines, AI/LLM integration, payment API integration, security boundaries, human-in-the-loop systems, automated testing, CI, threat modeling, and quantitative simulation.
