# session-sorter

A Claude Code mod that keeps the desktop app's Code-tab sidebar organized. After Claude finishes its first response in a new session, it asks once which sidebar section the session belongs in, based on what the session is about:

1. **Recommended section** — an existing section that fits (listed first when one fits)
2. **New: &lt;suggested name&gt;** — creates that section and files the session there (listed first when nothing existing fits)
3. **No section** — leaves the session where it is
4. **Other** — type your own setup: a custom section name, a rename, anything

Nothing moves without your answer. It stays quiet when the session is already in a section, was started by another session, or there is no sidebar (terminal CLI).

To re-sort a session at any time, invoke the `session-sorter` skill (e.g. ask Claude to "run session-sorter").

## Install

At the prompt of a terminal session:

```
/plugin install session-sorter --marketplace anvesh-pixel/claude-session-sorter
```

From a shell:

```bash
claude plugin install session-sorter --marketplace anvesh-pixel/claude-session-sorter
```

In the desktop app, where `/plugin` does not run: click **+** next to the prompt box, then **Plugins**, **Add marketplace** with `anvesh-pixel/claude-session-sorter`, then **Add plugin**.

## How it works

- `hooks/register.ts` — a `prompt.submit` hook that, on the first prompt of a new session, attaches a note telling Claude to run the sorter after it has handled the request.
- `skills/session-sorter/SKILL.md` — the procedure: read the sidebar sections, recommend one, ask, then file the session with the app's sidebar tools.
