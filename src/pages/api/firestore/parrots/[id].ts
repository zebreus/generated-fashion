import { arrayUnion, DocumentReference, updateDoc } from "firebase/firestore"
import { createPrediction } from "functions/createPrediction"
import { getOwnUrl } from "functions/getOwnUrl"
import { getDocument } from "hooks/firestore/core/useDocument"
import { getExplorationRef, getParrotRef } from "hooks/firestore/getRefs"
import { NextApiHandler } from "next"
import { pollPrediction, predict } from "replicate-api"
import { Parrot } from "types/firestore/parrot"

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

const replicateVersion = "7349c6ce7eb83fc9bc2e98e505a55ee28d7a8f4aa5fb6f711fad18724b4f2389"

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

  const doc = change.after as Parrot
  if (doc.state !== undefined) {
    res.status(200).json({ state: "success" })
    return
  }

  const prompt = doc.prompt
  if (!prompt) {
    res.status(200).json({ state: "success" })
    return
  }

  const prediction = await predict({
    version: replicateVersion,
    input: { prompt: prompt },
    token: process.env["REPLICATE_TOKEN"] || "",
    webhook: getOwnUrl() + "/api/replicate/parrotHook",
  })

  const ref = getParrotRef(id)

  await updateDoc(ref, {
    createdAt: Date.now(),
    replicateId: prediction.id,
    prompt: prompt,
    state: "starting",
    version: replicateVersion,
  })

  if (process.env["NEXT_PUBLIC_USE_FIREBASE_EMULATOR"] === "true") {
    await waitForResult(prediction.id, ref)
  }

  res.status(200).json({ state: "success" })
  return
}

const waitForResult = async (replicateId: string, ref: DocumentReference<Parrot>) => {
  const prediction = await pollPrediction({
    id: replicateId,
    token: process.env["REPLICATE_TOKEN"] || "",
  })

  const outputString = typeof prediction.output === "string" ? (prediction.output as string) : undefined

  const results = outputString?.split(/\n-+\n/)

  await updateDoc(ref, {
    state: prediction.status,
    results: results ?? [],
  })

  const parrot = await getDocument(ref)

  if (!parrot) {
    throw new Error("Failed to get parrot after update")
  }

  const explorationRef = await getExplorationRef(parrot.explorationId)

  const newPredictions = await Promise.all((parrot.results ?? []).map(result => createPrediction(result)))

  await updateDoc(explorationRef, {
    predictions: arrayUnion(...newPredictions),
  })
}

export default handler
