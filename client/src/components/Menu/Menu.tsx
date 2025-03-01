import React from 'react'
import './styles.css'

type MenuType = {
  zoom: number
  onAddCard?: VoidFunction
  onBack?: VoidFunction
}

export const Menu: React.FC<MenuType> = ({ zoom, onAddCard, onBack }) => {
  return (
    <div className='actions'>
      <button onClick={onBack}>Назад</button>
      <button onClick={onAddCard}>Добавить карточку</button>
      <div>Zoom: {zoom}</div>
    </div>
  )
}
