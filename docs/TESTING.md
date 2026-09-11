# Testing Strategy

AgentPay Firewall treats the deterministic authorization layer as the highest-value component to test because it is the final control before payment-provider execution.

## Current automated coverage

The policy suite covers:

- Safe trusted-merchant approval
- Category-specific human-review rules
- Absolute transaction caps
- Risk-threshold blocking
- Unknown-merchant review behavior
- Monthly budget violations
- Explicitly blocked categories
- Safety-failure precedence over approval requests
- Trusted-merchant bypass resistance for high-risk transactions
- Explicit transaction-level approval requests

Run:

```bash
npm install
npm test
npm run build
```

## Security-oriented scenarios

The application also exposes a decision-integrity demonstration that submits a forged frontend `ALLOW` while the server independently evaluates the transaction. The expected result is `BLOCK` with no Razorpay call.

## Benchmark methodology

The built-in simulator generates a deterministic 120-transaction synthetic workload across merchants, categories, amounts, risk scores, and approval requirements. It reports authorization counts, transaction value by decision, intervention rate, and high-risk containment.

These are engineering/demo measurements, not fraud-model accuracy metrics and not production financial-loss estimates.

## Verification status

The repository contains CI configuration that runs tests and a production build. A green CI run or fresh-machine local run should be treated as the authoritative verification record; repository configuration alone is not evidence that the commands have passed.
