// src/pages/LandingPage.tsx
//
// ═══════════════════════════════════════════════════════════════════
// FILE MAP (search these header comments to jump around quickly)
// ═══════════════════════════════════════════════════════════════════
//   1. DESIGN TOKENS (dark P / light L)
//   2. SAMPLE DATA (static HTML text + matching DomNode tree)
//   3. HOOKS  (useDebounce, useTypewriter, useInView)
//   4. SMALL PIECES  (TypewriterCursor, NeoButton, FloatingChip)
//   5. BRACKET MASCOT
//   6. PATH PILLS  (Learning Path — currently commented out below)
//   7. HOW IT WORKS CARD DATA  (includes new "Coming Soon" badge)
//   8. LIVE DEMO SECTION  (now READ-ONLY, sample data only, glass panel)
//   9. MAIN LandingPage COMPONENT (Navbar, Hero, sections, Footer)
// ═══════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { DomTree } from '../components/dom-tree/DomTree';
import { getSampleDomTree, findNodeById } from '../utils/domParser';
import { useSelectedNode } from '../context/SelectedNodeContext';
import type { DomNode } from '../types/dom.types';

// ═══════════════════════════════════════════════════════════════════
// 1. DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════

// ── Dark mode ──
const P = {
  bg:       '#1B1F27',
  panel:    '#242A35',
  amber:    '#E8A33D',
  steel:    '#4C7EA8',
  steelLt:  '#6B9EC4',
  cream:    '#E7E9EE',
  muted:    '#8891A4',
  mutedDim: '#4A5568',
  border:   '#2A3140',
  navy:     '#0d0d14',
};

// ── Light mode ──
// Every component below reads from `colors` (derived from theme in
// the main component), never directly from P or L — that's what
// makes the light/dark toggle actually work across the whole page.
const L = {
  bg:       '#cbcbbd',
  panel:    '#ffff',
  amber:    '#ca8b32',
  steel:    '#2E6690',
  steelLt:  '#4C7EA8',
  cream:    '#1B1E27',
  muted:    '#383e46',
  mutedDim: '#2d2f33',
  border:   '#565553',
  navy:     '#FFFFFF',
};

// ═══════════════════════════════════════════════════════════════════
// 2. SAMPLE DATA
//    The Live Demo section is READ-ONLY and always shows this exact
//    sample tree — it is NOT editable and does NOT call
//    parseHtmlString anymore. This text and the DomNode tree from
//    getSampleDomTree() describe the SAME structure on purpose, so
//    what the visitor reads on the left visually matches the tree
//    on the right.
// ═══════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════
// 3. HOOKS
// ═══════════════════════════════════════════════════════════════════

// ── useTypewriter ──────────────────────────────────────────────────
// Reveals `fullText` one character at a time once `enabled` is true.
// Respects prefers-reduced-motion — reveals instantly for those users.
// Used by: Hero headline, "Code meets tree" heading, "THREE STEPS TO
// CLARITY" heading, "READY TO SEE THE DOM?" heading.
function useTypewriter(
  fullText: string,
  speedMs: number,
  startDelayMs: number,
  enabled: boolean,
) {
  const [typedLength, setTypedLength] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setTypedLength(fullText.length);
      return;
    }

    let cancelled = false;

    const startTimer = setTimeout(function tick(i = 0) {
      if (cancelled) return;
      const next = i + 1;
      setTypedLength(next);
      if (next < fullText.length) {
        setTimeout(() => tick(next), speedMs);
      }
    }, startDelayMs);

    return () => {
      cancelled = true;
      clearTimeout(startTimer);
    };
  }, [fullText, speedMs, startDelayMs, enabled]);

  return typedLength;
}

// ── useInView ─────────────────────────────────────────────────────
// Returns true once the element has scrolled into the viewport.
// Used to trigger typewriter effects for below-fold headings so they
// don't all type out immediately on page load.
function useInView(threshold = 0.3): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, inView];
}

// ═══════════════════════════════════════════════════════════════════
// 4. SMALL PIECES
// ═══════════════════════════════════════════════════════════════════

// ── TypewriterCursor ──────────────────────────────────────────────
// The blinking bar shown at the end of text while it's still typing.
function TypewriterCursor({ color }: { color: string }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block',
        width: '0.5em',
        height: '0.85em',
        marginLeft: 6,
        verticalAlign: '-0.1em',
        backgroundColor: color,
        animation: 'db-console-blink 1s steps(2) infinite',
      }}
    />
  );
}

