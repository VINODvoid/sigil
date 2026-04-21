# Sigil — Technical Architecture

## High-Level Stack

```
┌───────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                       │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Principal   │  │ Agent        │  │ Registry         │  │
│  │ Dashboard   │  │ Builder      │  │ Explorer         │  │
│  │ (issue)     │  │ (self-serve) │  │ (discover)       │  │
│  └─────────────┘  └──────────────┘  └──────────────────┘  │
└────────────────────────┬──────────────────────────────────┘
                         │
┌────────────────────────▼──────────────────────────────────┐
│                TypeScript SDK (@sigil/sdk)                  │
│      createSigil() / discover() / verify() / attest()       │
└────────────────────────┬──────────────────────────────────┘
                         │
┌────────────────────────▼──────────────────────────────────┐
│                    Solana Programs (Anchor/Rust)            │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Credential  │  │ Registry     │  │ Reputation       │  │
│  │ Program     │  │ Program      │  │ Program          │  │
│  └─────────────┘  └──────────────┘  └──────────────────┘  │
└────────────────────────┬──────────────────────────────────┘
                         │
┌────────────────────────▼──────────────────────────────────┐
│                         Solana L1                           │
└───────────────────────────────────────────────────────────┘

     │                                      │
     │ Integrates with                      │ Gates
     ▼                                      ▼
┌──────────────┐                    ┌─────────────────┐
│ x402 payment │                    │ MCP Servers     │
│ middleware   │                    │ (plug-in)       │
└──────────────┘                    └─────────────────┘
```

---

## Tech Stack Decisions

| Layer | Tech | Reason |
|-------|------|--------|
| Smart Contracts | Anchor (Rust) | Solana standard, hackathon partner support |
| RPC | Helius | Free tier, partner, best DX |
| Wallet Auth | Privy | Embedded wallets, partner, fast onboarding |
| Frontend | Next.js + TypeScript | Your strength |
| UI | Tailwind + shadcn/ui | Fast, clean, partner-friendly |
| DB (off-chain metadata) | PostgreSQL + Prisma | Your strength |
| Hosting | Vercel (frontend), Render (indexer) | Standard stack |
| Indexer | Helius Webhooks | Real-time event streaming |
| SDK language | TypeScript | Maximum reach for integrators |
| Package | npm | Standard |

---

## Smart Contract Design

### Program 1: Credential Program

**Purpose:** Issue, update, revoke Sigil credentials.

**Accounts:**

```rust
#[account]
pub struct Sigil {
    pub agent_pubkey: Pubkey,           // 32
    pub principal_pubkey: Pubkey,        // 32
    pub issuer_pubkey: Pubkey,          // 32
    pub capabilities: Vec<Capability>,   // variable
    pub spend_limit_per_tx: u64,         // 8
    pub spend_limit_per_day: u64,        // 8
    pub spent_today: u64,                 // 8 (reset daily)
    pub last_reset: i64,                  // 8
    pub stake_amount: u64,                // 8
    pub attestations: Vec<Attestation>, // variable
    pub issued_at: i64,                   // 8
    pub expires_at: i64,                  // 8
    pub revoked: bool,                    // 1
    pub bump: u8,                         // 1
}

#[account]
pub struct Capability {
    pub category: [u8; 32],  // e.g. "image-generation"
    pub allowed_domains: Vec<[u8; 64]>, // wildcard URLs
}

#[account]
pub struct Attestation {
    pub issuer: Pubkey,
    pub attestation_type: u8,  // KYC, employer, etc.
    pub data_hash: [u8; 32],   // hash of off-chain data
    pub signed_at: i64,
    pub signature: [u8; 64],
}
```

**Instructions:**
- `issue_sigil(capabilities, limits, stake, expiry)` — principal creates
- `update_sigil(new_limits, new_expiry)` — principal modifies
- `revoke_sigil()` — principal kills instantly
- `add_attestation(attestation)` — third-party KYC provider signs
- `record_spend(amount)` — called by registry when txn happens
- `slash(amount, reason)` — governance/oracle slashes stake

**PDA seeds:** `[b"sigil", agent_pubkey.as_ref()]`

---

### Program 2: Registry Program

**Purpose:** Public directory of active agents.

**Accounts:**

