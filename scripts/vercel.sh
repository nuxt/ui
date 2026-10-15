#!/bin/bash

echo "VERCEL_ENV: $VERCEL_ENV"
echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

# Each release branch (v2, v3, v4, v5...) is the production branch of its own Vercel project,
# so don't build it as a preview of another project
if [[ "$VERCEL_ENV" != "production" && "$VERCEL_GIT_COMMIT_REF" =~ ^v[0-9]+$ ]] ; then
  echo "🛑 - Build cancelled"
  exit 0;

else
  echo "✅ - Build can proceed"
  exit 1;
fi
