import { collection, CollectionReference, DocumentData, getDocs, getFirestore, onSnapshot } from "firebase/firestore"
import { cacheDocument, getCachedCollection } from "hooks/firestore/FirestoreCache"
import { genericConverter, WithRef } from "hooks/firestore/FirestoreDocument"
import { useEffect, useState } from "react"

// Get a single collection
export function useCollection<T extends DocumentData>(
  collectionRef: string | CollectionReference<WithRef<T> | T | DocumentData> | undefined
) {
  // The listeners will be kept alive for cacheTimeout ms after the component unmounts
  // This can be used to save cost on duplicate reads
  const cacheTime = 1000 * 60 * 20 // 20 minutes
  const [documents, setDocuments] = useState<WithRef<T>[] | undefined>(() => getCachedCollection<T>(collectionRef))
  const [loading, setLoading] = useState<boolean>(true)
  const [exists, setExists] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    if (!collectionRef) {
      setLoading(true)
      setExists(undefined)
      setDocuments(getCachedCollection<T>(collectionRef))
      return
    }
    const ref = typeof collectionRef === "string" ? collection(getFirestore(), collectionRef) : collectionRef
    let listenerActive = true
    const unsubscribe = onSnapshot(ref.withConverter(genericConverter<WithRef<T>>()), snapshot => {
      if (listenerActive) {
        const docs = snapshot.docs.map(doc => doc.data())
        docs.forEach(doc => cacheDocument(doc))
        setLoading(false)
        setExists(true)
        setDocuments(docs)
      }
    })

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
  }, [typeof collectionRef === "string" ? collectionRef : collectionRef?.path])

  return { documents, loading, exists }
}

export async function getCollection<T extends DocumentData>(
  collectionRef: string | CollectionReference<WithRef<T> | T | DocumentData> | undefined
) {
  if (!collectionRef) {
    return undefined
  }

  const ref = typeof collectionRef === "string" ? collection(getFirestore(), collectionRef) : collectionRef

  try {
    const snapshot = await getDocs<WithRef<T>>(ref.withConverter(genericConverter<WithRef<T>>()))
    const docs = snapshot.docs.map(doc => doc.data())
    docs.forEach(doc => cacheDocument(doc))
    return docs
  } catch (error) {
    console.log(error)
    return undefined
  }
}
