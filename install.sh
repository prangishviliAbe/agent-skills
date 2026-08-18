#!/usr/bin/env bash
# Install these skills for an AI agent runtime.
#
#   ./install.sh                    -> Codex        (~/.codex/skills)
#   ./install.sh claude             -> Claude Code  (~/.claude/skills)
#   ./install.sh antigravity        -> Antigravity  (~/.gemini/antigravity/skills)
#   ./install.sh all                -> the three above
#   ./install.sh ~/some/other/dir   -> any custom directory
#
# Each skill folder is replaced in full, so removed files do not linger.

set -euo pipefail

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET="${1:-codex}"

skills=()
for dir in "$SRC"/*/; do
  name="$(basename "$dir")"
  [ -f "$dir/SKILL.md" ] && skills+=("$name")
done

if [ ${#skills[@]} -eq 0 ]; then
  echo "No skills found in $SRC" >&2
  exit 1
fi

install_to() {
  local dest="$1"
  mkdir -p "$dest"
  for skill in "${skills[@]}"; do
    rm -rf "${dest:?}/$skill"
    cp -R "$SRC/$skill" "$dest/$skill"
    echo "  $skill"
  done
  echo "Installed ${#skills[@]} skills to $dest"
}

case "$TARGET" in
  codex)       install_to "$HOME/.codex/skills" ;;
  claude)      install_to "$HOME/.claude/skills" ;;
  antigravity) install_to "$HOME/.gemini/antigravity/skills" ;;
  all)
    install_to "$HOME/.codex/skills"
    install_to "$HOME/.claude/skills"
    install_to "$HOME/.gemini/antigravity/skills"
    ;;
  */*|~*|.*)
    # anything that looks like a path is used verbatim
    install_to "${TARGET/#\~/$HOME}"
    ;;
  *)
    echo "Unknown target: $TARGET" >&2
    echo "Usage: ./install.sh [codex|claude|antigravity|all|<path>]" >&2
    exit 1
    ;;
esac

echo "Start a new session so the updated metadata and triggers load."
