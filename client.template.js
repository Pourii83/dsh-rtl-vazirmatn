/**
 * Browser half of the RTL + Vazirmatn bundle.
 *
 * Two direction modes:
 * - `full`: `dir="rtl"` on the document, so the whole interface mirrors.
 * - `chat`: only the transcript and the composer text field mirror. The
 *   conversation header, the composer's button row, the sidebar, settings,
 *   and the rest of DSH keep their normal left-to-right order.
 * - `off`: no mirrored layout (the typeface still applies).
 *
 * The sidebar-foot switch cycles the modes and remembers the choice per
 * browser. The stylesheet pins technical surfaces back to left-to-right,
 * mirrors markdown indents, and repairs host chrome that is positioned with
 * physical left/right values.
 *
 * Regeneration: `tools/build-client.ps1` inlines the bundled WOFF2 face into
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
     * Full-mode scope: the whole document.
     */
    const FULL = 'html[dir="rtl"]'
    /**
     * Chat-mode scopes: the message column, and the composer's text field.
     * Both are stable host attributes, so the header and the button row stay
     * out of the mirrored region.
     */
    const CHAT_FLOW = 'html[data-dsh-rtl="chat"] [data-chat-flow]'
    const CHAT_INPUT = 'html[data-dsh-rtl="chat"] [data-input-scroll]'
    /** Mirrored transcript text and everything inside it. */
    const RTL_CONTENT = `:is(${FULL}, ${CHAT_FLOW})`
    /** Mirrored text-field content and everything inside it. */
    const RTL_INPUT = `:is(${FULL}, ${CHAT_INPUT})`
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
   transcript and the text field alone: the header and the composer's button
   row are left untouched on purpose. */
${CHAT_FLOW},
${CHAT_INPUT} {
  direction: rtl;
}

/* Technical content keeps left-to-right reading order in either mode. */
${RTL_CONTENT} :is(pre, pre *, code, kbd, samp, .xterm, .monaco-editor) {
  direction: ltr;
  unicode-bidi: isolate;
  text-align: left;
}

${RTL_INPUT} :is(code, kbd, samp) {
  direction: ltr;
  unicode-bidi: isolate;
}

/* Markdown lists and block quotes mirror their physical indents. */
${RTL_CONTENT} :where(ul, ol) {
  padding-left: 0;
  padding-right: 18px;
}

${RTL_CONTENT} :where(ul, ol) :where(ul, ol) {
  padding-right: 18px;
}

${RTL_CONTENT} blockquote {
  margin-left: 0;
  margin-right: 0;
  padding-left: 0;
  padding-right: 14px;
  border-left: 0;
  border-right: 2px solid var(--dsw-alias-border-l2);
}

/* Text field: the caret and the placeholder start on the right, and the
   input's own scrollbar moves to the side it occupies. */
${RTL_INPUT} .GRgSLq_input {
  padding: 4px 14px 0 8px;
}

${RTL_INPUT} .GRgSLq_placeholder {
  inset: 4px 14px auto 8px;
}

html[dir="rtl"] [data-input-scroll],
html[data-dsh-rtl="chat"] [data-input-scroll] {
  margin-left: 4px;
  margin-right: 0;
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

/* Tool-call and disclosure headers read from the right. */
${RTL_CONTENT} .F07MqG_header,
${RTL_CONTENT} .DXuOLW_header {
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
     * Select a direction mode.
     * @param next - `full`, `chat`, or `off`.
     */
    function chooseMode(next) {
      mode = next
      rememberMode(next)
      syncMode()
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
      chat: 'Chat transcript and input are right-to-left — click to turn layout mirroring off',
      off: 'Left-to-right — click for the whole interface right-to-left',
    }

    /**
     * Compact sidebar-foot switch that cycles the three direction modes. Full
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
