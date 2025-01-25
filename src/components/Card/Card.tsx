import React, { useState, useRef, useEffect, memo } from 'react'

import './styles.css'

import { EditArea } from './components'

import { useLatest } from '@/hooks'
import { resetManager } from '@/modules'
import { Position } from '@/types'
import { rafThrottle } from '@/utils'

interface CardProps {
  id: string
  name?: string
  text?: string
  zoom: number
  coordinates: Position
  onMoveEnd: (id: string, coordinates: Position) => void
  onEndEdit: (id: string, text?: string) => void
}

export const Card = memo(
  ({ id, name, text, coordinates, onMoveEnd, onEndEdit, zoom }: CardProps) => {
    const cardRef = useRef<HTMLDivElement | null>(null)
    const lastPosition = useRef({ ...coordinates })

    const [isEditMode, setIsEditMode] = useState<boolean>(false)
    const [tempPosition, setTempPosition] = useState<Position | null>(null)
    const [dragging, setDragging] = useState(false)

    const position = tempPosition ?? coordinates

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>): void => {
      if (isEditMode) {
        return
      }

      setDragging(true)
      setTempPosition({ ...coordinates })
      lastPosition.current = { x: event.clientX, y: event.clientY }

      resetManager.onReset(() => {
        setDragging(false)
        setTempPosition(null)
      })
    }

    const handleMouseMove = (event: MouseEvent): void => {
      if (!dragging) return

      const deltaX = event.clientX - lastPosition.current.x
      const deltaY = event.clientY - lastPosition.current.y

      setTempPosition((prev) => {
        if (prev === null) {
          return prev
        }

        return {
          x: prev.x + deltaX / zoom,
          y: prev.y + deltaY / zoom,
        }
      })
      lastPosition.current = { x: event.clientX, y: event.clientY }
    }

    const handleMouseUp = (): void => {
      setDragging(false)

      if (tempPosition) {
        onMoveEnd(id, { ...tempPosition })
        setTempPosition(null)
      }
    }

    const onMouseMoveCb = useLatest(handleMouseMove)
    const onMouseUpCb = useLatest(handleMouseUp)

    useEffect(() => {
      if (!dragging) {
        return
      }

      const handleMouseMove = (e: MouseEvent): void => {
        onMouseMoveCb.current(e)
      }
      const throttleMouseMove = rafThrottle(handleMouseMove)

      const handleMouseup = (): void => {
        onMouseUpCb.current()
      }

      document.addEventListener('mousemove', throttleMouseMove)
      document.addEventListener('mouseup', handleMouseup)

      return (): void => {
        document.removeEventListener('mousemove', throttleMouseMove)
        document.removeEventListener('mouseup', handleMouseup)
      }
    }, [dragging, onMouseMoveCb, onMouseUpCb])

    useEffect(() => {
      const handleDoubleClick = (event: MouseEvent): void => {
        setDragging(false)
        if (cardRef.current && cardRef.current.contains(event.target as Node)) {
          setIsEditMode((prev) => !prev)
        } else {
          setIsEditMode(false)
        }
      }

      const handleClick = (event: MouseEvent): void => {
        if (!cardRef.current?.contains(event.target as Node)) {
          setIsEditMode(false)
        }
      }

      document.addEventListener('dblclick', handleDoubleClick)
      document.addEventListener('click', handleClick)

      return (): void => {
        document.removeEventListener('dblclick', handleDoubleClick)
        document.removeEventListener('click', handleClick)
      }
    }, [cardRef])

    return (
      <div
        ref={cardRef}
        className='card'
        onMouseDown={handleMouseDown}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          cursor: dragging ? 'grabbing' : 'grab',
          zIndex: dragging ? 1 : 0,
          borderColor: dragging ? '#3364ed' : '#dcdcdc',
        }}
      >
        <div>{name}</div>
        <div className='card-content'>
          <EditArea
            text={text}
            isEdit={!isEditMode}
            onBlur={(text) => onEndEdit(id, text)}
          />
        </div>
      </div>
    )
  }
)
