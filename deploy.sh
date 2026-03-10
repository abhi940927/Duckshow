#!/bin/bash
# 🦆 Duckshow Deploy Script
# Run this whenever you want to push changes to Vercel.
# Usage: ./deploy.sh "your commit message"

set -e  # Stop on any error

MSG=${1:-"chore: update and rebuild"}

echo ""
echo "🦆 DUCKSHOW DEPLOY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 1: Build the React client
echo "⚡ Step 1/3 — Building React app..."
npm install --prefix client --silent
npm run build --prefix client
echo "✅ Build complete!"
echo ""

# Step 2: Stage everything
echo "📦 Step 2/3 — Staging files..."
git add -A
git add -f client/dist/
echo "✅ Files staged!"
echo ""

# Step 3: Commit & Push
echo "🚀 Step 3/3 — Committing and pushing..."
git commit -m "$MSG" || echo "⚠️  Nothing new to commit."
git push
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Done! Vercel will redeploy in ~1-2 minutes."
echo "🌐 https://duckshow-1hsg.vercel.app"
echo ""
