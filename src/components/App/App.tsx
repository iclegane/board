import React, { useState, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import '@/components/App/App.css'

import { Card, Menu } from '@/components'

type PositionType = { x: number; y: number }
type CardType = { id: string; name: string } & PositionType

export const App: React.FC = () => {
  const [cards, setCards] = useState<CardType[]>([])
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
    const { x, y } = cards.at(-1) ?? { x: 0, y: 0 }
    setPosition({ x: -x * zoom, y: -y * zoom })
  }

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>): void => {
    const cursorX = event.clientX
    const cursorY = event.clientY

    let newZoom = zoom
    const zoomChange = event.deltaY < 0 ? 0.1 : -0.1
    const updatedZoom = newZoom + zoomChange
    if (updatedZoom > 0 && updatedZoom <= 3) {
      newZoom = updatedZoom
    }

    const roundedZoom = Math.round(newZoom * 10) / 10

    setPosition((prevPosition) => {
      const deltaX = cursorX - prevPosition.x
      const deltaY = cursorY - prevPosition.y

      const newX = prevPosition.x + deltaX * (1 - roundedZoom / zoom)
      const newY = prevPosition.y + deltaY * (1 - roundedZoom / zoom)

      return { x: newX, y: newY }
    })
    setZoom(roundedZoom)
  }

  const handleAddCard = (): void => {
    setCards((prev) => [
      ...prev,
      {
        id: uuidv4(),
        name: `Карточка ${prev.length + 1}`,
        x: -position.x / zoom,
        y: -position.y / zoom,
      },
    ])
  }

  const handleMoveCard = (id: string, deltaX: number, deltaY: number): void => {
    setCards((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              x: item.x + deltaX / zoom,
              y: item.y + deltaY / zoom,
            }
          : item
      )
    )
  }

  return (
    <div className='board'>
      <Menu
        zoom={zoom}
        onBack={handleBackPosition}
        onAddCard={handleAddCard}
      />
      <div
        className='board-background'
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseLeave={() => setDragging(false)}
        onWheel={handleWheel}
        style={{
          cursor: dragging ? 'grabbing' : 'grab',
          backgroundPositionX: position.x,
          backgroundPositionY: position.y,
          backgroundSize: `${500 * zoom}px`,
        }}
      />
      <div
        className='board-content'
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
        }}
      >
        {cards.map((card) => (
          <Card
            id={card.id}
            key={card.id}
            name={card.name}
            coordination={{ x: card.x, y: card.y }}
            onMove={handleMoveCard}
          />
        ))}
      </div>
    </div>
  )
}
