export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: number | null = null

  return (...args: Parameters<T>): void => {
    if (timeout !== null) {
      clearTimeout(timeout)
    }
    timeout = window.setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}
