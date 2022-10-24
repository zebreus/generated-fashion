import { ImageResponse } from "@vercel/og"
import { ShirtPrint } from "components/ShirtPrint"
import { getPrediction } from "hooks/firestore/simple/usePrediction"
import { initialize } from "hooks/useInitialize"

export const config = {
  runtime: "experimental-edge",
}

const dpi = 150

const ogImage = async (request: Request) => {
  initialize()

  const parts = request.url.split("/")
  const id = parts[parts.length - 2]
  if (!id) {
    throw new Error("fail 356")
  }

  const prediction = await getPrediction(id)

  return new ImageResponse(
    (
      <ShirtPrint
        prompt={prediction?.prompt || "Loading (or crashed)"}
        imageUrl={prediction?.resultUrl || "https://placeimg.com/512/512"}
        qrCodeText={"generated.fashion/shirt/" + id}
        qrCodeUrl={"https://generated.fashion/shirt/" + id}
      />
    ),
    {
      height: 16 * dpi,
      width: 12 * dpi,
    }
  )
}

export default ogImage
