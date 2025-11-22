# Contributing to TaalMeet

Thank you for your interest in contributing to TaalMeet! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## Development Workflow

### 1. Setup

```bash
# Fork and clone the repository
git clone https://github.com/your-username/taalmeet-app.git
cd taalmeet-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.development
# Edit .env.development with your credentials
```

### 2. Create a Branch

Always create a new branch from `develop`:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
# or
git checkout -b bugfix/issue-description
```

### 3. Make Changes

- Follow the existing code style
- Write clear, self-documenting code
- Add comments for complex logic
- Update documentation as needed
- Write tests for new functionality

### 4. Test Your Changes

```bash
# Run linter
npm run lint

# Type check
npm run type-check

# Run tests
npm test

# Test on device/simulator
npm run start:dev
```

### 5. Commit Your Changes

Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: Add user profile editing"
git commit -m "fix: Resolve navigation crash"
git commit -m "docs: Update setup instructions"
```

### 6. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request to `develop` branch.

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define types/interfaces for all data structures
- Avoid `any` type - use `unknown` if needed
- Use strict mode

### Code Style

- Follow ESLint and Prettier configurations
- Use meaningful variable and function names
- Keep functions small and focused
- Follow SOLID principles

### File Organization

- Follow the existing folder structure
- One component/function per file
- Group related files together
- Use index files for clean imports

### Testing

- Write unit tests for business logic
- Write integration tests for critical flows
- Aim for >80% code coverage
- Test edge cases and error scenarios

## Pull Request Guidelines

### Before Submitting

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] Type checking passes
- [ ] Documentation updated
- [ ] No console.log() statements
- [ ] Branch is up to date with develop

### PR Description

- Clear description of changes
- Link to related issues
- Screenshots for UI changes
- Testing instructions
- Breaking changes documented

## Issue Reporting

### Bug Reports

Use the bug report template and include:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots/logs

### Feature Requests

Use the feature request template and include:
- Problem statement
- Proposed solution
- Use cases
- Mockups/designs (if applicable)

## Questions?

- Open an issue for questions
- Check existing documentation
- Review closed issues/PRs

Thank you for contributing! 🎉

