import React, { useEffect, useState } from 'react'

export const useAutoFontSize = (
  value: string,
  containerRef: React.MutableRefObject<HTMLDivElement | null>
): number => {
  const [fontSize, setFontSize] = useState(16)

  useEffect(() => {
    const adjustFontSize = () => {
      const container = containerRef.current
      if (!container) return

      const containerWidth = container.offsetWidth
      const containerHeight = container.offsetHeight
      if (!containerWidth || !containerHeight) return

      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      if (!context) return

      const fontFamily = getComputedStyle(container).fontFamily
      const lineHeight =
        parseFloat(getComputedStyle(container).lineHeight) || 1.2

      let minFontSize = 1
      let maxFontSize = 16
      let optimalFontSize = 16

      const spaceWidth = context.measureText(' ').width

      while (minFontSize <= maxFontSize) {
        const midFontSize = Math.floor((minFontSize + maxFontSize) / 2)
        context.font = `${midFontSize}px ${fontFamily}`

        const words = (value ?? '').split(' ')
        let line = ''
        let lines = 1

        for (let word of words) {
          const testWidth =
            context.measureText(line).width +
            context.measureText(word).width +
            spaceWidth

          if (testWidth > containerWidth) {
            lines++
            line = word + ' '
          } else {
            line = line + word + ' '
          }
        }

        const textHeight = lines * midFontSize * lineHeight

        if (textHeight <= containerHeight) {
          if (midFontSize === 16) {
            optimalFontSize = 16
            break
          }
          optimalFontSize = midFontSize
          minFontSize = midFontSize + 1
        } else {
          maxFontSize = midFontSize - 1
        }
      }

      setFontSize(optimalFontSize)
    }

    adjustFontSize()
  }, [value, containerRef])

  return fontSize
}
