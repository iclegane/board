import React from 'react'

import { LogoutButton } from '@/components'

import './styles.css'

export const RightMenu: React.FC = () => {
  return (
    <div className='right-menu'>
      <LogoutButton />
    </div>
  )
}
