import React from 'react'
import { createPortal } from 'react-dom'

import { useAuth } from '@/context/AuthContext.tsx'

import './styles.css'

const loaderRoot = document.getElementById('widgets')

export const GlobalLoadingIndicator: React.FC = () => {
  const { isCheckAuthLoading } = useAuth()

  if (!isCheckAuthLoading || !loaderRoot) return null

  return createPortal(
    <div className='global-loader'>
      <div className='global-loader__content'>
        <div className='global-loader__spinner'></div>
        <span className='global-loader__text'>Loading...</span>
      </div>
    </div>,
    loaderRoot
  )
}
