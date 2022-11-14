import { QrCode } from "components/QrCode"

type QrTestPrintProps = {
  height: number
  width: number
}

export const QrWithText = ({
  size,
  url,
  errorCorrection,
  scale,
  darkBackground,
}: {
  url: string
  errorCorrection?: "low" | "medium" | "quartile" | "high"
  darkBackground?: boolean
} & ({ size?: undefined; scale: number } | { scale?: undefined; size: number })) => {
  const textcolor = darkBackground ? "white" : "black"

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
      <h2 style={{ fontSize: "30x", margin: "24px", color: textcolor }}>
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
        <QrCode data={url} errorCorrection={errorCorrection} scale={scale} darkBackground={darkBackground} />
      </div>
      {/* <h2 style={{ fontSize: "20px", margin: "12px" }}>{text}</h2> */}
    </div>
  )
}

export const QrTestPrint = ({ height, width }: QrTestPrintProps) => {
  const qrCodeUrl = "https://generated.fashion/shirt/qrcodes"
  const testSizes = [600, 450, 300, 200, 150, 100]
  const testScales = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
  const testEcl = ["low", "medium", "quartile", "high"] as const

  const widthLinesNumber = Math.floor(width / 100) + 1
  const widthLines = new Array(widthLinesNumber).fill(0).map((i, index) => index * 100)

  const darkBackground = false

  const textcolor = darkBackground ? "white" : "black"

  return (
    <div
      style={{
        width: width + "px",
        height: height + "px",
        background: "transparent",
        display: "flex",
        flexDirection: "row",
        transform: `scale(1)`,
        transformOrigin: "top left",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1
        style={{
          fontSize: "300px",
          flexGrow: "1",
          flexBasis: "100%",
          minWidth: "100%",
          textAlign: "center",
          marginLeft: "2600px",
          textAnchor: "middle",
          color: textcolor,
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
            darkBackground={darkBackground}
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
            darkBackground={darkBackground}
          />
        ))
      )}
      <div
        style={{
          fontSize: "300px",
          flexGrow: "1",
          flexBasis: "100%",
          minWidth: "100%",
          width: "100%",
          background: "transparent",
          height: "100px",
          display: "flex",
        }}
      >
        {widthLines.map(position => {
          return (
            <>
              <div
                style={{
                  width: "5px",
                  height: "100px",
                  position: "absolute",
                  left: position - 2 + "px",
                  background: textcolor,
                }}
              />
            </>
          )
        })}
      </div>
      <h2
        style={{
          fontSize: "100px",
          flexGrow: "1",
          flexBasis: "100%",
          minWidth: "100%",
          textAlign: "center",
          marginLeft: "3700px",
          textAnchor: "middle",
          width: "100%",
          color: textcolor,
        }}
      >
        And also some colors
      </h2>
      <div
        style={{
          flexBasis: "100%",
          minWidth: "100%",
          width: "100%",
          background: `linear-gradient(to right, ${textcolor} 10%, transparent 10%, transparent 90%, ${textcolor} 90%)`,
          height: "100px",
        }}
      />
      <div
        style={{
          flexBasis: "100%",
          minWidth: "100%",
          width: "100%",
          background: "linear-gradient(to right, transparent 10%, #000000 90%)",
          height: "150px",
        }}
      />
      <div
        style={{
          flexBasis: "100%",
          minWidth: "100%",
          width: "100%",
          background: "linear-gradient(to right, transparent 10%, #ffffff 90%)",
          height: "150px",
        }}
      />
      <div
        style={{
          flexBasis: "100%",
          minWidth: "100%",
          width: "100%",
          background: "linear-gradient(to right, #ffffff 10%, #000000  90%)",
          height: "150px",
        }}
      />
      <div
        style={{
          flexBasis: "100%",
          minWidth: "100%",
          width: "100%",
          background: "linear-gradient(to right, transparent 10%, #ff0000 90%)",
          height: "150px",
        }}
      />
      <div
        style={{
          flexBasis: "100%",
          minWidth: "100%",
          width: "100%",
          background: "linear-gradient(to right, transparent 10%, #00ff00 90%)",
          height: "150px",
        }}
      />
      <div
        style={{
          flexBasis: "100%",
          minWidth: "100%",
          width: "100%",
          background: "linear-gradient(to right, transparent 10%, #0000ff 90%)",
          height: "150px",
        }}
      />
      <div
        style={{
          flexBasis: "100%",
          minWidth: "100%",
          width: "100%",
          background: "linear-gradient(to right, transparent 10%, #ff00ff 90%)",
          height: "150px",
        }}
      />
      <div
        style={{
          flexBasis: "100%",
          minWidth: "100%",
          width: "100%",
          background: "linear-gradient(to right, transparent 10%, #ffff00 90%)",
          height: "150px",
        }}
      />
      <div
        style={{
          flexBasis: "100%",
          minWidth: "100%",
          width: "100%",
          background: "linear-gradient(to right, transparent 10% , #00ffff 90%)",
          height: "150px",
        }}
      />
      <div
        style={{
          flexBasis: "100%",
          minWidth: "100%",
          width: "100%",
          background: `linear-gradient(to right, ${textcolor} 10%, transparent 10%, transparent 90%, ${textcolor} 90%)`,
          height: "100px",
        }}
      />
    </div>
  )
}
