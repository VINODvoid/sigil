# Contributing to Sigil

---

## Prerequisites

| Tool | Install |
|------|---------|
| Rust | [rustup.rs](https://rustup.rs) |
| Anchor CLI | `cargo install --git https://github.com/coral-xyz/anchor avm --locked && avm install latest && avm use latest` |
| Solana CLI | [docs.solana.com](https://docs.solana.com/cli/install-solana-cli-tools) |
| Bun | [bun.sh](https://bun.sh) |

---

## Setup

```bash
git clone https://github.com/sigil-xyz/sigil && cd sigil

# Solana devnet
solana config set --url devnet
solana airdrop 2

# Build Anchor programs
anchor build

# Run tests
cargo test

# Dashboard
cd apps/dashboard
cp .env.example .env.local
bun install
bun dev
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
│   ├── sdk/                # @sigil/sdk
│   ├── x402-middleware/    # @sigil/x402
│   └── mcp-plugin/         # @sigil/mcp
├── apps/
│   └── dashboard/          # Next.js 15
└── Anchor.toml
```

---

## Branch Conventions

| Branch | Purpose |
|--------|---------|
| `main` | Always deployable. Protected — no direct commits. |
| `feat/<scope>/<description>` | New features |
| `fix/<scope>/<description>` | Bug fixes |
| `chore/<description>` | Tooling, deps, config |
| `docs/<description>` | Documentation only |
| `ci/<description>` | CI/CD changes |

**Scopes:** `credential`, `registry`, `reputation`, `sdk`, `x402`, `dashboard`, `deps`

Examples:
```
feat/credential/issue-sigil-instruction
fix/sdk/discover-filter-logic
chore/deps/upgrade-anchor-1.1
```

---

## Commit Conventions

This project follows [Conventional Commits](https://www.conventionalcommits.org).

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`, `ci`, `revert`

**Rules:**
- Subject line: lowercase, no period at end, max 72 characters
- Body: explain *why*, not *what*
- Reference issues: `Closes #123`

Examples:
```
feat(credential): add issue_sigil instruction with PDA derivation
fix(sdk): handle missing sigil PDA in getSigil()
chore(deps): upgrade anchor-lang to 1.0.1
```

---

## Pull Request Process

1. Branch from `main`: `git checkout -b feat/credential/issue-sigil`
2. Make focused changes — one PR per logical unit of work
3. Ensure CI passes: `cargo fmt`, `cargo clippy`, `bunx tsc --noEmit`, `bun lint`
4. Fill in the PR template
5. Request review before merging
6. Squash merge to `main`

---

## Code Rules

- **bun only** — never `npm install` or `npx`. Use `bun add` and `bunx`.
- **TypeScript strict mode** — no `any`, no implicit types.
- **No direct commits to `main`** — all changes via PR.
- **No secrets committed** — `.env` files, private keys, tokens. Use `.env.example` for structure.
- **No mock data in production code paths** — mocks live in `src/data/mock.ts` and are replaced when real programs are deployed.
- **One program per instruction group** — Credential, Registry, and Reputation are separate programs with separate PDAs.

---

## Environment Variables

```bash
cp apps/dashboard/.env.example apps/dashboard/.env.local
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_HELIUS_RPC_URL` | Helius devnet RPC endpoint |
| `NEXT_PUBLIC_CREDENTIAL_PROGRAM_ID` | Deployed credential program ID |
| `NEXT_PUBLIC_REGISTRY_PROGRAM_ID` | Deployed registry program ID |
| `NEXT_PUBLIC_REPUTATION_PROGRAM_ID` | Deployed reputation program ID |
| `NEXT_PUBLIC_PRIVY_APP_ID` | Privy app ID for wallet auth |

---

## Deployed Program IDs (Devnet)

| Program | ID |
|---------|----|
| Credential | `Eoxakhx7oq5oDsGLsjvNPUEw5E58yfWnNJ18weUtAbxh` |
| Registry | `RjfxSbr9KaHFHkW1txeuWQhtQtGtw8DZZLNhbyPGUdM` |
| Reputation | TBD |

---

## Publishing Packages

Tags trigger automated publishing via GitHub Actions. To cut a release:

```bash
# SDK
git tag sdk/v0.1.0 && git push origin sdk/v0.1.0

# x402 middleware
git tag x402/v0.1.0 && git push origin x402/v0.1.0
```

Requires `NPM_TOKEN` set in repository secrets.
