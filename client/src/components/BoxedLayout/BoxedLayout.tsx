import React from 'react'

import './styles.css'

type Props = {
  children: React.ReactNode
  title?: string
}

export const BoxedLayout: React.FC<Props> = ({ title, children }) => {
  return (
    <div className='centered-container'>
      <div className='centered-box'>
        <div className='centered-box-content'>
          {title && <h1>{title}</h1>}
          {children}
        </div>
      </div>
    </div>
  )
}
