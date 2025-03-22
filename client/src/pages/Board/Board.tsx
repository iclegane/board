import React, { useCallback, useEffect, useRef, useState } from 'react'

import { api } from '@/api/axios'
import { Card, Menu, RightMenu } from '@/components'
import { API_PATH } from '@/constants'
import { useLatest } from '@/hooks'
import { Position } from '@/types'
import { rafThrottle } from '@/utils'

import './Board.css'

type CardType = {
  id: string
  name: string
  text?: string
  coordinates: Position
}

const cardWidth = 155
const cardHeight = 275

export const Board: React.FC = () => {
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

  const handleAddCard = async () => {
    try {
      const name = 'Card'
      const x = (-position.x + (window.innerWidth - cardWidth) / 2) / zoom
      const y = (-position.y + (window.innerHeight - cardHeight) / 2) / zoom
      const response = await api.post('/board/card', { name, x, y })
      const id = response.data.payload.id
      setCards((prev) => [
        ...prev,
        {
          id,
          name,
          coordinates: {
            x,
            y,
          },
        },
      ])
    } catch (e) {
      console.log(e)
    }
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

  // Перемещение и сайзинг доски
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

    const onMouseLeave = () => {
      setDragging(false)
    }

    const onMouseUp = () => {
      setDragging(false)
    }

    document.addEventListener('wheel', onWheel)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseleave', onMouseLeave)

    document.addEventListener('mouseup', onMouseUp)

    return (): void => {
      document.removeEventListener('wheel', onWheel)
      document.removeEventListener('mouseleave', onMouseMove)
      document.addEventListener('mouseleave', onMouseLeave)

      document.addEventListener('mouseup', onMouseUp)
    }
  }, [zoomCb, handleMouseMoveCb, handleWheelCb])

  useEffect(() => {
    const getCards = async () => {
      try {
        const response = await api.get(API_PATH.CARD)
        const cards = response.data.payload
        setCards(cards)
      } catch (e) {
        console.error(e)
      }
    }

    getCards()
  }, [])

  return (
    <div className='board'>
      <Menu
        zoom={zoom}
        onBack={handleBackPosition}
        onAddCard={handleAddCard}
      />
      <RightMenu />
      <div
        ref={backgroundRef}
        className='board-background'
        onMouseDown={handleMouseDown}
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
