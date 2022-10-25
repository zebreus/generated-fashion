export type PredictionState = "starting" | "processing" | "succeeded" | "failed" | "canceled"

export type Parrot = {
  replicateId?: string
  version?: string
  state?: PredictionState
  prompt: string
  results?: string[]
  explorationId: string
  createdAt?: number
}
