# Security Notes

## Threat model

AgentPay Firewall assumes that both model output and browser input can be incorrect or malicious.

### Protected boundary

The critical authorization boundary is the server-side firewall immediately before Razorpay execution.

### Controls demonstrated

- Absolute per-transaction cap
- Category-level autonomous allowances
- Explicit human review gate
- Risk threshold
- Trusted-merchant checks
- Server-side policy recompilation
- Server-side transaction re-evaluation
- Block-before-provider behavior
- Bounded audit events
- Decision-integrity test against a forged frontend `ALLOW`

### Important invariant

A browser request cannot directly select an authorized payment outcome. The Razorpay route evaluates the transaction independently and only proceeds for a server-side `ALLOW`, or a server-side `REVIEW` accompanied by explicit human approval.

## What this prototype does not claim

This project is not a production security certification, fraud model, or complete penetration test. Its simulation data is synthetic, its audit storage is in-memory, and its policy language is intentionally constrained.

## Production hardening roadmap

1. Authenticate and cryptographically identify each agent.
2. Persist policy versions and make every authorization decision version-addressable.
3. Store audit records in tamper-evident durable storage.
4. Add idempotency keys and replay protection around payment execution.
5. Make budget accounting atomic and persistent.
6. Add rate limits, abuse detection, and operational alerting.
7. Add automated API, integration, and adversarial security tests.
8. Use managed secret storage and rotation for payment credentials.
