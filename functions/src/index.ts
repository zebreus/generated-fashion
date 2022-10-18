import chrome from "@sparticuz/chromium"
import admin from "firebase-admin"
// eslint-disable-next-line import/no-namespace
import * as functions from "firebase-functions"
import { existsSync } from "fs"

import { request as httpRequest } from "http"
import { request as httpsRequest } from "https"

import puppeteer = require("puppeteer-core")

admin.initializeApp()

const getChromeExecutable = async () => {
  const isEmulator = process.env["FUNCTIONS_EMULATOR"] === "true"
  if (!isEmulator) {
    return await chrome.executablePath
  }
  const normal =
    process.platform === "win32"
      ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
      : process.platform === "linux"
      ? "/run/current-system/sw/bin/google-chrome-stable"
      : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  if (existsSync(normal)) {
    return normal
  }
  const nixos = "/run/current-system/sw/bin/google-chrome-stable"
  if (existsSync(nixos)) {
    return nixos
  }
  throw new Error("Failed to find chrome executable")
}

const takeScreenshot = async (url: string, height: number, width: number) => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-web-security"],
    executablePath: await getChromeExecutable(),
    headless: true,
    ignoreHTTPSErrors: true,
  })

  const page = await browser.newPage()
  await page.setViewport({ width, height })
  console.log("Visiting ", url)
  await page.goto(url, { waitUntil: "load", timeout: 3000 })
  await page.addStyleTag({ content: "nextjs-portal{display: none;}" })
  await page.addStyleTag({
    content: `:root,body{
    background: transparent !important;
    background-color: transparent !important;
  }`,
  })
  await new Promise(r => setTimeout(r, 5000))
  const result = await page.screenshot({ type: "webp", omitBackground: true, fullPage: true })
  await browser.close()

  return result
}

export const createShirtScreenshot = functions
  .region("europe-west3")
  .https.onCall(
    async ({
      widthQuery,
      heightQuery,
      pathQuery,
      shirtIdQuery,
      token,
    }: {
      widthQuery: string
      heightQuery: string
      pathQuery: string
      shirtIdQuery: string
      token: string
    }) => {
      if (token !== process.env["FIRESTORE_RELAY_SHARED_SECRET"]) {
        throw new functions.https.HttpsError("unauthenticated", "You need the shared secret")
      }

      if (!widthQuery || !heightQuery || !pathQuery || !shirtIdQuery) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "Missing width, height, shirtId or path query parameters."
        )
      }

      const predictionRef = admin.firestore().collection("predictions").doc(shirtIdQuery)
      const prediction = await predictionRef.get()
      if (prediction.data()?.["previewImageUrl"] !== undefined) {
        return { status: "OK", detail: "Already generated" }
      }

      const hostDetails = getHostDetails()
      const url = `${hostDetails.proto}://${hostDetails.host}:${hostDetails.port}/${pathQuery}`

      const width = parseInt(widthQuery)
      const height = parseInt(heightQuery)

      try {
        const screenshot = await takeScreenshot(url, height, width)
        if (!screenshot) {
          throw new functions.https.HttpsError("internal", "Failed to generate screenshot for a unknown reason")
        }

        const storage = admin.storage().bucket()
        const storageFile = storage.file(`images/${shirtIdQuery}.webp`)
        await storageFile.save(screenshot, {
          contentType: "image/webp",
        })
        await storageFile.makePublic()
        const [metadata] = await storageFile.getMetadata()
        const previewImageUrl = (metadata?.publicUrl?.() || storageFile?.publicUrl?.())?.replace("%2F", "/")
        console.log("Generated preview image url", previewImageUrl)
        await predictionRef.update({ previewImageUrl })
        return { status: "OK", url: previewImageUrl }
      } catch (e) {
        console.error(e)
        if (e instanceof functions.https.HttpsError) {
          throw e
        }
        throw new functions.https.HttpsError("internal", JSON.stringify(e))
      }
    }
  )

export const createScreenshot = functions
  .region("europe-west3")
  .runWith({
    timeoutSeconds: 60,
    memory: "2GB",
  })
  .https.onRequest(async (req, res) => {
    const authHeader = req.headers.authorization
    if (!authHeader || authHeader !== "Bearer " + process.env["FIRESTORE_RELAY_SHARED_SECRET"]) {
      res.status(401).send("Unauthorized")
      return
    }

    const {
      width: widthQuery,
      height: heightQuery,
      path: pathQuery,
    } = req.query as { width: string; height: string; path: string }
    if (!widthQuery || !heightQuery || !pathQuery) {
      res.status(400).send("Bad request. Missing width, height, or path query parameters.")
      return
    }

    const hostDetails = getHostDetails()
    const url = `${hostDetails.proto}://${hostDetails.host}:${hostDetails.port}/${pathQuery}`

    const width = parseInt(widthQuery)
    const height = parseInt(heightQuery)

    try {
      const screenshot = await takeScreenshot(url, height, width)
      res.set("Content-Type", "image/webp")
      res.contentType("image/webp").send(screenshot)
    } catch (e) {
      res.status(500).send(JSON.stringify(e))
      console.error(e)
    }
  })

export const firestoreLevelOne = functions
  .region("europe-west3")
  .firestore.document("{firstCollectionId}/{firstDocumentId}")
  .onWrite(async (change, context) => {
    return await relayUpdate(change, context)
  })
export const firestoreLevelTwo = functions
  .region("europe-west3")
  .firestore.document("{firstCollectionId}/{firstDocumentId}/{secondCollectionId}/{secondDocumentId}")
  .onWrite(async (change, context) => {
    return await relayUpdate(change, context)
  })
export const firestoreLevelThree = functions
  .region("europe-west3")
  .firestore.document(
    "{firstCollectionId}/{firstDocumentId}/{secondCollectionId}/{secondDocumentId}/{thirdCollectionId}/{thirdDocumentId}"
  )
  .onWrite(async (change, context) => {
    return await relayUpdate(change, context)
  })
export const firestoreLevelFour = functions
  .region("europe-west3")
  .firestore.document(
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
      proto: "http",
    }
  }
  return {
    request: httpsRequest,
    host: "generated.fashion",
    port: "443",
    proto: "https",
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
