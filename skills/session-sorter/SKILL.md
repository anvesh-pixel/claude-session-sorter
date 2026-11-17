---
name: session-sorter
description: File the current Code-tab session into a sidebar section by its genre. Runs automatically at the end of the first response in a new session (via the plugin's hook); invoke it manually to re-sort the current session.
---

# Session sorter

Ask the user once where to file this session in the Code-tab sidebar, then do it. Never move the session without their answer.

When triggered automatically, this runs AFTER the first request is fully handled: finish the user's request, then run these steps as the last thing in the turn (before `wrap_up` / the closing message). When invoked manually, run them right away.

## Steps

0. **Skip checks (silent — say nothing about the sorter if any applies):**
   - No `mcp__ccd_sidebar__*` tools in your tool list or deferred-tool list (terminal CLI, no sidebar) → skip. Don't spend a ToolSearch to find out.
   - Automatic run only: call `mcp__ccd_session_mgmt__get_session` with `"self"`. Skip if `group` is not null (already filed — e.g. created straight into a section) or if `parentSessionId` is set (started by another session; it belongs with its parent's work). A manual `/session-sorter` run ignores these two checks.
1. Call `mcp__ccd_sidebar__list_sections`. Only `kind: "manual"` sections are genre sections; ignore the built-ins (`pinned`, `routines`, `sessions`). If it fails (no app window), skip silently.
2. From the request, what you did, and the session's folder/project, decide the session's genre, then pick ONE recommendation:
   - an existing manual section that clearly fits, or
   - a new section, when nothing fits. Name it by genre: 1–3 words, Title Case (e.g. "Web Dev", "Video", "Finance"). Never a near-duplicate of an existing one.
   Always also have a new-section name ready (it is option 2 even when an existing section is recommended).
3. Call `AskUserQuestion` once, header `Section`, question `Move this session into a sidebar section?`, single-select, options in this order:
   - **Existing section recommended:**
     1. `<Existing name> (Recommended)` — "Fits the work in this session."
     2. `New: <Suggested name>` — "Create this section and move the session into it."
     3. `No section` — "Leave the session where it is."
   - **New section recommended:**
     1. `New: <Suggested name> (Recommended)` — "Create this section and move the session into it."
     2. `<Closest existing name>` — only if any manual section exists; otherwise omit.
     3. `No section` — "Leave the session where it is."
   - Option 4, **Other**, is the dialog's built-in free-text choice: don't add it yourself, and add no other options.
4. Act on the answer:
   - Existing section → `mcp__ccd_sidebar__move_sessions` with `session_ids: ["self"]`, `section_id: <its id>`.
   - New section → `mcp__ccd_sidebar__create_section` with the suggested name, then `move_sessions` into the returned id.
   - No section → do nothing.
   - Other (free text) → do what the user described: their own section name (reuse if it exists, else create), a rename (`mcp__ccd_sidebar__rename_section`), or any other setup. If unclear, ask one follow-up.
5. Confirm in one short line (e.g. "Filed under Web Dev.").
