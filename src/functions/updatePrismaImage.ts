import { prisma } from "functions/prisma"
import fetch from "node-fetch"
import { PredictionStatusObject } from "replicate-api/dist/helpers/convertPrediction"

export const updatePrismaImage = async (prediction: PredictionStatusObject) => {
  const imageUrl = prediction.output?.[0] as string | undefined
  const downloadedImage = imageUrl ? await getImage(imageUrl) : undefined
  if (!downloadedImage) {
    return
  }
  const updatedImage = await prisma.image.update({
    where: {
      replicateId: prediction.id,
    },
    data: {
      replicateState: prediction.status,
      image: { create: downloadedImage },
    },
  })

  return updatedImage
}

const getImage = async (url: string) => {
  const response = await fetch(url)
  const buffer = await response.arrayBuffer()
  const imageData = Buffer.from(buffer)
  const mimeType = response.headers.get("content-type") as string
  return { data: imageData, mimeType }
}
