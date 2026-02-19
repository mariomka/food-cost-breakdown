export function useId(): () => string {
  return () => crypto.randomUUID()
}
