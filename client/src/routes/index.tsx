import React from 'react'
import { Navigate, Outlet } from 'react-router'

import { useAuth } from '@/context/AuthContext.tsx'

export const AuthOnly: React.FC = () => {
  const { isLogged } = useAuth()
  return isLogged ? (
    <Outlet />
  ) : (
    <Navigate
      to='/login'
      replace
    />
  )
}

export const GuestOnly: React.FC = () => {
  const { isLogged } = useAuth()
  return isLogged ? (
    <Navigate
      to='/board'
      replace
    />
  ) : (
    <Outlet />
  )
}
