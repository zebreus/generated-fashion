import {
  CollectionReference,
  doc,
  DocumentData,
  DocumentReference,
  getFirestore,
  OrderByDirection,
  QueryConstraint,
  Timestamp,
  WhereFilterOp,
} from "firebase/firestore"
import { genericConverter, WithRef } from "hooks/firestore/FirestoreDocument"
import { FunctionComponent } from "react"

type FirestoreCache = Record<string, WithRef<DocumentData> | undefined>
type TransferableFirestoreCache = Record<string, unknown>

const cache: FirestoreCache = {}

// Convenience functions for ease of use in pages. Just wrap the props in withExportCache and the page component in withImportCache.
// ts-prune-ignore-next
export function withImportCache<T>(
  child: FunctionComponent<T>
): FunctionComponent<{ firestoreCache: TransferableFirestoreCache } & T> {
  const wrappedFunction: FunctionComponent<{ firestoreCache: TransferableFirestoreCache } & T> = props => {
    importCache(props.firestoreCache)
    return child(props)
  }
  return wrappedFunction
}

// ts-prune-ignore-next
export function withExportCache<T>(props: T) {
  return { ...props, firestoreCache: exportCache() }
}

// ts-prune-ignore-next
export function exportCache() {
  return serializeDocuments(cache)
}

// ts-prune-ignore-next
export function importCache(newCache?: TransferableFirestoreCache) {
  if (!newCache) {
    return
  }
  const otherCache = deserializeDocuments(newCache)
  Object.assign(cache, otherCache)
}

// ts-prune-ignore-next
export function clearCache() {
  for (const member in cache) delete cache[member]
}

// ts-prune-ignore-next
export function serializeDocuments(cache: FirestoreCache) {
  const strippedDocuments = Object.fromEntries(
    (Object.entries(cache).filter(entry => !!entry[1]) as [string, WithRef<DocumentData>][]).map(([path, document]) => {
      /* eslint-disable no-unused-vars */
      /* eslint-disable @typescript-eslint/no-unused-vars */
      const { _ref, ...withoutRef } = document
      return [path, serializeDocument(withoutRef as DocumentData)]
    })
  )
  return strippedDocuments as TransferableFirestoreCache
}

// ts-prune-ignore-next
export function serializeDocument(document: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(document)
      .sort(([a], [b]) => (a < b ? 1 : a > b ? -1 : 0))
      .filter(([key]) => key !== "_ref")
      .map(([key, value]) => {
        return [key, serializeValue(value)]
      })
  )
}

function serializeValue(value: unknown): unknown {
  switch (typeof value) {
    case "object": {
      if (value === null) {
        return value
      }
      if (Array.isArray(value)) {
        return value.map(v => serializeValue(v))
      }
      // Support for firestore Bytes
      // if (Object.prototype.hasOwnProperty.call(value, "_byteString")) {
      //   return { _byteString: (value as Bytes).toBase64() }
      // }
      const recordValue = value as Record<string, unknown>
      if (typeof recordValue["seconds"] === "number" && typeof recordValue["nanoseconds"] === "number") {
        return { seconds: recordValue["seconds"], nanoseconds: recordValue["nanoseconds"] }
      }
      return serializeDocument(recordValue)
    }
    default:
      return value
  }
}

// ts-prune-ignore-next
export function deserializeDocument(serializedDocument: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(serializedDocument).map(([key, value]) => {
      return [key, deserializeValue(value)]
    })
  )
}

function deserializeValue(value: unknown): unknown {
  switch (typeof value) {
    case "object": {
      if (value === null) {
        return value
      }
      if (Array.isArray(value)) {
        return value.map(v => deserializeValue(v))
      }
      // Support for firestore Bytes
      // if (Object.prototype.hasOwnProperty.call(value, "_byteString")) {
      //   return Bytes.fromBase64String((value as { _byteString: string })._byteString)
      // }
      const recordValue = value as Record<string, unknown>
      if (typeof recordValue["seconds"] === "number" && typeof recordValue["nanoseconds"] === "number") {
        return new Timestamp(recordValue["seconds"], recordValue["nanoseconds"])
      }
      return deserializeDocument(recordValue)
    }
    default:
      return value
  }
}

