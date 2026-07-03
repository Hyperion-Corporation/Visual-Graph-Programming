# github/ — Automation Suite

Non-GitHub-native automation logic for the project board and CI/CD lifecycle.
`.github/` holds what GitHub itself must find (workflows, issue/PR templates,
Dependabot config); `github/` holds everything *we* wrote to drive it.

```
github/
├── scripts/
│   ├── sync_backlog.py       # ROADMAP.md/CHANGELOG.md -> Gemini -> ProjectV2 diff
│   ├── agent_tools.py        # LLM-callable GraphQL primitives (create/transition/close)
│   └── check_commit_ref.py   # Commit-message ticket-ref checker, called by hooks/post-commit
├── hooks/
│   ├── pre-commit / post-commit   # POSIX shell, symlinked into .git/hooks/
│   ├── post-commit.bat            # Windows equivalent
│   └── install.sh                 # One-time opt-in installer
└── config/
    ├── project_labels.json    # Canonical component/priority/status/agent label taxonomy
    └── automation_rules.yaml  # Conflict-resolution policy, LLM settings, circuit breaker
```

Dependencies for `scripts/` and the `hooks/pre-commit` config-validation step
live in the repo-root `pyproject.toml`, under the `ci` optional-dependency
group (not a standalone `requirements.txt`).

## Git hook integration strategy

Git will never auto-run hooks shipped inside a cloned repo — `.git/hooks/`
is local and untracked by design, for security. So the scripts in
`github/hooks/` are **not** live until a contributor opts in, once, per
clone:

```bash
bash github/hooks/install.sh
```

This symlinks `github/hooks/pre-commit` and `github/hooks/post-commit` into
`.git/hooks/`. Symlinks (not copies) are used deliberately: `git pull`
updates to the hook logic take effect immediately, with no re-install step.
Windows contributors without a POSIX shell can instead point Git's
`core.hooksPath` at `github/hooks` and rely on `post-commit.bat`:

```powershell
git config core.hooksPath github/hooks
```

- **pre-commit** — fast, local-only: validates `project_labels.json` /
  `automation_rules.yaml` so a broken config never silently disables
  downstream automation.
- **post-commit** — parses the just-made commit message for a ticket
  reference (patterns configured in `automation_rules.yaml`) and, if
  `GITHUB_TOKEN` + `VGP_PROJECT_ID` are set in the environment, best-effort
  transitions that ticket on the board via `agent_tools.py`. It is
  fail-open by design: a network hiccup here must never block a commit
  that has already been made.

## Runtime dependencies

```bash
pip install -e ".[ci]"
```

`GITHUB_TOKEN` (repo + project scopes) and `GEMINI_API_KEY` are required
for `sync_backlog.py`; the GitHub Actions workflow (`.github/workflows/agent_sync.yml`)
injects these from repository secrets.
