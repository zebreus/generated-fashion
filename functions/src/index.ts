import chrome from "@sparticuz/chromium"
import admin from "firebase-admin"
// eslint-disable-next-line import/no-namespace
import * as functions from "firebase-functions"
import { existsSync } from "fs"

import { request as httpRequest } from "http"
import { request as httpsRequest } from "https"
import fetch from "node-fetch"

import puppeteer = require("puppeteer-core")
import sharp = require("sharp")

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

const takeScreenshot = async (url: string, height: number, width: number, extraWait?: number) => {
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
  await new Promise(r => setTimeout(r, extraWait ?? 0))
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
      shirtIdQuery,
      token,
    }: {
      widthQuery: string
      heightQuery: string
      shirtIdQuery: string
      token: string
    }) => {
      if (token !== process.env["FIRESTORE_RELAY_SHARED_SECRET"]) {
        throw new functions.https.HttpsError("unauthenticated", "You need the shared secret")
      }

      if (!widthQuery || !heightQuery || !shirtIdQuery) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "Missing width, height, shirtId or path query parameters."
        )
      }

      const predictionRef = admin.firestore().collection("predictions").doc(shirtIdQuery)
      const prediction = await predictionRef.get()

      const bucketImagePromise = moveImageIntoBucket(prediction)
      const printUrls = await createPrintScreenshot(prediction)
      const bucketImage = await bucketImagePromise

      await predictionRef.update({
        resultUrl: bucketImage,
        smallPrintUrl: printUrls.small,
        printUrl: printUrls.big,
      })

      const previewUrl = await createPreviewScreenshot(prediction)
      await predictionRef.update({
        previewImageUrl: previewUrl,
      })

      return { status: "OK", url: previewUrl }
    }
  )

const putIntoPublicBucket = async (content: string | Buffer, name: string, type = "image/webp") => {
  try {
    const storage = admin.storage().bucket()
    const storageFile = storage.file(name)
    await storageFile.save(content, {
      contentType: type,
    })
    await storageFile.makePublic()
    const [metadata] = await storageFile.getMetadata()
    const previewImageUrl = ((metadata?.publicUrl?.() as string) || storageFile?.publicUrl?.())?.replace("%2F", "/")
    console.log("Put file into bucket", previewImageUrl)
    return previewImageUrl
  } catch (e) {
    console.error(e)
    if (e instanceof functions.https.HttpsError) {
      throw e
    }
    throw new functions.https.HttpsError("internal", JSON.stringify(e))
  }
}

const resizeImageBuffer = async (image: Buffer | string, maxWidth: number) => {
  const resizedBuffer = await sharp(image, { pages: -1 })
    .rotate()
    .resize(maxWidth, undefined, { fit: "cover", withoutEnlargement: true })
    .webp({ quality: 92 })
    .toBuffer()

  return resizedBuffer
}

const moveImageIntoBucket = async (shirt: admin.firestore.DocumentSnapshot<admin.firestore.DocumentData>) => {
  if (typeof shirt.data()?.["resultUrl"] !== "string") {
    throw new functions.https.HttpsError("internal", "Failed to move nonexistent image into bucket")
  }

  const motifUrl = shirt.data()?.["resultUrl"] as string
  if (
    motifUrl.includes("localhost") ||
    motifUrl.includes("127.0.0.1") ||
    motifUrl.includes("google") ||
    motifUrl.includes("firebase") ||
    motifUrl.includes("appspot")
  ) {
    return motifUrl
  }
  const image = await fetch(motifUrl)
  const imageData = Buffer.from(await image.arrayBuffer())
  const image512 = await resizeImageBuffer(imageData, 512)
  // const image256 = await resizeImageBuffer(imageData, 256)
  const publicUrl = await putIntoPublicBucket(image512, `images/${shirt.id}/motif-512.webp`, `image/webp`)
  // const publicUrl = await putIntoPublicBucket(image256, `images/${shirt.id}/motif-256.webp`, `image/webp`)

  return publicUrl
}

const createPreviewScreenshot = async (shirt: admin.firestore.DocumentSnapshot<admin.firestore.DocumentData>) => {
  if (shirt.data()?.["previewImageUrl"] !== undefined) {
    return shirt.data()?.["previewImageUrl"]
  }

  const hostDetails = getHostDetails()
  const url = `${hostDetails.proto}://${hostDetails.host}:${hostDetails.port}/shirt/${shirt.id}/image`

  const width = 288
  const height = 384

  try {
    const screenshot = await takeScreenshot(url, height, width, 3000)
    if (!screenshot) {
      throw new functions.https.HttpsError("internal", "Failed to generate screenshot for a unknown reason")
    }
    const publicUrl = await putIntoPublicBucket(screenshot, `images/${shirt.id}/preview-288.webp`, `image/webp`)

    return publicUrl
  } catch (e) {
    console.error(e)
    if (e instanceof functions.https.HttpsError) {
      throw e
    }
    throw new functions.https.HttpsError("internal", JSON.stringify(e))
  }
}

const createPrintScreenshot = async (shirt: admin.firestore.DocumentSnapshot<admin.firestore.DocumentData>) => {
  if (typeof shirt.data()?.["printUrl"] === "string" && typeof shirt.data()?.["smallPrintUrl"] === "string") {
    return {
      small: shirt.data()?.["smallPrintUrl"] as string,
      big: shirt.data()?.["printUrl"] as string,
    }
  }

  const hostDetails = getHostDetails()
  const url = `${hostDetails.proto}://${hostDetails.host}:${hostDetails.port}/shirt/${shirt.id}/print`

  const dpi = 200
  const printWidth = 23.4
  const printHeight = 28.95

  const width = dpi * printWidth
  const height = dpi * printHeight

  try {
    const print = await takeScreenshot(url, height, width)
    if (!print) {
      throw new functions.https.HttpsError("internal", "Failed to generate screenshot for a unknown reason")
    }
    const printSmall = await resizeImageBuffer(print, 300)

    const printPublicUrl = await putIntoPublicBucket(print, `images/${shirt.id}/print.webp`, `image/webp`)
    const printSmallPublicUrl = await putIntoPublicBucket(printSmall, `images/${shirt.id}/print-300.webp`, `image/webp`)

    return {
      small: printSmallPublicUrl,
      big: printPublicUrl,
    }
  } catch (e) {
    console.error(e)
    if (e instanceof functions.https.HttpsError) {
      throw e
    }
    throw new functions.https.HttpsError("internal", JSON.stringify(e))
  }
}

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
