// src/components/console/console.types.ts

export type ConsoleMessageType = 'success' | 'warning';

export interface ConsoleMessage {
  id: string;
  type: ConsoleMessageType;
  text: string;
}