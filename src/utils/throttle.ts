type Callback = (...args: any[]) => void

export function rafThrottle<T extends Callback>(func: T): T {
  let isThrottled = false
  let savedArgs: Parameters<T> | null = null
  let savedThis: any = null

  function wrapper(this: any, ...args: Parameters<T>) {
    if (isThrottled) {
      savedArgs = args
      savedThis = this
      return
    }

    func.apply(this, args)
    isThrottled = true

    requestAnimationFrame(() => {
      isThrottled = false
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs)
        savedArgs = null
        savedThis = null
      }
    })
  }

  return wrapper as T
}
