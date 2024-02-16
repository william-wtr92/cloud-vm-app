import { parseCookies } from "nookies"

import parseToken from "@/web/services/utils/parseToken"
import styles from "@/styles/components/NavBar.module.css"
import { useGetUserDetail } from "@/web/services/userService"
import { NextRouter, useRouter } from "next/router"
import { useCallback } from "react"
import Button from "@/components/utils/Button"

export const NavBar = () => {
  const router: NextRouter = useRouter()

  const cookies = parseCookies()
  const jwtToken: string = cookies["token"]
  const session = parseToken(jwtToken)
  const userId = session ? session.user.id : null

  const { userDetailData, userDetailLoading } = useGetUserDetail(userId)

  const user = !userDetailLoading && userDetailData

  const handleClearCookies = useCallback(() => {
    document.cookie = "token" + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    router.push("/login")
  }, [router])

  return (
    <div className={styles.navContainer}>
      <div>
        <h1 className={styles.title}>Azure VM Manager</h1>
      </div>
      <div className={styles.infos}>
        <div>
          <span>Email:</span>
          <span>{user.email}</span>
        </div>
        <div>
          <span>Client:</span>
          <span>{user.azureClientId}</span>
        </div>
        <div>
          <span>Role:</span>
          <span className={styles.role}>{user.roleName}</span>
        </div>
        <Button label={"Logout"} onClickAction={handleClearCookies} />
      </div>
    </div>
  )
}
