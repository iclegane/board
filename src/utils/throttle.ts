type Callback = (...args: any[]) => void

export function throttle<T extends Callback>(func: T, limit: number): T {
  let lastCall = 0
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now()

    if (lastCall + limit <= now) {
      lastCall = now
      func.apply(this, args)
    } else if (!timeoutId) {
      const remainingTime = lastCall + limit - now
      timeoutId = setTimeout(() => {
        lastCall = Date.now()
        timeoutId = null
        func.apply(this, args)
      }, remainingTime)
    }
  } as T
}
