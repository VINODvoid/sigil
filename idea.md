# Sigil — Core Idea

## What Sigil Is

**Sigil is the identity, trust, and discovery layer for AI agents transacting on Solana.**

A "sigil" (historically: a magical seal) in this context is a cryptographically signed credential that proves an AI agent:
- Belongs to a known principal (owner)
- Is authorized for specific actions
- Has spending limits
- Has staked collateral / liability
- Has a verifiable transaction history

Every agent gets a Sigil. Every transaction verifies a Sigil. Every registry entry is linked to a Sigil.

---

## The Problem Sigil Solves

### Today's Broken State (April 2026)

AI agents can now pay each other via x402 (HTTP-native crypto payments). The pieces exist:
- **Payment layer:** x402 (Coinbase + Cloudflare)
- **Wallet layer:** MoonPay Open Wallet Standard (just launched March 23, 2026)
- **Protocol layer:** Model Context Protocol (MCP)
- **Settlement layer:** Solana / Base / etc.

But the trust and discovery layer doesn't exist. This creates four critical problems:

**1. Identity Crisis**
- An agent claiming to be "customer service for Company X" could be anyone
- No way to cryptographically prove an agent's principal
- No way to verify authorizations
- No way to limit damage from a compromised agent

**2. Discovery Problem**
- Agents can't find each other (the A402 paper from March 2026 explicitly named this)
- No marketplace, no directory
- Only $28K daily x402 volume — not demand-limited, discovery-limited

**3. Reputation Vacuum**
- No way to know if an agent is reliable
- No consequences for bad behavior
- No incentive for good behavior
- Trust bootstrapping requires out-of-band coordination

**4. Liability Uncertainty**
- When an agent misbehaves, who pays?
- No collateral model
- No dispute resolution
- Corporations won't deploy agents they can't bound liability on

### a16z's Explicit Call-Out (2026 Thesis)

From a16z crypto's "Missing Infrastructure for AI Agents":

> "The critical missing primitive here is KYA: Know Your Agent. Just as humans need credit scores to get loans, agents will need cryptographically signed credentials to transact — linking the agent to its principal, its constraints, and its liability. The industry that built that KYC infrastructure over decades now has just months to figure out KYA."

**Sigil is the KYA primitive.** Plus discovery. Plus reputation.

---

## The Three Components

### 1. Sigil Credentials (Identity + Authorization)

Each agent holds a Sigil — a signed credential stored onchain. Structure:

```
Sigil {
  agent_pubkey: Pubkey           // Agent's wallet
  principal_pubkey: Pubkey       // Owner (human/company)
  issuer_pubkey: Pubkey          // Who attested (can be self)
  
  capabilities: Vec<Capability>  // What agent can do
  spend_limit_per_tx: u64        // Max USDC per transaction
  spend_limit_per_day: u64       // Max USDC per 24h
  allowed_domains: Vec<String>   // Restricted endpoints
  
  stake: u64                     // Collateral locked
  slash_conditions: Vec<...>     // When stake gets taken
  
  attestations: Vec<Attestation> // External signatures (KYC, etc)
  
  issued_at: i64
  expires_at: i64
  revoked: bool
}
```

**How it's used:**
- An x402 endpoint can require a Sigil: "pay me, but only if you have a Sigil with spending authority up to $0.10"
- An agent marketplace can filter: "show me agents with 100+ successful transactions and 10 SOL staked"
- A principal can revoke a compromised agent's Sigil instantly
- A dispute can trigger slashing of the stake

### 2. Sigil Registry (Discovery)

A public onchain directory where agents publish:

```
AgentListing {
  sigil: PDA                     // Links to credential
  capabilities: Vec<String>      // ["image-generation", "ocr"]
  pricing: PricingModel          // Per-call / streaming / subscription
  endpoint: String               // URL or MCP server address
  reputation_score: f32          // Computed from transaction history
  total_transactions: u64
  total_volume: u64
  last_active: i64
}
```

**Discovery flow:**
```typescript
const agent = await sigil.discover({
  capability: "ocr",
  maxPrice: 0.001,
  minReputation: 4.5,
  minStake: 5,  // 5 SOL minimum collateral
});

const response = await agent.call({ imageUrl: "..." });
// Payment auto-routed via x402 using Sigil credentials
```

### 3. Reputation Engine

Every completed transaction creates an onchain receipt:

