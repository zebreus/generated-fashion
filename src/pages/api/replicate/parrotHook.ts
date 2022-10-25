import { updateDoc, where } from "firebase/firestore"
import { getQuery } from "hooks/firestore/core/useQuery"
import { getParrotsRef } from "hooks/firestore/getRefs"
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

  const matchingPredictions = await getQuery(getParrotsRef(), where("replicateId", "==", prediction.id))

  const matchingPrediction = matchingPredictions?.[0]

  if (!matchingPrediction) {
    res.status(404).json({ detail: "prediction not found" })
    return
  }

  if (prediction.status === matchingPrediction.state) {
    res.status(200).json({ state: "success" })
    return
  }

  const outputString = typeof prediction.output === "string" ? (prediction.output as string) : undefined

  const results = outputString?.split(/\n-+\n/)

  await updateDoc(matchingPrediction._ref, {
    state: prediction.status,
    results: results ?? [],
  })

  res.status(200).json({ state: "success" })
}

export default handler
