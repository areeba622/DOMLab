interface HtmlInputPanelProps {
    isOpen: boolean;
    error: string | null;
    onParse: (html: string) => void;
    onReset: () => void;
    onClose: () => void;
}
export declare function HtmlInputPanel({ isOpen, error, onParse, onReset, onClose }: HtmlInputPanelProps): import("react").JSX.Element | null;
export {};
