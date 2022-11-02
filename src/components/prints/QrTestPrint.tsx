import { QrCode } from "components/QrCode"

type QrTestPrintProps = {
  height: number
  width: number
  scale?: number
}

export const QrWithText = ({
  size,
  url,
  errorCorrection,
  scale,
}: {
  url: string
  errorCorrection?: "low" | "medium" | "quartile" | "high"
} & ({ size?: undefined; scale: number } | { scale?: undefined; size: number })) => {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: `${(size ?? scale * 29) * 0.2}px`,
      }}
    >
      <h2 style={{ fontSize: "15x", margin: "12px" }}>
        ecl: {errorCorrection ?? "medium"} | size: {scale ? scale + "px per dot" : ""}
        {size ? size + "px" : ""}
      </h2>
      <div
        style={{
          width: size ? `${size}px` : "auto",
          height: size ? `${size}px` : "auto",
          display: "flex",
          gap: "0",
          position: "relative",
          bottom: "0",
        }}
      >
        <QrCode data={url} errorCorrection={errorCorrection} scale={scale} />
      </div>
      {/* <h2 style={{ fontSize: "20px", margin: "12px" }}>{text}</h2> */}
    </div>
  )
}

export const QrTestPrint = ({ height, width, scale }: QrTestPrintProps) => {
  const qrCodeUrl = "https://generated.fashion/shirt/qrcodes"
  const testSizes = [300, 200, 150, 100]
  const testScales = [6, 5, 4, 3, 2, 1]
  const testEcl = ["low", "medium", "quartile", "high"] as const

  return (
    <div
      style={{
        width: width + "px",
        height: height + "px",
        background: "transparent",
        display: "flex",
        flexDirection: "row",
        transform: `scale(${scale || 1})`,
        transformOrigin: "top left",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1
        style={{
          fontSize: "150px",
          flexGrow: "1",
          flexBasis: "100%",
          minWidth: "100%",
          textAlign: "center",
          marginLeft: "500px",
          textAnchor: "middle",
          width: "100%",
        }}
      >
        Testing QR codes
      </h1>
      {testSizes.map(size =>
        testEcl.map(errorCorrection => (
          <QrWithText
            key={size + "-" + errorCorrection}
            url={qrCodeUrl}
            size={size}
            errorCorrection={errorCorrection}
          />
        ))
      )}
      {testScales.map(scale =>
        testEcl.map(errorCorrection => (
          <QrWithText
            key={"scale" + "-" + scale + "-" + errorCorrection}
            url={qrCodeUrl}
            scale={scale}
            errorCorrection={errorCorrection}
          />
        ))
      )}
    </div>
  )
}
