# GitHub Repository Setup Guide

This guide walks you through setting up the GitHub repository with proper branching strategy and CI/CD.

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Repository name: `taalmeet-app`
3. Description: `Language exchange mobile app - Find partners nearby`
4. Visibility: **Private** (or Public if preferred)
5. **Do NOT** initialize with README, .gitignore, or license (we have our own)
6. Click "Create repository"

## Step 2: Initial Commit and Push

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "feat: Initial commit - Project structure with clean architecture"

# Add remote repository (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/taalmeet-app.git

# Push to main branch
git branch -M main
git push -u origin main
```

## Step 3: Create Development Branches

```bash
# Create and switch to develop branch
git checkout -b develop
git push -u origin develop

# Create and switch to staging branch
git checkout -b staging
git push -u origin staging

# Switch back to develop for future work
git checkout develop
```

## Step 4: Configure Branch Protection Rules

### For `main` branch:

1. Go to: **Settings** → **Branches** → **Add rule**
2. Branch name pattern: `main`
3. Enable:
   - ✅ Require a pull request before merging
     - Require approvals: **2**
     - Dismiss stale pull request approvals when new commits are pushed
   - ✅ Require status checks to pass before merging
     - Require branches to be up to date before merging
   - ✅ Require conversation resolution before merging
   - ✅ Do not allow bypassing the above settings
   - ✅ Require linear history
   - ✅ Include administrators

### For `develop` branch:

1. Add another rule for branch: `develop`
2. Enable:
   - ✅ Require a pull request before merging
     - Require approvals: **1**
   - ✅ Require status checks to pass before merging
   - ✅ Allow force pushes (admins only)
   - ✅ Include administrators

### For `staging` branch:

1. Add another rule for branch: `staging`
2. Enable:
   - ✅ Require a pull request before merging
     - Require approvals: **1**
   - ✅ Require status checks to pass before merging
   - ✅ Include administrators

## Step 5: Configure GitHub Secrets

Go to: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add the following secrets:

### Required Secrets:

- `EXPO_TOKEN` - Expo access token (get from https://expo.dev/accounts/[account]/settings/access-tokens)
- `CODECOV_TOKEN` - Codecov token (optional, for coverage reporting)

### Environment Secrets (for staging/production):

1. Go to: **Settings** → **Environments** → **New environment**
2. Create `staging` environment
3. Create `production` environment
4. Add environment-specific secrets:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`
   - `GOOGLE_MAPS_API_KEY`
   - `MAPBOX_ACCESS_TOKEN`
   - `SENTRY_DSN`
   - `MIXPANEL_TOKEN`

## Step 6: Update CODEOWNERS

Edit `.github/CODEOWNERS` and replace `@your-github-username` with actual GitHub usernames:

```
* @actual-username
/src/core/ @team-lead-username
/.github/ @devops-username
```

## Step 7: Verify CI/CD

1. Create a test feature branch:
   ```bash
   git checkout develop
   git checkout -b feature/test-ci
   ```

2. Make a small change (e.g., update README)

3. Commit and push:
   ```bash
   git add .
   git commit -m "test: Verify CI pipeline"
   git push origin feature/test-ci
   ```

4. Create a Pull Request to `develop`

5. Verify that CI workflows run:
   - Go to **Actions** tab
   - Check that workflows are triggered
   - Verify all checks pass

## Step 8: Workflow Overview

### Feature Development:

```bash
# 1. Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/user-authentication

# 2. Make changes and commit
git add .
git commit -m "feat: Add user authentication"

# 3. Push and create PR
git push origin feature/user-authentication
# Create PR to develop on GitHub

# 4. After PR approval and merge, delete branch
git checkout develop
git pull origin develop
git branch -d feature/user-authentication
```

### Release Process:

```bash
# 1. Create release branch from develop
git checkout develop
git pull origin develop
git checkout -b release/v1.0.0

# 2. Test and fix any issues
# 3. Merge to staging for final testing
git checkout staging
git merge release/v1.0.0
git push origin staging

# 4. After staging approval, merge to main
git checkout main
git merge release/v1.0.0
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin main --tags

# 5. Merge back to develop
git checkout develop
git merge release/v1.0.0
git push origin develop
```

### Hotfix Process:

```bash
# 1. Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug-fix

# 2. Fix the issue
git commit -m "fix: Critical bug fix"

# 3. Merge to main
git checkout main
git merge hotfix/critical-bug-fix
git push origin main

# 4. Merge to develop
git checkout develop
git merge hotfix/critical-bug-fix
git push origin develop
```

## Branch Naming Conventions

- **Features**: `feature/description` (e.g., `feature/user-profile`)
- **Bugfixes**: `bugfix/description` (e.g., `bugfix/login-error`)
- **Hotfixes**: `hotfix/description` (e.g., `hotfix/crash-fix`)
- **Releases**: `release/v1.x.x` (e.g., `release/v1.0.0`)

## Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <subject>

<body>

<footer>
```

Examples:
- `feat: Add user authentication`
- `fix: Resolve login crash on Android`
- `docs: Update API documentation`
- `refactor: Simplify matching algorithm`

## Troubleshooting

### CI/CD Not Running?

- Check that workflows are in `.github/workflows/` directory
- Verify YAML syntax is correct
- Check GitHub Actions tab for error messages
- Ensure secrets are configured

### Branch Protection Issues?

- Verify branch protection rules are set correctly
- Check that required status checks are configured
- Ensure you have proper permissions

### PR Not Merging?

- Check that all required checks pass
- Verify required approvals are met
- Ensure branch is up to date with target branch

## Additional Resources

- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)

