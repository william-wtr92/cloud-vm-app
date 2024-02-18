import Image from "next/image"
import React, { useEffect, useState } from "react"
import { parseCookies } from "nookies"

import styles from "@/styles/components/VmCard.module.css"
import Button from "@/components/utils/Button"
import createVmService from "@/web/services/createVmService"
import {
  CreateVmInitialValues,
  StartedVms,
} from "@/utils/validators/createVmValidator"
import parseToken from "@/web/services/utils/parseToken"
import { Cookies, VMCard } from "@/utils/validators/genericValidator"

export const VmCard = () => {
  const cardMockData: VMCard[] = [
    {
      id: 1,
      name: "VM Windows 10",
      image: "/images/windows.png",
      alt: "Windows 10 logo",
      status: "Down",
      osType: "Windows 10",
    },
    {
      id: 2,
      name: "VM Ubuntu",
      image: "/images/ubuntu.png",
      alt: "Ubuntu logo",
      status: "Down",
      osType: "Ubuntu",
    },
    {
      id: 3,
      name: "VM CentOS",
      image: "/images/centos.png",
      alt: "CentOS logo",
      status: "Down",
      osType: "CentOS",
    },
    {
      id: 4,
      name: "VM Debian",
      image: "/images/debian.png",
      alt: "Debian logo",
      status: "Down",
      osType: "Debian",
    },
  ]
  const [startedVms, setStartedVms] = useState<StartedVms>({})
  const [vms, setVms] = useState(cardMockData)
  const [userRole, setUserRole] = useState<string | null>(null)

  const cookies: Cookies = parseCookies()
  const azureToken: string = cookies["azure_token"]

  useEffect((): void => {
    const userToken: string = cookies["token"]
    const role: string = userToken ? parseToken(userToken).user.role : null

    setUserRole(role)
  }, [cookies])

  const displayVms: VMCard[] = userRole === "owner" ? vms : [vms[1]]

  if (userRole === "reader") {
    return (
      <div className={styles.noCreds}>
        You do not have any credits to use VMs.
      </div>
    )
  }

  const handleSubmit = async (osType: string, vmId: number): Promise<void> => {
    const values: CreateVmInitialValues = {
      jwt: azureToken,
      osType,
    }

    const [result] = await createVmService(values)

    setStartedVms((prev: StartedVms) => ({
      ...prev,
      [vmId]: result,
    }))

    setVms((prevVms: VMCard[]) =>
      prevVms.map(
        (vm: VMCard): VMCard =>
          vm.id === vmId ? { ...vm, status: "Running" } : vm,
      ),
    )
  }

  return (
    <div className={styles.vmcardContainer}>
      {displayVms.map((card: VMCard) => (
        <div key={card.id} className={styles.vmCard}>
          <h3 className={styles.title}>{card.name}</h3>
          <div className={styles.imagesContainer}>
            <div className={styles.imagesSubContainer}>
              <Image src={card.image} alt={card.alt} fill={true} />
            </div>
          </div>
          <div className={styles.status}>
            <p>Status:</p>
            <p
              className={
                card.status === "Running" ? styles.running : styles.down
              }
            ></p>
          </div>
          {startedVms[card.id] ? (
            <div className={styles.infos}>
              <div className={styles.infosCard}>
                <span>address</span>
                <span> {startedVms[card.id].credentials.ip}</span>
              </div>
              <div>
                <span>username</span>
                <span> {startedVms[card.id].credentials.username}</span>
              </div>
              <div>
                <span>password</span>
                <span> {startedVms[card.id].credentials.password}</span>
              </div>
            </div>
          ) : (
            <div className={styles.startButton}>
              <Button
                label={"Start"}
                onClickAction={() => handleSubmit(card.osType, card.id)}
                disabled={card.status === "Running"}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
