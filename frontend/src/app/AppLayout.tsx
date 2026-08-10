// src/app/AppLayout.tsx
import { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Panel } from '../components/layout/Panel';
// import { ComingSoon } from '../components/layout/ComingSoon';
import { StatusBar } from '../components/layout/StatusBar';
import { DomTreePanel } from '../components/dom-tree/DomTreePanel';
import { Inspector } from '../components/inspector/Inspector';
import { HtmlInputPanel } from '../components/input/HtmlInputPanel';
import { useParsedDom } from '../hooks/useParsedDom';
import { useSelectedNode } from '../context/SelectedNodeContext';
import { LivePreview } from '../components/canvas/LivePreview';
import { Console } from '../components/console/Console';



export function AppLayout() {
  const { tree, source, error, parseHtml, resetToSample } = useParsedDom();
  const { clearSelection } = useSelectedNode();
  const [isHtmlInputOpen, setIsHtmlInputOpen] = useState(false);

// src/app/AppLayout.tsx — replace handleParse with this
  const handleParse = (html: string) => {
    const succeeded = parseHtml(html);
    if (succeeded) {
      clearSelection();
      setIsHtmlInputOpen(false);
    }
    // On failure: tree is untouched, old selection is still valid,
    // modal stays open so the user can see the error and try again.
  };

  const handleReset = () => {
    resetToSample();
    clearSelection();
    setIsHtmlInputOpen(false);
  };

  return (


    <div className="flex h-screen flex-col bg-background">
      <Navbar onOpenHtmlInput={() => setIsHtmlInputOpen(true)} />

      <div className="flex-1 overflow-y-auto p-4 md:overflow-hidden">
        <div className="flex flex-col gap-4 md:h-full">

          {/* Tree / Canvas / Inspector — equal-height row on desktop.
              Panel now draws its own border+shadow, so this row's only
              job is spacing (gap-4) and letting the grid stretch all
              three panels to match the tallest one. */}
          <div className="grid grid-cols-1 gap-4 md:min-h-0 md:flex-1 md:grid-cols-[1.1fr_1.6fr_1fr]">
            <div id="panel-tree" className="min-h-[60vh] md:min-h-0">
              <DomTreePanel rootNode={tree} />
            </div>

            <div id="panel-canvas" className="min-h-[60vh] md:min-h-0">
              <Panel title="Visualization canvas — live preview">
                <LivePreview rootNode={tree} />
              </Panel>
            </div>

            <div id="panel-inspector" className="min-h-[60vh] md:min-h-0">
              <Panel title="Inspector">
                <Inspector rootNode={tree} />
              </Panel>
            </div>
          </div>

          {/* Console — full-width row of its own, fixed height on
              desktop rather than stretching (it's a log, not a
              structural panel — it shouldn't compete for space with
              Tree/Canvas/Inspector). */}
          <div id="panel-console" className="min-h-32 md:h-28 md:min-h-0 md:flex-none">
            <Panel title="Console">
              <Console rootNode={tree} />
            </Panel>
          </div>

        </div>
      </div>

      <StatusBar rootNode={tree} source={source} />

      <HtmlInputPanel
        isOpen={isHtmlInputOpen}
        error={error}
        onParse={handleParse}
        onReset={handleReset}
        onClose={() => setIsHtmlInputOpen(false)}
      />
    </div>



  );
}