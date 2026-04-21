# Sigil — 3-Week Build Plan

**Today:** April 20, 2026
**Deadline:** May 11, 2026 (target submission by May 9)
**Days available:** 21 (submit early at 19)

---

## Pre-Day-1 Setup (Today, April 20)

### Must do before writing any code

- [ ] Register project on arena.colosseum.org — reserve "Sigil"
- [ ] Create public GitHub repo: `sigil-protocol/sigil`
- [ ] Create project accounts:
  - [ ] GitHub org: `sigil-protocol`
  - [ ] Twitter/X: `@sigilprotocol` or `@sigilxyz`
  - [ ] Domain: check sigil.xyz / sigilprotocol.com
- [ ] Join Colosseum Discord
- [ ] Join Solana Developers Discord
- [ ] Bookmark workshop schedule (Phantom Connect, Metaplex, World)
- [ ] Initialize repo:
  ```
  sigil/
  ├── programs/
  ├── packages/
  ├── apps/
  ├── docs/
  └── README.md
  ```

### Alignment / Reality Check

- Can I learn Anchor fast enough? → 2-day assessment. If blocked by Day 3, adjust scope.
- Do I have Solana devnet + wallet + USDC devnet tokens? Set up first.
- Am I committing to this idea or still exploring? → Commit today or don't start.

---

## Week 1: Foundation (Apr 21 – Apr 27)

### Goal: Core credential program deployed + SDK skeleton

#### Day 1 — Mon Apr 21
- [ ] Morning: Read Anchor book (Chapter 1-3)
- [ ] Afternoon: Set up Anchor project, deploy hello-world to devnet
- [ ] Evening: Sketch Sigil account structure on paper

#### Day 2 — Tue Apr 22
- [ ] Write initial Credential Program
  - `issue_sigil` instruction
  - Sigil account structure
- [ ] Test locally
- [ ] Deploy to devnet
- [ ] Post Weekly Update Video #1 on arena (intro + what you're building)

#### Day 3 — Wed Apr 23
- [ ] Implement `revoke_sigil`, `update_sigil`
- [ ] Implement `record_spend` (updates spent_today counter)
- [ ] Write Anchor tests
- [ ] Commit everything

#### Day 4 — Thu Apr 24
- [ ] Start TypeScript SDK (`@sigil/sdk`)
- [ ] Implement `client.issueSigil()`, `client.getSigil()`, `client.verifySigil()`
- [ ] Test SDK against devnet contract
- [ ] Publish alpha to npm

#### Day 5 — Fri Apr 25
- [ ] Start Registry Program
  - AgentListing account
  - `list_agent`, `update_listing` instructions
- [ ] Deploy to devnet
- [ ] Begin dashboard scaffolding (Next.js, Tailwind, shadcn)

#### Day 6 — Sat Apr 26
- [ ] Dashboard: principal issues Sigil (UI)
  - Connect Phantom / Privy
  - Form: capabilities, limits, expiry
  - Call SDK → signs + submits
- [ ] Dashboard: view issued Sigils
- [ ] Test end-to-end

#### Day 7 — Sun Apr 27
- [ ] Registry explorer page
  - List all agents
  - Filter by capability
- [ ] SDK: add `client.discover()`
- [ ] End of Week 1 retro — what's done, what's blocked
- [ ] If blocked on contract work, simplify scope (drop Reputation Program)

**Week 1 Exit Criteria:**
- Credential Program deployed to devnet
- Registry Program deployed to devnet
- SDK published to npm (alpha)
- Dashboard can issue + list Sigils
- Weekly video #1 posted

---

## Week 2: Integration + Polish (Apr 28 – May 4)

### Goal: End-to-end demo working with x402

#### Day 8 — Mon Apr 28
- [ ] Start Reputation Program
  - TransactionReceipt account
  - `create_receipt` instruction
- [ ] Post Weekly Update Video #2 (show progress)

#### Day 9 — Tue Apr 29
- [ ] Build x402 middleware (`@sigil/x402`)
- [ ] `requireSigil()` function — verifies sigil from HTTP header
- [ ] Test against mock x402 endpoint

#### Day 10 — Wed Apr 30
- [ ] Build demo "Agent A" — minimal Node server that uses Sigil to call Agent B
- [ ] Build demo "Agent B" — Node server with x402 + Sigil middleware
- [ ] Test: Agent A calls Agent B → payment works → receipt created

#### Day 11 — Thu May 1
- [ ] Dashboard: reputation display
- [ ] Registry explorer: search, filter, rank
- [ ] SDK: `client.discover()` with real filtering logic

#### Day 12 — Fri May 2
- [ ] MCP plugin (`@sigil/mcp`)
  - Wrap existing MCP server
  - Verify Sigil on tool calls
- [ ] Demo MCP server using it
- [ ] Reach out to 3 MCP server builders for feedback

#### Day 13 — Sat May 3
- [ ] Polish pass on dashboard UX
- [ ] Add landing page (sigil.xyz homepage)
- [ ] Docs site skeleton
- [ ] Test full flow on fresh machine

