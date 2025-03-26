import React from 'react'

type CursorProps = {
  id: string
  x: number
  y: number
  login: string
  color?: string
}

export const Cursor: React.FC<CursorProps> = ({
  id,
  login,
  x,
  y,
  color = '#4F46E5',
}) => {
  return (
    <div
      key={id}
      className='miro-cursor'
      style={{
        position: 'absolute',
        transform: `translate(${x}px, ${y}px)`,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          transformOrigin: 'top left',
        }}
      >
        <div className='cursor-pointer' />
        <div
          className='cursor-label'
          style={{ backgroundColor: color }}
        >
          {login}
        </div>
      </div>
    </div>
  )
}
