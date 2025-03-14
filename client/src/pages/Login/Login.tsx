import React from 'react'

import { BoxedLayout } from '@/components'
import { LoginForm } from '@/pages/Login/components'

import './Login.css'

export const Login: React.FC = () => {
  return (
    <BoxedLayout title={'Login page'}>
      <LoginForm />
    </BoxedLayout>
  )
}
