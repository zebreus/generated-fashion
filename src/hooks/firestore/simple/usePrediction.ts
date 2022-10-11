import { getDocument, useDocument } from "hooks/firestore/core/useDocument"
import { getPredictionRef } from "hooks/firestore/getRefs"

// ts-prune-ignore-next
export function usePrediction(predictionId: string | undefined) {
  const { document } = useDocument(getPredictionRef(predictionId))
  return document
}

// ts-prune-ignore-next
export async function getPrediction(shopId: string) {
  return await getDocument(getPredictionRef(shopId))
}
