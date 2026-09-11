export function usePg() {
  return (useAppConfig().ui as { pg: Record<string, string> }).pg
}
