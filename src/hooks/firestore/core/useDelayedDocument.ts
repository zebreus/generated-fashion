import {
  deleteField,
  DocumentData,
  DocumentReference,
  FieldValue,
  PartialWithFieldValue,
  setDoc,
} from "firebase/firestore"
import { useDocument } from "hooks/firestore/core/useDocument"
import { cacheDocument } from "hooks/firestore/FirestoreCache"
import { WithRef } from "hooks/firestore/FirestoreDocument"
import { useCallback, useEffect, useRef, useState } from "react"

export type WithFieldValue<T> = {
  [Property in keyof T]: T[Property] | FieldValue
}

/**Returns a WithRef<T> and functions to update it and commit changes.
 * Until a valid document is received from firestore, undefined is returned
 * If defaultDocument is set, it is used until a real document arrives
 */
export function useDelayedDocument<T extends DocumentData>(
  documentRef: DocumentReference | undefined,
  defaultDocument?: WithRef<T>
) {
  const { document } = useDocument<T>(documentRef)
  // This delayedDocument contains no fieldvalues, while delayedDocumentRef does
  const [delayedDocument, setDelayedDocument] = useState(document ?? defaultDocument)
  const delayedDocumentRef = useRef<WithRef<T> | undefined>(document ?? defaultDocument)
  const affectedKeysRef = useRef<(keyof T)[]>([])

  useEffect(() => {
    if (!delayedDocument && !document && defaultDocument) {
      setDelayedDocument(defaultDocument)
      delayedDocumentRef.current = defaultDocument
    }
  }, [defaultDocument === undefined])

  useEffect(() => {
    if (document !== undefined) {
      delayedDocumentRef.current = document
      setDelayedDocument(document)
    }
  }, [document === undefined])

  // Updates to the real document are also applied to the delayed document, while the delayed document is unchanged
  useEffect(() => {
    if (document && affectedKeysRef.current.length === 0) {
      delayedDocumentRef.current = document
      setDelayedDocument(document)
    }
  }, [document])

  const updateDocument = useCallback((values: Partial<WithFieldValue<T>>) => {
    delayedDocumentRef.current = { ...delayedDocumentRef.current, ...values } as WithRef<T>
    affectedKeysRef.current = [...affectedKeysRef.current, ...(Object.keys(values) as (keyof T)[])]
    setDelayedDocument(
      delayedDoc =>
        ({
          ...delayedDoc,
          ...Object.fromEntries(
            Object.entries(values).map(([key, value]) => {
              const valueString = JSON.stringify(value)
              const fixedValue = valueString === JSON.stringify(deleteField()) ? undefined : value
              return [key, fixedValue]
            })
          ),
        } as WithRef<T>)
    )
  }, [])

  const commit = useCallback(async () => {
    const newDelayedDocument = delayedDocumentRef.current
    if (newDelayedDocument !== undefined) {
      const affectedKeys = affectedKeysRef.current

      const realAffectedKeys = [
        ...(defaultDocument ? Object.keys(defaultDocument) : []),
        ...affectedKeys,
      ] as (keyof T)[]
      if (realAffectedKeys.length !== 0) {
        const updateValues = realAffectedKeys.reduce((values, key) => {
          values[key] = newDelayedDocument[key]
          return values
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }, {} as Record<keyof T, any>)

        //TODO: Find better solution than as unknown as PartialWithFieldValue<T>
        await setDoc(newDelayedDocument._ref, updateValues as unknown as PartialWithFieldValue<T>, { merge: true })
        cacheDocument(newDelayedDocument)

        affectedKeysRef.current = []
      }
    }
  }, [])

  return { delayedDocument, updateDocument, commit }
}
