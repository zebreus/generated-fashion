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

export const ShirtPrint = ({ imageUrl, prompt, qrCodeUrl, qrCodeText, height, width, scale }: ShirtPrintProps) => {
  imageUrl
  prompt
  qrCodeUrl
  qrCodeText

  // const heightInCm = 16 * 2.54
  const vh = (value: number) => {
    return `${(value / 100) * height}px`
  }
  // const vw = (value: number) => {
  //   return `${(value / 100) * width}px`
  // }
  // const cm = (value: number) => {
  //   return `${(value / heightInCm) * height}px`
  // }

  //   const element = generatedQrElement()
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
        <h1 style={{ fontSize: vh(5) }}>{prompt}</h1>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "0",
          left: "0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ width: "300px", height: "300px", display: "flex", gap: "0", position: "relative", bottom: "0" }}>
          <QrCode data={qrCodeUrl} />
        </div>
        <h2 style={{ fontSize: "20px" }}>{qrCodeText}</h2>
      </div>
    </div>
  )
}
