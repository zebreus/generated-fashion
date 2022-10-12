// eslint-disable-next-line import/no-namespace
import * as functions from "firebase-functions"

import { request as httpRequest } from "http"
import { request as httpsRequest } from "https"

export const firestoreLevelOne = functions.firestore
  .document("{firstCollectionId}/{firstDocumentId}")
  .onWrite(async (change, context) => {
    return await relayUpdate(change, context)
  })
export const firestoreLevelTwo = functions.firestore
  .document("{firstCollectionId}/{firstDocumentId}/{secondCollectionId}/{secondDocumentId}")
  .onWrite(async (change, context) => {
    return await relayUpdate(change, context)
  })
export const firestoreLevelThree = functions.firestore
  .document(
    "{firstCollectionId}/{firstDocumentId}/{secondCollectionId}/{secondDocumentId}/{thirdCollectionId}/{thirdDocumentId}"
  )
  .onWrite(async (change, context) => {
    return await relayUpdate(change, context)
  })
export const firestoreLevelFour = functions.firestore
  .document(
    "{firstCollectionId}/{firstDocumentId}/{secondCollectionId}/{secondDocumentId}/{thirdCollectionId}/{thirdDocumentId}/{fourthCollectionId}/{fourthDocumentId}"
  )
  .onWrite(async (change, context) => {
    return await relayUpdate(change, context)
  })

type RelayedChange = {
  before: Record<string, unknown> | undefined
  after: Record<string, unknown> | undefined
  path: string
  timestamp: string
  type: "create" | "update" | "delete"
}

const relayUpdate = async (
  change: functions.Change<functions.firestore.DocumentSnapshot>,
  context: functions.EventContext
) => {
  const path = context.resource.name.split("/(default)/documents/")[1]
  if (!path) {
    throw new Error("Failed to extract firestore path from context")
  }

  const before = change.before.exists ? change.before.data() : undefined
  const after = change.after.exists ? change.after.data() : undefined

  const type = before ? (after ? "update" : "delete") : "create"

  const update: RelayedChange = {
    before: change.before.exists ? change.before.data() : undefined,
    after: change.after.exists ? change.after.data() : undefined,
    path: path,
    timestamp: context.timestamp,
    type: type,
  }

  postChange(update)
}

const getHostDetails = () => {
  const isEmulator = process.env["FUNCTIONS_EMULATOR"] === "true"
  if (isEmulator) {
    return {
      request: httpRequest,
      host: "localhost",
      port: "3000",
    }
  }
  return {
    request: httpsRequest,
    host: "generated.fashion",
    port: "443",
  }
}

const postChange = async (change: RelayedChange) => {
  const post_data = JSON.stringify(change)

  const pathSegments = change.path.split("/")

  const hostDetails = getHostDetails()
  const request = hostDetails.request

  const post_req = request(
    {
      host: hostDetails.host,
      port: hostDetails.port,
      path: "/api/firestore/" + pathSegments.join("/"),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(post_data),
        "Authorization": "Bearer " + process.env["FIRESTORE_RELAY_SHARED_SECRET"],
      },
    },
    res => {
      res.setEncoding("utf8")
      //   res.on("end", () => {
      //     resolve()
      //   })
      //   res.on("error", () => {
      //     reject()
      //   })
      //   res.on("close", () => {
      //     resolve()
      //   })
    }
  )

  post_req.write(post_data)
  post_req.end()
}
