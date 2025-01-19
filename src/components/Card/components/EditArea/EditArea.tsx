import React, { useState, memo, useRef, useEffect } from 'react'

import './styles.css'

type Props = {
  isEdit: boolean
  text?: string
  onBlur: (txt?: string) => void
}

export const EditArea: React.FC<Props> = memo(({ text, isEdit, onBlur }) => {
  const [value, setValue] = useState(text)

  return (
    <div className='editArea-container'>
      {isEdit ? (
        <div>{text}</div>
      ) : (
        <TextArea
          autoFocus
          value={value}
          onInput={(e) => setValue((e.target as HTMLTextAreaElement).value)}
          onBlur={(e) => onBlur(e.target.value)}
        />
      )}
    </div>
  )
})

const TextArea: React.FC<React.HTMLProps<HTMLTextAreaElement>> = (props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      const length = textareaRef.current.value.length

      textareaRef.current.setSelectionRange(length, length)
    }
  }, [])

  return (
    <textarea
      onScroll={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onMouseMove={(e) => e.stopPropagation()}
      ref={textareaRef}
      {...props}
    />
  )
}
