/**
 * Browser half of the RTL + Vazirmatn bundle.
 *
 * Two layout modes:
 * - `full`: `dir="rtl"` on the document, so the whole interface mirrors.
 * - `chat`: only the transcript and the composer text field mirror. The
 *   conversation header, the composer's button row, the sidebar, settings,
 *   and the rest of DSH keep their normal left-to-right order.
 * - `off`: no mirrored chrome (the typeface still applies).
 *
 * Independently of the layout mode, chat content follows the script of the
 * text it holds: Persian (and other RTL scripts) render right-to-left, English
 * renders left-to-right. The direction of a block comes from the letters that
 * make it up, not from its first character, so a Persian sentence that starts
 * with an English term stays RTL and an English log line that quotes a
 * Persian name stays LTR.
 *
 * The sidebar-foot switch cycles the layout modes and remembers the choice
 * per browser. The stylesheet pins technical surfaces back to left-to-right,
 * mirrors markdown indents, and repairs host chrome that is positioned with
 * physical left/right values.
 *
 * Regeneration: `tools/build-client.mjs` inlines the bundled WOFF2 face into
 * the @font-face source and writes `client.js`.
 */
window.__ModuleLoader__.load({
  id: '@local/dsh-rtl-vazirmatn',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const PLUGIN_ID = '@local/dsh-rtl-vazirmatn'
    const STORAGE_KEY = `${PLUGIN_ID}:mode`
    const LEGACY_KEY = `${PLUGIN_ID}:direction`
    const MODES = ['full', 'chat', 'off']
    /**
     * Full-mode scope: the whole document. Chat-mode base direction: the
     * transcript column only.
     */
    const FULL = 'html[dir="rtl"]'
    const CHAT_FLOW = 'html[data-dsh-rtl="chat"] [data-chat-flow]'
    /** Content roots the automatic direction engine runs inside. */
    const CONTENT_ROOTS =
      '[data-conversation-content], [data-chat-flow], [data-trajectory-scroll]'
    /** Subtrees that keep their own direction (technical content and editors). */
    const EXCLUDED =
      'pre, code, kbd, samp, textarea, input, script, style, [data-input-scroll], [data-composer-card], [contenteditable="true"]'
    /** Rows and text blocks that receive a direction of their own. */
    const UNIT_SELECTOR = [
      '[data-chat-node-key]',
      '[data-trajectory-row-key]',
      '[data-step-process]',
      'p',
      'li',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'blockquote',
      'figcaption',
      'dt',
      'dd',
      'td',
      'th',
    ].join(', ')
    const UNIT_QUERY = `:is(${CONTENT_ROOTS}) :is(${UNIT_SELECTOR})`
    const CSS = `/* Vazirmatn 33.0.3, bundled variable face (SIL Open Font License 1.1). */
@font-face {
  font-family: "Vazirmatn";
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url(data:font/woff2;base64,__VAZIRMATN_BASE64__) format("woff2");
}

/* Interface and conversation text use Vazirmatn. The theme composes
   --dsw-font-family from --dsh-font-family-text, so overriding the variable
   reaches every surface; code and terminal keep their monospace stacks. */
:root,
body {
  --dsh-font-family-text: "Vazirmatn", "Segoe UI", Tahoma, system-ui, sans-serif !important;
  --dsw-font-family: "Vazirmatn", "Segoe UI", Tahoma, system-ui, sans-serif !important;
}

/* Full mode drives the document direction. Chat-only mode mirrors the
   transcript; the header and the composer's button row stay untouched. The
   script then assigns each block its own direction, so Persian text is RTL
   and English text is LTR inside either shell direction. */
${CHAT_FLOW} {
  direction: rtl;
}

/* Technical content keeps left-to-right reading order wherever it sits inside
   a right-to-left block. */
:is([dir="rtl"], html[data-dsh-rtl="chat"] [data-chat-flow]) :is(pre, pre *, code, kbd, samp, .xterm, .monaco-editor) {
  direction: ltr;
  unicode-bidi: isolate;
  text-align: left;
}

/* Markdown indents follow the direction the block actually computes, so an
   English paragraph inside a right-to-left transcript keeps left-aligned
   bullets and a Persian paragraph gets mirrored ones. */
:dir(rtl) :where(ul, ol) {
  padding-left: 0;
  padding-right: 18px;
}

:dir(rtl) :where(ul, ol) :where(ul, ol) {
  padding-right: 18px;
}

:dir(rtl) blockquote {
  margin-left: 0;
  margin-right: 0;
  padding-left: 0;
  padding-right: 14px;
  border-left: 0;
  border-right: 2px solid var(--dsw-alias-border-l2);
}

/* The composer text field follows its own content: the padding and the
   scrollbar clearance move to the side the caret starts on. */
[data-input-scroll][dir="rtl"] {
  margin-left: 4px;
  margin-right: 0;
}

[data-input-scroll][dir="rtl"] .GRgSLq_input {
  padding: 4px 14px 0 8px;
}

[data-input-scroll][dir="rtl"] .GRgSLq_placeholder {
  inset: 4px 14px auto 8px;
}

/* Full mode only: the composer's trailing controls reach the inline end
   through a physical auto margin, which strands the send button mid-row once
   the direction flips. */
html[dir="rtl"] .GRgSLq_trailing:not(.GRgSLq_trailingActive) {
  margin-left: 0;
  margin-right: auto;
}

html[dir="rtl"] .GRgSLq_retry {
  margin-left: 0;
  margin-right: 8px;
}

html[dir="rtl"] .an3WzG_scrollBody {
  margin-left: 2px;
  margin-right: 0;
}

html[dir="rtl"] .an3WzG_composerSeat {
  left: var(--dsh-scrollbar-width);
  right: 0;
}

/* Tool-call and disclosure headers read from the right when their own content
   is right-to-left, and stay left-aligned for English rows. */
:is(.F07MqG_header, .DXuOLW_header):dir(rtl) {
  text-align: right;
}

/* Sidebar-foot direction switch, beside Settings. */
.rtl-vazirmatn-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 8px;
  border: 0;
  border-radius: var(--dsw-radius-sm, 8px);
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  white-space: nowrap;
  cursor: pointer;
}

.rtl-vazirmatn-toggle:hover {
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-primary);
}

.rtl-vazirmatn-toggle:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 1px;
}

.rtl-vazirmatn-toggle > svg {
  flex: none;
  display: block;
}

/* Windows custom titlebar: the sidebar's collapse and new-session buttons are
   pinned to the physical left edge by the shipped sidebar sheet, so mirror
   them to keep them attached to the sidebar. These class names track the
   shipped sidebar build and simply stop matching if it is rebuilt. */
html[dir="rtl"][data-windows-titlebar] .wtg9ga_toggle {
  left: auto;
  right: 12px;
}

html[dir="rtl"][data-windows-titlebar] .wtg9ga_collapsed .wtg9ga_newSession {
  left: auto;
  right: 48px;
}
`

    /* ── Script-based direction ─────────────────────────────────────────── */

    /**
     * Whether a code unit belongs to a script written right-to-left: Hebrew,
     * Arabic (which covers Persian), Syriac, and their presentation forms.
     * @param code - UTF-16 code unit.
     * @returns true for an RTL letter.
     */
    function isRtlLetter(code) {
      return (
        (code >= 0x0590 && code <= 0x05ff) ||
        (code >= 0x0600 && code <= 0x06ff) ||
        (code >= 0x0700 && code <= 0x074f) ||
        (code >= 0x0750 && code <= 0x077f) ||
        (code >= 0x08a0 && code <= 0x08ff) ||
        (code >= 0xfb1d && code <= 0xfdff) ||
        (code >= 0xfe70 && code <= 0xfeff)
      )
    }

    /**
     * Whether a code unit is a Latin letter, including the accented ranges
     * used by European languages.
     * @param code - UTF-16 code unit.
     * @returns true for a Latin letter.
     */
    function isLatinLetter(code) {
      return (
        (code >= 0x0041 && code <= 0x005a) ||
        (code >= 0x0061 && code <= 0x007a) ||
        (code >= 0x00c0 && code <= 0x024f)
      )
    }

    /**
     * Pick a direction from the letters a block is made of, rather than from
     * its first character: a block is RTL when RTL letters are at least half
     * of its letters. A Persian sentence that opens with an English term stays
     * RTL; an English line that quotes a Persian phrase stays LTR.
     * @param text - the block's visible text.
     * @returns `rtl`, `ltr`, or null when the text carries no letters at all.
     */
    function readDirection(text) {
      let rtl = 0
      let latin = 0
      const length = Math.min(text.length, 20000)
      for (let i = 0; i < length; i += 1) {
        const code = text.charCodeAt(i)
        if (isRtlLetter(code)) rtl += 1
        else if (isLatinLetter(code)) latin += 1
      }
      if (rtl === 0 && latin === 0) return null
      if (rtl === 0) return 'ltr'
      if (latin === 0) return 'rtl'
      return rtl >= latin ? 'rtl' : 'ltr'
    }

    /** requestAnimationFrame with a timer fallback for non-window hosts. */
    const scheduleFrame =
      typeof requestAnimationFrame === 'function'
        ? (callback) => requestAnimationFrame(callback)
        : (callback) => setTimeout(callback, 16)
    /** Cancel the matching scheduled frame. */
    const cancelFrame =
      typeof cancelAnimationFrame === 'function'
        ? (id) => cancelAnimationFrame(id)
        : (id) => clearTimeout(id)

    const pendingUnits = new Set()
    let unitFrame = 0
    let composerFrame = 0

    /**
     * Give one row or text block the direction its own text asks for, and
     * leave host-set attributes alone.
     * @param unit - candidate element.
     */
    function applyUnit(unit) {
      if (!unit.isConnected) return
      if (unit.closest(EXCLUDED) !== null) return
      if (unit.hasAttribute('dir') && !unit.hasAttribute('data-auto-dir')) return
      const direction = readDirection(unit.textContent || '')
      if (direction === null) {
        if (unit.hasAttribute('data-auto-dir')) {
          unit.removeAttribute('dir')
          unit.removeAttribute('data-auto-dir')
        }
        return
      }
      if (unit.getAttribute('data-auto-dir') !== direction) {
        unit.setAttribute('data-auto-dir', direction)
        unit.setAttribute('dir', direction)
      }
    }

    /** Apply every queued unit in one frame. */
    function flushUnits() {
      for (const unit of pendingUnits) applyUnit(unit)
      pendingUnits.clear()
    }

    /** Schedule one frame that applies the queued units. */
    function requestUnitFlush() {
      if (unitFrame !== 0) return
      unitFrame = scheduleFrame(() => {
        unitFrame = 0
        flushUnits()
      })
    }

    /**
     * Queue a unit when it is inside a content root and outside the technical
     * subtrees that keep their own direction.
     * @param unit - candidate element.
     */
    function markUnit(unit) {
      if (!(unit instanceof Element)) return
      if (unit.closest(EXCLUDED) !== null) return
      if (unit.closest(CONTENT_ROOTS) === null) return
      pendingUnits.add(unit)
      requestUnitFlush()
    }

    /**
     * Queue the units affected by one changed DOM node: the rows and blocks
     * around it (so a growing message re-evaluates) and the units inside it
     * (so a newly rendered subtree is covered).
     * @param target - changed node.
     */
    function markChangedNode(target) {
      if (!(target instanceof Element)) return
      let unit = target.closest(UNIT_SELECTOR)
      let depth = 0
      while (unit !== null && depth < 6) {
        markUnit(unit)
        unit = unit.parentElement === null ? null : unit.parentElement.closest(UNIT_SELECTOR)
        depth += 1
      }
      for (const inner of target.querySelectorAll(UNIT_SELECTOR)) markUnit(inner)
    }

    /**
     * Point the composer's text field at the script of its draft. An empty
     * field falls back to the layout mode's own direction.
     */
    function syncComposer() {
      const fallback = mode === 'off' ? 'ltr' : 'rtl'
      for (const scroll of document.querySelectorAll('[data-input-scroll]')) {
        const editable = scroll.querySelector('[data-composer-input]')
        const text = editable === null ? '' : editable.textContent || ''
        const direction = readDirection(text) ?? fallback
        if (scroll.getAttribute('dir') !== direction) {
          scroll.setAttribute('dir', direction)
          scroll.setAttribute('data-auto-dir', direction)
        }
      }
    }

    /** Schedule one frame that re-reads the composer draft. */
    function requestComposerSync() {
      if (composerFrame !== 0) return
      composerFrame = scheduleFrame(() => {
        composerFrame = 0
        syncComposer()
      })
    }

    /**
     * Watch the page for content changes and keep their direction current.
     * Attribute changes are not observed, so writing `dir` here never feeds
     * back into the observer.
     * @param ctx - owning Client plugin context.
     */
    function installAutoDirection(ctx) {
      ctx.effect(() => {
        const observer = new MutationObserver((records) => {
          for (const record of records) {
            if (record.type === 'characterData') {
              const parent = record.target.parentElement
              if (parent === null) continue
              if (parent.closest('[data-input-scroll]') !== null) requestComposerSync()
              else markChangedNode(parent)
              continue
            }
            for (const node of record.addedNodes) {
              const element = node.nodeType === 1 ? node : node.parentElement
              if (element === null) continue
              if (element.closest('[data-input-scroll]') !== null) requestComposerSync()
              else markChangedNode(element)
            }
          }
        })
        observer.observe(document.body, {
          childList: true,
          characterData: true,
          subtree: true,
        })
        for (const unit of document.querySelectorAll(UNIT_QUERY)) markUnit(unit)
        flushUnits()
        syncComposer()
        return () => {
          observer.disconnect()
          if (unitFrame !== 0) cancelFrame(unitFrame)
          if (composerFrame !== 0) cancelFrame(composerFrame)
          unitFrame = 0
          composerFrame = 0
          pendingUnits.clear()
          for (const element of document.querySelectorAll('[data-auto-dir]')) {
            element.removeAttribute('data-auto-dir')
            element.removeAttribute('dir')
          }
        }
      }, 'rtl-vazirmatn: automatic content direction')
    }

    /* ── Layout modes ───────────────────────────────────────────────────── */

    /**
     * Read the remembered mode; the whole interface is right-to-left unless
     * the browser stored another mode (including the earlier rtl/ltr value).
     * @returns the stored mode, or `full` when nothing usable is stored.
     */
    function readMode() {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY)
        if (MODES.includes(stored)) return stored
        const legacy = window.localStorage.getItem(LEGACY_KEY)
        if (legacy === 'ltr') return 'off'
        if (legacy === 'rtl') return 'full'
        return 'full'
      } catch {
        return 'full'
      }
    }

    /** Remember the chosen mode for this browser. */
    function rememberMode(value) {
      try {
        window.localStorage.setItem(STORAGE_KEY, value)
      } catch {
        // Storage can be unavailable (private mode, policy); the choice then
        // lasts for this page only.
      }
    }

    let mode = 'full'
    let rootElement = null
    let baselineDir = null
    const subscribers = new Set()

    /** Apply the current mode to the document, restoring the previous direction when off. */
    function syncMode() {
      if (rootElement === null) return
      if (mode === 'full') {
        rootElement.setAttribute('dir', 'rtl')
        rootElement.setAttribute('data-dsh-rtl', 'full')
        return
      }
      if (baselineDir === null) rootElement.removeAttribute('dir')
      else rootElement.setAttribute('dir', baselineDir)
      if (mode === 'chat') rootElement.setAttribute('data-dsh-rtl', 'chat')
      else rootElement.removeAttribute('data-dsh-rtl')
    }

    /**
     * Select a layout mode.
     * @param next - `full`, `chat`, or `off`.
     */
    function chooseMode(next) {
      mode = next
      rememberMode(next)
      syncMode()
      requestComposerSync()
      for (const notify of subscribers) notify()
    }

    /** The mode after this one, in switch order. */
    function nextMode() {
      return MODES[(MODES.indexOf(mode) + 1) % MODES.length]
    }

    /**
     * Install the bundle stylesheet as a package-owned style element so the
     * module system can evict it with this entry and cleanup removes it.
     * @param ctx - owning Client plugin context.
     */
    function installStyles(ctx) {
      ctx.effect(() => {
        const tag = document.createElement('style')
        tag.dataset.plugin = PLUGIN_ID
        tag.dataset.pluginCss = `${PLUGIN_ID}/rtl-vazirmatn.css`
        tag.textContent = CSS
        document.head.appendChild(tag)
        return () => {
          tag.remove()
        }
      }, 'rtl-vazirmatn: stylesheet')
    }

    /**
     * Own the document direction for the lifetime of this entry, restoring the
     * value found before activation when the entry is disabled or reloaded.
     * @param ctx - owning Client plugin context.
     */
    function installDirection(ctx) {
      ctx.effect(() => {
        const root = document.documentElement
        const before = root.getAttribute('dir')
        rootElement = root
        baselineDir = before
        syncMode()
        return () => {
          if (before === null) root.removeAttribute('dir')
          else root.setAttribute('dir', before)
          root.removeAttribute('data-dsh-rtl')
          rootElement = null
        }
      }, 'rtl-vazirmatn: document direction')
    }

    /** Short label naming the layout the current mode produces. */
    const MODE_LABELS = { full: 'RTL', chat: 'Chat RTL', off: 'LTR' }

    /** Tooltip describing the current state and the next click. */
    const MODE_TITLES = {
      full: 'Whole interface is right-to-left — click for a right-to-left chat only',
      chat: 'Chat is right-to-left — click to turn layout mirroring off',
      off: 'Interface is left-to-right — click to mirror the whole interface',
    }

    /**
     * Compact sidebar-foot switch that cycles the three layout modes. Full
     * columns show the mode label beside the icon; the rail shows the icon.
     * @param props - sidebar footer action props (only `wide` matters here).
     * @returns the switch button.
     */
    function DirectionSwitch({ wide }) {
      const [current, setCurrent] = React.useState(() => mode)
      React.useEffect(() => {
        const notify = () => setCurrent(mode)
        subscribers.add(notify)
        notify()
        return () => {
          subscribers.delete(notify)
        }
      }, [])
      const title = MODE_TITLES[current] ?? MODE_TITLES.full
      const label = MODE_LABELS[current] ?? MODE_LABELS.full
      const mirrored = current !== 'off'
      return h(
        'button',
        {
          type: 'button',
          className: 'rtl-vazirmatn-toggle',
          'aria-pressed': mirrored ? 'true' : 'false',
          'aria-label': title,
          title,
          onClick: () => chooseMode(nextMode()),
        },
        h(
          'svg',
          {
            viewBox: '0 0 16 16',
            width: 16,
            height: 16,
            'aria-hidden': true,
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: 1.5,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
          },
          h('path', { d: mirrored ? 'M13 4H5' : 'M3 4h8' }),
          h('path', { d: mirrored ? 'M13 8H7' : 'M3 8h6' }),
          h('path', { d: mirrored ? 'M10 12.5H4' : 'M6 12.5h6' }),
          h('path', { d: mirrored ? 'M6.5 10L4 12.5l2.5 2.5' : 'M9.5 10L12 12.5l-2.5 2.5' }),
        ),
        wide ? h('span', { 'aria-hidden': true }, label) : null,
      )
    }

    return {
      inject: ['slots'],
      apply(ctx) {
        if (typeof document === 'undefined') return
        mode = readMode()
        installDirection(ctx)
        installStyles(ctx)
        installAutoDirection(ctx)
        ctx.slots.inject('sidebar.footer.action', () =>
          ctx.slots.register(
            {
              name: 'sidebar.footer.action',
              id: 'rtl-vazirmatn',
              order: 5,
              label: 'Text direction',
            },
            DirectionSwitch,
          ),
        )
      },
    }
  },
})
