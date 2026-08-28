window.__ModuleLoader__.load({
  id: 'dsh-deepseek-girl-pet',
  factory: (require) => {
    const module = { exports: {} }
    const exports = module.exports
    const React = require('react')
    const PLUGIN_ID = 'dsh-deepseek-girl-pet'
    const STYLE_ID = `${PLUGIN_ID}/overlay`

    if (document.querySelector(`style[data-plugin-css="${STYLE_ID}"]`) === null) {
      const tag = document.createElement('style')
      tag.dataset.plugin = PLUGIN_ID
      tag.dataset.pluginCss = STYLE_ID
      tag.textContent = `
        .dsg-pet {
          --dsg-scale: 1.15;
          --dsg-y: 0px;
          position: absolute;
          right: 18px;
          bottom: 124px;
          width: calc(192px * var(--dsg-scale));
          height: calc(208px * var(--dsg-scale));
          padding: 0;
          border: 0;
          border-radius: 18px;
          background: transparent;
          cursor: zoom-in;
          filter: drop-shadow(0 10px 16px rgb(0 0 0 / 36%));
          transition: width 180ms ease, height 180ms ease, filter 180ms ease;
          z-index: 1;
        }
        .dsg-pet[data-large="true"] {
          --dsg-scale: 1.5;
          cursor: zoom-out;
          z-index: 3;
        }
        .dsg-pet[data-mode="running"] { --dsg-y: -1456px; }
        .dsg-pet[data-mode="waiting"] { --dsg-y: -1248px; }
        .dsg-sprite {
          display: block;
          width: 192px;
          height: 208px;
          background-image: url('/deepseek-girl-pet/spritesheet.webp');
          background-repeat: no-repeat;
          background-size: 1536px 2288px;
          background-position: 0 var(--dsg-y);
          transform: scale(var(--dsg-scale));
          transform-origin: left top;
          animation: dsg-six-frames 1.7s step-end infinite;
        }
        .dsg-pet[data-mode="running"] .dsg-sprite { animation-duration: 900ms; }
        .dsg-pet[data-mode="waiting"] .dsg-sprite { animation-duration: 1.35s; }
        .dsg-pet[data-looking="true"] .dsg-sprite {
          animation: none;
          background-position: var(--dsg-look-x) var(--dsg-look-y);
        }
        .dsg-status {
          position: absolute;
          right: 8px;
          bottom: -28px;
          max-width: 184px;
          overflow: hidden;
          padding: 5px 10px;
          border: 1px solid var(--dsw-alias-border-l2);
          border-radius: 999px;
          color: var(--dsw-alias-text-secondary);
          background: color-mix(in srgb, var(--dsw-alias-bg-base) 88%, transparent);
          font: 12px/1.2 system-ui, sans-serif;
          text-overflow: ellipsis;
          white-space: nowrap;
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 150ms ease, transform 150ms ease;
          pointer-events: none;
        }
        .dsg-pet:hover .dsg-status,
        .dsg-pet:focus-visible .dsg-status {
          opacity: 1;
          transform: translateY(0);
        }
        .dsg-pet:focus-visible {
          outline: 2px solid var(--dsw-alias-border-l3);
          outline-offset: 4px;
        }
        @keyframes dsg-six-frames {
          0%, 16.66% { background-position: 0 var(--dsg-y); }
          16.67%, 33.32% { background-position: -192px var(--dsg-y); }
          33.33%, 49.99% { background-position: -384px var(--dsg-y); }
          50%, 66.65% { background-position: -576px var(--dsg-y); }
          66.66%, 83.32% { background-position: -768px var(--dsg-y); }
          83.33%, 99.99% { background-position: -960px var(--dsg-y); }
          100% { background-position: 0 var(--dsg-y); }
        }
        @media (max-width: 760px) {
          .dsg-pet { --dsg-scale: .9; right: 8px; bottom: 106px; }
          .dsg-pet[data-large="true"] { --dsg-scale: 1.2; }
        }
        @media (prefers-reduced-motion: reduce) {
          .dsg-pet, .dsg-status { transition: none; }
          .dsg-sprite { animation: none; }
        }
      `
      document.head.appendChild(tag)
    }

    function selectCurrentId(state) {
      return state.current
    }

    function selectRunning(state) {
      const current = state.current === undefined ? undefined : state.byId[state.current]
      return current?.running === true
    }

    function DeepSeekPet(props) {
      const currentId = props.useSessions(selectCurrentId)
      const running = props.useSessions(selectRunning)
      // Harness 0.1.2-alpha.1 moved pending interactions out of the session
      // summary into a dedicated snapshot map.
      const pending = props.useSessionPendingInteraction(
        currentId === undefined ? () => undefined : (map) => map.get(currentId),
      )
      const mode = pending !== undefined ? 'waiting' : running ? 'running' : 'idle'
      const [large, setLarge] = React.useState(false)
      const [lookIndex, setLookIndex] = React.useState(null)
      const buttonRef = React.useRef(null)

      React.useEffect(() => {
        if (mode !== 'idle') {
          setLookIndex(null)
          return undefined
        }

        let idleTimer
        const handlePointerMove = (event) => {
          const rect = buttonRef.current?.getBoundingClientRect()
          if (rect === undefined) return
          const dx = event.clientX - (rect.left + rect.width / 2)
          const dy = event.clientY - (rect.top + rect.height / 2)
          const clockwiseFromUp = (Math.atan2(dx, -dy) * 180 / Math.PI + 360) % 360
          setLookIndex(Math.round(clockwiseFromUp / 22.5) % 16)
          clearTimeout(idleTimer)
          idleTimer = setTimeout(() => setLookIndex(null), 1100)
        }

        window.addEventListener('pointermove', handlePointerMove, { passive: true })
        return () => {
          window.removeEventListener('pointermove', handlePointerMove)
          clearTimeout(idleTimer)
        }
      }, [mode])

      const lookRow = lookIndex === null ? 0 : lookIndex < 8 ? 9 : 10
      const lookColumn = lookIndex === null ? 0 : lookIndex % 8
      const label = mode === 'running'
        ? 'deepseek\u5a18\u6b63\u5728\u5de5\u4f5c'
        : mode === 'waiting'
          ? 'deepseek\u5a18\u6b63\u5728\u7b49\u5f85\u4f60'
          : 'deepseek\u5a18\u6b63\u5728\u5f85\u6a5f'
      const hint = '\u9ede\u64ca\u5207\u63db\u5927\u5c0f'
      return React.createElement(
        'button',
        {
          'aria-label': `${label}\uff0c${hint}`,
          className: 'dsg-pet',
          'data-large': String(large),
          'data-look-index': lookIndex === null ? '' : String(lookIndex),
          'data-looking': String(lookIndex !== null),
          'data-mode': mode,
          onClick: () => setLarge((value) => !value),
          ref: buttonRef,
          style: {
            '--dsg-look-x': `${-lookColumn * 192}px`,
            '--dsg-look-y': `${-lookRow * 208}px`,
          },
          title: `${label}\uff0c${hint}`,
          type: 'button',
        },
        React.createElement('span', { 'aria-hidden': 'true', className: 'dsg-sprite' }),
        React.createElement('span', { className: 'dsg-status' }, label),
      )
    }

    function apply(ctx) {
      const slots = ctx.get('slots')
      if (slots === undefined) return
      slots.inject('shell.overlay', () => slots.register({
        name: 'shell.overlay',
        id: 'deepseek-girl-pet',
        order: 90,
      }, DeepSeekPet))
    }

    exports.apply = apply
    return module.exports
  },
})
