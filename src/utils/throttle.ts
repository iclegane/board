export function rafThrottle<T extends (...args: any[]) => void>(func: T): T {
  let isThrottled = false
  let savedArgs: Parameters<T> | null = null
  let savedThis: any = null

  function wrapper(this: any, ...args: Parameters<T>): void {
    savedArgs = args
    savedThis = this

    if (!isThrottled) {
      isThrottled = true
      requestAnimationFrame(() => {
        if (savedArgs) {
          func.apply(savedThis, savedArgs)
          savedArgs = null
          savedThis = null
        }
        isThrottled = false
      })
    }
  }

  return wrapper as T
}
