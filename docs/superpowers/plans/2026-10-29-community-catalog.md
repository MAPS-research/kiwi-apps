# Kiwi Apps Community Catalog Implementation Plan

> **For agentic workers:** Use the agreed conversational design and execute these tasks in the existing new repository. Documentation may be written in parallel with catalog tooling; review the whole repository before delivery.

**Goal:** Create a standalone local `kiwi-apps` Git repository for community listings without certification.

**Architecture:** Contributors retain app source, hosting, releases, and support in their own repositories. One YAML file per app is the catalog source; a JSON Schema and local/CI validator check metadata only. The initial catalog is empty and a fictional submission example lives outside it.

**Tech Stack:** Node.js 24 recommended, npm, YAML, JSON Schema, GitHub Actions.

**Spec:** The user approved the repository structure and PR contribution process described in this chat, then explicitly requested local creation. This plan records that approved scope; it does not add a marketplace or installer.

## Global Constraints

- Work only in `/Users/hw3242/Projects/Kiwi/kiwi-apps`; this new repository is isolated from the existing framework.
- No GitHub repository creation, remote configuration, publication, or app installation.
- No fictitious catalog listings, verification badges, security scores, or compatibility claims from CI.
- Preserve the distinction between public listings and a deployment's administrator approval, registration secrets, scopes, and class enablement.
- Write original English and Simplified Chinese documentation, with MIT licensing for this repository's own material; upstream app licenses remain independent.

## Review Focus

- Malformed YAML, duplicate keys, missing metadata, and unknown fields must fail with useful errors.
- YAML filenames must match stable slugs and duplicate identities must fail.
- Examples must validate but must never become real catalog listings.
- Commands must work in a fresh checkout and CI must validate data without fetching or executing submitted apps.
- Documentation must accurately describe schema fields, commands, manual admission checks, and the current empty catalog.

### Task 1: Catalog tooling

**Files:** `package.json`, `package-lock.json`, `.nvmrc`, `.gitignore`, `schemas/catalog.schema.json`, `examples/study-coach.yaml`, `catalog/.gitkeep`, `scripts/validate-catalog.mjs`, `tests/catalog.test.mjs`.

**Interfaces:** `npm run validate` validates the catalog and submission example; `npm test` runs behavioral tests; `npm run check` runs both. CLI positional arguments select a catalog directory and optional example file for testing. Node 20.14+ is sufficient for tooling; Node 24 is the recommended runtime.

- [x] Write CLI tests using temporary directories for valid/empty catalogs, bad metadata, malformed YAML, duplicate keys, duplicate slugs, filename mismatch, unsupported files, and invalid examples; observe failure before implementation.
- [x] Implement the schema, safe data-only validator, and example; install and lock dependencies.
- [x] Run tests and validate the actual repository.

### Task 2: Community documentation and workflow

**Files:** `README.md`, `README.zh-CN.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `LICENSE`, `.github/PULL_REQUEST_TEMPLATE.md`, `.github/ISSUE_TEMPLATE/*`, `.github/workflows/validate.yml`.

**Interfaces:** Documentation describes the exact catalog fields established in Task 1. Workflow runs `npm ci --ignore-scripts` and `npm run check` with read-only repository permissions on pull requests and pushes. Contributors edit YAML and add bilingual README rows in the same PR; no generator is needed for this initial directory.

- [x] Write bilingual directory pages, contribution/maintenance rules, example-copy instructions, licensing and templates.
- [x] Add CI using supported checkout/setup-node actions and validate its YAML locally.
- [x] Check local Markdown links and compare documented fields with the schema.

### Task 3: Review and delivery

- [x] Obtain an independent review of scope, tooling, workflow, and docs; fix material findings.
- [x] Run a clean install, the complete checks, and Git whitespace/status checks.
- [x] Create the initial local commit if the user's existing Git identity is configured. Do not publish or add a remote.
- [x] Report the repository path, validation outcome, and empty-catalog status.

## Verification record

- Clean npm installation from the committed lockfile succeeded.
- Original 25 behavioral tests passed on Node 20.14 and Node 25.8.
- Independent review identified malformed HTTPS host/port acceptance in generic URI validation. Four regression cases reproduced it; the shared URL format now also uses Node's URL parser.
- Final suite: 29 tests passed; the empty catalog and separate fictional example validated.
- All 21 local Markdown links resolved; workflow and both issue forms parsed as YAML.
- GitHub Actions is configured but has not run remotely; this is a local-only repository.
