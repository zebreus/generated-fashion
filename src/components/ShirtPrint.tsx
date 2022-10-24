import { QrCode } from "components/QrCode"

type ShirtPrintProps = {
  imageUrl: string
  prompt: string
  qrCodeUrl: string
  qrCodeText: string
}

export const ShirtPrint = ({ imageUrl, prompt, qrCodeUrl, qrCodeText }: ShirtPrintProps) => {
  imageUrl
  prompt
  qrCodeUrl
  qrCodeText
  //   const element = generatedQrElement()
  return (
    <div style={{ width: "100%", height: "100%", background: "transparent", display: "flex", flexDirection: "column" }}>
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
        <h1 style={{ fontSize: "128px" }}>{prompt}</h1>
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
        <div style={{ width: "300px", height: "300px", display: "flex" }}>
          <QrCode data={qrCodeUrl} />
        </div>
        <h2 style={{ fontSize: "20px" }}>{qrCodeText}</h2>
      </div>
    </div>
  )
}
