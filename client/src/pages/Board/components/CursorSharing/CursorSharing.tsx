import React from 'react'

import { Cursor } from '@/pages/Board/components/CursorSharing/Cursor.tsx'
import { useCursorSharing } from '@/pages/Board/components/CursorSharing/hook'

import './style.css'

type Props = {
  x: number
  y: number
  zoom: number
}

export const CursorSharing: React.FC<Props> = ({ x, y, zoom }) => {
  const remoteCursors = useCursorSharing({
    position: {
      x,
      y,
    },
    zoom,
  })
  return (
    <>
      {Object.entries(remoteCursors).map(([userId, cursor]) => {
        const screenX = cursor.x * zoom + x
        const screenY = cursor.y * zoom + y

        return (
          <Cursor
            key={userId}
            id={userId}
            login={cursor.login}
            y={screenY}
            x={screenX}
          />
        )
      })}
    </>
  )
}
