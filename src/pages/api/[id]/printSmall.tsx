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

  if (!prediction) {
    throw new Error("fail 33452")
  }

  return await ogImage(<ShirtPrint shirt={prediction} height={16 * dpi} width={12 * dpi} scale={1} />, {
    height: 16 * dpi,
    width: 12 * dpi,
    scale: 0.1,
  })
}

export default ogImagePrint
