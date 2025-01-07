import React, { useState, useRef, useEffect, forwardRef } from 'react'

import './styles.css'
import { useLatest } from '@/hooks'

interface CardProps {
  id: string
  name?: string
  text?: string
  coordination: { x: number; y: number }
  onMove: (id: string, deltaX: number, deltaY: number) => void
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ id, name, text, coordination, onMove }, ref) => {
    const [dragging, setDragging] = useState(false)
    const lastPosition = useRef({ ...coordination })

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>): void => {
      setDragging(true)
      lastPosition.current = { x: event.clientX, y: event.clientY }
    }

    const handleMouseMove = (event: MouseEvent): void => {
      if (!dragging) return

      const deltaX = event.clientX - lastPosition.current.x
      const deltaY = event.clientY - lastPosition.current.y

      onMove(id, deltaX, deltaY)
      lastPosition.current = { x: event.clientX, y: event.clientY }
    }

    const handleMouseUp = (): void => {
      setDragging(false)
    }

    const onMouseMoveCb = useLatest(handleMouseMove)
    const onMouseUpCb = useLatest(handleMouseUp)

    useEffect(() => {
      const handler = (e: MouseEvent): void => {
        onMouseMoveCb.current(e)
      }
      document.addEventListener('mousemove', handler)

      return (): void => {
        document.removeEventListener('mousemove', handler)
      }
    }, [onMouseMoveCb])

    useEffect(() => {
      const handler = (): void => {
        onMouseUpCb.current()
      }
      document.addEventListener('mouseup', handler)

      return (): void => {
        document.removeEventListener('mouseup', handler)
      }
    }, [onMouseUpCb])

    return (
      <div
        ref={ref}
        className='card'
        onMouseDown={handleMouseDown}
        style={{
          transform: `translate(${coordination.x}px, ${coordination.y}px)`,
          cursor: dragging ? 'grabbing' : 'grab',
          zIndex: dragging ? 1 : 0,
          borderColor: dragging ? '#3364ed' : '#dcdcdc',
        }}
      >
        <div>{name}</div>
        <div>{text}</div>
      </div>
    )
  }
)
