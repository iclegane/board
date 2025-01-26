class resetManagerClass {
  private resetVoid: VoidFunction | undefined
  constructor() {
    this.init()
  }

  public onReset = (closeF: VoidFunction): void => {
    this.resetVoid = closeF
  }

  private init = () => {
    const handleKeyPress = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        this.resetVoid?.()
      }
    }

    document.addEventListener('keydown', handleKeyPress)
  }
}

export const resetManager = new resetManagerClass()
