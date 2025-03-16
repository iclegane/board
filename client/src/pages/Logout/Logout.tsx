import React from 'react'
import { useNavigate } from 'react-router'

import { BoxedLayout, Button } from '@/components'
import { useAuth } from '@/context/AuthContext.tsx'

export const Logout: React.FC = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    logout().then(() => {
      navigate('/login')
    })
  }

  return (
    <BoxedLayout title={'Logout page'}>
      <Button
        onClick={handleLogout}
        type={'button'}
      >
        Logout
      </Button>
    </BoxedLayout>
  )
}
