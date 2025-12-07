#!/bin/bash
set -euo pipefail

# Only run in Claude Code remote (web) sessions
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# SessionStart hook for .github repository
# This repository contains GitHub profile and workflow configuration files.
# No dependencies need to be installed.

# Verify the environment is ready
echo "Session environment ready for .github repository"
