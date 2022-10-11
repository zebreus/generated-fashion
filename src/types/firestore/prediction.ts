export type PredictionState = "starting" | "processing" | "succeeded" | "failed" | "canceled"

export type Prediction = {
  replicateId: string
  version: string
  state: string
  prompt: string
  seed: number
  resultUrl?: string
  createdAt: number
}
