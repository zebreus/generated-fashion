import { NextApiHandler } from "next"

const handler: NextApiHandler = async (req, res) => {
  if (req.headers.authorization !== "Bearer " + process.env["FIRESTORE_RELAY_SHARED_SECRET"]) {
    res.status(401).json({ detail: "unauthorized" })
    return
  }
  console.log("Firestore handler")
  console.log("body:", req.body)
  res.status(200).json({ state: "success" })
  return
}

export default handler
