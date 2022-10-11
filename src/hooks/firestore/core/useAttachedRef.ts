import { DocumentData, DocumentReference } from "firebase/firestore"
import { WithRef } from "hooks/firestore/FirestoreDocument"
import { useMemo } from "react"

export function useAttachedRef<T extends DocumentData>(
  reference: DocumentReference<T> | undefined,
  doc?: T
): WithRef<T> | undefined {
  const withRef = useMemo(() => {
    return reference && doc && { ...doc, _ref: reference }
  }, [reference === undefined, doc === undefined])
  return withRef
}
