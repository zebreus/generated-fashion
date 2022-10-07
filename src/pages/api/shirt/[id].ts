import { NextApiHandler } from "next"
import { getPrediction } from "replicate-api"

// Next.js API route support: https://nextjs.org/docs/api-routes/introductio
const handler: NextApiHandler = async (req, res) => {
  console.log("API call")
  const id = typeof req.query["id"] === "string" ? req.query["id"] : req.query["id"]?.[0]
  if (!id) {
    res.status(400).json({ detail: "id is required" })
    return
  }
  if (typeof id !== "string") {
    res.status(400).json({ detail: "id needs to be a string" })
    return
  }
  if (id.length < 3) {
    res.status(400).json({ detail: "id is too short" })
    return
  }

  try {
    const prediction = await getPrediction({
      id: id,
      token: process.env["REPLICATE_TOKEN"] || "",
    })
    res.setHeader("Content-Type", "application/json")

    if (prediction.status === "succeeded") {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable")
      res.status(200).json({ url: prediction.output[0], state: "done" })
      return
    }
    if (prediction.status === "starting" || prediction.status === "processing") {
      res.setHeader("Cache-Control", "public, s-maxage=2, stale-while-revalidate")
      res.status(200).json({ state: "pending" })
      return
    }
    if (prediction.status === "canceled" || prediction.status === "failed") {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable")
      res.status(500).json({ state: "failed" })
      return
    }
  } catch (error) {
    res.setHeader("Cache-Control", "no-cache")
    res.status(404).json({ state: "Not found" })
    return
  }
  // https://replicate.com/api/models/stability-ai/stable-diffusion/files/58a1dcfc-3d5d-4297-bac2-5395294fe463/out-0.png
}

export default handler
