import type { ReactNode } from 'react';
interface PanelProps {
    title: string;
    children?: ReactNode; /** Optional slot for panel-scoped controls, e.g. the Tree's Toolbar buttons */
    headerActions?: ReactNode;
}
export declare function Panel({ title, children, headerActions }: PanelProps): import("react").JSX.Element;
export {};
