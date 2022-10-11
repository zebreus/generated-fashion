import { css } from "@emotion/react"
import { Gallery } from "components/Gallery"
import Head from "next/head"
import Image from "next/image"
import { useRouter } from "next/router"

export default function ShirtPreview() {
  const router = useRouter()
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
          Create shirts with <a href="https://nextjs.org">stable diffusion</a> (AI!!!)
        </h1>

        <textarea
          id="textareaJOOO"
          css={css`
            margin: 4rem 0;
            line-height: 1.5;
            font-size: 1.5rem;
            text-align: center;
          `}
          defaultValue="ruiner, cyber future, hello darkness, drawn, her head break, red and black color scheme, blade runner, Benedykt Szneider, modular synth, red on black"
        />

        <button
          onClick={async () => {
            console.log("clicked")
            const textarea = document.getElementById("textareaJOOO") as HTMLTextAreaElement
            const content = textarea.value
            const response = await fetch("/api/shirt", {
              body: JSON.stringify({ prompt: content }),
              method: "POST",
              headers: { "Content-Type": "application/json" },
            })
            const responseJson = await response.json()
            const id = responseJson.id
            if (!id) {
              alert("Something went wrong, no id")
            }
            router.push("/shirt/" + id)
          }}
        >
          GENERATE NOW!!!
        </button>
        <Gallery />
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
