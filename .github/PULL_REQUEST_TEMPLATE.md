### Summary
<!-- What does this PR do and why? Link the ticket it closes, e.g. "Closes #42". -->

### Component Mapping
<!-- Check every component this PR touches, so agent_sync.yml routes it to
     the correct ProjectV2 board column(s). Must match github/config/project_labels.json. -->
- [ ] `component:graph-engine`
- [ ] `component:text-sync`
- [ ] `component:ui-canvas`
- [ ] `component:lsp-bridge`
- [ ] `component:cli`
- [ ] `component:ci-automation`
- [ ] `component:docs`

### Agent-Verification-Checklist
<!-- Paste actual command output below each item, not just a checkmark.
     A blank/unfilled entry will be treated by reviewers as "not run". -->
- [ ] Linting passed
  ```text
  <paste lint output here>
  ```
- [ ] Type checks passed
  ```text
  <paste type-check output here>
  ```
- [ ] Automated tests passed
  ```text
  <paste test summary here>
  ```
- [ ] Manually verified the golden path (describe below)
  <!-- e.g. "Loaded a 500-node graph, toggled text-sync, confirmed no drift" -->

### Ticket Reference
<!-- e.g. "Refs: #42" or "VGP-42" -- required for github/hooks/post-commit
     board automation to pick this up. See github/config/automation_rules.yaml. -->
Refs: #
