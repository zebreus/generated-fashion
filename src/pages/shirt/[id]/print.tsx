import { css } from "@emotion/react"
import { ShirtPrint } from "components/ShirtPrint"
import { usePrediction } from "hooks/firestore/simple/usePrediction"

import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const dpi = 120
const width = 23.4
const height = 28.95

const ShirtImage = () => {
  const router = useRouter()
  const id = typeof router.query["id"] === "string" ? router.query["id"] : router.query["id"]?.[0]

  const prediction = usePrediction(id)

  const [screenHeight, setHeight] = useState(0)
  useEffect(() => {
    // document.documentElement.clientHeight
    setHeight(window.innerHeight)
  }, [setHeight])

  return (
    <div
      css={css`
        position: fixed;
        height: ${height * dpi}px;
        width: ${width * dpi}px;
        background: transparent;
        transform-origin: top left;
        transform: scale(${screenHeight / (height * dpi)});
      `}
    >
      {prediction ? <ShirtPrint shirt={prediction} width={width * dpi} height={height * dpi} /> : null}
    </div>
  )
}

export default ShirtImage
