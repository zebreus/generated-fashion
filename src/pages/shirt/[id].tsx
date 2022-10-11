import { css } from "@emotion/react"
import { CoolShirt } from "components/CoolShirt"
import { usePrediction } from "hooks/firestore/simple/usePrediction"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"

export default function ShirtPreview() {
  const router = useRouter()
  const id = typeof router.query["id"] === "string" ? router.query["id"] : router.query["id"]?.[0]

  const prediction = usePrediction(id)
  const url = prediction?.resultUrl
  console.log(url)
  return (
    <div
      css={css`
        padding: 0 2rem;
      `}
    >
      <main
        css={css`
          min-height: 100vh;
          padding: 4rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        `}
      >
        <h1
          css={css`
            a {
              color: #0070f3;
              text-decoration: none;
            }

            a:hover,
            a:focus,
            a:active {
              text-decoration: underline;
            }

            margin: 0;
            line-height: 1.15;
            font-size: 4rem;
            text-align: center;
          `}
        >
          SHIRT! SHIRT! SHIRT! <Link href="/">ANOTHER ONE!</Link> (AI!!!)
        </h1>
        <div
          css={css`
            display: flex;
            flex-direction: row;
          `}
        >
          <CoolShirt url={url} />
          <CoolShirt url={url} />
          <CoolShirt url={url} />
        </div>

        {url ? (
          <Image src={url} alt="shirt" width={400} height={400} />
        ) : (
          <h2
            css={css`
              width: 400px;
              height: 400px;
              color: red;
            `}
          >
            Generating shirt...
          </h2>
        )}
      </main>
    </div>
  )
}
