import { DocumentReference, updateDoc } from "firebase/firestore"
import { getOwnUrl } from "functions/getOwnUrl"
import { getPredictionRef } from "hooks/firestore/getRefs"
import { NextApiHandler } from "next"
import { pollPrediction, predict } from "replicate-api"
import { Prediction } from "types/firestore/prediction"

type BeforeAndAfter =
  | {
      before: undefined
      after: Record<string, unknown>
      type: "create"
    }
  | {
      before: Record<string, unknown>
      after: Record<string, unknown>
      type: "update"
    }
  | {
      before: Record<string, unknown>
      after: undefined
      type: "delete"
    }

type RelayedChange = {
  path: string
  timestamp: string
} & BeforeAndAfter

const replicateVersion = "a9758cbfbd5f3c2094457d996681af52552901775aa2d6dd0b17fd15df959bef"

const handler: NextApiHandler = async (req, res) => {
  const id = typeof req.query["id"] === "string" ? req.query["id"] : undefined

  if (req.headers.authorization !== "Bearer " + process.env["FIRESTORE_RELAY_SHARED_SECRET"]) {
    res.status(401).json({ detail: "unauthorized" })
    return
  }
  const change = req.body as RelayedChange
  if (!id) {
    res.status(400).json({ detail: "invalid id" })
    return
  }

  if (change.type === "delete") {
    res.status(200).json({ state: "success" })
    return
  }

  const doc = change.after as Prediction
  if (doc.state !== undefined) {
    res.status(200).json({ state: "success" })
    return
  }

  const prompt = doc.prompt
  if (!prompt) {
    res.status(200).json({ state: "success" })
    return
  }

  const seed = doc.seed || Math.floor(Math.random() * 100000000)

  const prediction = await predict({
    version: replicateVersion,
    input: { prompt: prompt, num_inference_steps: 100, seed: seed },
    token: process.env["REPLICATE_TOKEN"] || "",
    webhook: getOwnUrl() + "/api/replicateWebhook",
  })

  const ref = getPredictionRef(id)

  await updateDoc(ref, {
    createdAt: Date.now(),
    replicateId: prediction.id,
    prompt: prompt,
    seed: seed,
    state: "starting",
    version: replicateVersion,
  })

  if (process.env["NEXT_PUBLIC_USE_FIREBASE_EMULATOR"] === "true") {
    await waitForResult(prediction.id, ref)
  }

  res.status(200).json({ state: "success" })
  return
}

const waitForResult = async (replicateId: string, ref: DocumentReference<Prediction>) => {
  const prediction = await pollPrediction({
    id: replicateId,
    token: process.env["REPLICATE_TOKEN"] || "",
  })

  await updateDoc(ref, {
    state: prediction.status,
    resultUrl: typeof prediction.output?.[0] === "string" ? prediction.output?.[0] : undefined,
  })
}

export default handler
