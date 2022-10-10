import is from "@sindresorhus/is"
import { prisma } from "functions/prisma"
import { NextApiHandler } from "next"

const handler: NextApiHandler = async (req, res) => {
  const id = typeof req.query["id"] === "string" ? req.query["id"] : req.query["id"]?.[0]
  if (!is.string(id)) {
    res.status(400).json({ detail: "id is required" })
    return
  }

  const image = await prisma.image.findUnique({
    where: {
      id: id,
    },
    include: {
      image: true,
    },
  })

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

  if (!image.image) {
    res.setHeader("Cache-Control", "public, no-cache")
    res.status(404).json({ state: "Not found" })
    return
  }

  res.setHeader("Cache-Control", "public, max-age=31536000, immutable")
  res.setHeader("Content-Type", image.image.mimeType)
  res.status(200).send(image.image.data)
}

export default handler
