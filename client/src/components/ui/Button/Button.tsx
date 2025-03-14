import classNames from 'classnames'
import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'

import { Size } from '@/components/ui'

import './styles.css'

type Props = {
  children: React.ReactNode
  size?: Size
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

export const Button: React.FC<Props> = ({
  children,
  size = 'default',
  ...btnProps
}) => {
  return (
    <button
      className={classNames('button', `button-${size}`)}
      {...btnProps}
    >
      {children}
    </button>
  )
}
