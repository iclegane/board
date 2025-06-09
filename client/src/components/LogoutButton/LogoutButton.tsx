import React from 'react'
import { useNavigate } from 'react-router'

import { Button } from '@/components'
import { PAGES_PATH } from '@/constants'
import { useAuth } from '@/context/AuthContext.tsx'

export const LogoutButton: React.FC = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    logout().then(() => {
      navigate(PAGES_PATH.LOGIN)
    })
  }

  return (
    <Button
      onClick={handleLogout}
      type={'button'}
    >
      Logout
    </Button>
  )
}
