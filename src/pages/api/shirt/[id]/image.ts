import is from "@sindresorhus/is"
import { getPrismaImage } from "functions/getPrismaImage"
import { NextApiHandler } from "next"

const handler: NextApiHandler = async (req, res) => {
  const id = typeof req.query["id"] === "string" ? req.query["id"] : req.query["id"]?.[0]
  if (!is.string(id)) {
    res.status(400).json({ detail: "id is required" })
    return
  }

  const image = await getPrismaImage(id)

  if (!image) {
    res.setHeader("Cache-Control", "public, no-cache")
    res.status(404).json({ state: "Not found" })
    return
  }

  if (image.replicateState === "starting" || image.replicateState === "processing") {
    res.setHeader("Cache-Control", "public, no-cache")
    res.status(404).json({ state: "Not ready" })
    return
  }

  if (!image.imageData || !image.imageMimeType) {
    res.setHeader("Cache-Control", "public, no-cache")
    res.status(404).json({ state: "Not found" })
    return
  }

  res.setHeader("Content-Type", image.imageMimeType)
  res.status(200).send(image.imageData)
}

export default handler
