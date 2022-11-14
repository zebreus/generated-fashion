import { WithRef } from "hooks/firestore/FirestoreDocument"
import { usePrediction } from "hooks/firestore/simple/usePrediction"
import { Prediction } from "types/firestore/prediction"

export const useMotifUrl = (predictionId?: string, options?: { small?: boolean }) => {
  const prediction = usePrediction(predictionId)
  return prediction ? getMotifUrl(prediction, options) : undefined
}

export const getMotifUrl = (prediction?: WithRef<Prediction>, options?: { small?: boolean }) => {
  if (!prediction?._ref.id || !prediction.resultUrl) {
    return undefined
  }
  const imageProperty = options?.small ? "smallPrintUrl" : "printUrl"
  const url = prediction[imageProperty]
  return url
}
