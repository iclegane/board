import React, { useState, useRef } from 'react'

import '@/components/App/App.css'
import { Card } from '@/components'

type PositionType = { x: number; y: number }

export const App: React.FC = () => {
  const [position, setPosition] = useState<PositionType>({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [zoom, setZoom] = useState(1)

  const lastClientPosition = useRef<PositionType>({ x: 0, y: 0 })
  const lastCoordinatePosition = useRef<PositionType>({ x: 0, y: 0 })

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>): void => {
    setDragging(true)
    lastClientPosition.current = { x: event.clientX, y: event.clientY }
    lastCoordinatePosition.current = { ...position }
  }

  const handleMouseUp = (): void => {
    setDragging(false)
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>): void => {
    if (!dragging) {
      return
    }

    const deltaX = event.clientX - lastClientPosition.current.x
    const deltaY = event.clientY - lastClientPosition.current.y

    setPosition((prev) => ({ x: prev.x + deltaX, y: prev.y + deltaY }))
    lastClientPosition.current = { x: event.clientX, y: event.clientY }
  }

  const handleBackPosition = (): void => {
    const { x, y } = lastCoordinatePosition.current
    setPosition({ x, y })
  }

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>): void => {
    const cursorX = event.clientX
    const cursorY = event.clientY

    const newZoom = event.deltaY < 0 ? zoom + 0.1 : zoom - 0.1
    const roundedZoom = Math.round(newZoom * 10) / 10 || 1

    setPosition((prevPosition) => {
      const deltaX = cursorX - prevPosition.x
      const deltaY = cursorY - prevPosition.y

      const newX = prevPosition.x + deltaX * (1 - roundedZoom / zoom)
      const newY = prevPosition.y + deltaY * (1 - roundedZoom / zoom)

      return { x: newX, y: newY }
    })
    setZoom(roundedZoom)
  }

  return (
    <div className='board'>
      <div
        className='board-wrapper'
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseLeave={() => setDragging(false)}
        onWheel={handleWheel}
        style={{
          cursor: dragging ? 'grabbing' : 'grab',
          backgroundPositionX: position.x,
          backgroundPositionY: position.y,
          backgroundSize: `${15 * (1 + zoom)}%`,
        }}
      >
        <div className='actions'>
          <button
            onMouseDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            onClick={handleBackPosition}
          >
            Назад
          </button>
          <div>Zoom: {zoom}</div>
        </div>
        <div
          className='board-wrapper-window'
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transformOrigin: 'center',
          }}
        >
          <Card
            name='Карточка 1'
            scale={zoom}
          />
          <Card
            name='Карточка 2'
            scale={zoom}
          />
          <Card
            name='Карточка 3'
            scale={zoom}
          />
          <Card
            name='Карточка 4'
            scale={zoom}
          />
        </div>
      </div>
    </div>
  )
}
