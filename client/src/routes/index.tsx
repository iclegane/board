import React from 'react'
import { Navigate, Outlet } from 'react-router'

import { PAGES_PATH } from '@/constants'
import { useAuth } from '@/context/AuthContext.tsx'

export const AuthOnly: React.FC = () => {
  const { isLogged } = useAuth()
  return isLogged ? (
    <Outlet />
  ) : (
    <Navigate
      to={PAGES_PATH.LOGIN}
      replace
    />
  )
}

export const GuestOnly: React.FC = () => {
  const { isLogged } = useAuth()
  return isLogged ? (
    <Navigate
      to={PAGES_PATH.BOARD}
      replace
    />
  ) : (
    <Outlet />
  )
}