// ── NeoButton ─────────────────────────────────────────────────────
// Neobrutalist button: thick black border, hard offset shadow that
// collapses + button shifts down-right on press (physical feel).
function NeoButton({
  children, onClick, color, large = false, style = {},
}: {
  children: React.ReactNode;
  onClick?: () => void;
  color: string;
  large?: boolean;
  style?: React.CSSProperties;
}) {
  const [pressed, setPressed] = useState(false);
  // Text is black on amber, cream on darker/other backgrounds
  const textColor = color === P.amber || color === L.amber ? '#000' : P.cream;

  return (
    <button
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        backgroundColor: color,
        color: textColor,
        border: '2.5px solid #000',
        boxShadow: pressed ? '0px 0px 0 #000' : '4px 4px 0 #000',
        transform: pressed ? 'translate(4px, 4px)' : 'translate(0,0)',
        transition: 'box-shadow 0.08s, transform 0.08s',
        fontFamily: 'Archivo Black, sans-serif',
        fontSize: large ? '1.1rem' : '0.9rem',
        fontWeight: 400,
        padding: large ? '14px 32px' : '10px 20px',
        cursor: 'pointer',
        borderRadius: '0',
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// ── FloatingChip ──────────────────────────────────────────────────
// Small floating code-snippet labels that drift around the mascot.
function FloatingChip({
  text, top, left, right, bottom, rotate, delay, colors,
}: {
  text: string;
  top?: string; left?: string; right?: string; bottom?: string;
  rotate: number;
  delay: string;
  colors: typeof P;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        top, left, right, bottom,
        transform: `rotate(${rotate}deg)`,
        animation: 'chipFloat 3s ease-in-out infinite',
        animationDelay: delay,
        backgroundColor: colors.panel,
        border: `1.5px solid ${colors.border}`,
        padding: '6px 12px',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.72rem',
        color: colors.amber,
        whiteSpace: 'nowrap',
        zIndex: 1,
        boxShadow: '2px 2px 0 #000',
      }}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
}

// ═══════════════════════════════════════════════════════════════════
// 5. BRACKET MASCOT
//    Waves once on load (hand tilts from the wrist), then settles
//    into a continuous gentle idle bob.
// ═══════════════════════════════════════════════════════════════════
function BracketMascot({ colors }: { colors: typeof P }) {
  const handControls = useAnimation();
  const bodyControls = useAnimation();

  useEffect(() => {
    const sequence = async () => {
      // Wave: hand tilts gently around the wrist joint, not a full arm swing.
      await handControls.start({
        rotate: [0, -12, 8, -10, 6, 0],
        transition: { duration: 1.2, ease: 'easeInOut' },
      });
      // Settle into continuous idle bob
      bodyControls.start({
        y: [0, -8, 0],
        transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
      });
    };
    const timer = setTimeout(sequence, 800);
    return () => clearTimeout(timer);
  }, [handControls, bodyControls]);

  return (
    <motion.div animate={bodyControls}>
      <svg
        width="210" height="190"
        viewBox="0 0 210 190"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left bracket arm */}
        <path
          d="M82 24 L34 95 L82 166"
          stroke={colors.amber} strokeWidth="16"
          strokeLinecap="round" strokeLinejoin="round"
        />
        {/* Right bracket arm (static — only the hand at the tip waves) */}
        <path
          d="M128 24 L176 95 L128 166"
          stroke={colors.steel} strokeWidth="16"
          strokeLinecap="round" strokeLinejoin="round"
        />
        {/* Body */}
        <ellipse cx="105" cy="95" rx="36" ry="43" fill={colors.amber} />
        {/* Body highlight */}
        <ellipse cx="105" cy="80" rx="22" ry="18" fill="#F5C87A" opacity="0.28" />
        {/* Eyes */}
        <circle cx="91"  cy="86" r="5.5" fill={P.navy} />
        <circle cx="119" cy="86" r="5.5" fill={P.navy} />
        {/* Eye shine */}
        <circle cx="93.5" cy="83.5" r="2.4" fill="white" />
        <circle cx="121.5" cy="83.5" r="2.4" fill="white" />
        {/* Smile */}
        <path
          d="M91 104 Q105 117 119 104"
          stroke={P.navy} strokeWidth="4"
          strokeLinecap="round" fill="none"
        />
        {/* Static arm stub connecting body to hand */}
        <line
          x1="176" y1="95"
          x2="185" y2="55"
          stroke={colors.steel} strokeWidth="14"
          strokeLinecap="round"
        />
        {/* Waving hand — rotates around the wrist point (185, 55) */}
        <motion.g
          animate={handControls}
          style={{ transformOrigin: '185px 55px', transformBox: 'fill-box' }}
        >
          <ellipse cx="185" cy="40" rx="13" ry="11" fill={colors.steel} />
          <ellipse cx="176" cy="30" rx="5" ry="7" fill={colors.steelLt} />
          <ellipse cx="185" cy="27" rx="5" ry="7" fill={colors.steelLt} />
          <ellipse cx="194" cy="30" rx="5" ry="7" fill={colors.steelLt} />
        </motion.g>
      </svg>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 6. PATH PILLS  (Learning Path section — currently commented out
//    further down in the JSX; kept here so it's ready to re-enable)
// ═══════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════
// 7. HOW IT WORKS CARD DATA
//    Card index 2 ("Manipulate with JS") now carries a
//    `comingSoon: true` flag — the card render logic below reads
//    this flag and overlays a small "COMING SOON" badge in the
//    corner. Feature not built yet, so we're honest about it here.
// ═══════════════════════════════════════════════════════════════════
const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Paste HTML',
    desc: 'Drop any HTML markup into the editor. DOMLab parses it instantly.',
    color: '#4A90D9',
    comingSoon: false,
    icon: (
      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '1rem' }}>
        &lt;/&gt;
      </span>
    ),
  },
  {
    step: '02',
    title: 'Explore the Tree',
    desc: 'See every node, text content, attribute and relationship in the visual tree.',
    color: '#4CAF72',
    comingSoon: false,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="3" r="2" fill="#000" />
        <circle cx="4"  cy="16" r="2" fill="#000" />
        <circle cx="16" cy="16" r="2" fill="#000" />
        <line x1="10" y1="5"  x2="10" y2="10" stroke="#000" strokeWidth="1.5" />
        <line x1="10" y1="10" x2="4"  y2="14" stroke="#000" strokeWidth="1.5" />
        <line x1="10" y1="10" x2="16" y2="14" stroke="#000" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    step: '03',
    title: 'Manipulate with JS',
    desc: 'Run JavaScript directly. Watch every DOM mutation happen in real time.',
    color: '#E84D8A',
    // ── NEW: this feature (Sprint 4) hasn't been built yet ──
    comingSoon: true,
    icon: (
      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '1rem' }}>
        {'{ }'}
      </span>
    ),
  },
];

