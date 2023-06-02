import { writable } from 'svelte/store'

export const LIGHT_MODE = 'lightMode'
export const DARK_MODE = 'darkMode'

function init() {
  const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')
  const { subscribe, set } = writable(mediaQueryList.matches ? DARK_MODE : LIGHT_MODE)
  const listener = (event: MediaQueryListEvent) => set(event.matches ? DARK_MODE : LIGHT_MODE)
  mediaQueryList.addEventListener('change', listener)

  return {
    subscribe,
  }
}

export default init()
