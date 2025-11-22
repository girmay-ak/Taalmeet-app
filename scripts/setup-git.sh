#!/bin/bash

# Git Repository Setup Script
# This script helps set up the initial git repository and branches

set -e

echo "🚀 Setting up Git repository for TaalMeet..."

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing git repository..."
    git init
else
    echo "✅ Git repository already initialized"
fi

# Check if remote exists
if git remote | grep -q "^origin$"; then
    echo "⚠️  Remote 'origin' already exists"
    read -p "Do you want to update it? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter GitHub repository URL: " REPO_URL
        git remote set-url origin "$REPO_URL"
    fi
else
    read -p "Enter GitHub repository URL: " REPO_URL
    git remote add origin "$REPO_URL"
fi

# Stage all files
echo "📝 Staging all files..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "feat: Initial commit - Project structure with clean architecture" || {
    echo "⚠️  No changes to commit or commit already exists"
}

# Set main branch
echo "🌿 Setting up main branch..."
git branch -M main

# Push main branch
echo "📤 Pushing main branch..."
git push -u origin main || {
    echo "⚠️  Failed to push. Make sure the repository exists on GitHub."
    exit 1
}

# Create develop branch
echo "🌿 Creating develop branch..."
git checkout -b develop
git push -u origin develop

# Create staging branch
echo "🌿 Creating staging branch..."
git checkout -b staging
git push -u origin staging

# Switch back to develop
echo "🔄 Switching back to develop branch..."
git checkout develop

echo ""
echo "✅ Git setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Configure branch protection rules on GitHub (see GITHUB_SETUP.md)"
echo "2. Add GitHub secrets for CI/CD (see GITHUB_SETUP.md)"
echo "3. Update CODEOWNERS with actual usernames"
echo ""
echo "🌿 Current branch: develop"
echo "📚 See GITHUB_SETUP.md for detailed instructions"

