<div align="center">
  <img src=".github/assets/logo_animated.svg" width="80" height="96" alt="Sigil Logo" />

  <h1>Sigil</h1>

  <p><strong>Cryptographic identity and trust layer for the AI agent economy.</strong></p>

  <p>
    <a href="https://github.com/sigil-xyz/sigil/actions/workflows/ci.yml">
      <img src="https://github.com/sigil-xyz/sigil/actions/workflows/ci.yml/badge.svg" alt="CI" />
    </a>
    <img src="https://img.shields.io/badge/Solana-Devnet-9945FF?style=flat&logo=solana&logoColor=white" alt="Network" />
    <img src="https://img.shields.io/badge/License-MIT-blue?style=flat" alt="License" />
    <img src="https://img.shields.io/badge/status-alpha-orange?style=flat" alt="Status" />
  </p>
</div>

---

AI agents can already pay each other. What they cannot do is **trust** each other.

Sigil is the identity, authorization, and discovery layer that makes the AI agent economy possible. It gives every agent a cryptographically verifiable credential — linking it to an owner, constraining what it can do, and staking collateral against misbehavior.

---

## The Problem

| Problem | Impact |
| :--- | :--- |
| **No identity** | Any agent can claim to be anything. There is no way to verify ownership or authorization. |
| **No discovery** | There is no standard directory for agents to advertise capabilities and get found. |
| **No reputation** | Transaction history is opaque. Agents have no way to build or verify track records. |
| **No accountability** | When an agent misbehaves or fails, there is nothing at stake. |

---

## How It Works

Sigil is built on three on-chain primitives.

### 1. Sigil Credentials

Every agent holds a **Sigil** — a PDA on Solana that encodes its owner (principal), what capabilities it has, and what it is allowed to spend.

```typescript
import { SigilClient } from '@sigil/sdk';

const client = new SigilClient({ cluster: 'devnet' });

const sigil = await client.issueSigil({
  agent: agentKeypair.publicKey,
  capabilities: [{ category: 'image-generation' }],
  spendLimit: { perTx: 0.10, perDay: 5.00 }, // USDC
  stake: 1.0,                                 // SOL collateral
}, principalSigner);
```

### 2. Agent Registry

A public on-chain directory. Agents list their services; other agents discover them by capability, price, and reputation.

```typescript
const agents = await client.discover({
  capability: 'image-generation',
  minReputation: 4.5,
  minStake: 0.5,
});
```

### 3. Reputation Engine

Every transaction produces an on-chain receipt. Successes build reputation scores; disputes can trigger stake slashing.

---

## Architecture

```
Principal ──issues──► Sigil Credential
                            │
                   Agent holds Sigil
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
       Agent Registry   Spend Limits   Attestations
              │
       Reputation Engine
              │
       x402 Payment (Solana USDC)
```

---

## Packages

| Package | Description | Status |
| :--- | :--- | :--- |
| `@sigil/sdk` | TypeScript client for all program interactions | Alpha |
| `@sigil/x402` | Express middleware for Sigil-gated agent endpoints | Planned |
| `@sigil/mcp` | MCP server plugin for agent verification | Planned |

---

## Quick Start

**Prerequisites:** [Rust](https://rustup.rs), [Anchor CLI](https://www.anchor-lang.com/docs/installation), [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools), [Bun](https://bun.sh)

```bash
git clone https://github.com/sigil-xyz/sigil && cd sigil

# Configure Solana
solana config set --url devnet
solana airdrop 2

# Build Anchor programs
anchor build

# Run tests
cargo test

# Run dashboard
cd apps/dashboard
cp .env.example .env.local
# Fill in .env.local with your Helius RPC URL, program IDs, and Privy app ID
bun install && bun dev
```

---

## Repository Structure

```
sigil/
├── programs/
│   ├── credential/        # issue_sigil, revoke_sigil, record_spend
│   ├── registry/          # list_agent, update_listing, discover
│   └── reputation/        # create_receipt, submit_rating
├── packages/
│   ├── sdk/               # @sigil/sdk
│   ├── x402-middleware/   # @sigil/x402
│   └── mcp-plugin/        # @sigil/mcp
├── apps/
│   └── dashboard/         # Next.js 15 principal dashboard
├── Anchor.toml
└── package.json
```

---

## Build Status

| Component | Status |
| :--- | :--- |
| Dashboard (Next.js 15) | Complete — mock data |
| Credential Program | In progress |
| Registry Program | Planned |
| Reputation Program | Planned |
| SDK (`@sigil/sdk`) | Planned |
| x402 Middleware | Planned |

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup, branch conventions, and the PR process.

## Security

See [SECURITY.md](./SECURITY.md) for the vulnerability disclosure policy.

## License

[MIT](./LICENSE)
