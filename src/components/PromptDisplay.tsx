type PromptDisplayProps = {
  prompt: string
  maxCharacters?: number
}

// function getTextWidth(text: string, font: string, lineWidth: number) {
//   const canvas = document.createElement("canvas")
//   const context = canvas.getContext("2d")

//   if (!context) {
//     throw new Error()
//   }

//   context.font = font
//   const metrics = context.measureText(text)
//   const lineHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
//   const width = metrics.width
//   const lines = Math.ceil(width / lineWidth)
//   const height = lines * lineHeight
//   return { width, height, lines, lineHeight }
// }

function getTextWidth(text: string, font: string) {
  const canvas = document.createElement("canvas")
  const context = canvas.getContext("2d")

  if (!context) {
    throw new Error()
  }

  context.font = font
  const metrics = context.measureText(text)
  const width = metrics.width
  return width
}

const truncateText = (prompt: string, maxWidth: number) => {
  if (prompt.length < maxWidth) {
    return prompt
  }

  const segments = prompt.split(/[;,.]/)
  const truncated = segments.reduce((acc, segment) => {
    const withSegment = acc + prompt[acc.length] + segment
    if (withSegment.length < maxWidth - 3) {
      return withSegment
    }
    return acc
  })

  if (truncated.length !== 0 && truncated.length > maxWidth * 0.5 && truncated.length < maxWidth) {
    return truncated + prompt[truncated.length] + " …"
  }

  return prompt.length > maxWidth ? prompt.slice(0, maxWidth - 1) + "…" : prompt
}

export const PromptDisplay = ({ prompt, maxCharacters = 105 }: PromptDisplayProps) => {
  const shortenedPrompt = truncateText(prompt, maxCharacters).replace(/^./, v => v.toUpperCase())

  const targetWidth = 280 * 3
  const fontFamily = getComputedStyle(document.body).fontFamily

  const fontSizes = ["1.5rem", "1.35rem", "1.2rem"]
  const fonts = fontSizes.map(fontSize => `bold ${fontSize} ${fontFamily}`)
  const lengths = fonts.map(font => getTextWidth(shortenedPrompt, font))
  const fontIndex = lengths.findIndex(length => length < targetWidth)

  const font = fontIndex === -1 ? fonts[fonts.length - 1] : fonts[fontIndex]
  console.log(lengths)

  return (
    <div className={`tooltip z-10 tooltip-bottom`} data-tip={prompt}>
      <h3 className="items-center text-center flex h-20 mx-5" style={{ font: font }}>
        {shortenedPrompt}
      </h3>
    </div>
  )
}
