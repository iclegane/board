import React from 'react'

import { Button, Input, Password } from '@/components'
import { useField } from '@/hooks'

import './styles.css'

export const CreateAccountForm: React.FC<{}> = () => {
  const login = useField<string | undefined>({
    validator: (value) => !!value && value.length > 0,
  })
  const password = useField<string | undefined>({
    validator: (value) => !!value && value.length > 0,
  })
  const passwordConfirm = useField<string | undefined>({
    validator: (value) => !!value && value.length > 0,
  })

  const isSubmitDisabled =
    login.isError || password.isError || passwordConfirm.isError

  const handleOnFormSubmit = (e: React.FormEvent<HTMLFormElement>) =>
    e.preventDefault()

  return (
    <form
      name='create-form'
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
        placeholder='Password'
        showPasswordBtn
      />
      <Password
        value={passwordConfirm.value}
        status={passwordConfirm.isError ? 'error' : undefined}
        onChange={passwordConfirm.handleChange}
        name={'passwordConfirm'}
        placeholder='Repeat the password'
        showPasswordBtn
      />

      <Button
        type={'submit'}
        disabled={isSubmitDisabled}
      >
        Create account
      </Button>
    </form>
  )
}
