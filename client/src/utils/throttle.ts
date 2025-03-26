export const rafThrottle = <T extends (...args: any[]) => void>(func: T): T => {
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

export const rafThrottleWithLimit = (
  fn: (...args: any[]) => void,
  wait: number = 100
) => {
  let lastCall = 0
  let scheduled = false

  return function (this: any, ...args: any[]) {
    const now = Date.now()

    if (!scheduled && now - lastCall >= wait) {
      scheduled = true

      requestAnimationFrame(() => {
        if (Date.now() - lastCall >= wait) {
          fn.apply(this, args)
          lastCall = Date.now()
        }
        scheduled = false
      })
    }
  }
}
