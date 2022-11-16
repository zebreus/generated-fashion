import { DocumentReference, updateDoc } from "firebase/firestore"
import { getOwnUrl } from "functions/getOwnUrl"
import { WithRef } from "hooks/firestore/FirestoreDocument"
import { initialize } from "hooks/useInitialize"
import { pollPrediction, predict } from "replicate-api"
import { Prediction } from "types/firestore/prediction"

const replicateVersion = "a9758cbfbd5f3c2094457d996681af52552901775aa2d6dd0b17fd15df959bef"

export const generateImageIfRequired = async (
  oldPrediction: WithRef<Prediction> | undefined,
  newPrediction: WithRef<Prediction> | undefined
) => {
  initialize()
  const ready = newPrediction && !oldPrediction && newPrediction.state === undefined && newPrediction.prompt
  if (!ready) {
    return
  }

  const prompt = newPrediction.prompt
  const seed = newPrediction.seed || Math.floor(Math.random() * 100000000)

  const prediction = await predict({
    version: replicateVersion,
    input: { prompt: prompt, num_inference_steps: 100, seed: seed },
    token: process.env["REPLICATE_TOKEN"] || "",
    webhook: getOwnUrl() + "/api/replicate/predictionHook",
  })

  const ref = newPrediction._ref

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