```
TransactionReceipt {
  sigil_from: PDA
  sigil_to: PDA
  amount: u64
  capability_used: String
  successful: bool               // Did agent deliver?
  dispute_raised: bool
  resolved_at: i64
  rating: Option<u8>             // 1-5, optional
}
```

Reputation is computed deterministically from receipts:
- Base score from completion rate
- Volume-weighted rating average
- Time decay (recent > old)
- Slashing = permanent reputation hit

**Anti-gaming:**
- Receipts require both parties' signatures
- Gas costs prevent spam
- Stake slashing if fake transactions detected
- Sybil resistance via principal linking (one human, many agents, all share reputation baseline)

---

## How It All Fits Together

```
┌─────────────────────────────────────────────────────────┐
│                   HUMAN / COMPANY                         │
│                   (Principal)                             │
└──────────────────────────┬──────────────────────────────┘
                           │
                  issues Sigil to
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   AI AGENT                                │
│   ┌─────────────────┐    ┌──────────────────────────┐   │
│   │     WALLET      │    │       SIGIL              │   │
│   │  (MoonPay OWS)  │◄───┤  (Identity + limits)     │   │
│   └─────────────────┘    └──────────────────────────┘   │
└────────────────────┬───────────────┬────────────────────┘
                     │               │
              transacts via     listed in
                     │               │
                     ▼               ▼
     ┌───────────────────┐    ┌─────────────────────┐
     │   x402 PAYMENT    │    │  SIGIL REGISTRY     │
     │   (Coinbase/      │    │  (Discovery +       │
     │    Cloudflare)    │    │   Reputation)       │
     └───────┬───────────┘    └─────────────────────┘
             │
             │ settles on
             ▼
     ┌───────────────────┐
     │      SOLANA       │
     │   (Settlement)    │
     └───────────────────┘
```

Sigil sits as the **trust meta-layer** connecting wallets, payments, and agents.

---

## Killer Integrations (Built Into MVP)

### x402 Gateway Middleware
```typescript
// Any x402 endpoint can gate by Sigil
import { requireSigil } from '@sigil/x402-middleware';

app.post('/api/expensive-llm-call',
  requireSigil({ minReputation: 4.0, maxSpendPerTx: 0.10 }),
  x402Payment({ amount: 0.05 }),
  handler
);
```

### MCP Server Plugin
```typescript
// MCP tools can verify agent identity
import { sigilPlugin } from '@sigil/mcp';

const server = new MCPServer({
  plugins: [sigilPlugin({ requireAttestation: true })]
});
```

### Agent SDK
```typescript
// Any agent framework can get a Sigil
import { createSigil } from '@sigil/sdk';

const sigil = await createSigil({
  principal: wallet.publicKey,
  capabilities: ['code-review', 'translation'],
  spendLimit: { perTx: 0.10, perDay: 5.00 },
  stake: 1.0  // SOL
});

// Now use it for x402 calls
const response = await fetch('https://api.example.com/data', {
  headers: { 'X-Sigil': sigil.serialize() }
});
```

---

## Why "Sigil"

- Historically: a magical seal that binds something (perfect metaphor for cryptographic identity)
- Short, pronounceable, memorable
- Works as a noun ("agent needs a Sigil") and verb ("sigil your agent")
- No existing crypto project collision (verify before launch)
- Distinctive without being weird
- Fits the Solana ecosystem tone (mystical but technical)

Taglines to try:
- "Every agent needs a Sigil."
- "The mark that lets agents transact."
- "Identity + discovery for the agent economy."

---

## What's NOT in Scope (Important)

To keep the MVP shippable in 3 weeks:

- **Not** building a new wallet (use MoonPay OWS or Privy)
- **Not** building a new payment protocol (use x402)
- **Not** building a new blockchain (use Solana)
- **Not** building full dispute resolution (ship basic slashing, defer Kleros-style)
- **Not** building KYC attachment (just the schema for it, actual KYC providers integrate later)
- **Not** building multichain (Solana first, then bridge later)

Focus: **credentials + registry + reputation on Solana.** That's it.

---

## The Bet

Every serious prediction about 2026 says the agent economy explodes. But for it to explode safely, someone needs to build the trust layer. a16z said it. MoonPay is betting on it. Colosseum is funding it (MCPay Cohort 4).

Sigil is that trust layer. Ship it first, become the standard.
