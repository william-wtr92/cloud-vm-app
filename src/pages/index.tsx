import Head from "next/head"
import styles from "@/styles/pages/Home.module.css"
import { VmCard } from "@/components/ui/VmCard"

export default function Home() {
  return (
    <>
      <Head>
        <title>Azure VM Manager</title>
        <meta name="description" content="VM Azure Manager" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.home}>
        <VmCard />
      </main>
    </>
  )
}
