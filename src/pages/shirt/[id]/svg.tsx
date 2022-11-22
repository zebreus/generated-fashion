import { ShirtPrint } from "components/ShirtPrint"
import { usePrediction } from "hooks/firestore/simple/usePrediction"
import { useSatori } from "hooks/useSatori"
import { useRouter } from "next/router"
import { useMemo } from "react"

const dpi = 200
const width = 23.4
const height = 28.95

const ShirtImage = () => {
  const router = useRouter()
  const id = typeof router.query["id"] === "string" ? router.query["id"] : router.query["id"]?.[0]
  const prediction = usePrediction(id)

  const options = useMemo(
    () => ({
      width: width * dpi,
      height: height * dpi,
      scale: 0.1,
    }),
    []
  )

  const shirtNode = useMemo(
    () => (prediction ? <ShirtPrint shirt={prediction} height={height * dpi} width={width * dpi} /> : undefined),
    [prediction]
  )

  const svg = useSatori(shirtNode, options)

  return (
    <div>
      {svg && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={svg}
          alt="generated svg"
          //   css={css`
          //     width: ${(width * dpi) / 10}px;
          //     height: ${(height * dpi) / 10}px;
          //   `}
        ></img>
      )}
      {svg ?? "not ready"}
    </div>
  )
}

export default ShirtImage
