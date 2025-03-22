import classNames from 'classnames'
import React from 'react'

import './styles.css'

export type PlateStatus = 'default' | 'error' | 'success' | 'warning' | 'info'

type Props = {
  text?: string
  status?: PlateStatus
}

export const Plate: React.FC<Props> = ({ text, status = 'default' }) => {
  return <div className={classNames('plate', `plate-${status}`)}>{text}</div>
}
