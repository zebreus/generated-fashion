import { arrayUnion, updateDoc, where } from "firebase/firestore"
import { createPrediction } from "functions/createPrediction"
import { getQuery } from "hooks/firestore/core/useQuery"
import { getExplorationRef, getParrotsRef } from "hooks/firestore/getRefs"
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

  const parrot = matchingPredictions?.[0]

  if (!parrot) {
    res.status(404).json({ detail: "prediction not found" })
    return
  }

  if (prediction.status === parrot.state) {
    res.status(200).json({ state: "success" })
    return
  }

  const outputString = typeof prediction.output === "string" ? (prediction.output as string) : undefined

  const results = outputString?.split(/\n-+\n/)

  // Write results to parrot doc
  await updateDoc(parrot._ref, {
    state: prediction.status,
    results: results ?? [],
  })

  const explorationRef = await getExplorationRef(parrot.explorationId)

  const newPredictions = await Promise.all(
    (results ?? []).slice(0, 5).map(result => createPrediction(parrot.prompt, result))
  )

  await updateDoc(explorationRef, {
    predictions: arrayUnion(...newPredictions),
  })

  res.status(200).json({ state: "success" })
}

export default handler
