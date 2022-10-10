import { prisma } from "functions/prisma"
import fetch from "node-fetch"
import { getPrediction } from "replicate-api"

export const getPrismaImage = async (id: string) => {
  const image = await prisma.image.findUnique({
    where: {
      id: id,
    },
  })

  if (!image) {
    console.log("image not found 1", image)
    return undefined
  }

  if (image.replicateState === "succeeded" || image.replicateState == "failed" || image.replicateState == "canceled") {
    return image
  }

  const prediction = await getPrediction({
    id: image.replicateId,
    token: process.env["REPLICATE_TOKEN"] || "",
  }).catch(() => undefined)

  if (!prediction) {
    console.log("image not found 2", image)
    return undefined
  }

  if (prediction.status !== image.replicateState) {
    const imageUrl = prediction.output?.[0] as string | undefined
    const downloadedImage = imageUrl ? await getImage(imageUrl) : undefined
    const updatedImage = await prisma.image.update({
      where: {
        id: id,
      },
      data: {
        replicateState: prediction.status,
        ...(downloadedImage ? { imageData: downloadedImage.imageData, imageMimeType: downloadedImage.mimeType } : {}),
      },
    })

    return updatedImage
  }
}

const getImage = async (url: string) => {
  const response = await fetch(url)
  const buffer = await response.arrayBuffer()
  const imageData = Buffer.from(buffer)
  const mimeType = response.headers.get("content-type")
  return { imageData, mimeType }
}
