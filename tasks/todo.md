# Sigil — Implementation Todo

**Updated:** April 21, 2026
**Deadline:** May 11, 2026 (target submit May 9)
**Days remaining:** 20

---

## Phase 0: Frontend (COMPLETE)

- [x] Landing / Hero page — cinematic entrance, parallax, scroll reveal
- [x] Principal Dashboard — mock sigil list, spend bars, issue dialog, revoke flow
- [x] Sigil Detail page — `/dashboard/sigils/[id]`, animated spend bar, revoke AlertDialog
- [x] Registry Explorer — client-side filter/sort, agent card grid
- [x] Agent Profile — Recharts reputation graph, transaction history table

---

## Phase 1: Solana Anchor Programs (CURRENT — Days 1–3)

### Credential Program (`programs/credential/`)
- [ ] Initialize Anchor workspace (`anchor init sigil` inside `programs/`)
- [ ] Define `Sigil` account struct (matches `architecture.md` schema)
- [ ] Define `Capability` and `Attestation` nested structs
- [ ] Implement `issue_sigil` instruction (principal creates sigil PDA for agent)
- [ ] Implement `revoke_sigil` instruction (principal kills instantly)
- [ ] Implement `update_sigil` instruction (modify limits/expiry)
- [ ] Implement `record_spend` instruction (update spent_today, enforce daily limit)
- [ ] PDA seeds: `[b"sigil", agent_pubkey.as_ref()]`
- [ ] Write Anchor tests for all instructions
- [ ] Deploy to devnet
- [ ] Note deployed program ID

### Registry Program (`programs/registry/`)
- [ ] Define `AgentListing` account struct
- [ ] Define `PricingModel` enum
- [ ] Implement `list_agent` instruction
- [ ] Implement `update_listing` instruction
- [ ] Implement `deactivate_listing` instruction
- [ ] PDA seeds: `[b"listing", sigil_pda.as_ref()]`
- [ ] Write Anchor tests
- [ ] Deploy to devnet

### Reputation Program (`programs/reputation/`) — lower priority
- [ ] Define `TransactionReceipt` account struct
- [ ] Implement `create_receipt` instruction
- [ ] Implement `submit_rating` instruction
- [ ] PDA seeds: `[b"receipt", tx_signature.as_ref()]`
- [ ] Write Anchor tests
- [ ] Deploy to devnet

---

## Phase 2: TypeScript SDK (`packages/sdk/`) — Days 4–5

- [ ] Init package: `bun init` at `packages/sdk/`, set `name: @sigil/sdk`
- [ ] Add deps: `@coral-xyz/anchor`, `@solana/web3.js`
- [ ] `SigilClient` class with constructor (cluster, rpcUrl)
- [ ] `issueSigil(params, signer)` — builds + sends `issue_sigil` instruction
- [ ] `getSigil(agentPubkey)` — fetches PDA account data
- [ ] `verifySigil(pda, requirements)` — validates capability + limits + active status
- [ ] `revokeSigil(agentPubkey, signer)` — sends `revoke_sigil`
- [ ] `listAgent(params, signer)` — sends `list_agent` to Registry Program
- [ ] `discover(filters)` — reads Registry Program accounts, filters client-side
- [ ] Export types: `Sigil`, `AgentListing`, `SigilClient`
- [ ] Publish alpha to npm as `@sigil/sdk@0.1.0-alpha`

---

## Phase 3: x402 Middleware (`packages/x402-middleware/`) — Days 6–7

- [ ] Init package: `bun init` at `packages/x402-middleware/`
- [ ] `requireSigil(options)` — Express middleware that reads `X-Sigil` header, calls `client.verifySigil()`
- [ ] `x402Payment(options)` — Express middleware for payment gating (stub using x402 protocol)
- [ ] Wire both middleware so they compose: `requireSigil` runs first, `x402Payment` second
- [ ] Export from single entry point
- [ ] Publish to npm as `@sigil/x402@0.1.0-alpha`

---

## Phase 4: Wire Dashboard to Real Solana — Days 8–10

- [ ] Install `@coral-xyz/anchor`, `@solana/wallet-adapter-react`, `@privy-io/react-auth` in dashboard
- [ ] Replace `MOCK_PRINCIPAL` with live wallet connection (Privy)
- [ ] Replace `MOCK_SIGILS` with live `client.getSigil()` calls via Helius RPC
- [ ] "Issue New Sigil" form → calls `client.issueSigil()`, signs with connected wallet
- [ ] "Revoke" button → calls `client.revokeSigil()`, signs with connected wallet
- [ ] Registry Explorer → calls `client.discover()` with filter params
- [ ] Add environment variables: `NEXT_PUBLIC_HELIUS_RPC_URL`, `NEXT_PUBLIC_CREDENTIAL_PROGRAM_ID`, `NEXT_PUBLIC_REGISTRY_PROGRAM_ID`
- [ ] Test full flow on devnet

---

## Phase 5: Demo Agents — Days 11–12

- [ ] Build `Agent A` — minimal Node/Bun server, holds a Sigil, calls Agent B
- [ ] Build `Agent B` — Node/Bun server with `@sigil/x402` middleware, performs mock image-gen
- [ ] End-to-end test: A calls B → Sigil verified → x402 payment → receipt created
- [ ] Record working terminal output / Loom for demo video

---

## Phase 6: Submission — Days 13–19 (May 3–9)

- [ ] Polish dashboard UX (remove loading skeletons, clean up stale mock data references)
- [ ] Record 3-min demo video (issue → discover → transact → receipt)
- [ ] Write submission description (problem, solution, technical approach, monetization, user acquisition)
- [ ] Finalize pitch deck (10 slides)
- [ ] Record pitch video (<3 min)
- [ ] Dry run full submission on arena.colosseum.org
- [ ] **SUBMIT May 9**

---

## Scope Cut Triggers (if behind)

| Cut in order | What to drop |
|---|---|
| 1st | MCP plugin (`@sigil/mcp`) |
| 2nd | Reputation Program (use mock scores) |
| 3rd | Attestation in UI |
| 4th | Registry real-time filter (keep mock data) |
| Last resort | Full stack → Credential Program only + SDK + demo |

---

## Review Section

_To be filled after each phase completes._
