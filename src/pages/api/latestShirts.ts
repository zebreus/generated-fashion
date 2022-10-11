import { prisma } from "functions/prisma"
import { NextApiHandler } from "next"

const handler: NextApiHandler = async (req, res) => {
  const shirts = await prisma.image.findMany({
    take: 10,
    where: {
      replicateState: "succeeded",
    },
    orderBy: {
      date: "desc",
    },
  })

  const processedResults = shirts.map(shirt => ({
    id: shirt.id,
    prompt: shirt.prompt,
    seed: shirt.seed,
  }))

  res.status(200).json({ latest: processedResults })
}

export default handler
