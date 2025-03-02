import React from 'react'

import { Button, Input, Password } from '@/components'
import { useField } from '@/hooks'

import './styles.css'

export const LoginForm: React.FC<{}> = () => {
  const login = useField<string | undefined>({
    validator: (value) => !!value && value.length > 0,
  })
  const password = useField<string | undefined>({
    validator: (value) => !!value && value.length > 0,
  })

  const isSubmitDisabled = login.isError || password.isError

  const handleOnFormSubmit = (e: React.FormEvent<HTMLFormElement>) =>
    e.preventDefault()

  return (
    <form
      name='login-form'
      onSubmit={handleOnFormSubmit}
      className={'login-form'}
    >
      <Input
        value={login.value}
        status={login.isError ? 'error' : undefined}
        onChange={login.handleChange}
        name={'login'}
        placeholder='Login'
      />
      <Password
        value={password.value}
        status={password.isError ? 'error' : undefined}
        onChange={password.handleChange}
        name={'password'}
        showPasswordBtn
        placeholder='Password'
      />

      <Button
        type={'submit'}
        disabled={isSubmitDisabled}
      >
        Log in
      </Button>
    </form>
  )
}
