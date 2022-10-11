import { doc, DocumentData, DocumentReference, getDoc, getFirestore, onSnapshot } from "firebase/firestore"
import { cacheDocument, getCachedDocument } from "hooks/firestore/FirestoreCache"
import { genericConverter, WithRef } from "hooks/firestore/FirestoreDocument"
import { useEffect, useState } from "react"
import { unstable_batchedUpdates } from "react-dom"

interface UseFirestoreOptions {
  /** Do not create a listener */
  noListen?: boolean
  /** Do not use cached results */
  noCache?: boolean
  /** Do only use cached results */
  onlyCache?: boolean
}

export interface GetFirestoreOptions {
  /** Allow cached results */
  cache?: boolean
  /** Do only use cached results. No effect if cache is not true. */
  onlyCache?: boolean
}

// Get a single document
export function useDocument<T extends DocumentData>(
  documentRef: string | DocumentReference<WithRef<T> | T | DocumentData> | undefined,
  options?: UseFirestoreOptions
) {
  // The listeners will be kept alive for cacheTimeout ms after the component unmounts
  // This can be used to save cost on duplicate reads
  const cacheTime = 1000 * 60 * 20 // 20 minutes
  const [document, setDocument] = useState<WithRef<T> | undefined>(() =>
    options?.noCache ? undefined : getCachedDocument<T>(documentRef)
  )
  const [loading, setLoading] = useState<boolean>(!document)

  useEffect(() => {
    const ref = typeof documentRef === "string" ? doc(getFirestore(), documentRef) : documentRef

    const setDocumentIfDifferent = (newDocument: WithRef<T> | undefined) => {
      // setDocument(oldDocument => {
      // const equal =
      // oldDocument === newDocument ||
      // (oldDocument &&
      // newDocument &&
      // JSON.stringify(serializeDocument(oldDocument as unknown as Record<string, unknown>)) ===
      // JSON.stringify(serializeDocument(newDocument as unknown as Record<string, unknown>)))
      // return equal ? oldDocument : newDocument
      //})
      setDocument(newDocument)
    }

    if (!ref) {
      const cachedDocument = getCachedDocument<T>(documentRef)
      unstable_batchedUpdates(() => {
        setLoading(!cachedDocument)
        setDocumentIfDifferent(cachedDocument)
      })
      return
    }

    if (options?.noListen) {
      if (!document) {
        const getDoc = async (ref: DocumentReference<WithRef<T> | T | DocumentData>) => {
          const doc = await getDocument(ref, { cache: !options.noCache, onlyCache: options.onlyCache })
          if (doc) {
            unstable_batchedUpdates(() => {
              setLoading(false)
              setDocumentIfDifferent(doc)
            })
          }
        }
        getDoc(ref)
      }
      return
    }

    let listenerActive = true

    const unsubscribe = onSnapshot(ref.withConverter(genericConverter<WithRef<T>>()), snapshot => {
      if (listenerActive) {
        const doc = snapshot.data()
        if (doc) {
          cacheDocument(doc)
        }
        unstable_batchedUpdates(() => {
          setLoading(false)
          setDocumentIfDifferent(doc)
        })
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
  }, [typeof documentRef === "string" ? documentRef : documentRef?.path])

  return { document, loading }
}

/** Get the document.
 * It should be possible to add a synchronous overload, if onlyCache and cache are set.
 */
export async function getDocument<T extends DocumentData>(
  documentRef: string | DocumentReference<WithRef<T> | T | DocumentData> | undefined,
  options?: GetFirestoreOptions
) {
  if (!documentRef) {
    return undefined
  }

  const ref = typeof documentRef === "string" ? doc(getFirestore(), documentRef) : documentRef

  if (options?.cache) {
    const doc = getCachedDocument<T>(documentRef)
    if (doc) {
      return doc
    }
    if (options?.onlyCache) {
      return undefined
    }
  }

  try {
    const snapshot = await getDoc<WithRef<T>>(ref.withConverter(genericConverter<WithRef<T>>()))
    const result = snapshot.data()
    if (result) {
      cacheDocument(result)
    }
    return result
  } catch (error) {
    console.log(error)
    return undefined
  }
}
