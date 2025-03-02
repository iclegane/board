import React from 'react'

import { BoxedLayout } from '@/components'
import { CreateAccountForm } from '@/pages/CreateAccount/components/CreateAccountForm'

export const CreateAccount: React.FC = () => {
  return (
    <BoxedLayout title={'Create account'}>
      <CreateAccountForm />
    </BoxedLayout>
  )
}
