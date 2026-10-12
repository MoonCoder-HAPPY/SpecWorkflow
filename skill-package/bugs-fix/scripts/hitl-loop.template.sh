#!/usr/bin/env bash
# Human-in-the-loop reproduction loop.
# Copy this file, edit the steps below, and run it.
# The agent runs the script; the user follows prompts in their terminal.
#
# Usage:
#   bash hitl-loop.template.sh --lang en
#   bash hitl-loop.template.sh --lang zh-CN
# SPEC_WORKFLOW_LANG can select the default; English remains the legacy default.
#
# Two helpers:
#   step "<instruction>"          -> show instruction, wait for Enter
#   capture VAR "<question>"      -> show question, read response into VAR
#
# At the end, captured values are printed as KEY=VALUE for the agent to parse.

set -euo pipefail

selected_lang="${SPEC_WORKFLOW_LANG:-en}"
if [[ "${1:-}" == "--lang" ]]; then
  selected_lang="${2:-}"
  shift "$(( $# >= 2 ? 2 : 1 ))"
fi
if [[ $# -ne 0 ]]; then
  printf 'Usage: bash hitl-loop.template.sh [--lang en|zh-CN]\n' >&2
  exit 2
fi

case "$selected_lang" in
  zh|zh-CN|zh-cn|zh-Hans)
    enter_prompt='    [完成后按 Enter] '
    open_instruction='打开 http://localhost:3000 并登录。'
    export_question="点击实际标为 'Export' 的按钮后是否报错？(y/n)"
    error_question="请输入错误原文；没有错误则输入 'none'："
    captured_label='采集结果'
    ;;
  en|en-US|en-GB)
    enter_prompt='    [Enter when done] '
    open_instruction='Open the app at http://localhost:3000 and sign in.'
    export_question="Click the 'Export' button. Did it throw an error? (y/n)"
    error_question="Paste the error message (or 'none'):"
    captured_label='Captured'
    ;;
  *)
    printf 'Unsupported language / 不支持的语言: %s (en, zh-CN)\n' "$selected_lang" >&2
    exit 2
    ;;
esac

step() {
  printf '\n>>> %s\n' "$1"
  read -r -p "$enter_prompt" _
}

capture() {
  local var="$1" question="$2" answer
  printf '\n>>> %s\n' "$question"
  read -r -p "    > " answer
  printf -v "$var" '%s' "$answer"
}

# --- edit below ---------------------------------------------------------

step "$open_instruction"

capture ERRORED "$export_question"

capture ERROR_MSG "$error_question"

# --- edit above ---------------------------------------------------------

printf '\n--- %s ---\n' "$captured_label"
printf 'ERRORED=%s\n' "$ERRORED"
printf 'ERROR_MSG=%s\n' "$ERROR_MSG"
