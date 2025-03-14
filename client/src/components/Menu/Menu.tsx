import React from 'react'

import { Button } from '@/components'

import './styles.css'

type MenuType = {
  zoom: number
  onAddCard?: VoidFunction
  onBack?: VoidFunction
}

export const Menu: React.FC<MenuType> = ({ zoom, onAddCard, onBack }) => {
  return (
    <div className='actions'>
      <Button onClick={onBack}>Назад</Button>
      <Button onClick={onAddCard}>Добавить карточку</Button>
      <div>Zoom: {zoom}</div>
    </div>
  )
}
