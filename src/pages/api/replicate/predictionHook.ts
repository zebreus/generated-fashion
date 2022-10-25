import { updateDoc, where } from "firebase/firestore"
import { updateScreenshot } from "functions/updateScreenshot"
import { getQuery } from "hooks/firestore/core/useQuery"
import { getPredictionsRef } from "hooks/firestore/getRefs"
import { initialize } from "hooks/useInitialize"
import { NextApiHandler } from "next"
import { processWebhook } from "replicate-api"

// Next.js API route support: https://nextjs.org/docs/api-routes/introductio
const handler: NextApiHandler = async (req, res) => {
  initialize()
  const body = req.body
  const prediction = processWebhook({
    token: process.env["REPLICATE_TOKEN"] || "",
    body,
  })

  const matchingPredictions = await getQuery(getPredictionsRef(), where("replicateId", "==", prediction.id))

  const matchingPrediction = matchingPredictions?.[0]

  if (!matchingPrediction) {
    res.status(404).json({ detail: "prediction not found" })
    return
  }

  if (prediction.status === matchingPrediction.state) {
    res.status(200).json({ state: "success" })
    return
  }

  await updateDoc(matchingPrediction._ref, {
    state: prediction.status,
    resultUrl: typeof prediction.output?.[0] === "string" ? prediction.output?.[0] : undefined,
  })

  updateScreenshot(matchingPrediction._ref.id)
  // Try to ensure, that the screenshot update is at least triggered
  await new Promise(r => setTimeout(r, 1500))

  res.status(200).json({ state: "success" })
}

export default handler
