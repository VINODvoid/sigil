# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 0.x     | Yes       |

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Email: security@sigil.protocol

Include:
- A description of the vulnerability and its potential impact
- Steps to reproduce
- Any proof-of-concept or exploit code (if applicable)

You will receive an acknowledgement within 48 hours. If the issue is confirmed, we will coordinate a fix and disclosure timeline with you.

## Scope

In scope:
- Smart contract logic (programs/credential, programs/registry, programs/reputation)
- TypeScript SDK (`@sigil/sdk`)
- x402 middleware (`@sigil/x402`)
- Authentication and authorization flows

Out of scope:
- Third-party dependencies (report directly to their maintainers)
- Issues requiring physical access to infrastructure
- Social engineering attacks

## Responsible Disclosure

We follow a 90-day disclosure window from the date of initial report.
