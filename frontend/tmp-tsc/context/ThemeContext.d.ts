import { type ReactNode } from 'react';
import type { ThemeContextValue } from './theme.types';
export declare function ThemeProvider({ children }: {
    children: ReactNode;
}): import("react").JSX.Element;
export declare function useTheme(): ThemeContextValue;
