import { collection, doc, DocumentData, DocumentReference, getFirestore } from "firebase/firestore"
import { genericConverter, WithRef } from "hooks/firestore/FirestoreDocument"
import { Prediction } from "types/firestore/prediction"

function getConvertedCollection<T extends DocumentData>(path: string) {
  const ref = collection(getFirestore(), path)
  return ref.withConverter(genericConverter<T>())
}

function getConvertedDocument<T extends DocumentData>(path: string) {
  const ref = doc(getFirestore(), path)
  return ref.withConverter(genericConverter<T>())
}

// ts-prune-ignore-next
export function getPredictionsRef() {
  return getConvertedCollection<Prediction>(`predictions`)
}

// ts-prune-ignore-next
export function getPredictionRef(predictionId: string): DocumentReference<WithRef<Prediction>>
export function getPredictionRef(predictionId: string | undefined): undefined | DocumentReference<WithRef<Prediction>>
export function getPredictionRef(predictionId: string | undefined): undefined | DocumentReference<WithRef<Prediction>> {
  return predictionId ? getConvertedDocument<Prediction>(`predictions/${predictionId}`) : undefined
}