// ═══════════════════════════════════════════════════════════════════
// 8. LIVE DEMO SECTION
//    CHANGED: this is now a READ-ONLY showcase of sample data.
//      - Left panel: static syntax-highlighted HTML text (NOT an
//        editable textarea — user cannot type here anymore).
//        Background uses a glassmorphism effect (semi-transparent +
//        backdrop-blur) instead of a flat panel color.
//      - Right panel: the real DomTree component, rendering the
//        real sample tree from getSampleDomTree(). Clicking a node
//        selects it via the shared SelectedNodeContext (same context
//        the Explorer uses), and a small "Selected node" info strip
//        below the tree shows that node's tag/depth/text — this is
//        the "small info of selected node" the user asked for.
//      - The typewriter effect on the "Code meets tree, in real
//        time" heading is UNCHANGED and still runs on scroll-into-view.
// ═══════════════════════════════════════════════════════════════════
function formatAttributes(attributes: Record<string, string>) {
  return Object.entries(attributes)
    .map(([key, value]) => ` ${key}="${value}"`)
    .join('');
}

function renderReadOnlyHtmlNode(
  node: DomNode,
  selectedNodeId: string | null,
  onSelect: (id: string) => void,
  colors: typeof P,
  indent = 0,
): ReactNode[] {
  if (node.tagName === '#fragment') {
    return node.children.flatMap((child) =>
      renderReadOnlyHtmlNode(child, selectedNodeId, onSelect, colors, indent),
    );
  }

  const isSelected = node.id === selectedNodeId;
  const indentPx = indent * 18;
  const attrs = formatAttributes(node.attributes);

  const lineStyle: React.CSSProperties = {
    display: 'flex',
    paddingLeft: indentPx,
    margin: 0,
    color: colors.cream,
    lineHeight: 1.75,
    cursor: 'pointer',
    backgroundColor: isSelected ? `${colors.amber}22` : 'transparent',
    borderRadius: isSelected ? 4 : 0,
  };

  const result: ReactNode[] = [
    <div
      key={`${node.id}-open`}
      style={lineStyle}
      onClick={() => onSelect(node.id)}
    >
      <span style={{ color: colors.steel }}>{`<${node.tagName}${attrs}>`}</span>
    </div>,
  ];

  if (node.textContent) {
    result.push(
      <div
        key={`${node.id}-text`}
        style={{
          ...lineStyle,
          paddingLeft: indentPx + 18,
        }}
        onClick={() => onSelect(node.id)}
      >
        {node.textContent}
      </div>,
    );
  }

  for (const child of node.children) {
    result.push(...renderReadOnlyHtmlNode(child, selectedNodeId, onSelect, colors, indent + 1));
  }

  result.push(
    <div
      key={`${node.id}-close`}
      style={lineStyle}
      onClick={() => onSelect(node.id)}
    >
      <span style={{ color: colors.steel }}>{`</${node.tagName}>`}</span>
    </div>,
  );

  return result;
}