```rust
#[account]
pub struct AgentListing {
    pub sigil: Pubkey,              // PDA of credential
    pub capabilities: Vec<[u8; 32]>, // categories
    pub pricing_model: PricingModel,
    pub endpoint_url: [u8; 128],
    pub reputation_score: u32,       // fixed-point, 0-10000
    pub total_transactions: u64,
    pub total_volume: u64,
    pub successful_transactions: u64,
    pub disputed_transactions: u64,
    pub last_active: i64,
    pub active: bool,
    pub bump: u8,
}

#[account]
pub enum PricingModel {
    PerCall { amount: u64 },
    PerToken { amount: u64 },
    Subscription { monthly: u64 },
    Custom { metadata_uri: String },
}
```

**Instructions:**
- `list_agent(sigil, listing_data)` — register in registry
- `update_listing(new_data)` — modify
- `deactivate_listing()` — temporary pause
- `record_transaction(amount, successful, rating)` — called after txn settles

**PDA seeds:** `[b"listing", sigil.as_ref()]`

---

### Program 3: Reputation Program

**Purpose:** Compute and store transaction receipts, calculate scores.

**Accounts:**

```rust
#[account]
pub struct TransactionReceipt {
    pub tx_signature: [u8; 64],
    pub sigil_from: Pubkey,
    pub sigil_to: Pubkey,
    pub amount: u64,
    pub capability_used: [u8; 32],
    pub successful: bool,
    pub dispute_raised: bool,
    pub resolved_at: i64,
    pub rating: Option<u8>,  // 1-5
    pub created_at: i64,
}
```

**Instructions:**
- `create_receipt(...)` — signed by both parties
- `raise_dispute(receipt, reason)` — initiate dispute
- `resolve_dispute(receipt, outcome)` — oracle/governance resolves
- `submit_rating(receipt, rating)` — post-txn rating

**PDA seeds:** `[b"receipt", tx_signature.as_ref()]`

**Reputation calculation (off-chain indexer, exposed via API):**

```
score = weighted_average(
  recent_transactions_success_rate * 40%,
  volume_weighted_rating * 30%,
  total_volume * 20%,
  account_age * 10%
)

slashing_event → score *= 0.5 permanent
```

---

## SDK Design

**Package:** `@sigil/sdk` on npm

```typescript
import { SigilClient } from '@sigil/sdk';

const client = new SigilClient({
  cluster: 'mainnet-beta',
  rpcUrl: process.env.HELIUS_RPC_URL,
});

// 1. Principal issues Sigil to agent
const sigil = await client.issueSigil({
  agent: agentKeypair.publicKey,
  capabilities: [
    { category: 'image-generation', allowedDomains: ['api.openai.com'] },
  ],
  spendLimit: { perTx: 0.10, perDay: 5.00 }, // USDC
  stake: 1.0, // SOL
  expiresIn: '90d',
}, principalSigner);

// 2. Agent lists itself in registry
await client.listAgent({
  sigil: sigil.pda,
  capabilities: ['image-generation'],
  pricing: { model: 'per-call', amount: 0.05 },
  endpoint: 'https://my-agent.example.com/generate',
}, agentSigner);

// 3. Other agents discover
const matches = await client.discover({
  capability: 'image-generation',
  maxPrice: 0.10,
  minReputation: 4.0,
  minStake: 0.5,
});

// 4. Transact via x402 with Sigil verification
const response = await client.callAgent(matches[0], {
  request: { prompt: 'a cat' },
  paymentCredential: sigil,
});

// 5. Verify a Sigil
const isValid = await client.verifySigil(sigilPda, {
  requiredCapability: 'image-generation',
  maxSpendAmount: 0.05,
});
```

---

## x402 Middleware Integration

**Package:** `@sigil/x402`

```typescript
import express from 'express';
import { requireSigil, x402Payment } from '@sigil/x402';

const app = express();

app.post('/api/generate-image',
  requireSigil({
    minReputation: 3.5,
    requiredCapability: 'image-generation',
    maxSpendPerTx: 0.10,
  }),
  x402Payment({ amount: 0.05, currency: 'USDC' }),
  async (req, res) => {
    // req.sigil is now populated with verified agent data
    const image = await generateImage(req.body.prompt);
    res.json({ image });
  }
);
```

---

## MCP Server Plugin

