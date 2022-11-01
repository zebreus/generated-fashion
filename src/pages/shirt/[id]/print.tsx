import { css } from "@emotion/react"
import { ShirtPrint } from "components/ShirtPrint"
import { usePrediction } from "hooks/firestore/simple/usePrediction"

import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const dpi = 150

const ShirtImage = () => {
  const router = useRouter()
  const id = typeof router.query["id"] === "string" ? router.query["id"] : router.query["id"]?.[0]

  const prediction = usePrediction(id)
  const url = prediction?.resultUrl

  const [height, setHeight] = useState(0)
  useEffect(() => {
    // document.documentElement.clientHeight
    setHeight(window.innerHeight)
  }, [setHeight])

  return (
    <div
      css={css`
        position: fixed;
        height: ${16 * dpi}px;
        width: ${12 * dpi}px;
        background: white;
        transform-origin: top left;
        transform: scale(${height / (16 * dpi)});
      `}
    >
      <ShirtPrint
        prompt={prediction?.prompt || "Test prompt"}
        imageUrl={url || "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"}
        qrCodeText={"generated.fashion/28"}
        qrCodeUrl={"https://generated.fashion/shirt/" + id}
        width={12 * dpi}
        height={16 * dpi}
      />
    </div>
  )
}

export default ShirtImage
