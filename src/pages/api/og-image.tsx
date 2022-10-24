import { ImageResponse } from "@vercel/og"
import { ShirtPrint } from "components/ShirtPrint"

export const config = {
  runtime: "experimental-edge",
}

const dpi = 150

const ogImage = async () => {
  return new ImageResponse(
    (
      <ShirtPrint
        prompt={"Test prompt"}
        imageUrl={"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"}
        qrCodeText={"funny qr code"}
        qrCodeUrl={"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"}
      />
    ),
    {
      height: 16 * dpi,
      width: 12 * dpi,
    }
  )
}

export default ogImage
