import { usePrediction } from "hooks/firestore/simple/usePrediction"
import { useLikeShirt } from "hooks/useLikeShirt"

export type HeartButtonProps = {
  id: string | undefined
}

export const HeartButton = ({ id }: HeartButtonProps) => {
  const prediction = usePrediction(id)
  const [like, setLike] = useLikeShirt(id)
  return (
    <button
      className="btn btn-primary w-fit mb-2 gap-2"
      onClick={() => {
        console.log("Like is currently " + like + " and will be set to " + !like)
        setLike(!like)
      }}
      title={
        like
          ? "Remove from your favorites"
          : "Add this shirt to your favorites. You can see your favorites on the start page."
      }
    >
      {like ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 16 16">
          <g fill="none">
            <path
              d="M7.541 3.948a3.25 3.25 0 0 0-4.595-.012a3.25 3.25 0 0 0 .012 4.595l4.707 4.708a.5.5 0 0 0 .707 0l4.683-4.68a3.25 3.25 0 0 0-.012-4.594a3.252 3.252 0 0 0-4.601-.012l-.447.448l-.454-.453z"
              fill="currentColor"
            ></path>
          </g>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 16 16">
          <g fill="none">
            <path
              d="M7.541 3.948a3.25 3.25 0 0 0-4.595-.012a3.25 3.25 0 0 0 .012 4.595l4.707 4.708a.5.5 0 0 0 .707 0l4.683-4.68a3.25 3.25 0 0 0-.012-4.594a3.252 3.252 0 0 0-4.601-.012l-.447.448l-.454-.453zm4.805 3.905L8.02 12.178L3.665 7.824a2.25 2.25 0 0 1-.012-3.18a2.25 2.25 0 0 1 3.181.01l.81.81a.5.5 0 0 0 .715-.008l.79-.796a2.252 2.252 0 0 1 3.186.012a2.25 2.25 0 0 1 .011 3.181z"
              fill="currentColor"
            ></path>
          </g>
        </svg>
      )}
      {prediction?.likes || 0} Hearts
    </button>
  )
}