#### Day 14 — Sun May 4
- [ ] Fix whatever broke
- [ ] End of Week 2 retro
- [ ] Start draft of pitch deck
- [ ] List every known bug, prioritize

**Week 2 Exit Criteria:**
- End-to-end flow works: issue Sigil → list → discover → call → pay → receipt
- x402 middleware published
- Demo Agent A + Agent B working
- Weekly video #2 posted
- Pitch deck draft started

---

## Week 3: Submission (May 5 – May 11)

### Goal: Ship it. Submit early.

#### Day 15 — Mon May 5
- [ ] Record technical demo (target 3 minutes)
  - Intro (15s)
  - Problem statement (30s)
  - Live demo: issue → discover → transact → receipt (2 min)
  - Close: call to action (15s)
- [ ] Post Weekly Update Video #3

#### Day 16 — Tue May 6
- [ ] Write submission description
  - Problem
  - Solution
  - Technical approach
  - Monetization
  - User acquisition
  - Team
- [ ] Finalize pitch deck (10 slides)

#### Day 17 — Wed May 7
- [ ] Pitch video recording (investor-style)
  - Who we are (you) + what it is + why it wins
  - Keep it under 3 minutes
  - Show product
- [ ] Upload to arena

#### Day 18 — Thu May 8
- [ ] Testimonials: reach out to 3-5 beta users for quotes
- [ ] Final polish on website
- [ ] Final bug sweep
- [ ] **Do dry run of full submission**

#### Day 19 — Fri May 9 ★ SUBMIT
- [ ] Morning: final review
- [ ] Afternoon: **SUBMIT**
- [ ] Evening: relax, do not touch code

#### Day 20-21 — Sat May 10 - Sun May 11
- [ ] Monitor for any submission issues
- [ ] Engage with Colosseum community
- [ ] Start preparing for potential accelerator interview

---

## Daily Routine (Suggested)

**Morning (3-4 hrs) — DEEP WORK**
- Smart contract / SDK coding
- No distractions

**Afternoon (2-3 hrs) — INTEGRATION**
- UI building
- Testing
- Debugging

**Evening (1-2 hrs) — OUTREACH / PROGRESS**
- Weekly update videos
- Twitter posts
- Discord engagement
- Reach out to potential users/partners
- Update docs

**Non-negotiables:**
- 1 commit per day minimum (demonstrates consistent work)
- 1 Twitter post per week about progress (builds audience)
- 1 weekly video update (visibility to judges)

---

## Scope Cut Triggers

If behind schedule, cut in this order:

1. **First to cut:** MCP plugin (nice-to-have, not critical for demo)
2. **Second:** Reputation score calculations (can fake for demo)
3. **Third:** Attestation schema (can show in docs, not in code)
4. **Fourth:** Registry search filtering (can be basic)
5. **Last resort:** Simplify to just Credential Program + basic dashboard + one demo

**Don't cut:**
- Core credential issuance flow
- One working end-to-end demo
- Demo video
- Pitch deck
- Submission

---

## Learning Resources (Use These in Order)

1. [Anchor Book](https://book.anchor-lang.com/) — Chapters 1-5
2. [Solana Cookbook](https://solanacookbook.com/) — reference
3. [Helius Developer Docs](https://docs.helius.dev/)
4. [x402 Protocol Docs](https://www.x402.org/)
5. [MCP SDK Docs](https://modelcontextprotocol.io/)

---

## Emergency Contacts

If stuck on specific things:

- **Anchor/Rust issue:** Solana Developers Discord, #anchor channel
- **x402 integration:** Coinbase dev forum + x402.org Discord
- **Privy / Wallet:** Privy support + their Discord
- **Helius RPC:** Helius support (very responsive)
- **Pitching / deck feedback:** Colosseum Discord, office hours

---

## What Success Looks Like at Each Checkpoint

### End of Day 3
- Hello world deployed ✅
- First real function in contract ✅
- Comfortable with Anchor basics

### End of Week 1
- Contracts deployed
- SDK alpha on npm
- Dashboard can issue sigils
- Weekly video posted
- Feeling confident

### End of Week 2
- Full end-to-end demo working
- 3 beta users have tried it
- Pitch deck draft done
- Bug list manageable

### End of Week 3
- Submitted
- Demo video polished
- Pitch deck final
- Website live
- 10+ inbound DMs about the project

---

## If Hackathon Goes Sideways

### Plan B (after Week 1 if behind)
- Scope cut: drop Registry Program, just ship Credential Program + SDK + demo
- Still valuable — KYA is the primitive

### Plan C (after Week 2 if still behind)
- Ship as "research preview" with partial functionality
- Focus pitch deck on the vision + what's shipped vs roadmap
- Can still place in Top 20

### Plan D (if everything breaks)
- Do NOT submit a half-broken product
- Pivot submission to a hackathon project that IS done
- You still have the research, still have the idea, can build post-hackathon

---

## Accountability

**Public commitments help:**
- Tweet daily about progress
- Commit daily to GitHub (visible contribution graph)
- Post weekly videos (hard to skip)
- Tell 3 friends you're doing this