**Package:** `@sigil/mcp`

```typescript
import { MCPServer } from '@modelcontextprotocol/sdk';
import { sigilPlugin } from '@sigil/mcp';

const server = new MCPServer({
  plugins: [
    sigilPlugin({
      requiredCapability: 'code-review',
      minAttestations: ['employer-verified'],
      minStake: 1.0,
    }),
  ],
});
```

---

## Data Flow Example

**Scenario:** Agent A (belongs to Company X) wants to use Agent B (image generation) for a task.

```
1. Company X issues Sigil to Agent A
   → issue_sigil() called on Credential Program
   → SigilA PDA created with spend limits

2. Agent B (already registered in registry)
   → Has SigilB, listed with capabilities + pricing

3. Agent A discovers Agent B
   → SDK queries Registry Program
   → Filter: capability=image-gen, min-reputation=4.0
   → Returns SigilB + endpoint

4. Agent A calls Agent B's x402 endpoint
   → HTTP request with X-Sigil header (SigilA credential proof)
   → Agent B's server runs @sigil/x402 middleware
   → Middleware verifies SigilA on-chain
   → Checks capability, spend limits, reputation
   → PASSES → x402 payment flow initiated

5. x402 payment settles on Solana
   → USDC transferred from Agent A wallet to Agent B wallet

6. Transaction receipt created
   → Both sigils sign
   → Recorded in Reputation Program

7. Agent A rates the transaction
   → 1-5 stars
   → Updates Agent B's reputation score

8. If Agent B misbehaved
   → Agent A raises dispute
   → Oracle/governance resolves
   → If Agent B found guilty → stake slashed → reputation hit
```

---

## MVP Scope (3 Weeks)

### Must-Have for Submission

- [ ] Credential Program deployed to devnet
  - issue_sigil, revoke, record_spend
- [ ] Registry Program deployed to devnet
  - list_agent, discover (read-only)
- [ ] Basic Reputation Program
  - create_receipt, simple score
- [ ] TypeScript SDK published to npm (alpha)
- [ ] Principal Dashboard (Next.js) — issue/revoke sigils
- [ ] Registry Explorer — browse agents
- [ ] x402 middleware (npm package)
- [ ] Demo: 2 mock agents transacting through Sigil
- [ ] 3-min demo video

### Nice-to-Have

- [ ] MCP plugin
- [ ] Slashing/dispute flow working end-to-end
- [ ] Attestation from 1 KYC provider integrated
- [ ] Mobile-friendly dashboard
- [ ] Deployed indexer
- [ ] 10+ mock agents for realistic demo

### Explicitly Out of Scope

- Mainnet deployment (devnet only)
- Full dispute resolution oracle (use governance multisig)
- Multi-chain support
- Gas optimization (works but not perf-tuned)
- Production monitoring

---

## Tools & Libraries

| Purpose | Library | Why |
|---------|---------|-----|
| Anchor framework | `@coral-xyz/anchor` | Smart contracts |
| Wallet | `@solana/wallet-adapter-react` | Standard |
| Web3 | `@solana/web3.js` | Standard |
| RPC | Helius | Free tier + webhooks |
| x402 | Custom SDK + payment protocol | Partner support |
| Embedded wallet | `@privy-io/react-auth` | Onboarding UX |
| UI kit | shadcn/ui | Fast + clean |
| Indexer | Helius Webhooks → Postgres | Real-time updates |

---

## Deployment Targets

| Service | Where |
|---------|-------|
| Smart contracts | Solana Devnet (initially) |
| Frontend | Vercel |
| Indexer | Render / Railway |
| Docs | Vercel (same monorepo) |
| npm packages | @sigil/sdk, @sigil/x402, @sigil/mcp |

---

## Repository Structure

```
sigil/
├── programs/
│   ├── credential/
│   ├── registry/
│   └── reputation/
├── packages/
│   ├── sdk/                    # @sigil/sdk
│   ├── x402-middleware/        # @sigil/x402
│   └── mcp-plugin/             # @sigil/mcp
├── apps/
│   ├── dashboard/              # Principal + Agent dashboards
│   └── explorer/               # Registry explorer
├── indexer/                    # Helius webhook → PG
├── docs/
├── tests/
├── Anchor.toml
└── package.json (bun workspaces)
```
