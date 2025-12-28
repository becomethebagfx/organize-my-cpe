#!/bin/bash
# Organize My CPE - Deployment Script

set -e

echo "==================================="
echo "Organize My CPE - Deploy to Production"
echo "==================================="

# Check for required environment variables
check_env() {
  local var_name=$1
  if [ -z "${!var_name}" ]; then
    echo "ERROR: $var_name is not set"
    return 1
  fi
  echo "✓ $var_name is set"
}

echo ""
echo "Checking environment variables..."
echo ""

MISSING=0
check_env "DATABASE_URL" || MISSING=1
check_env "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" || MISSING=1
check_env "CLERK_SECRET_KEY" || MISSING=1
check_env "STRIPE_SECRET_KEY" || MISSING=1
check_env "STRIPE_PRICE_ID" || MISSING=1
check_env "OPENAI_API_KEY" || MISSING=1

if [ $MISSING -eq 1 ]; then
  echo ""
  echo "Please set all required environment variables before deploying."
  echo ""
  echo "Required variables:"
  echo "  DATABASE_URL                        - PostgreSQL connection string"
  echo "  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY   - From dashboard.clerk.com"
  echo "  CLERK_SECRET_KEY                    - From dashboard.clerk.com"
  echo "  STRIPE_SECRET_KEY                   - From dashboard.stripe.com"
  echo "  STRIPE_PRICE_ID                     - price_1SjRlJCncK0NQAfvKTjhkewE (or create new)"
  echo "  OPENAI_API_KEY                      - From platform.openai.com"
  echo ""
  exit 1
fi

echo ""
echo "All environment variables set!"
echo ""

# Run tests
echo "Running tests..."
npm run test

# Run linting
echo "Running linting..."
npm run lint

# Run type checking
echo "Running type check..."
npm run typecheck

# Build the application
echo "Building application..."
npm run build

# Push database schema
echo "Pushing database schema..."
npx prisma db push

# Seed database if empty
echo "Seeding database..."
npx prisma db seed || echo "Database may already be seeded"

echo ""
echo "==================================="
echo "Build successful! Ready for deployment."
echo "==================================="
echo ""
echo "Deploy with one of these commands:"
echo ""
echo "  Vercel:    vercel deploy --prod"
echo "  Railway:   railway up"
echo "  Docker:    docker build -t organize-my-cpe . && docker run -p 3000:3000 organize-my-cpe"
echo ""
