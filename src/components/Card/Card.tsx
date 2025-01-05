import React, { useState, useRef } from 'react'

import './styles.css'

interface CardProps {
  name?: string
  text?: string
  scale: number
}

export const Card: React.FC<CardProps> = ({ name, text, scale }) => {
  const cardRef = useRef<HTMLDivElement>(null)

  const [dragging, setDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const lastPosition = useRef({ x: 0, y: 0 })

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>): void => {
    event.stopPropagation()
    setDragging(true)
    lastPosition.current = { x: event.clientX, y: event.clientY }
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>): void => {
    event.stopPropagation()
    if (!dragging) return

    const deltaX = (event.clientX - lastPosition.current.x) / scale
    const deltaY = (event.clientY - lastPosition.current.y) / scale

    setPosition((prevPosition) => {
      return { x: prevPosition.x + deltaX, y: prevPosition.y + deltaY }
    })

    lastPosition.current = { x: event.clientX, y: event.clientY }
  }

  const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>): void => {
    event.stopPropagation()
    setDragging(false)
  }

  return (
    <div
      className='card'
      ref={cardRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setDragging(false)}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: dragging ? 'grabbing' : 'grab',
        zIndex: dragging ? 1 : 0,
      }}
    >
      <div>{name}</div>
      <div>{text}</div>
    </div>
  )
}
