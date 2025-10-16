#!/usr/bin/env bash
set -euo pipefail

CONTEXT_FILE="${CLAUDE_PLUGIN_ROOT}/hooks/NUXTUI.md"

if [ -f "$CONTEXT_FILE" ]; then
    CONTEXT_CONTENT=$(cat "$CONTEXT_FILE")
    jq -n --arg context "$CONTEXT_CONTENT" '{
      "hookSpecificOutput": {
        "hookEventName": "SessionStart",
        "additionalContext": $context
      }
    }'
fi
