import { generateImageIfRequired } from "functions/generateImageIfRequired"
import { updateScreenshotIfRequired } from "functions/updateScreenshot"
import { WithRef } from "hooks/firestore/FirestoreDocument"
import { getPredictionRef } from "hooks/firestore/getRefs"
import { NextApiHandler } from "next"
import { Prediction } from "types/firestore/prediction"

type BeforeAndAfter<T = Record<string, unknown>> =
  | {
      before: undefined
      after: T
      type: "create"
    }
  | {
      before: T
      after: T
      type: "update"
    }
  | {
      before: T
      after: undefined
      type: "delete"
    }

type RelayedChange<T = Record<string, unknown>> = {
  path: string
  timestamp: string
} & BeforeAndAfter<T>

const handler: NextApiHandler = async (req, res) => {
  const id = typeof req.query["id"] === "string" ? req.query["id"] : undefined

  if (req.headers.authorization !== "Bearer " + process.env["FIRESTORE_RELAY_SHARED_SECRET"]) {
    res.status(401).json({ detail: "unauthorized" })
    return
  }
  if (!id) {
    res.status(400).json({ detail: "invalid id" })
    return
  }

  const change = req.body as RelayedChange<WithRef<Prediction>>
  if (change.before) {
    change.before._ref = getPredictionRef(id)
  }
  if (change.after) {
    change.after._ref = getPredictionRef(id)
  }

  const tasks = [
    generateImageIfRequired(change.before, change.after),
    updateScreenshotIfRequired(change.before, change.after),
  ]

  await Promise.all(tasks)

  res.status(200).json({ state: "success" })
  return
}

export default handler
