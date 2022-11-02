import { QrCode } from "components/QrCode"

type ShirtPrintProps = {
  imageUrl: string
  prompt: string
  qrCodeUrl: string
  qrCodeText: string
  height: number
  width: number
  scale?: number
}

type PromptDisplayProps = {
  prompt: string
  maxCharacters?: number
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

export const PromptDisplay = ({ prompt, maxCharacters = 370 }: PromptDisplayProps) => {
  const shortenedPrompt = truncateText(prompt, maxCharacters).replace(/^./, v => v.toUpperCase())

  const fontSizes = [
    {
      upTo: 13, // One line
      fontSize: 250,
    },
    {
      upTo: 20, // One line
      fontSize: 200,
    },
    {
      upTo: 50, // Two lines
      fontSize: 150,
    },
    {
      upTo: 65, // Two lines
      fontSize: 120,
    },
    {
      upTo: 103, // Three lines
      fontSize: 100,
    },
    {
      upTo: 180, // 4 lines
      fontSize: 80,
    },
    {
      upTo: 255, // 5 lines
      fontSize: 70,
    },
    {
      upTo: 370, // 6 lines
      fontSize: 60,
    },
  ]

  const fontSize = fontSizes.find(({ upTo }) => upTo > shortenedPrompt.length)?.fontSize

  return (
    <>
      <h3 style={{ fontSize: `${fontSize}px`, textAlign: "center" }}>{shortenedPrompt}</h3>
    </>
  )
}

export const ShirtPrint = ({ imageUrl, prompt, qrCodeUrl, qrCodeText, height, width, scale }: ShirtPrintProps) => {
  imageUrl
  prompt
  qrCodeUrl
  qrCodeText

  return (
    <div
      style={{
        width: width + "px",
        height: height + "px",
        background: "transparent",
        display: "flex",
        flexDirection: "column",
        transform: `scale(${scale || 1})`,
        transformOrigin: "top left",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          right: "0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element*/}
        <img src={imageUrl} alt="shirt motif" style={{ width: "100%", aspectRatio: "1", objectFit: "cover" }} />
        <PromptDisplay prompt={prompt} />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "0",
          left: "0",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {/* <div style={{ width: "300px", height: "300px", display: "flex", gap: "0", position: "relative", bottom: "0" }}> */}
        <QrCode data={qrCodeUrl} scale={3} errorCorrection={"quartile"} />
        {/* </div> */}
        <h2 style={{ fontSize: "20px", margin: "12px" }}>{qrCodeText}</h2>
      </div>
    </div>
  )
}
