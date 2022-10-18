export type PredictionState = "starting" | "processing" | "succeeded" | "failed" | "canceled"

type PredictionRequest = {
  replicateId?: undefined
  version?: undefined
  state?: undefined
  prompt: string
  seed: number
  resultUrl?: undefined
  createdAt?: undefined
  previewImageUrl?: undefined
  likes?: undefined
}

export type Prediction =
  | {
      replicateId?: string
      version: string
      state: PredictionState
      prompt: string
      seed: number
      resultUrl?: string
      createdAt: number
      previewImageUrl?: string
      likes: number
    }
  | PredictionRequest
