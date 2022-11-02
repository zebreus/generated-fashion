import { QrTestPrint } from "components/prints/QrTestPrint"
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

  return await ogImage(<QrTestPrint height={16 * dpi} width={12 * dpi} scale={1} />, {
    height: 16 * dpi,
    width: 12 * dpi,
    scale: 1,
  })
}

export default ogImagePrint
