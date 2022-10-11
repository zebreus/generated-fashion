import {
  collection,
  CollectionReference,
  DocumentData,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  QueryConstraint,
} from "firebase/firestore"
import { GetFirestoreOptions } from "hooks/firestore/core/useDocument"
import { cacheDocument, getCachedQuery } from "hooks/firestore/FirestoreCache"
import { genericConverter, WithRef } from "hooks/firestore/FirestoreDocument"
import { useEffect, useState } from "react"

// Get query results
// ts-prune-ignore-next
export function useQuery<T extends DocumentData>(
  collectionRef: string | CollectionReference<WithRef<T> | T | DocumentData> | undefined,
  ...constraints: QueryConstraint[]
) {
  // The listeners will be kept alive for cacheTimeout ms after the component unmounts
  // This can be used to save cost on duplicate reads
  const cacheTime = 1000 * 60 * 20 // 20 minutes
  const [documents, setDocuments] = useState<WithRef<T>[] | undefined>(() =>
    getCachedQuery<T>(collectionRef, ...constraints)
  )
  const [loading, setLoading] = useState<boolean>(true)
  const [exists, setExists] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    if (!collectionRef) {
      setLoading(true)
      setExists(undefined)
      setDocuments(undefined)
      return
    }
    const ref = typeof collectionRef === "string" ? collection(getFirestore(), collectionRef) : collectionRef
    const queryRef = query(ref, ...constraints)
    let listenerActive = true
    const unsubscribe = onSnapshot(
      queryRef.withConverter(genericConverter<WithRef<T>>()),
      { includeMetadataChanges: true },
      snapshot => {
        if (listenerActive) {
          if (!snapshot.metadata.fromCache) {
            const docs = snapshot.docs.map(doc => doc.data())
            docs.forEach(doc => cacheDocument(doc))
            setLoading(false)
            setExists(true)
            setDocuments(docs)
          }
        }
      }
    )

    return () => {
      listenerActive = false
      if (cacheTime) {
        setTimeout(() => {
          unsubscribe()
        }, cacheTime)
      } else {
        unsubscribe()
      }
    }
  }, [typeof collectionRef === "string" ? collectionRef : collectionRef?.path, JSON.stringify(constraints)])

  return { documents, loading, exists }
}

// ts-prune-ignore-next
export async function getQuery<T extends DocumentData>(
  collectionRef: string | CollectionReference<WithRef<T> | T | DocumentData> | undefined,
  ...constraints: QueryConstraint[]
): Promise<WithRef<T>[] | undefined>
export async function getQuery<T extends DocumentData>(
  collectionRef: string | CollectionReference<WithRef<T> | T | DocumentData> | undefined,
  options: GetFirestoreOptions,
  ...constraints: QueryConstraint[]
): Promise<WithRef<T>[] | undefined>
export async function getQuery<T extends DocumentData>(
  collectionRef: string | CollectionReference<WithRef<T> | T | DocumentData> | undefined,
  ...constraintsOrOptions: (QueryConstraint | GetFirestoreOptions)[]
) {
  if (!collectionRef) {
    return undefined
  }

  const firstKeys = Object.keys(constraintsOrOptions[0] || {})
  const { constraints, options } =
    firstKeys.length === 0 || firstKeys.includes("cache") || firstKeys.includes("onlyCache")
      ? {
          options: constraintsOrOptions[0] as GetFirestoreOptions,
          constraints: constraintsOrOptions.filter((v, i) => i !== 0) as QueryConstraint[],
        }
      : { constraints: constraintsOrOptions as QueryConstraint[], options: undefined }
  const ref = typeof collectionRef === "string" ? collection(getFirestore(), collectionRef) : collectionRef
  const queryRef = query(ref, ...constraints)

  if (options?.cache) {
    const docs = getCachedQuery<T>(collectionRef, ...constraints)
    if (docs?.length) {
      return docs
    }
    if (options?.onlyCache) {
      return undefined
    }
  }

  try {
    const snapshot = await getDocs<WithRef<T>>(queryRef.withConverter(genericConverter<WithRef<T>>()))
    const docs = snapshot.docs.map(doc => doc.data())
    docs.forEach(doc => cacheDocument(doc))
    return docs
  } catch (error) {
    console.log(error)
    return undefined
  }
}

export default useQuery