// ts-prune-ignore-next
export function deserializeDocuments(transferableCache: TransferableFirestoreCache) {
  const restoredCache = Object.fromEntries(
    Object.entries(transferableCache).map(([path, document]) => {
      const ref = doc(getFirestore(), path).withConverter(genericConverter<WithRef<DocumentData>>())
      // eslint-disable-next-line @typescript-eslint/ban-types
      return [path, { ...deserializeDocument(document as DocumentData), _ref: ref } as WithRef<DocumentData>]
    })
  )

  return restoredCache as FirestoreCache
}

function toCleanPath(documentRef: string | DocumentReference | CollectionReference) {
  const path = (typeof documentRef === "string" ? documentRef : documentRef.path).replace(/^\/|\/$/g, "")
  return path
}

// ts-prune-ignore-next
export function cacheDocument<T extends DocumentData>(document: WithRef<T>) {
  const path = toCleanPath(document._ref)
  cache[path] = document
}

// ts-prune-ignore-next
export function uncacheDocument(documentRef: string | DocumentReference) {
  const path = toCleanPath(documentRef)
  cache[path] = undefined
}

// ts-prune-ignore-next
export function getCachedDocuments<T extends DocumentData>(
  documentRefs: (DocumentReference | string)[] | undefined,
  requireAll = false
) {
  if (!documentRefs) {
    return undefined
  }

  const docs = documentRefs.map(ref => getCachedDocument<T>(ref)).flatMap(f => (f ? [f] : []))
  if (requireAll && docs.length !== documentRefs.length) {
    return undefined
  }
  return docs
}

// ts-prune-ignore-next
export function getCachedDocument<T extends DocumentData>(documentRef: string | DocumentReference | undefined) {
  if (!documentRef) {
    return undefined
  }
  const path = toCleanPath(documentRef)
  const document = cache[path]
  if (typeof document === "undefined") {
    return undefined
  }
  return document as WithRef<T>
}

// ts-prune-ignore-next
export function getCachedCollection<T extends DocumentData>(collectionRef: string | CollectionReference | undefined) {
  if (!collectionRef) {
    return undefined
  }
  const path = toCleanPath(collectionRef)
  const documents = Object.entries(cache)
    .filter(([docPath, document]) => docPath.startsWith(path))
    .map(([docPath, document]) => {
      return document
    })
  return documents as WithRef<T>[]
}

function getAttribute<T extends DocumentData>(document: WithRef<T>, segments: (string | number)[]) {
  if (segments[0] === "__name__") {
    return document._ref.id
  }
  const docValue = segments.reduce((current, segment) => {
    return current?.[segment]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }, document as any)
  return docValue
}

interface WhereConstraint {
  type: "where"
  _op: WhereFilterOp
  _field: { segments: (string | number)[] }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _value: any
}

interface LimitConstraint {
  type: "limit" | "limitToLast"
  _limit: number
  _limitType: "L" | "F"
}

interface OrderByConstraint {
  type: "orderBy"
  _direction: OrderByDirection
  _field: { segments: (string | number)[] }
}

interface CursorConstraint {
  type: "startAt" | "startAfter" | "endAt" | "endBefore"
}

type FixedQueryConstraint = WhereConstraint | LimitConstraint | OrderByConstraint | CursorConstraint

