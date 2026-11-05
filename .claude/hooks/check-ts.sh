#!/usr/bin/env bash
# PostToolUse (Edit|Write): lint the edited file and typecheck the project.
# Exit 2 sends the errors back to Claude so it fixes them.
file=$(jq -r '.tool_input.file_path // empty')
case "$file" in
  *.ts|*.tsx|*.mts|*.js|*.mjs) ;;
  *) exit 0 ;;
esac
cd "$CLAUDE_PROJECT_DIR" || exit 0
out=$(npx eslint --quiet "$file" 2>&1) || { echo "$out" >&2; exit 2; }
out=$(npm run -s typecheck 2>&1) || { echo "$out" | head -40 >&2; exit 2; }
exit 0
