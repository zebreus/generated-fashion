import { css } from "@emotion/react"
import { CoolShirt } from "components/CoolShirt"
import { usePrediction } from "hooks/firestore/simple/usePrediction"
import { getMotifUrl } from "hooks/useMotifUrl"
import { useRouter } from "next/router"

const ShirtImage = () => {
  const router = useRouter()
  const id = typeof router.query["id"] === "string" ? router.query["id"] : router.query["id"]?.[0]

  const prediction = usePrediction(id)
  const motifUrl = getMotifUrl(prediction, { small: true })

  return (
    <div
      css={css`
        position: fixed;
        width: 100%;
        height: 100%;
      `}
    >
      <CoolShirt url={motifUrl} fallback={prediction?.previewImageUrl} noMovement color={prediction?.shirtColor} />
    </div>
  )
}

export default ShirtImage
