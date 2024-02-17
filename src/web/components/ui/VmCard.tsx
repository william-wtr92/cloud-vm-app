import Image from "next/image"
import React, { useState } from "react"
import { parseCookies } from "nookies"

import styles from "@/styles/components/VmCard.module.css"
import Button from "@/components/utils/Button"
import createVmService from "@/web/services/createVmService"
import {
  CreateVmInitialValues,
  StartedVms,
} from "@/utils/validators/createVmValidator"

export const VmCard = () => {
  const cardMockData = [
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
      alt: "xfce logo",
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

  const cookies = parseCookies()
  const azureToken: string = cookies["azure_token"]

  const handleSubmit = async (osType: string, vmId: number) => {
    const values: CreateVmInitialValues = {
      jwt: azureToken,
      osType,
    }

    const [result] = await createVmService(values)

    setStartedVms((prev) => ({
      ...prev,
      [vmId]: result,
    }))

    setVms((prevVms) =>
      prevVms.map((vm) => (vm.id === vmId ? { ...vm, status: "Running" } : vm)),
    )
  }

  return (
    <div className={styles.vmcardContainer}>
      {vms.map((card) => (
        <div key={card.id} className={styles.vmCard}>
          <h3 className={styles.title}>{card.name}</h3>
          <div className={styles.imagesContainer}>
            <Image
              className={styles.images}
              src={card.image}
              alt={card.alt}
              fill={true}
            />
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
