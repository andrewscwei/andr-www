type Params = {
  handler: (isDarkMode: boolean) => void
}

export default function colorScheme(node: HTMLElement, { handler }: Params) {
  const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')
  const listener = (event: MediaQueryListEvent) => handler(event.matches)

  mediaQueryList.addEventListener('change', listener)

  handler(mediaQueryList.matches)

  return {
    destroy() {
      mediaQueryList.removeEventListener('change', listener)
    },
  }
}
