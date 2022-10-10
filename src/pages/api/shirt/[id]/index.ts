import is from "@sindresorhus/is"
import { getPrismaImage } from "functions/getPrismaImage"
import { NextApiHandler } from "next"

// Next.js API route support: https://nextjs.org/docs/api-routes/introductio
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

  const result = {
    prompt: image.prompt,
    state: image.replicateState,
    seed: image.seed,
  }
  res.setHeader("Content-Type", "application/json")

  if (result.state === "succeeded") {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable")
    res.status(200).json(result)
    return
  }
  if (result.state === "starting" || result.state === "processing") {
    res.setHeader("Cache-Control", "public, s-maxage=2, stale-while-revalidate")
    res.status(200).json(result)
    return
  }
  if (result.state === "canceled" || result.state === "failed") {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable")
    res.status(500).json(result)
    return
  }

  // https://replicate.com/api/models/stability-ai/stable-diffusion/files/58a1dcfc-3d5d-4297-bac2-5395294fe463/out-0.png
}

export default handler
