import { type ReactNode } from 'react';
import type { SelectedNodeContextValue } from './selection.types';
export declare function SelectedNodeProvider({ children }: {
    children: ReactNode;
}): import("react").JSX.Element;
export declare function useSelectedNode(): SelectedNodeContextValue;
