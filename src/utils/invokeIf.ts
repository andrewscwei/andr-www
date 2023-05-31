export default function invokeIf(condition: boolean, fn: () => void) {
  if (!condition) return
  fn()
}
