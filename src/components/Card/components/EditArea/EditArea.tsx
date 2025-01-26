import React, { useState, memo, useRef, useEffect, forwardRef } from 'react'

import './styles.css'

type Props = {
  isEdit: boolean
  text?: string
  onBlur: (txt?: string) => void
}

export const EditArea: React.FC<Props> = memo(({ text, isEdit, onBlur }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const textElementRef = useRef<HTMLDivElement | null>(null)
  const areaElementRef = useRef<HTMLTextAreaElement | null>(null)

  const [tempValue, setTempValue] = useState<string | null>(null)
  const [fontSize, setFontSize] = useState(16) // Начальный размер шрифта

  const value = tempValue ?? text

  // Изменение размера текста
  useEffect(() => {
    const adjustFontSize = () => {
      const container = containerRef.current

      const element = areaElementRef.current ?? textElementRef.current

      if (!container || !element) return

      let currentFontSize = fontSize
      container.style.fontSize = `${currentFontSize}px`

      if (element) {
        while (
          (element.scrollWidth > container.offsetWidth ||
            element.scrollHeight > container.offsetHeight) &&
          currentFontSize > 1
        ) {
          currentFontSize -= 1
          container.style.fontSize = `${currentFontSize}px`
        }
      }

      setFontSize(currentFontSize)
    }

    adjustFontSize()
  }, [value, fontSize, isEdit])

  return (
    <div
      ref={containerRef}
      className='editArea-container'
      style={{ fontSize: `${fontSize}px` }}
    >
      {isEdit ? (
        <div ref={textElementRef}>{text}</div>
      ) : (
        <TextArea
          ref={areaElementRef}
          value={value}
          onInput={(e) => setTempValue((e.target as HTMLTextAreaElement).value)}
          onBlur={(e) => {
            setTempValue(null)
            onBlur(e.target.value)
          }}
          autoFocus
        />
      )}
    </div>
  )
})

const TextArea = forwardRef<
  HTMLTextAreaElement,
  React.HTMLProps<HTMLTextAreaElement>
>((props, ref) => {
  // Позиция каретки в тексте
  useEffect(() => {
    const textareaRef = ref as React.RefObject<HTMLTextAreaElement>
    if (textareaRef?.current) {
      const length = textareaRef.current.value.length
      textareaRef.current.setSelectionRange(length, length)
    }
  }, [ref])

  return (
    <textarea
      ref={ref}
      {...props}
    />
  )
})
