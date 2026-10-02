# DISPATCH — Reviewer Code QA

## Assignment
You are the teamwork_preview_reviewer for the Matcha House Delhi rebuild project.

## Working Directory
`/Users/iyumriba/Documents/antigravity/Matcha House Delhi/.agents/teamwork/reviewer_code_qa/`

## Source of Truth Files to Read
1. `/Users/iyumriba/Documents/antigravity/Matcha House Delhi/.agents/teamwork/ORIGINAL_REQUEST.md` (read completely)
2. `/Users/iyumriba/Documents/antigravity/Matcha House Delhi/PROJECT.md`
3. `/Users/iyumriba/Documents/antigravity/Matcha House Delhi/TEST_READY.md`
4. `/Users/iyumriba/Documents/antigravity/Matcha House Delhi/.agents/teamwork/worker_implementation/handoff.md`
5. `/Users/iyumriba/Documents/antigravity/Matcha House Delhi/.agents/teamwork/test_writer_track/handoff.md`

## Objectives
1. **Independent Verification**: Run the automated test suite (`python3 tests/e2e_test_suite.py`) and verify that all 22 tests pass with exit code 0.
2. **Hero Immutability Check**: Verify lines 45–52 of `index.html` are strictly preserved byte-for-byte (364 bytes, SHA-256 `fdbd20f70c1fd43b3355bd704d15321568c43ee92782059a21141d265a84932b`).
3. **Completeness & Standards**:
   - Verify all 32 menu items are present.
   - Verify category tabs, badges, oat milk toggle (+₹80).
   - Verify WhatsApp CTAs for orders, table booking, masterclass, loyalty club.
   - Verify Schema.org LocalBusiness JSON-LD syntax and OpenGraph tags.
   - Verify zero console errors, zero syntax errors, and zero broken internal anchors.
4. Output your formal review verdict (APPROVE or REQUEST_CHANGES) with supporting evidence to:
   `/Users/iyumriba/Documents/antigravity/Matcha House Delhi/.agents/teamwork/reviewer_code_qa/handoff.md`

## 2026-10-02T23:00:00Z
Read /Users/iyumriba/Documents/antigravity/Matcha House Delhi/.agents/teamwork/reviewer_code_qa/DISPATCH.md and /Users/iyumriba/Documents/antigravity/Matcha House Delhi/.agents/teamwork/ORIGINAL_REQUEST.md.
Your working directory is /Users/iyumriba/Documents/antigravity/Matcha House Delhi/.agents/teamwork/reviewer_code_qa/
Your identity is reviewer_code_qa (teamwork_preview_reviewer).
Run python3 tests/e2e_test_suite.py, verify hero immutability (364 bytes, SHA-256 fdbd20f70c1fd43b3355bd704d15321568c43ee92782059a21141d265a84932b), check 32 items, WhatsApp funnels, SEO JSON-LD, console errors, and code quality. Provide formal review verdict (APPROVE or REQUEST_CHANGES) in handoff.md. Send a message to orchestrator when finished.

