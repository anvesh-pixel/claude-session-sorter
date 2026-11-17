import type { Register } from 'claude-code'

// Origins that mean "the person typed this": terminal, phone/web bridge, desktop app (SDK host).
const USER_ORIGINS = new Set(['composer', 'bridge', 'sdk'])
const STORE_KEY = 'asked-sessions'
const KEEP = 500

const CONTEXT = [
  'session-sorter: this is the first prompt of a new session.',
  'Handle the request fully first. Then, as the LAST step of this turn (before wrap_up / your closing message),',
  'invoke the session-sorter skill (Skill tool; listed as `session-sorter:session-sorter` or `session-sorter`) and follow it: it skips silently if this session is already in a',
  'sidebar section or was started by another session, otherwise asks the user once which section to file it under.',
  'If no mcp__ccd_sidebar__* tools are listed or deferred (no sidebar), ignore this note entirely and say nothing about it.',
].join(' ')

export const register: Register = on => {
  on('prompt.submit', async ($, e, next) => {
    if (e.command || e.isMeta || !USER_ORIGINS.has(e.origin.kind)) {
      return next(e)
    }

    const turns = await $.session.turns()
    if (turns > 1) {
      return next(e)
    }

    const id = await $.session.id()
    const stored = await $.store.get(STORE_KEY)
    const asked = Array.isArray(stored) ? stored.filter(x => typeof x === 'string') : []
    if (asked.includes(id)) {
      return next(e)
    }

    await $.store.set(STORE_KEY, [...asked, id].slice(-KEEP))

    return next({ ...e, context: [...(e.context ?? []), CONTEXT] })
  }).catch(($, e, next) => next(e))
}
