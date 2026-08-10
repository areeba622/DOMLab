// Thin wrapper — the explorer is just the existing AppLayout,
// now mounted at '/explorer' instead of being the only thing
// the app ever rendered. Zero changes to AppLayout itself.
import { AppLayout } from '../app/AppLayout';

export function ExplorerPage() {
  return <AppLayout />;
}