# Contributing to Sigil

Sigil is a hackathon project (Colosseum Frontier, deadline May 11, 2026). Contributions welcome, but move fast — no bureaucracy.

---

## Stack

| Layer | Tech |
|-------|------|
| Smart contracts | Anchor (Rust) |
| RPC | Helius |
| Wallet auth | Privy |
| Frontend | Next.js 15, TypeScript, Tailwind, shadcn/ui |
| Runtime | bun (not npm/npx) |
| Language | TypeScript strict mode everywhere |

---

## Setup

**Prerequisites:** Rust, Anchor CLI, Solana CLI, bun

```bash
# Anchor CLI
cargo install --git https://github.com/coral-xyz/anchor avm --locked
avm install latest && avm use latest

# Solana CLI + devnet config
solana config set --url devnet

# Install JS deps
bun install

# Build programs
anchor build

# Run Anchor tests
anchor test

# Run dashboard
cd apps/dashboard && bun dev
```

---

## Repository Structure

```
sigil/
├── programs/               # Rust Anchor programs
│   ├── credential/         # issue_sigil, revoke_sigil, record_spend
│   ├── registry/           # list_agent, update_listing
│   └── reputation/         # create_receipt, submit_rating
├── packages/
│   ├── sdk/                # @sigil/sdk TypeScript SDK
│   ├── x402-middleware/    # @sigil/x402 Express middleware
│   └── mcp-plugin/         # @sigil/mcp MCP server plugin
├── apps/
│   └── dashboard/          # Next.js 15 app
├── tests/                  # Integration tests
├── Anchor.toml
└── package.json
```

---

## Rules

- **bun only** — never `npm install` or `npx`. Use `bun add` and `bunx`.
- **TypeScript strict mode** — no `any`, no implicit types.
- **No commits to main directly** — branch per feature, PR to merge.
- **Never commit secrets** — `.env` files, keys, tokens. Use `.env.example` for structure.
- **No mock data in production paths** — mocks live in `src/data/mock.ts` and are replaced when the real program is deployed.
- **One program per instruction group** — Credential, Registry, Reputation are separate programs with separate PDAs.

---

## Environment Variables

Create `apps/dashboard/.env.local` from the example:

```bash
cp apps/dashboard/.env.example apps/dashboard/.env.local
```

Required variables:

```
NEXT_PUBLIC_HELIUS_RPC_URL=
NEXT_PUBLIC_CREDENTIAL_PROGRAM_ID=
NEXT_PUBLIC_REGISTRY_PROGRAM_ID=
NEXT_PUBLIC_REPUTATION_PROGRAM_ID=
NEXT_PUBLIC_PRIVY_APP_ID=
```

---

## Deployed Program IDs (Devnet)

| Program | ID |
|---------|----|
| Credential | TBD |
| Registry | TBD |
| Reputation | TBD |

---

## SDK Publishing

```bash
cd packages/sdk
bun run build
bun publish --tag alpha
```

Packages: `@sigil/sdk`, `@sigil/x402`, `@sigil/mcp`

---

## Questions

Hackathon context in [.claude/context.md](./.claude/context.md). Full architecture in [architecture.md](./architecture.md). Current task list in [tasks/todo.md](./tasks/todo.md).
