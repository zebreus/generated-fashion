import { css } from "@emotion/react"
import { CoolShirt } from "components/CoolShirt"
import { usePrediction } from "hooks/firestore/simple/usePrediction"
import { useRouter } from "next/router"

const ShirtImage = () => {
  const router = useRouter()
  const id = typeof router.query["id"] === "string" ? router.query["id"] : router.query["id"]?.[0]

  const prediction = usePrediction(id)
  const url = prediction?.resultUrl

  return (
    <div
      css={css`
        position: fixed;
        width: 100%;
        height: 100%;
      `}
    >
      <CoolShirt url={url} fallback={prediction?.previewImageUrl} noMovement />
    </div>
  )
}

export default ShirtImage
