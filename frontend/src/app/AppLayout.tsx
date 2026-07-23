// src/app/AppLayout.tsx
import { Navbar } from '../components/layout/Navbar';
import { Panel } from '../components/layout/Panel';
import { ComingSoon } from '../components/layout/ComingSoon';
import { StatusBar } from '../components/layout/StatusBar';
import { DomTreePanel } from '../components/dom-tree/DomTreePanel';
import { Inspector } from '../components/inspector/Inspector';
import { getSampleDomTree } from '../utils/domParser';

export function AppLayout() {
  const sampleTree = getSampleDomTree();

  return (
    <div className="flex h-screen flex-col bg-background">
      <Navbar />

      {/* Mobile: this whole area scrolls vertically through stacked panels.
          Desktop (md+): overflow-hidden, since the grid below fills exactly
          one screen and each Panel scrolls internally instead. */}
      <div className="flex-1 overflow-y-auto md:overflow-hidden">
        <div className="grid grid-cols-1 md:h-full md:grid-cols-2 md:grid-rows-2">
          
          {/* 1. TOP LEFT: Visualization Canvas */}
          <div
            id="panel-canvas"
            className="min-h-[70vh] border-b border-border md:min-h-0 md:border-r"
          >
            <Panel title="Visualization canvas — live preview">
              <ComingSoon label="Live preview" />
            </Panel>
          </div>

          {/* 2. TOP RIGHT: DOM Tree Panel */}
          <div
            id="panel-tree"
            className="min-h-[70vh] border-b border-border md:min-h-0"
          >
            <DomTreePanel rootNode={sampleTree} />
          </div>

          {/* 3. BOTTOM LEFT: Inspector */}
          <div
            id="panel-inspector"
            className="min-h-[70vh] border-b border-border md:min-h-0 md:border-b-0 md:border-r"
          >
            <Panel title="Inspector">
              <Inspector rootNode={sampleTree} />
            </Panel>
          </div>

          {/* 4. BOTTOM RIGHT: Console */}
          <div id="panel-console" className="min-h-[70vh] md:min-h-0">
            <Panel title="Console">
              <ComingSoon label="Console" />
            </Panel>
          </div>

        </div>
      </div>

      <StatusBar rootNode={sampleTree} />
    </div>
  );
}