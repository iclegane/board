import React, { useState, useRef } from 'react'
import '@/components/App/App.css'

type PositionType = { x: number; y: number }

export const App: React.FC = () => {
  const [position, setPosition] = useState<PositionType>({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)

  const lastPosition = useRef<PositionType>({ x: 0, y: 0 })

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>): void => {
    setDragging(true)
    lastPosition.current = { x: event.clientX, y: event.clientY }
  }

  const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>): void => {
    setDragging(false)
    lastPosition.current = { x: event.clientX, y: event.clientY }
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>): void => {
    if (!dragging) {
      return
    }

    const deltaX = event.clientX - lastPosition.current.x
    const deltaY = event.clientY - lastPosition.current.y

    setPosition((prev) => {
      const newPosition = { x: prev.x + deltaX, y: prev.y + deltaY }

      document.documentElement.style.setProperty(
        '--background-x',
        `${newPosition.x}px`
      )
      document.documentElement.style.setProperty(
        '--background-y',
        `${newPosition.y}px`
      )

      return newPosition
    })

    lastPosition.current = { x: event.clientX, y: event.clientY }
  }

  const handleBackPosition = (): void => {
    setPosition({ x: 0, y: 0 })

    document.documentElement.style.setProperty('--background-x', `${0}px`)
    document.documentElement.style.setProperty('--background-y', `${0}px`)
  }

  return (
    <div
      className='board-container'
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
    >
      <button onClick={handleBackPosition}>Назад</button>
      <div
        className='board-container-window'
        style={{
          cursor: dragging ? 'grabbing' : 'grab',
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      >
        <div className='board-content'>target</div>
      </div>
    </div>
  )
}
