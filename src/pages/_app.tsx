import type { AppProps } from "next/app"
import Head from "next/head"
import { useEffect } from "react"
import { parseCookies } from "nookies"
import { NextRouter, useRouter } from "next/router"

import "@/styles/globals.css"
import { BaseLayout } from "@/components/ui/BaseLayout"
import parseSession from "@/web/services/utils/parseToken"

export default function App({ Component, pageProps }: AppProps) {
  const router: NextRouter = useRouter()
  const cookies = parseCookies()
  const token: string = cookies.token

  useEffect(() => {
    const session = token ? parseSession(token) : null

    if (!session && router.pathname !== "/login") {
      router.push("/login")
    }

    if (session && router.pathname === "/login") {
      router.push("/")
    }
  }, [router, token])

  const renderWithLayout =
    (Component as any).getLayout ||
    ((page: any) => <BaseLayout>{page}</BaseLayout>)

  return (
    <>
      <Head>
        <title>Azure VM Manager</title>
      </Head>
      {renderWithLayout(<Component {...pageProps} />)}
    </>
  )
}
