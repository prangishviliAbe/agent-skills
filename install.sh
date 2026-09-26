#!/usr/bin/env bash
# Usage: ./install.sh [codex|claude|antigravity|all|<path>] [--dry-run]
# Stages every skill before replacing any. Keeps backups outside active skills.
# A transaction covers one destination; `all` processes destinations in order.
set -euo pipefail
SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
TARGET="${1:-codex}"
DRY_RUN=0
if [ "$TARGET" = --dry-run ]; then TARGET=codex; DRY_RUN=1; fi
if [ "${2:-}" = --dry-run ]; then DRY_RUN=1; elif [ "$#" -gt 1 ]; then echo 'Unknown option.' >&2; exit 1; fi
if [ "$#" -gt 2 ]; then echo 'Too many arguments.' >&2; exit 1; fi
TARGET="${TARGET//\\//}"
windows_bash=0
case "$(uname -s)" in MINGW*|MSYS*|CYGWIN*) windows_bash=1 ;; esac

# Normalize through any existing parent without creating a directory. A user may
# intentionally install below an OS-provided symlink such as macOS /var. Parent
# traversal is refused because lexical normalization changes symlink semantics.
absolute_path() {
  local value="$1" part result='' candidate base suffix='' drive rest
  local parts=()
  value="${value//\\//}"
  case "/$value/" in */../*) echo "Parent traversal is not supported: $1" >&2; return 1 ;; esac
  case "$value" in
    /*|[A-Za-z]:/*) ;;
    *) value="$PWD/$value" ;;
  esac
  case "$value" in
    [A-Za-z]:/*)
      drive="${value%%:*}"
      rest="${value#?:}"
      drive="$(printf '%s' "$drive" | tr '[:upper:]' '[:lower:]')"
      value="/$drive$rest"
      ;;
  esac
  local old_ifs="$IFS"; IFS='/'; read -r -a parts <<< "$value"; IFS="$old_ifs"
  for part in "${parts[@]}"; do
    case "$part" in ''|.) continue ;; ..) result="${result%/*}" ;; *) result="$result/$part" ;; esac
  done
  candidate="${result:-/}"
  base="$candidate"
  while [ ! -d "$base" ]; do
    part="${base##*/}"
    suffix="/$part$suffix"
    base="${base%/*}"
    [ -n "$base" ] || base=/
  done
  base="$(cd -P -- "$base" && pwd -P)"
  if [ "$windows_bash" = 1 ]; then base="$(cygpath -ma "$base")"; fi
  printf '%s%s\n' "$base" "$suffix"
}
within() { [ "$2" = "$1" ] || [[ "$2" == "$1/"* ]]; }
SRC="$(absolute_path "$SRC")"
skills=()
for dir in "$SRC"/*/; do
  [ -f "$dir/SKILL.md" ] || continue
  name="$(basename "$dir")"
  [[ "$name" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]] || { echo "Invalid skill name: $name" >&2; exit 1; }
  [ ! -L "${dir%/}" ] || { echo "Linked skill: $dir" >&2; exit 1; }
  [ -f "$dir/agents/openai.yaml" ] || { echo "Missing metadata: $name" >&2; exit 1; }
  [ -z "$(find "$dir" -type l -print -quit)" ] || { echo "Linked source resource: $dir" >&2; exit 1; }
  skills+=("$name")
done
[ "${#skills[@]}" -gt 0 ] || { echo 'No skills found.' >&2; exit 1; }

install_to() (
  dest="$(absolute_path "$1")"
  if [ "$dest" = / ] || { [ "$windows_bash" = 1 ] && [[ "$dest" =~ ^([A-Za-z]:/|/[A-Za-z])$ ]]; } || within "$SRC" "$dest" || within "$dest" "$SRC"; then
    echo 'Source and destination must not overlap, and destination must not be a filesystem root.' >&2; exit 1
  fi
  for skill in "${skills[@]}"; do
    [ ! -L "$dest/$skill" ] || { echo "Linked destination skill: $dest/$skill" >&2; exit 1; }
    if [ -e "$dest/$skill" ] && [ ! -d "$dest/$skill" ]; then echo "Destination skill is not a directory: $dest/$skill" >&2; exit 1; fi
  done
  if [ "$DRY_RUN" = 1 ]; then printf 'Would replace %s skills in %s\n' "${#skills[@]}" "$dest"; exit 0; fi
  mkdir -p "$dest"
  lock="$dest/.agent-skills-install.lock"
  if ! mkdir "$lock" 2>/dev/null; then
    echo "Cannot acquire installation lock at $lock. If interrupted, inspect the backup and confirm the prior process stopped before removing it." >&2; exit 1
  fi
  stage=''; backup=''; committed=0
  installed=(); saved=()
  cleanup() {
    status="${1:-$?}"
    trap - EXIT HUP INT TERM
    if [ "$committed" = 0 ]; then
      for skill in "${installed[@]}"; do
        [ ! -L "$dest/$skill" ] && within "$dest" "$dest/$skill" && rm -rf -- "$dest/$skill" || status=1
      done
      for skill in "${saved[@]}"; do
        if [ ! -e "$dest/$skill" ] && [ ! -L "$dest/$skill" ]; then
          mv -- "$backup/$skill" "$dest/$skill" || status=1
        else
          echo "Restore target already exists: $dest/$skill; recover manually from $backup" >&2; status=1
        fi
      done
      [ -z "$backup" ] || echo "Recovery backup: $backup" >&2
    fi
    if [ -n "$stage" ] && [ -d "$stage" ] && [ ! -L "$stage" ]; then rm -rf -- "$stage" || status=1; fi
    if [ -n "${lock:-}" ] && [ -d "$lock" ] && [ ! -L "$lock" ]; then rm -rf -- "$lock" || status=1; fi
    exit "$status"
  }
  trap cleanup EXIT
  trap 'exit 130' INT
  trap 'exit 143' HUP TERM
  parent="$(dirname "$dest")"
  if ! stage="$(mktemp -d "$parent/.agent-skills-stage-XXXXXXXX")"; then cleanup 1; fi
  backup_parent="$(absolute_path "$parent/.agent-skills-backups")"
  if ! mkdir -p "$backup_parent"; then cleanup 1; fi
  if ! backup="$(mktemp -d "$backup_parent/$(date -u +%Y%m%dT%H%M%SZ)-XXXXXXXX")"; then cleanup 1; fi
  for skill in "${skills[@]}"; do
    if ! cp -Rp -- "$SRC/$skill" "$stage/$skill"; then cleanup 1; fi
    if ! diff -qr -- "$SRC/$skill" "$stage/$skill" >/dev/null; then cleanup 1; fi
  done
  for skill in "${skills[@]}"; do
    [ ! -L "$dest/$skill" ] || { echo "Destination changed to a link: $skill" >&2; exit 1; }
    if [ -e "$dest/$skill" ]; then
      if ! mv -- "$dest/$skill" "$backup/$skill"; then cleanup 1; fi
      saved+=("$skill")
    fi
    if ! mv -- "$stage/$skill" "$dest/$skill"; then cleanup 1; fi
    installed+=("$skill")
  done
  committed=1
  printf 'Installed %s skills to %s\nPrevious versions: %s\n' "${#skills[@]}" "$dest" "$backup"
)

codex_base="${CODEX_HOME:-$HOME/.codex}"
case "$TARGET" in
  codex) install_to "$codex_base/skills" ;;
  claude) install_to "$HOME/.claude/skills" ;;
  antigravity) install_to "$HOME/.gemini/antigravity/skills" ;;
  all)
    install_to "$codex_base/skills"
    install_to "$HOME/.claude/skills"
    install_to "$HOME/.gemini/antigravity/skills"
    ;;
  */*|~*|.*) install_to "${TARGET/#\~/$HOME}" ;;
  *) echo "Unknown target: $TARGET. Use codex, claude, antigravity, all, or a path." >&2; exit 1 ;;
esac
if [ "$DRY_RUN" = 0 ]; then echo 'Codex discovers updated skills on the next turn. Reload other runtimes if their skill list is cached.'; fi
