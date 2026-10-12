# Current-Host Goal Discovery

Use this built-in fallback when a host is new/unlisted, its capability is
unverified, the installed version or execution surface differs from the
catalog, a documented entry is absent, official sources conflict, or an
activation response indicates the wrong command/tool contract. Research the
host actually running this conversation. Do not invoke an external research
skill, external orchestration system, or a different Agent to substitute for it.
This does not override platform-required documentation or tool-control skills.

Use local `bilingual-output.md` for human findings and imported workflow fields.
Preserve official command/UI labels, source quotes, tool schemas and actual
API state values; do not translate a payload or infer approval from a localized
display. Save discovery prose in the chosen language without altering scope.

## Identify The Actual Host

Identify product, execution surface (CLI, IDE, desktop, web, cloud, SDK),
installed version when available, and exposed tools/commands. Use session
metadata, the tool schema, trusted installed help/version information, and
read-only command menus/configuration. A model/provider name or an installer's
alias is not host identity: an OpenAI-compatible model inside another client
does not make that client Codex. CLI and IDE editions can have different APIs.
For ACP or another bridge, record both the frontend and underlying agent
harness. Model tools belong to that harness, while user commands/forms may
depend on frontend support. An external agent's Goal feature does not establish
the editor's built-in Agent support or every bridge client's availability.

Keep credential/token/account-secret fields out of captures. Do not read or
print an entire authentication/configuration file to discover one capability.
If the product is discoverable, investigate it rather than asking the user.
Ask only when the host/surface genuinely cannot be identified from available
evidence, not because it is missing from the bundled catalog.

## Research Before Falling Back

1. Inspect exposed tool definitions and locally available official help or
   command menus. These establish what the current session can actually call.
   A tool name alone is insufficient: inspect inputs, authority requirements,
   output/state fields, limits, and whether it acts on the current session.
2. Search the identified product's official documentation for `goal`,
   `autopilot`, `autonomous`, `long-running`, `continue`, `loop`, `Ralph`, and
   equivalent product-specific terms. Find its official documentation index,
   command reference, and relevant release notes rather than guessing URLs or
   borrowing commands from another product. Read the primary page/code, not
   only search snippets or a third-party summary.
3. If documentation does not resolve it, read the product's official source or
   documented SDK/extension contract. Distinguish a core/official optional
   feature from an independently installed community plugin. Inspect the
   actual local plugin/version before claiming that an optional loop exists.
4. Establish the full executable contract: how to start, how to prove active
   execution and identify this spec, how another turn is admitted, how to
   complete/block/cancel, how user pause/resume and restarts behave, what limits
   apply, and which actions the model can take versus only the human UI.
   A user-triggered Start/Resume may admit only one ordinary run; verify
   automatic continuation after a reply rather than inferring it from a durable
   objective, a running process, or an active status. State-only Goal support is
   not enough to offer persistent unattended execution.
5. Reconcile conflicts against current-session tool schemas, installed-version
   documentation/code, and actual read-only state. Preserve unresolved facts as
   unverified; do not average conflicting defaults or call an old page current.
   Distinguish product rollout/account availability from documented support.

Research is read-only and bounded to the current-host question. Do not start a
test goal, install a plugin, register a hook, change approval settings, launch
another CLI/cloud task, or mutate a live goal merely to discover support.
Read-only local sources remain useful when network access is unavailable. If
neither local contracts nor primary sources can establish a usable mechanism,
record the concrete evidence/access limit and stop that discovery attempt.
Lack of a search result or a failed URL does not prove that a feature is absent.

## Persist The Discovered Contract

Save current-host findings under the existing requirement directory:

```text
.spec-workflow/<feature-slug>/research/agent-runtime.md
```

If no feature directory exists yet, use
`.spec-workflow/agent-runtime-discovery/research/<host-slug>.md`; reuse or link
it when the requirement directory is resolved. Do not write discovery notes
into production code, test directories, dependencies, or global skill folders.
Do not rewrite this installed skill or its bundled catalog automatically.

Include:

- Host product, surface, version/rollout information, date, and session scope.
- Official URLs or local official source/help locations actually read, with
  short supporting quotes and any source conflicts/access failures.
- Capability status: `verified-current`, `conditional`, `unverified`, or
  `explicitly-unsupported-by-current-contract`. Never infer the last status
  solely from missing search results.
- Backend candidate: `native-goal`, an existing verified `host-loop`, or none.
- Exact entry point/tool argument schema, prerequisites and authority, and
  whether a user composer/UI action is needed.
- Activation/state/identity evidence, continuation driver, completion mechanism,
  pause/cancel/resume/restart rules, and host limits versus repair-cycle budget.
- Discovery limitations, safe next action, and later real activation outcome
  or a pointer to `implementation-report.md` containing that outcome.

Reuse a matching discovery record only after comparing its host/surface/version,
tool schema, prerequisites, and readable current state. Re-research on mismatch,
contradiction, or an invalid entry; do not treat a prior success or check date
as timeless support. The record is evidence, never execution authorization.

## Apply The Result Without Expanding Authorization

Before the final Goal choice, use the verified current contract to explain and
offer the actual backend/start action. Finish this research during readiness;
do not activate a goal to finish collecting requirements.

For an already authorized run, first inspect available read-only goal/run state
after an activation error: a lost response might conceal a successful start.
Never create a duplicate or overwrite another spec's run. A discovered spelling
or schema correction can be applied under the same authorization only when the
host, current session, backend, objective/version/anchor, limits, commit policy,
authority, and side effects still match. Read back to verify it.

Changing backend, launching elsewhere, enabling a plugin/hook, broadening
permissions, extending limits, or changing executable scope requires the
appropriate new explicit choice before action. Do not treat "research this
tool's Goal mode" as permission to perform those changes. Existing user-paused
goals and host blockers remain in effect during research.

If no usable persistent mechanism can be verified after current-host research,
report the exact limit and offer explicitly labeled session-only execution or
staged execution. Do not invent a `/goal` command, call ordinary auto-approval
a goal, declare that Goal is active, or silently downgrade a selected backend.

Differentiate activation-contract failures from ordinary permission denials,
authentication/usage limits, and transient service failures. The latter follow
the host's recovery/approval rules; research cannot bypass them. If a corrected
entry fails for the same reason, record it and wait for the necessary host/user
action rather than endlessly researching, retrying creates, or changing tools.
