import QrCodeSvg from "qrcode-svg"

type QrCodeProps = {
  data?: string
}

export const QrCode = ({ data = "https://www.w3.org" }: QrCodeProps) => {
  const code = new QrCodeSvg(data)
  const modules = code.qrcode.modules
  const length = modules.length

  const size = 100 / length

  const divs = modules
    .map((row, colIndex) =>
      row.map((field, rowIndex) => {
        const color = field ? "black" : "white"
        return (
          <div
            key={`${colIndex}-${rowIndex}`}
            style={{
              display: "flex",
              position: "absolute",
              width: `${size}%`,
              height: `${size}%`,
              background: color,
              left: `${rowIndex * size}%`,
              top: `${colIndex * size}%`,
            }}
          />
        )
      })
    )
    .flat()

  const element = (
    <div
      style={{
        display: "flex",

        position: "relative",
        width: `100%`,
        height: `100%`,
        background: "white",
      }}
    >
      {divs}
    </div>
  )

  return element
}
