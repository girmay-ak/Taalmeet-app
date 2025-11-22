# GitHub Configuration

This directory contains GitHub-specific configuration files for the TaalMeet project.

## Structure

```
.github/
├── workflows/              # GitHub Actions workflows
│   ├── ci.yml             # Continuous Integration pipeline
│   ├── cd-staging.yml     # Staging deployment
│   ├── cd-production.yml  # Production deployment
│   └── branch-protection.yml # Branch protection checks
├── ISSUE_TEMPLATE/        # Issue templates
│   ├── bug_report.md      # Bug report template
│   └── feature_request.md # Feature request template
├── CODEOWNERS             # Code ownership assignments
├── CONTRIBUTING.md        # Contributing guidelines
└── PULL_REQUEST_TEMPLATE.md # PR template
```

## Workflows

### CI Pipeline (`ci.yml`)

Runs on:
- Pull requests to `develop`, `staging`, `main`
- Pushes to `develop`, `staging`

Jobs:
- **Lint & Type Check**: Runs ESLint and TypeScript type checking
- **Test**: Runs test suite with coverage
- **Build Android**: Builds Android debug APK
- **Build iOS**: Builds iOS app for simulator

### Staging Deployment (`cd-staging.yml`)

Runs on:
- Pushes to `staging` branch
- Manual workflow dispatch

Actions:
- Runs tests
- Builds app for staging environment
- Deploys to staging

### Production Deployment (`cd-production.yml`)

Runs on:
- Pushes to `main` branch
- Version tags (`v*`)
- Manual workflow dispatch

Actions:
- Runs full test suite
- Linting and type checking
- Builds production app
- Creates GitHub release
- Deploys to production

## Branch Protection

The `branch-protection.yml` workflow validates that:
- No direct PRs to `main` (must use release branches)
- Feature branches merge to `develop` first
- Proper branch naming conventions

## Issue Templates

### Bug Report

Use for reporting bugs. Includes:
- Bug description
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots/logs

### Feature Request

Use for suggesting new features. Includes:
- Feature description
- Problem statement
- Proposed solution
- Use cases
- Technical considerations

## Pull Request Template

The PR template ensures:
- Clear description of changes
- Type of change identified
- Testing completed
- Checklist verified
- Related issues linked

## CODEOWNERS

Defines code ownership for automatic PR review requests. Update with actual GitHub usernames.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed contribution guidelines.

## Setup

See [GITHUB_SETUP.md](../../GITHUB_SETUP.md) for complete setup instructions.

