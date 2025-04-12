type ListNode<T> = {
  value: T
  next: ListNode<T> | null
}

export class QueueService<T> {
  private head: ListNode<T> | null = null
  private tail: ListNode<T> | null = null
  private length = 0

  // (O(1))
  enqueue = (value: T) => {
    const newNode: ListNode<T> = { value, next: null }

    if (!this.tail) {
      this.head = newNode
      this.tail = newNode
    } else {
      this.tail.next = newNode
      this.tail = newNode
    }

    this.length++
  }

  // (O(1))
  dequeue = (): T | null => {
    if (!this.head) return null

    const value = this.head.value
    this.head = this.head.next

    if (!this.head) {
      this.tail = null
    }

    this.length--
    return value
  }

  // (O(1))
  peek = (): T | null => {
    return this.head?.value ?? null
  }

  // (O(1))
  get size(): number {
    return this.length
  }

  // (O(1))
  clear = (): void => {
    this.head = null
    this.tail = null
    this.length = 0
  }
}
