import QrCodeSvg from "qrcode-svg"

type QrCodeProps = {
  data?: string
  darkBackground?: boolean
  errorCorrection?: "low" | "medium" | "quartile" | "high"
  /** Get pixel aligned edges size by multiplying each pixel by scale */
  scale?: number
}

export const QrCode = ({
  data = "https://www.w3.org",
  darkBackground,
  errorCorrection = "medium",
  scale,
}: QrCodeProps) => {
  const ecl =
    errorCorrection === "low" ? "L" : errorCorrection === "medium" ? "M" : errorCorrection === "quartile" ? "Q" : "H"
  const code = new QrCodeSvg({ content: data, ecl, padding: 0 })
  const modules = darkBackground
    ? [
        new Array(code.qrcode.modules.length + 2).fill(false),
        ...code.qrcode.modules.map(arr => [false, ...arr, false]),
        new Array(code.qrcode.modules.length + 2).fill(false),
      ]
    : code.qrcode.modules
  const length = modules.length

  const size = 100 / length

  const dotColor = darkBackground ? "white" : "black"

  const divs = modules
    .map((row, colIndex) =>
      row.map((field, rowIndex) => {
        const downFieldIsTransparent =
          colIndex + 1 !== modules.length ? modules[colIndex + 1][rowIndex] !== !!darkBackground : false
        const rightFieldIsTransparent =
          rowIndex + 1 !== modules[0]?.length ? modules[colIndex][rowIndex + 1] !== !!darkBackground : false
        const downRightFieldIsTransparent =
          colIndex + 1 !== modules.length
            ? rowIndex + 1 !== modules[0]?.length
              ? modules[colIndex + 1][rowIndex + 1] !== !!darkBackground
              : false
            : false

        const isTransparent = field !== !!darkBackground

        return [
          isTransparent ? (
            <div
              key={`${colIndex}-${rowIndex}`}
              style={{
                display: "flex",
                position: "absolute",
                width: `${size + (rightFieldIsTransparent ? size * 0.75 : 0)}%`,
                height: `${
                  size +
                  (downRightFieldIsTransparent && rightFieldIsTransparent && downFieldIsTransparent ? size * 0.75 : 0)
                }%`,
                background: dotColor,
                left: `${rowIndex * size}%`,
                top: `${colIndex * size}%`,
              }}
            />
          ) : null,
          isTransparent && downFieldIsTransparent ? (
            <div
              key={`${colIndex}-${rowIndex}-down`}
              style={{
                display: "flex",
                position: "absolute",
                width: `${size}%`,
                height: `${size + size * 0.75}%`,
                background: dotColor,
                left: `${rowIndex * size}%`,
                top: `${colIndex * size}%`,
              }}
            />
          ) : null,
        ]
      })
    )
    .flat()

  const element = (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: scale === undefined ? `100%` : `${scale * length}px`,
        height: scale === undefined ? `100%` : `${scale * length}px`,
        padding: 0,
        background: "transparent",
      }}
    >
      {divs}
    </div>
  )

  return element
}
