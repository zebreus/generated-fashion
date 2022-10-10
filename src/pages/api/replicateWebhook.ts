import { updatePrismaImage } from "functions/updatePrismaImage"
import { NextApiHandler } from "next"
import { processWebhook } from "replicate-api"

// Next.js API route support: https://nextjs.org/docs/api-routes/introductio
const handler: NextApiHandler = async (req, res) => {
  const body = req.body
  const result = processWebhook({
    token: process.env["REPLICATE_TOKEN"] || "",
    body,
  })

  await updatePrismaImage(result)

  res.status(200).json({ state: "success" })
}

export default handler
