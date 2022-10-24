import { QrCode } from "components/QrCode"
import satori from "satori"

export const generateQrCode = async (data = "https://www.facebook.com/") => {
  const svg = await satori(<QrCode data={data} />, {
    width: length * 256,
    height: length * 256,
    fonts: [],
  })

  return svg
}
