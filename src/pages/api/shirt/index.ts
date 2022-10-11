import is from "@sindresorhus/is"
import { setDoc } from "firebase/firestore"
import { generateId } from "functions/generateId"
import { getOwnUrl } from "functions/getOwnUrl"
import { getPredictionRef } from "hooks/firestore/getRefs"
import { NextApiHandler } from "next"
import { predict } from "replicate-api"

const replicateVersion = "a9758cbfbd5f3c2094457d996681af52552901775aa2d6dd0b17fd15df959bef"

// Next.js API route support: https://nextjs.org/docs/api-routes/introductio
const handler: NextApiHandler = async (req, res) => {
  const { prompt } = req.body
  if (!is.string(prompt)) {
    res.status(400).json({ detail: "a string prompt is required" })
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

  const id = generateId()
  const seed = Math.floor(Math.random() * 100000000)

  const prediction = await predict({
    version: replicateVersion,
    input: { prompt: prompt, steps: 10, seed: seed },
    token: process.env["REPLICATE_TOKEN"] || "",
    webhook: getOwnUrl() + "/api/replicateWebhook",
  })

  const newRef = getPredictionRef(id)

  await setDoc(newRef, {
    createdAt: Date.now(),
    prompt: prompt,
    seed: seed,
    replicateId: prediction.id,
    state: prediction.status,
    version: prediction.version,
    _ref: newRef,
  })

  res.status(200).json({ id: id })
}

export default handler
