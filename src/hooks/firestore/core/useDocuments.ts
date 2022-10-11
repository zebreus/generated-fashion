import { doc, DocumentData, DocumentReference, getDoc, getFirestore, onSnapshot } from "firebase/firestore"
import { cacheDocument, getCachedDocuments } from "hooks/firestore/FirestoreCache"
import { genericConverter, WithRef } from "hooks/firestore/FirestoreDocument"
import { useEffect, useState } from "react"

/* Get multiple documents by path */
// ts-prune-ignore-next
export function useDocuments<T extends DocumentData>(
  documentRefs: (DocumentReference<WithRef<T> | T | DocumentData> | string)[] | undefined,
  requireAll = false
) {
  // The listeners will be kept alive for cacheTimeout ms after the component unmounts
  // This can be used to save cost on duplicate reads
  const cacheTime = 1000 * 60 * 20 // 20 minutes
  const [documents, setDocuments] = useState<WithRef<T>[] | undefined>(getCachedDocuments(documentRefs, requireAll))
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (documentRefs === undefined) {
      setDocuments(undefined)
      setLoading(true)
      return
    }
    if (documentRefs.length === 0) {
      setDocuments([])
      setLoading(false)
      return
    }
    if (!documents) {
      setDocuments(getCachedDocuments(documentRefs, requireAll))
      setLoading(true)
    }

    const refs = documentRefs.map(ref => (typeof ref === "string" ? doc(getFirestore(), ref) : ref))

    const documentStates: Record<string, WithRef<T> | undefined> = {}
    refs.forEach(documentRef => {
      documentStates[documentRef.path] = undefined
    })

    const unsubscribeFunctions = refs.map(documentRef => {
      let listenerActive = true
      const unsubscribe = onSnapshot<WithRef<T>>(
        documentRef.withConverter(genericConverter<WithRef<T>>()),
        snapshot => {
          if (listenerActive) {
            const doc = snapshot.data()
            if (doc) {
              cacheDocument(doc)
            }
            documentStates[snapshot.ref.path] = doc
            const documentsMissing = Object.values(documentStates).reduce<boolean>(
              (missing, value) => missing || value === undefined,
              false
            )
            if (!documentsMissing || !requireAll) {
              const docs = Object.values(documentStates)
              const filteredDocs = documentsMissing ? docs.flatMap(doc => (doc ? [doc] : [])) : (docs as WithRef<T>[])
              setLoading(false)
              setDocuments(filteredDocs)
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
    })

    return () => {
      unsubscribeFunctions.forEach(unsubscribe => {
        unsubscribe()
      })
    }
  }, [JSON.stringify(documentRefs?.map(ref => (typeof ref === "string" ? ref : ref.path)))])

  return { documents, loading }
}

// ts-prune-ignore-next
export async function getDocuments<T extends DocumentData>(
  documentRefs: (DocumentReference | string)[] | undefined,
  requireAll = false
) {
  if (documentRefs === undefined) {
    return undefined
  }
  if (documentRefs.length === 0) {
    return []
  }

  const refs = documentRefs.map(ref => (typeof ref === "string" ? doc(getFirestore(), ref) : ref))

  try {
    const snapshotPromises = refs.map(ref => getDoc<WithRef<T>>(ref.withConverter(genericConverter<WithRef<T>>())))
    const snapshotSettledPromises = await Promise.allSettled(snapshotPromises)
    const results = snapshotSettledPromises.flatMap(settledPromise => {
      switch (settledPromise.status) {
        case "fulfilled": {
          const snapshot = settledPromise.value
          const result = snapshot.data()
          if (!result) {
            return []
          }
          cacheDocument(result)
          return [result]
        }
        case "rejected": {
          console.log(settledPromise.reason)
          return []
        }
      }
    })

    if (requireAll && results.length !== documentRefs.length) {
      return undefined
    }
    return results
  } catch (error) {
    console.log(error)
    return undefined
  }
}
