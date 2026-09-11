# Security Notes

## Threat model

AgentPay Firewall assumes that both model output and browser input can be incorrect or malicious.

### Protected boundary

The critical authorization boundary is the server-side firewall immediately before Razorpay execution.

### Controls demonstrated

- Absolute per-transaction cap
- Category-level autonomous allowances
- Explicit human-review gate
- Risk threshold
- Trusted-merchant checks
- Server-side policy recompilation
- Server-side transaction re-evaluation
- Block-before-provider behavior
- Bounded audit events
- Decision-integrity test against a forged frontend `ALLOW`
- Baseline browser security headers

### Important invariant

A browser request cannot directly select the firewall decision. The Razorpay route evaluates the transaction independently and only proceeds for a server-side `ALLOW`, or a server-side `REVIEW` accompanied by an approval signal.

The current prototype's approval signal is intentionally simple and is **not an authenticated identity assertion**. In production, approval must be tied to an authenticated user, authorization scope, transaction fingerprint, and one-time approval token.

## AI trust boundary

The LLM is treated as an untrusted policy-interpreter component. Its structured output is sanitized and the payment route does not consume the browser's interpreted policy as an authorization decision; it recompiles the original policy text through the deterministic compiler before execution.

If the local LLM is unavailable or returns malformed output, the deterministic interpreter remains available.

## Demonstrated integrity scenario

The application intentionally submits a forged frontend `ALLOW` for a transaction that violates the server-side policy. The server independently evaluates it as `BLOCK`, and the execution path does not call Razorpay.

This demonstrates decision integrity at the application boundary. It is not a complete penetration test.

## What this prototype does not claim

This project is not a production security certification, fraud model, or complete penetration test. Its simulation data is synthetic, its audit storage is in-memory, its approval signal is not authenticated, and its policy language is intentionally constrained.

## Production hardening roadmap

1. Authenticate and cryptographically identify each agent.
2. Authenticate human approvers and bind approval to an exact transaction/policy hash.
3. Persist policy versions and make every authorization decision version-addressable.
4. Store audit records in tamper-evident durable storage.
5. Add idempotency keys and replay protection around payment execution.
6. Make budget accounting atomic and persistent.
7. Add rate limits, abuse detection, CSRF strategy where applicable, and operational alerting.
8. Add automated API, integration, fuzzing, and adversarial security tests.
9. Use managed secret storage and rotation for payment credentials.
