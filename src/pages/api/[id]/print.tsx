import { ShirtPrint } from "components/ShirtPrint"
import { getPrediction } from "hooks/firestore/simple/usePrediction"
import { initialize } from "hooks/useInitialize"
import { ogImage } from "util/image/ogImage"

export const config = {
  runtime: "experimental-edge",
}

const dpi = 200
const width = 23.4
const height = 28.95

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

  return await ogImage(<ShirtPrint shirt={prediction} height={width * dpi} width={height * dpi} />, {
    height: height * dpi,
    width: width * dpi,
    scale: 1,
  })
}

export default ogImagePrint
