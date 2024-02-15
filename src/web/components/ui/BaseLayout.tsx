import styles from "@/styles/components/BaseLayout.module.css"
import { NavBar } from "@/components/ui/NavBar"

export const BaseLayout = (props: any) => {
  const { children } = props

  return (
    <div className={styles.layout}>
      <NavBar />

      {children}
    </div>
  )
}
