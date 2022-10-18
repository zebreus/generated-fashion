import { setDoc } from "firebase/firestore"
import { generateId } from "functions/generateId"
import { getPredictionRef } from "hooks/firestore/getRefs"

export const createPrediction = async (prompt: string) => {
  const id = generateId()
  const seed = Math.floor(Math.random() * 100000000)
  const predictionRef = await getPredictionRef(id)
  await setDoc(predictionRef, {
    prompt: prompt,
    seed: seed,
    _ref: predictionRef,
  })
  return id
}
