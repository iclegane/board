import { useEffect, useState } from 'react'

import { useLatest } from '@/hooks'
import { WebSocketService, type Message } from '@/service/WebSocket.ts'
import { rafThrottle } from '@/utils/throttle.ts'

type CursorData = {
  login: string
  x: number
  y: number
}

type UseCursorSharingParams = {
  position: { x: number; y: number }
  zoom: number
}

export const useCursorSharing = ({
  position,
  zoom,
}: UseCursorSharingParams) => {
  const [remoteCursors, setRemoteCursors] = useState<
    Record<string, CursorData>
  >({})

  const x = useLatest(position.x)
  const y = useLatest(position.y)
  const zoomCb = useLatest(zoom)

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      const relativeX = (event.clientX - x.current) / zoomCb.current
      const relativeY = (event.clientY - y.current) / zoomCb.current

      WebSocketService.send({
        type: 'cursor_move',
        position: {
          x: relativeX,
          y: relativeY,
        },
      })
    }

    const onMouseMoveThrottled = rafThrottle(onMouseMove)

    document.addEventListener('mousemove', onMouseMoveThrottled)
    return () => document.removeEventListener('mousemove', onMouseMoveThrottled)
  }, [])

  useEffect(() => {
    const handleOnMessage = (message: Message) => {
      if (message.type === 'cursor_move') {
        setRemoteCursors((prev) => ({
          ...prev,
          [message.from.id]: {
            login: message.from.login,
            x: message.position.x,
            y: message.position.y,
          },
        }))
      }
    }

    WebSocketService.onMessage(handleOnMessage)
    return () => {
      WebSocketService.offMessage(handleOnMessage)
    }
  }, [])

  return remoteCursors
}
