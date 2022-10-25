import { collection, doc, DocumentData, DocumentReference, getFirestore } from "firebase/firestore"
import { genericConverter, WithRef } from "hooks/firestore/FirestoreDocument"
import { Exploration } from "types/firestore/exploration"
import { Parrot } from "types/firestore/parrot"
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

// ts-prune-ignore-next
export function getParrotsRef() {
  return getConvertedCollection<Parrot>(`parrots`)
}

// ts-prune-ignore-next
export function getParrotRef(parrotId: string): DocumentReference<WithRef<Parrot>>
export function getParrotRef(parrotId: string | undefined): undefined | DocumentReference<WithRef<Parrot>>
export function getParrotRef(parrotId: string | undefined): undefined | DocumentReference<WithRef<Parrot>> {
  return parrotId ? getConvertedDocument<Parrot>(`parrots/${parrotId}`) : undefined
}

// ts-prune-ignore-next
export function getExplorationsRef() {
  return getConvertedCollection<Exploration>(`explorations`)
}

// ts-prune-ignore-next
export function getExplorationRef(explorationId: string): DocumentReference<WithRef<Exploration>>
export function getExplorationRef(
  explorationId: string | undefined
): undefined | DocumentReference<WithRef<Exploration>>
export function getExplorationRef(
  explorationId: string | undefined
): undefined | DocumentReference<WithRef<Exploration>> {
  return explorationId ? getConvertedDocument<Exploration>(`explorations/${explorationId}`) : undefined
}
