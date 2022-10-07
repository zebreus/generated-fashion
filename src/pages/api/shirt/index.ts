import { NextApiHandler } from "next"
import { predict } from "replicate-api"

// Next.js API route support: https://nextjs.org/docs/api-routes/introductio
const handler: NextApiHandler = async (req, res) => {
  const { prompt } = req.body
  if (!prompt) {
    res.status(400).json({ detail: "prompt is required" })
    return
  }
  if (typeof prompt !== "string") {
    res.status(400).json({ detail: "prompt needs to be a string" })
    return
  }
  if (prompt.length < 3) {
    res.status(400).json({ detail: "prompt is too short" })
    return
  }
  if (prompt.length > 2000) {
    res.status(400).json({ detail: "prompt is too long" })
    return
  }
  const prediction = await predict({
    model: "stability-ai/stable-diffusion",
    input: { prompt: prompt },
    token: process.env["REPLICATE_TOKEN"] || "",
  })

  res.status(200).json({ id: prediction.id })
  // https://replicate.com/api/models/stability-ai/stable-diffusion/files/58a1dcfc-3d5d-4297-bac2-5395294fe463/out-0.png
}

export default handler
