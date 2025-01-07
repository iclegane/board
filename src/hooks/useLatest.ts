import { MutableRefObject, useLayoutEffect, useRef } from 'react'

export const useLatest = <T>(value: T): MutableRefObject<T> => {
  const valueRef = useRef(value)

  useLayoutEffect(() => {
    valueRef.current = value
  })

  return valueRef
}
