import { ShirtPrint } from "components/ShirtPrint"
import { getPrediction } from "hooks/firestore/simple/usePrediction"
import { initialize } from "hooks/useInitialize"
import { ogImage } from "util/image/ogImage"

export const config = {
  runtime: "experimental-edge",
}

const dpi = 150

const ogImagePrint = async (request: Request) => {
  initialize()

  const parts = request.url.split("/")
  const id = parts[parts.length - 2]
  if (!id) {
    throw new Error("fail 356")
  }

  const prediction = await getPrediction(id)

  return await ogImage(
    <ShirtPrint
      prompt={prediction?.prompt || "Loading (or crashed)"}
      imageUrl={prediction?.resultUrl || "https://placeimg.com/512/512"}
      qrCodeText={"generated.fashion/shirt/" + id}
      qrCodeUrl={"https://generated.fashion/shirt/" + id}
      height={16 * dpi}
      width={12 * dpi}
      scale={1}
    />,
    {
      height: 16 * dpi,
      width: 12 * dpi,
      scale: 0.1,
    }
  )
}

export default ogImagePrint
