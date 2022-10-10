import { prisma } from "functions/prisma"
import { updatePrismaImage } from "functions/updatePrismaImage"
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
    return await updatePrismaImage(prediction)
  }

  return image
}
