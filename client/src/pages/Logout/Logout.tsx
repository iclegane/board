import React from 'react'

import { BoxedLayout, LogoutButton } from '@/components'

export const Logout: React.FC = () => {
  return (
    <BoxedLayout title={'Logout page'}>
      <LogoutButton />
    </BoxedLayout>
  )
}