function collectDomNodeIds(node: DomNode): string[] {
  return [node.id, ...node.children.flatMap(collectDomNodeIds)];
}

function findDomNodePath(root: DomNode, targetId: string): string[] | null {
  if (root.id === targetId) return [root.id];
  for (const child of root.children) {
    const path = findDomNodePath(child, targetId);
    if (path) return [root.id, ...path];
  }
  return null;
}

function renderReadOnlyHtmlTree(
  root: DomNode,
  selectedNodeId: string | null,
  onSelect: (id: string) => void,
  colors: typeof P,
) {
  return (
    <div style={{
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '0.82rem',
      whiteSpace: 'pre',
      color: colors.cream,
      minHeight: '280px',
    }}>
      {renderReadOnlyHtmlNode(root, selectedNodeId, onSelect, colors)}
    </div>
  );
}

function LiveDemoSection({ colors }: { colors: typeof P }) {
  // Sample tree is fixed — generated once, never re-parsed, since
  // there is no editable input driving it anymore.
  const [tree] = useState<DomNode>(() => getSampleDomTree());
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(collectDomNodeIds(tree)),
  );

  // Reuse the SAME selection context the Explorer uses, so clicking
  // a node in this landing-page tree behaves identically to the
  // real app — no separate/duplicate selection state needed here.
  const { selectedNodeId, selectNode } = useSelectedNode();
  const selectedNode = selectedNodeId ? findNodeById(tree, selectedNodeId) : null;

  useEffect(() => {
    if (!selectedNodeId) return;
    const path = findDomNodePath(tree, selectedNodeId);
    if (!path) return;
    setExpandedIds((prev) => {
      const next = new Set(prev);
      path.forEach((id) => next.add(id));
      return next;
    });
  }, [selectedNodeId, tree]);

  const handleToggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ── Typewriter for the section heading (UNCHANGED, kept as-is) ──
  const [headingRef, headingInView] = useInView(0.3);
  const HEADING_TEXT = 'Code meets tree, in real time';
  const typedLength  = useTypewriter(HEADING_TEXT, 40, 200, headingInView);
  const typedHeading = HEADING_TEXT.slice(0, typedLength);
  const headingDone  = typedLength >= HEADING_TEXT.length;
  // "in real time" starts at character index 17 — colored differently
  const COLOURED_START = 17;
  const plainPart      = typedHeading.slice(0, COLOURED_START);
  const colouredPart   = typedHeading.slice(COLOURED_START);

  return (
    <section id="live-demo" style={{ padding: '80px 48px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* ── Section heading (typewriter effect preserved) ── */}
      <div ref={headingRef} style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h2 style={{
          fontFamily: 'Archivo Black, sans-serif',
          fontSize: 'clamp(1.6rem, 4vw, 2.6rem)',
          color: colors.cream,
          letterSpacing: '-0.02em',
          textTransform: 'uppercase',
          margin: 0,
        }}>
          {plainPart}
          <span style={{ color: colors.steel }}>{colouredPart}</span>
          {!headingDone && <TypewriterCursor color={colors.steel} />}
        </h2>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.85rem',
          color: colors.muted,
          marginTop: 10,
        }}>
          Sample data — click any node in the tree to see its details.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        alignItems: 'stretch',
      }}>

        {/* ── LEFT: read-only code panel with glassmorphism background ── */}
        <div style={{
          // Glassmorphism: semi-transparent panel color + backdrop-blur
          // so whatever sits behind this section (page background,
          // gradient, etc.) softly shows through the panel.
          backgroundColor: colors.panel , 
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)', // Safari support
          border: '2.5px solid #000',
          boxShadow: '4px 4px 0 #000',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Window chrome bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            borderBottom: '2px solid #000',
            backgroundColor: colors.bg + 'CC', // slightly transparent too
            flexShrink: 0,
          }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ff5f57', border: '1px solid #000' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ffbd2e', border: '1px solid #000' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#28c840', border: '1px solid #000' }} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: colors.muted, marginLeft: 8 }}>
              index.html — sample data (read-only)
            </span>
          </div>

          {/* Read-only HTML display — rendered from the sample DOM tree.
              The selected node is visually highlighted here and can be
              clicked to select the same node in the inspector/tree. */}
          <div style={{
            flex: 1,
            margin: 0,
            padding: '20px 24px',
            overflowX: 'auto',
            overflowY: 'auto',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.82rem',
            color: colors.cream,
            minHeight: '280px',
          }}>
            {renderReadOnlyHtmlTree(tree, selectedNodeId, selectNode, colors)}
          </div>
        </div>

        {/* ── RIGHT: real DomTree component + selected node info ── */}
        <div style={{
          backgroundColor: colors.panel,
          border: '2.5px solid #000',
          boxShadow: '4px 4px 0 #000',
          padding: '20px 24px',
          overflow: 'auto',
          minHeight: '320px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Panel header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
            paddingBottom: 12,
            borderBottom: `1px solid ${colors.border}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28,
                background: 'rgba(232,163,61,0.12)',
                border: '1px solid rgba(232,163,61,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="4.5" stroke={colors.amber} strokeWidth="1.5" />
                  <circle cx="6" cy="6" r="1.8" fill={colors.amber} />
                </svg>
              </div>
              <span style={{
                fontFamily: 'Archivo Black, sans-serif',
                fontSize: 12,
                color: colors.cream,
              }}>DOM Inspector</span>
            </div>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10,
              color: colors.mutedDim,
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: `1px solid ${colors.border}`,
              padding: '2px 8px',
            }}>sample</span>
          </div>

          {/* The real DomTree — same component used in /explorer.
              All nodes start expanded (root + its direct children)
              so visitors see structure immediately without clicking. */}
          <DomTree
            rootNode={tree}
            expandedIds={expandedIds}
            onToggleExpand={handleToggleExpand}
          />

          {/* ── NEW: small "Selected node" info strip ──
              Shows tag / depth / text content of whichever node the
              visitor clicked in the tree above. Empty state when
              nothing is selected yet. */}
          <div style={{
            marginTop: 16,
            paddingTop: 14,
            borderTop: `1px solid ${colors.border}`,
          }}>
            {selectedNode ? (
              <div style={{
                padding: '10px 14px',
                backgroundColor: 'rgba(232,163,61,0.07)',
                border: '1px solid rgba(232,163,61,0.2)',
              }}>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 10,
                  color: colors.muted,
                  marginBottom: 6,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>Selected node</div>

                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>
                  <span>
                    <span style={{ color: colors.amber }}>tag</span>
                    <span style={{ color: colors.muted }}>: </span>
                    <span style={{ color: '#9DD494' }}>"{selectedNode.tagName}"</span>
                  </span>
                  <span>
                    <span style={{ color: colors.amber }}>depth</span>
                    <span style={{ color: colors.muted }}>: </span>
                    <span style={{ color: '#9DD494' }}>{selectedNode.depth}</span>
                  </span>
                  {selectedNode.textContent && (
                    <span>
                      <span style={{ color: colors.amber }}>text</span>
                      <span style={{ color: colors.muted }}>: </span>
                      <span style={{ color: '#9DD494' }}>"{selectedNode.textContent}"</span>
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <p style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 11.5,
                color: colors.mutedDim,
                margin: 0,
                fontStyle: 'italic',
              }}>
                Click a node above to see its details here.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 9. MAIN LANDING PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════
export function LandingPage() {
  const navigate  = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  // Derive the active token set from the current theme — every style
  // reference below uses `colors.x`, never P or L directly, so the
  // entire page re-renders with the correct palette on toggle.
  const colors = theme === 'dark' ? P : L;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  // ── HERO headline typewriter ──────────────────────────────────
  // Font-size note: 'clamp(3rem, 8vw, 4.5rem)' — scales fluidly
  // between a 48px floor and a 72px ceiling based on viewport width.
  const HERO_TEXT    = 'SEE INSIDE\nTHE BROWSER';
  const heroTyped    = useTypewriter(HERO_TEXT, 45, 700, true);
  const heroSliced   = HERO_TEXT.slice(0, heroTyped);
  const heroDone     = heroTyped >= HERO_TEXT.length;
  const [heroLine1, heroLine2 = ''] = heroSliced.split('\n');
  const stillLine1   = !heroSliced.includes('\n');

  // ── "THREE STEPS TO CLARITY" typewriter ──────────────────────
  const [stepsRef, stepsInView] = useInView(0.25);
  const STEPS_TEXT   = 'THREE STEPS TO CLARITY';
  const stepsTyped   = useTypewriter(STEPS_TEXT, 40, 200, stepsInView);
  const stepsSliced  = STEPS_TEXT.slice(0, stepsTyped);
  const stepsDone    = stepsTyped >= STEPS_TEXT.length;

  // ── "READY TO SEE THE DOM?" typewriter ───────────────────────
  const [ctaRef, ctaInView] = useInView(0.25);
  const CTA_TEXT     = 'READY TO SEE THE DOM?';
  const ctaTyped     = useTypewriter(CTA_TEXT, 40, 200, ctaInView);
  const ctaSliced    = CTA_TEXT.slice(0, ctaTyped);
  const ctaDone      = ctaTyped >= CTA_TEXT.length;

  return (
    <div style={{ backgroundColor: colors.bg, minHeight: '100vh', overflowX: 'hidden', transition: 'background-color 0.3s' }}>

      <style>{`
        @keyframes chipFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes db-console-blink {
          50% { opacity: 0; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 48px',
        borderBottom: '2.5px solid #000',
        backgroundColor: colors.bg,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2.5px 0 #000',
        transition: 'background-color 0.3s',
      }}>
        {/* Logo */}
        <div style={{
          fontFamily: 'Archivo Black, sans-serif',
          fontSize: '1.6rem',
          color: colors.cream,
          letterSpacing: '-0.02em',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <span style={{
            backgroundColor: colors.amber,
            color: '#000',
            border: '2.5px solid #000',
            padding: '2px 8px',
            fontSize: '1rem',
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: 700,
          }}>&lt;/&gt;</span>
          DOMLab
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: '32px' }}>
          <button
            onClick={() => scrollTo('live-demo')}
            style={{ background: 'none', border: 'none', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: colors.muted, cursor: 'pointer' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = colors.cream)}
            onMouseLeave={(e) => (e.currentTarget.style.color = colors.muted)}
          >Features</button>

          <button
            style={{ background: 'none', border: 'none', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: colors.muted, cursor: 'pointer' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = colors.cream)}
            onMouseLeave={(e) => (e.currentTarget.style.color = colors.muted)}
          >Docs</button>

          <button
            onClick={toggleTheme}
            style={{
              background: 'none', border: '1.5px solid #000',
              padding: '6px 10px', cursor: 'pointer',
              color: colors.cream, fontSize: '0.9rem',
              backgroundColor: colors.panel,
            }}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <NeoButton onClick={() => navigate('/explorer')} color={colors.amber}>
            Try it →
          </NeoButton>
        </div>

        {/* Mobile hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <button onClick={toggleTheme} style={{ background: colors.panel, border: '1.5px solid #000', padding: '6px 10px', cursor: 'pointer', color: colors.cream }}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: colors.panel, border: '2.5px solid #000', padding: '8px 12px', cursor: 'pointer', color: colors.cream, fontFamily: 'Archivo Black, sans-serif', fontSize: '1.2rem' }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ backgroundColor: colors.panel, borderBottom: '2.5px solid #000', padding: '24px 48px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <button onClick={() => scrollTo('live-demo')} style={{ background: 'none', border: 'none', color: colors.muted, fontFamily: 'Inter, sans-serif', textAlign: 'left', cursor: 'pointer' }}>Features</button>
          <button style={{ background: 'none', border: 'none', color: colors.muted, fontFamily: 'Inter, sans-serif', textAlign: 'left', cursor: 'pointer' }}>Docs</button>
          <NeoButton onClick={() => { navigate('/explorer'); setMenuOpen(false); }} large color={colors.amber}>Try it →</NeoButton>
        </div>
      )}

      {/* ── HERO ── */}
      <section style={{ padding: '100px 48px 80px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            border: `2.5px solid ${colors.amber}`,
            padding: '4px 14px',
            marginBottom: '32px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.78rem',
            color: colors.amber,
            letterSpacing: '0.08em',
            textTransform: 'uppercase' as const,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: colors.amber, display: 'inline-block' }} />
          Browser internals, made visible
        </motion.div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '48px',
          flexWrap: 'wrap' as const,
        }}>
          {/* Left: text */}
          <div style={{ flex: '1 1 500px' }}>
            {/*
              HERO HEADLINE FONT SIZE:
              clamp(3rem, 8vw, 4.5rem)
              — min 48px on small screens
              — fluid scaling with viewport width (8vw)
              — max 72px on wide displays
              Change the three values here to adjust headline size.
            */}
            <h1 style={{
              fontFamily: 'Archivo Black, sans-serif',
              fontSize: 'clamp(3rem, 8vw, 4.5rem)',
              lineHeight: '0.95',
              color: colors.cream,
              margin: '0 0 32px',
              letterSpacing: '-0.03em',
              textTransform: 'uppercase' as const,
              maxWidth: '900px',
            }}>
              {heroLine1}
              {stillLine1 && !heroDone && <TypewriterCursor color={colors.cream} />}
              <br />
              <span style={{ color: colors.amber }}>
                {heroLine2}
                {!stillLine1 && !heroDone && <TypewriterCursor color={colors.amber} />}
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '1.15rem',
                color: colors.muted,
                lineHeight: '1.7',
                maxWidth: '560px',
                margin: '0 0 48px',
              }}
            >
              Watch HTML transform into a live DOM tree. See every node, every attribute,
              every relationship — then manipulate it with JavaScript in real time.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' as const }}
            >
              <NeoButton onClick={() => navigate('/explorer')} large color={colors.amber}>
                Try it now →
              </NeoButton>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem', color: colors.muted }}>
                No signup. No install. Just open and explore.
              </div>
            </motion.div>
          </div>

          {/* Right: mascot + floating chips */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 340,
              flex: '0 1 400px',
            }}
          >
            <FloatingChip text="parentNode.children"    top="8%"     left="2%"   rotate={-5} delay="0s"   colors={colors} />
            <FloatingChip text="querySelector('#app')"   top="15%"    right="0%"  rotate={4}  delay="0.8s" colors={colors} />
            <FloatingChip text="node.addEventListener"   bottom="20%" left="0%"   rotate={-3} delay="0.4s" colors={colors} />
            <FloatingChip text="parentNode.children"     bottom="8%"  right="2%"  rotate={6}  delay="1.4s" colors={colors} />
            <BracketMascot colors={colors} />
          </motion.div>
        </div>
      </section>

      {/* ── LIVE DEMO — read-only sample data showcase (see section 8 above) ── */}
      <LiveDemoSection colors={colors} />

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '80px 48px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
          <div style={{ width: 32, height: 2.5, backgroundColor: colors.amber }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: colors.amber, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            How it works
          </span>
        </div>

        {/* Typewriter on "THREE STEPS TO CLARITY" — triggers on scroll */}
        <div ref={stepsRef}>
          <h2 style={{
            fontFamily: 'Archivo Black, sans-serif',
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            color: colors.cream,
            margin: '0 0 48px',
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
          }}>
            {stepsSliced}
            {!stepsDone && <TypewriterCursor color={colors.cream} />}
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          {HOW_IT_WORKS.map((card, i) => (
            <div
              key={i}
              style={{
                border: '2.5px solid #000',
                boxShadow: i === 1 ? `4px 4px 0 ${colors.amber}` : '4px 4px 0 #000',
                backgroundColor: colors.panel,
                padding: '40px 32px',
                position: 'relative',
                transform: i === 1 ? 'translateY(-8px)' : 'none',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = i === 1 ? 'translateY(-12px)' : 'translateY(-4px)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = i === 1 ? 'translateY(-8px)' : 'none'; }}
            >
              {/* ── NEW: "Coming Soon" badge — only renders when
                  card.comingSoon is true (currently just card 03,
                  "Manipulate with JS"). Positioned top-left so it
                  doesn't collide with the step number (top-right). */}
              {card.comingSoon && (
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  backgroundColor: '#E84D8A',
                  color: '#000',
                  border: '2px solid #000',
                  padding: '3px 10px',
                  fontFamily: 'Archivo Black, sans-serif',
                  fontSize: '0.62rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  boxShadow: '2px 2px 0 #000',
                }}>
                  Coming Soon
                </div>
              )}

              <div style={{
                fontFamily: 'Archivo Black, sans-serif',
                fontSize: '3.5rem',
                color: colors.mutedDim,
                position: 'absolute',
                top: '16px',
                right: '24px',
                lineHeight: 1,
                userSelect: 'none',
                letterSpacing: '-0.05em',
                opacity: 0.5,
              }}>{card.step}</div>

              <div style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '48px', height: '48px',
                backgroundColor: card.color,
                border: '2.5px solid #000',
                marginBottom: '20px',
                // Push icon down slightly on the comingSoon card so
                // it doesn't sit flush under the new badge above it
                marginTop: card.comingSoon ? '28px' : '0px',
              }}>{card.icon}</div>

              <h3 style={{ fontFamily: 'Archivo Black, sans-serif', fontSize: '1.3rem', color: colors.cream, margin: '0 0 12px', textTransform: 'uppercase' }}>{card.title}</h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: colors.muted, lineHeight: '1.6', margin: 0 }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── LEARNING PATH — currently disabled (commented out) ──
          Kept in the file, ready to re-enable once JS Operations
          (Sprint 4) actually ships and this row means something real.
      <section style={{ padding: '64px 48px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 32 }}>
          <div style={{ width: 32, height: 2.5, backgroundColor: colors.amber }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: colors.amber, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Learning Path
          </span>
          <div style={{ width: 32, height: 2.5, backgroundColor: colors.amber }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
          {PILLS.map((pill, i) => (
            <PathPill key={pill.label} pill={pill} isLast={i === PILLS.length - 1} />
          ))}
        </div>

        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.88rem', color: colors.muted }}>
          You are on <span style={{ color: colors.amber, fontWeight: 600 }}>HTML</span> — the foundation of the DOM. Complete each module to unlock the next.
        </p>
      </section>
      */}

      {/* ── CTA BANNER ── */}
      <section ref={ctaRef} style={{
        margin: '0 auto 80px',
        maxWidth: '1104px',
        border: '2.5px solid #000',
        boxShadow: `6px 6px 0 ${colors.amber}`,
        backgroundColor: colors.amber,
        padding: '64px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '32px',
      }}>
        <div>
          <h2 style={{
            fontFamily: 'Archivo Black, sans-serif',
            fontSize: 'clamp(1.6rem, 4vw, 2.8rem)',
            color: '#000',
            margin: '0 0 12px',
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
          }}>
            {ctaSliced}
            {!ctaDone && <TypewriterCursor color="#000" />}
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: P.bg, margin: 0 }}>
            No account required. Open the tool and start exploring in seconds.
          </p>
        </div>
        <NeoButton onClick={() => navigate('/explorer')} large color={P.bg} style={{ color: P.cream }}>
          Open DOMLab →
        </NeoButton>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: `2.5px solid ${colors.panel}`,
        padding: '32px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div style={{ fontFamily: 'Archivo Black, sans-serif', fontSize: '1rem', color: colors.mutedDim }}>DOMLab</div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: colors.mutedDim }}>
          Built for developers who want to understand, not just use.
        </div>
      </footer>
    </div>
  );
}