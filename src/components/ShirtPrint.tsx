import { QrCode } from "components/QrCode"
import { getShirtColor } from "functions/getColors"
import { WithRef } from "hooks/firestore/FirestoreDocument"
import { Prediction } from "types/firestore/prediction"

type ShirtPrintProps = {
  shirt: WithRef<Prediction>
  height: number
  width: number
  scale?: number
}

type PromptDisplayProps = {
  prompt: string
  textColor: string
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

export const PromptDisplay = ({ prompt, textColor, maxCharacters = 370 }: PromptDisplayProps) => {
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
      <h3 style={{ fontSize: `${fontSize}px`, textAlign: "center", color: textColor }}>{shortenedPrompt}</h3>
    </>
  )
}

export const ShirtPrint = ({ shirt, height, width, scale }: ShirtPrintProps) => {
  const prompt = shirt.customText ?? (shirt.prompt || "Test prompt")
  const imageUrl = shirt.resultUrl
    ? shirt.resultUrl
    : "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
  const qrCodeText = `generated.fashion/shirt/${shirt._ref.id}`
  const qrCodeUrl = `https://generated.fashion/shirt/${shirt._ref.id}`

  const shirtColor = getShirtColor(shirt)
  const textColor = shirtColor.dark ? "white" : "black"

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
        <PromptDisplay prompt={prompt} textColor={textColor} />
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
        <QrCode data={qrCodeUrl} scale={3} errorCorrection={"quartile"} darkBackground={shirtColor.dark} />
        {/* </div> */}
        <h2 style={{ fontSize: "20px", margin: "12px", color: textColor }}>{qrCodeText}</h2>
      </div>
    </div>
  )
}
