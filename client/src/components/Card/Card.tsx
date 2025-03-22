import React, { useState, useRef, useEffect, memo } from 'react'

import { EditArea } from './components'

import { useLatest } from '@/hooks'
import { WebSocketService, type Message } from '@/service/WebSocket.ts'
import { Position } from '@/types'
import { rafThrottle } from '@/utils'

import './styles.css'

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
    const lastPosition = useRef(coordinates)

    const [isEditMode, setIsEditMode] = useState<boolean>(false)
    const [tempPosition, setTempPosition] = useState<Position | null>(null)
    const [dragging, setDragging] = useState(false)

    const idCb = useLatest(id)
    const tempPositionCb = useLatest(tempPosition)

    const [isRemoteDragging, setIsRemoteDragging] = useState(false)
    const [remoteLogin, setRemoteLogin] = useState(null)

    const position = tempPosition ?? coordinates

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
      if (isEditMode) {
        return
      }

      setDragging(true)
      setTempPosition(coordinates)
      lastPosition.current = { x: event.clientX, y: event.clientY }

      WebSocketService.send({
        type: 'start',
        id,
        position: coordinates,
      })
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!dragging || isRemoteDragging) return

      const deltaX = event.clientX - lastPosition.current.x
      const deltaY = event.clientY - lastPosition.current.y

      setTempPosition((prev) => {
        if (prev === null) {
          return prev
        }

        const x = prev.x + deltaX / zoom
        const y = prev.y + deltaY / zoom
        WebSocketService.send({ type: 'move', id, position: { x, y } })
        return { x, y }
      })
      lastPosition.current = { x: event.clientX, y: event.clientY }
    }

    const handleMouseUp = () => {
      setDragging(false)

      if (tempPosition) {
        onMoveEnd(id, { ...tempPosition })
        setTempPosition(null)
        WebSocketService.send({
          type: 'end',
          id,
          position: tempPosition,
        })
      }
    }

    const onMouseMoveCb = useLatest(handleMouseMove)
    const onMouseUpCb = useLatest(handleMouseUp)

    // Перемещение карточки
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

    // Вкл | Выкл режима редактирования
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

    // Возврат к прошлой позиции по ESC при перемещении
    useEffect(() => {
      if (!dragging) {
        return
      }

      const handleKeyPress = (event: KeyboardEvent): void => {
        if (event.key === 'Escape') {
          setDragging(false)
          setTempPosition(null)

          WebSocketService.send({
            type: 'end',
            id,
            position: coordinates,
          })
        }
      }

      document.addEventListener('keydown', handleKeyPress)

      return (): void => {
        document.removeEventListener('keydown', handleKeyPress)
      }
    }, [dragging])

    // Подписка WebSocketService
    useEffect(() => {
      const handleMessage = (msg: Message) => {
        if (idCb.current === msg.id) {
          setRemoteLogin(msg.from.login)
          if (msg.type === 'start' || msg.type === 'move') {
            setTempPosition(msg.position)
            setIsRemoteDragging(true)
          }

          if (msg.type === 'end') {
            setTempPosition(msg.position)
            setIsRemoteDragging(false)
            setRemoteLogin(null)

            if (tempPositionCb.current) {
              onMoveEnd(id, { ...tempPositionCb.current })
            }
          }
        }
      }

      WebSocketService.onMessage(handleMessage)
      return () => {
        WebSocketService.offMessage(handleMessage)
      }
    }, [idCb, tempPositionCb])

    return (
      <div
        ref={cardRef}
        className='card'
        onMouseDown={handleMouseDown}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          cursor: dragging ? 'grabbing' : 'grab',
          zIndex: dragging || isRemoteDragging ? 1 : 0,
          borderColor: dragging
            ? '#3364ed'
            : isRemoteDragging
              ? '#50b5ff'
              : '#dcdcdc',
        }}
      >
        {remoteLogin && <div className={'badge'}>{remoteLogin}</div>}
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