function fixQueryConstraint(constraint: QueryConstraint): FixedQueryConstraint {
  switch (constraint.type) {
    case "where": {
      const mangledWhereConstraint = constraint as {
        ga?: WhereFilterOp
        ma?: { segments: (string | number)[] }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ya?: any
      } & WhereConstraint

      return {
        type: mangledWhereConstraint.type,
        _op: mangledWhereConstraint.ga ?? mangledWhereConstraint._op,
        _value: mangledWhereConstraint.ya ?? mangledWhereConstraint._value,
        _field: mangledWhereConstraint.ma ?? mangledWhereConstraint._field,
      }
    }
    case "orderBy": {
      const mangledOrderByConstraint = constraint as {
        pa?: OrderByDirection
        ma?: { segments: (string | number)[] }
      } & OrderByConstraint

      return {
        type: mangledOrderByConstraint.type,
        _direction: mangledOrderByConstraint.pa ?? mangledOrderByConstraint._direction,
        _field: mangledOrderByConstraint.ma ?? mangledOrderByConstraint._field,
      }
    }
    case "limit":
    case "limitToLast": {
      const mangledLimitConstraint = constraint as {
        Ia?: number
        Ta?: "L" | "F"
      } & LimitConstraint

      return {
        type: mangledLimitConstraint.type,
        _limit: mangledLimitConstraint.Ia ?? mangledLimitConstraint._limit,
        _limitType: mangledLimitConstraint.Ta ?? mangledLimitConstraint._limitType,
      }
    }
    case "startAt":
    case "startAfter":
    case "endAt":
    case "endBefore":
      return { type: constraint.type }
  }
}

// ts-prune-ignore-next
export function getCachedQuery<T extends DocumentData>(
  collectionRef: string | CollectionReference | undefined,
  ...constraints: QueryConstraint[]
) {
  const collectionDocs = getCachedCollection<T>(collectionRef)
  if (!collectionDocs) {
    return undefined
  }

  const queriedDocs = constraints
    .map(constraint => fixQueryConstraint(constraint))
    .reduce((docs, constraint) => {
      switch (constraint.type) {
        case "where": {
          const result = docs.filter(document => {
            const docValue = getAttribute(document, constraint._field.segments)
            const constraintValue = constraint._value

            switch (constraint._op) {
              case "<":
                return docValue < constraintValue
              case "<=":
                return docValue <= constraintValue
              case "==":
                return docValue == constraintValue
              case "!=":
                return docValue != constraintValue
              case ">=":
                return docValue >= constraintValue
              case ">":
                return docValue > constraintValue
              case "array-contains":
                if (typeof docValue !== "object") {
                  return false
                }
                return docValue.includes(constraintValue)
              case "in":
                if (typeof constraintValue !== "object") {
                  return false
                }
                return constraintValue.includes(docValue)
              case "array-contains-any":
                if (typeof docValue !== "object" || typeof constraintValue !== "object") {
                  return false
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return docValue.some((val: any) => constraintValue.includes(val))
              case "not-in":
                if (typeof constraintValue !== "object") {
                  return false
                }
                return !constraintValue.includes(docValue)
            }
          })

          return result
        }
        case "orderBy": {
          const result = docs
            .filter(document => {
              const docValue = getAttribute(document, constraint._field.segments)
              return docValue !== undefined
            })
            .sort((a, b) => {
              const aValue = getAttribute(a, constraint._field.segments)
              const bValue = getAttribute(b, constraint._field.segments)
              const aSmallerB = aValue < bValue
              const bSmallerA = bValue < aValue
              return !aSmallerB && !bSmallerA ? 0 : (constraint._direction === "desc" ? aSmallerB : bSmallerA) ? 1 : -1
            })
          return result
        }
        case "limit":
        case "limitToLast": {
          switch (constraint._limitType) {
            case "L":
              return docs.slice(-constraint._limit)
            case "F":
            default:
              return docs.slice(0, constraint._limit)
          }
        }
        case "startAt":
        case "startAfter":
        case "endAt":
        case "endBefore":
          console.error(
            "Our firestore caching does not support cursors yet. If you need them, tell lennart or implement them yourself in FirestoreCache.ts"
          )
          return docs
        default:
          return docs
      }
    }, collectionDocs)

  return queriedDocs
}
