import React, { useState, useRef, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import '@/components/App/App.css'

import { Card, Menu } from '@/components'
import { useLatest } from '@/hooks'
import { Position } from '@/types'
import { rafThrottle } from '@/utils'

type CardType = {
  id: string
  name: string
  text?: string
  coordinates: Position
}

const cardWidth = 155
const cardHeight = 275

export const App: React.FC = () => {
  const backgroundRef = useRef<HTMLDivElement>(null)
  const [cards, setCards] = useState<CardType[]>([])
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [zoom, setZoom] = useState(1)
  const zoomCb = useLatest(zoom)

  const lastClientPosition = useRef<Position>({ x: 0, y: 0 })
  const lastCoordinatePosition = useRef<Position>({ x: 0, y: 0 })

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>): void => {
    setDragging(true)
    lastClientPosition.current = { x: event.clientX, y: event.clientY }
    lastCoordinatePosition.current = { ...position }
  }

  const handleMouseUp = (): void => {
    setDragging(false)
  }

  const handleMouseMove = (event: MouseEvent): void => {
    if (!dragging) {
      return
    }

    const deltaX = event.clientX - lastClientPosition.current.x
    const deltaY = event.clientY - lastClientPosition.current.y

    setPosition((prev) => ({ x: prev.x + deltaX, y: prev.y + deltaY }))
    lastClientPosition.current = { x: event.clientX, y: event.clientY }
  }

  const handleWheel = (event: WheelEvent): void => {
    const zoom = zoomCb.current

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

  const handleBackPosition = (): void => {
    const { x, y } = cards.at(-1)?.coordinates ?? { x: 0, y: 0 }

    setPosition({
      x: -x * zoom + (window.innerWidth - cardWidth) / 2,
      y: -y * zoom + (window.innerHeight - cardHeight) / 2,
    })
  }

  const handleAddCard = (): void => {
    setCards((prev) => [
      ...prev,
      {
        id: uuidv4(),
        name: `Карточка ${prev.length + 1}`,
        coordinates: {
          x: (-position.x + (window.innerWidth - cardWidth) / 2) / zoom,
          y: (-position.y + (window.innerHeight - cardHeight) / 2) / zoom,
        },
      },
    ])
  }

  const handleEditCardText = useCallback((id: string, text?: string) => {
    setCards((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              text,
            }
          : item
      )
    )
  }, [])

  const handleMoveEndCard = useCallback(
    (id: string, coordinates: Position): void => {
      setCards((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                coordinates,
              }
            : item
        )
      )
    },
    []
  )

  const handleMouseMoveCb = useLatest(handleMouseMove)
  const handleWheelCb = useLatest(handleWheel)

  useEffect(() => {
    const backgroundContainer = backgroundRef.current
    if (!backgroundContainer) {
      return
    }

    const onWheel = (event: WheelEvent): void => {
      handleWheelCb.current(event)
    }

    const onMouseMove = rafThrottle((event: MouseEvent) => {
      handleMouseMoveCb.current(event)
    })

    backgroundContainer.addEventListener('wheel', onWheel)
    backgroundContainer.addEventListener('mousemove', onMouseMove)

    return (): void => {
      backgroundContainer.removeEventListener('wheel', onWheel)
      backgroundContainer.removeEventListener('mousemove', onMouseMove)
    }
  }, [zoomCb, handleMouseMoveCb, handleWheelCb])

  return (
    <div className='board'>
      <Menu
        zoom={zoom}
        onBack={handleBackPosition}
        onAddCard={handleAddCard}
      />
      <div
        ref={backgroundRef}
        className='board-background'
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
        onMouseLeave={() => setDragging(false)}
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
            key={card.id}
            zoom={zoom}
            onEndEdit={handleEditCardText}
            onMoveEnd={handleMoveEndCard}
            {...card}
          />
        ))}
      </div>
    </div>
  )
}
