// src/app/AppLayout.tsx
import { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Panel } from '../components/layout/Panel';
import { ComingSoon } from '../components/layout/ComingSoon';
import { StatusBar } from '../components/layout/StatusBar';
import { DomTreePanel } from '../components/dom-tree/DomTreePanel';
import { Inspector } from '../components/inspector/Inspector';
import { HtmlInputPanel } from '../components/input/HtmlInputPanel';
import { useParsedDom } from '../hooks/useParsedDom';
import { useSelectedNode } from '../context/SelectedNodeContext';

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

      <div className="flex-1 overflow-y-auto md:overflow-hidden">
        <div className="grid grid-cols-1 md:h-full md:grid-cols-2 md:grid-rows-2">
          <div id="panel-tree" className="min-h-[70vh] border-b border-border md:min-h-0 md:border-r">
            <DomTreePanel rootNode={tree} />
          </div>

          <div id="panel-canvas" className="min-h-[70vh] border-b border-border md:min-h-0">
            <Panel title="Visualization canvas — live preview">
              <ComingSoon label="Live preview" />
            </Panel>
          </div>

          <div id="panel-inspector" className="min-h-[70vh] border-b border-border md:min-h-0 md:border-b-0 md:border-r">
            <Panel title="Inspector">
              <Inspector rootNode={tree} />
            </Panel>
          </div>

          <div id="panel-console" className="min-h-[70vh] md:min-h-0">
            <Panel title="Console">
              <ComingSoon label="Console" />
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