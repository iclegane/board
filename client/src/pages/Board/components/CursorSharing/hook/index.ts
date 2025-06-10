import { useEffect, useState } from 'react'

import { WS_TYPES } from '@/constants'
import { useLatest } from '@/hooks'
import { WebSocketService, type ResponseMessage } from '@/service/WebSocket.ts'
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
        type: WS_TYPES.CURSOR.MOVE,
        data: {
          position: {
            x: relativeX,
            y: relativeY,
          },
        },
      })
    }

    const onMouseMoveThrottled = rafThrottle(onMouseMove)

    document.addEventListener('mousemove', onMouseMoveThrottled)
    return () => document.removeEventListener('mousemove', onMouseMoveThrottled)
  }, [])

  useEffect(() => {
    const handleOnMessage = (message: ResponseMessage) => {
      if (message.type !== WS_TYPES.CURSOR.MOVED) {
        return
      }

      const { login } = message.from
      const { position } = message.data
      setRemoteCursors((prev) => ({
        ...prev,
        [message.from.id]: {
          login,
          ...position,
        },
      }))
    }

    WebSocketService.onMessage(handleOnMessage)
    return () => {
      WebSocketService.offMessage(handleOnMessage)
    }
  }, [])

  return remoteCursors
}
