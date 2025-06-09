import axios from 'axios'
import React, { useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { api } from '@/api/axios.ts'
import { Button, Input, Password } from '@/components'
import { Plate } from '@/components/ui/Plate'
import { API_PATH, PAGES_PATH } from '@/constants'

import './styles.css'

type FormValues = {
  login: string
  password: string
  passwordConfirmation: string
}

export const CreateAccountForm: React.FC = () => {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setServerError(null)
    setIsLoading(true)

    try {
      await api.post(API_PATH.CREATE, data)
      navigate(PAGES_PATH.LOGIN)
    } catch (error) {
      let errorMessage = 'Create account failed'

      if (axios.isAxiosError(error)) {
        errorMessage =
          error.response?.data?.message ||
          error.message ||
          'Create account failed'
      } else if (error instanceof Error) {
        errorMessage = error.message
      }

      setServerError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      name='create-form'
      onSubmit={handleSubmit(onSubmit)}
      className={'login-form'}
    >
      <Input
        {...register('login', {
          required: 'Login is required',
          minLength: {
            value: 3,
            message: 'Login must be at least 3 characters',
          },
          pattern: {
            value: /^[a-zA-Z0-9_]+$/,
            message: 'Invalid login format',
          },
        })}
        placeholder='Login'
        status={errors.login ? 'error' : 'default'}
      />
      {errors.login && (
        <Plate
          status='error'
          text={errors.login.message}
        />
      )}
      <Password
        {...register('password', {
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters',
          },
        })}
        placeholder='Password'
        status={errors.password ? 'error' : 'default'}
        showPasswordBtn
      />
      {errors.password && (
        <Plate
          status='error'
          text={errors.password.message}
        />
      )}
      <Password
        {...register('passwordConfirmation', {
          required: 'passwordConfirm is required',
          validate: (value, { password }) =>
            value === password || 'Passwords do not match',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters',
          },
        })}
        placeholder='Repeat the password'
        status={errors.passwordConfirmation ? 'error' : 'default'}
        showPasswordBtn
      />
      {errors.passwordConfirmation && (
        <Plate
          status='error'
          text={errors.passwordConfirmation.message}
        />
      )}

      <Button type={'submit'}>Create account</Button>

      {isLoading && 'loading...'}
      {serverError && (
        <Plate
          status='error'
          text={serverError}
        />
      )}
    </form>
  )
}
