import { type RefObject, useLayoutEffect } from 'react'

/**
 * Publishes the height of a bar fixed to the bottom of the viewport as `--bottom-bar-height`, so the
 * footer reserves exactly that much (no guessed padding, no dead space). One fixed bar per page.
 */
export function useBottomBarHeight(bar: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const element = bar.current
    if (!element) return
    const root = document.documentElement
    const publish = () => root.style.setProperty('--bottom-bar-height', `${element.offsetHeight}px`)
    publish()
    const observer = new ResizeObserver(publish)
    observer.observe(element)
    return () => {
      observer.disconnect()
      root.style.removeProperty('--bottom-bar-height')
    }
  }, [bar])
}
