# AgentPay Firewall — Architecture

## Trust boundaries

```text
             AI AGENT / LLM
                    |
          interprets user intent
                    v
          +-------------------+
          | Policy Interpreter |
          +---------+---------+
                    |
             structured policy
                    v
          +-------------------+
          |  AgentPay Firewall |
          |-------------------|
          | limits            |
          | category rules    |
          | merchant trust    |
          | risk thresholds   |
          | approval gates    |
          | budget controls   |
          +---------+---------+
                    |
             deterministic
              authorization
                    |
          +---------+---------+
          |         |         |
        ALLOW    REVIEW     BLOCK
          |         |         |
          |      HUMAN       STOP
          |     APPROVAL      |
          +---------+---------+
                    |
             server re-check
                    |
                    v
          Razorpay Test Mode
                    |
                    v
               Audit trail
```

## Authorization invariant

The payment provider must only be reached after an independent server-side evaluation produces `ALLOW`, or produces `REVIEW` plus explicit human approval.

The frontend does not provide authoritative authorization. The LLM does not provide authoritative authorization.

## Request lifecycle

1. User/agent submits a payment intent.
2. Natural-language policy is interpreted into structured controls.
3. The server compiles the policy using the deterministic policy engine.
4. Transaction attributes are evaluated against the policy.
5. The firewall returns `ALLOW`, `REVIEW`, or `BLOCK` with checks and reasons.
6. `BLOCK` ends the request without calling Razorpay.
7. `REVIEW` pauses until a human approval signal is supplied.
8. The Razorpay route independently recompiles and evaluates the policy.
9. Only an authorized request reaches Razorpay Test Mode.
10. Execution metadata is recorded in the bounded audit store.

## Failure handling

- Missing/invalid request data → HTTP 400.
- Policy violation → `BLOCK` or `REVIEW`; payment provider is not called until authorized.
- Missing Razorpay credentials → execution stops safely.
- Razorpay API failure → execution is reported as failed; no success event is emitted.
- LLM unavailable or malformed → deterministic policy interpretation remains available.

## Prototype limitations

The audit store is intentionally bounded in-memory storage for a hackathon demonstration. Production deployment would require persistent tamper-evident logging, authenticated agent identities, policy versioning, idempotency/replay protection, persistent budget accounting, observability, and stronger security testing.
