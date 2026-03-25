# Contributing to @bajzik/scoped-console

Thank you for considering contributing! Here's how to get started.

## Setup
```bash
git clone https://github.com/bajzik/scoped-console.git
cd scoped-console
pnpm install
```

## Development
```bash
pnpm dev        # watch mode
pnpm build      # build
pnpm test:run   # run tests
pnpm lint       # lint
```

## Submitting changes

1. Fork the repo
2. Create a branch: `git checkout -b fix/your-fix` or `feat/your-feature`
3. Make your changes
4. Make sure tests pass: `pnpm test:run`
5. Open a Pull Request targeting `master`

## Commit style

Use conventional commits:
- `fix: description` — bug fixes
- `feat: description` — new features
- `chore: description` — maintenance
- `docs: description` — documentation
- `test: description` — tests

## Reporting bugs

Use the [bug report template](https://github.com/bajzik/scoped-console/issues/new?template=bug_report.md).