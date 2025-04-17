import React, { ReactNode } from 'react'

import { useAuth } from '@/context/AuthContext.tsx'

import './styles.css'

type Props = {
  children: ReactNode
}

export const GlobalLoadingIndicator: React.FC<Props> = ({ children }) => {
  const { isCheckAuthLoading } = useAuth()

  return (
    <div className='global-loader-container'>
      {children}
      {isCheckAuthLoading && (
        <div className='global-loader-overlay'>
          <div className='global-loader-content'>
            <span className='global-loader-spinner'></span>
            <span className='global-loader__text'>Loading...</span>
          </div>
        </div>
      )}
    </div>
  )
}
