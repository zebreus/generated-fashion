import { DocumentData, DocumentReference, PartialWithFieldValue, QueryDocumentSnapshot } from "firebase/firestore"

// ts-prune-ignore-next
export interface FirestoreDocument<T> {
  _ref: DocumentReference<T>
}

// ts-prune-ignore-next
export type WithRef<T extends DocumentData> = T & FirestoreDocument<T>

// ts-prune-ignore-next
export const genericConverter = <T extends DocumentData>() => ({
  toFirestore(data: PartialWithFieldValue<WithRef<T>>): T {
    const result: DocumentData = { ...data }
    delete result["_ref"]
    return result as T
  },
  fromFirestore(data: QueryDocumentSnapshot<T>): WithRef<T> {
    return { ...data.data(), _ref: data.ref.withConverter(genericConverter<T>()) } as WithRef<T>
  },
})
