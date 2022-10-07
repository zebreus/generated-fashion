import { css } from "@emotion/react"
import { CoolShirt } from "components/CoolShirt"
import { useImage } from "hooks/useImage"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"

export default function ShirtPreview() {
  const router = useRouter()
  const id = typeof router.query["id"] === "string" ? router.query["id"] : router.query["id"]?.[0]

  const url = useImage(id)
  console.log(url)
  return (
    <div
      css={css`
        padding: 0 2rem;
      `}
    >
      <Head>
        <title>text2shirt</title>
        <meta name="description" content="Ai created shirts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
          {" "}
          <CoolShirt url={url} />
          <CoolShirt url={url} />
          <CoolShirt url={url} />
        </div>

        {url ? (
          <Image src={url} alt="shirt" width={400} height={400} />
        ) : (
          <h2 style={{ color: "red" }}>No shirt found... yet</h2>
        )}
      </main>

      <footer
        css={css`
          display: flex;
          flex: 1;
          padding: 2rem 0;
          border-top: 1px solid #eaeaea;
          justify-content: center;
          align-items: center;

          a {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-grow: 1;
          }
        `}
      >
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span
            css={css`
              height: 1em;
              margin-left: 0.5rem;
            `}
          >
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
