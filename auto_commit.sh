#!/usr/bin/env bash

# Exit on error
set -e

# Set to "true" to actually run commands
RUN=true

# Get today's date in YYYY-MM-DD format
DATE=$(date +%F)

BRANCH_NAME="markdowns_${DATE}"
COMMIT_MSG="auto markdowns update ${DATE}"

run_cmd() {
  if [ "$RUN" = true ]; then
    echo "Running: $*"
    eval "$@"
  else
    echo "$@"
  fi
}

run_cmd git fetch origin
run_cmd git switch -c "$BRANCH_NAME" origin/main
run_cmd git add .
run_cmd git commit -am "\"$COMMIT_MSG\""
# run_cmd git push -u origin HEAD
# run_cmd git branch -d "$BRANCH_NAME"