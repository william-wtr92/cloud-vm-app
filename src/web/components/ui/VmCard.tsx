import styles from "@/styles/components/VmCard.module.css"
import Image from "next/image"
import Button from "@/components/utils/Button"

export const VmCard = () => {
  const cardMockData = [
    {
      id: 1,
      name: "VM Windows 10",
      image: "/images/windows.png",
      alt: "Windows 10 logo",
      status: "Down",
      ip: "12.0.0.1",
      username: "admin",
      password: "admin",
    },
    {
      id: 2,
      name: "VM Ubuntu",
      image: "/images/ubuntu.png",
      alt: "Ubuntu logo",
      status: "Down",
      ip: "12.0.0.1",
      username: "admin",
      password: "admin",
    },
    {
      id: 3,
      name: "VM Windows 11",
      image: "/images/windows.png",
      alt: "Windows 11 logo",
      status: "Running",
      ip: "12.0.0.1",
      username: "admin",
      password: "admin",
    },
    {
      id: 4,
      name: "VM Debian",
      image: "/images/debian.png",
      alt: "Debian logo",
      status: "Running",
      ip: "12.0.0.1",
      username: "admin",
      password: "admin",
    },
  ]

  return (
    <div className={styles.vmcardContainer}>
      {cardMockData.map((card) => {
        return (
          <>
            {card.status === "Running" ? (
              <div key={card.id} className={styles.vmCard}>
                <h3 className={styles.title}>{card.name}</h3>
                <div className={styles.imagesContainer}>
                  <Image
                    className={styles.images}
                    src={card.image}
                    alt={card.alt}
                    fill={true}
                    layout={"fill"}
                  />
                </div>
                <div className={styles.status}>
                  <p>Status:</p>
                  {card.status === "Running" ? (
                    <p className={styles.running}></p>
                  ) : (
                    <p className={styles.down}></p>
                  )}
                </div>
                <div>
                  {card.status === "Running" && (
                    <div className={styles.infos}>
                      <div>
                        address: <span>{card.ip}</span>
                      </div>
                      <div>
                        user: <span>{card.username}</span>
                      </div>
                      <div>
                        password: <span>{card.password}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div key={card.id} className={styles.vmCard}>
                <h3 className={styles.title}>{card.name}</h3>
                <div className={styles.imagesContainer}>
                  <Image
                    className={styles.images}
                    src={card.image}
                    alt={card.alt}
                    fill={true}
                    layout={"fill"}
                  />
                </div>
                <div className={styles.status}>
                  <p>Status:</p>
                  <p className={styles.down}></p>
                </div>
                <div className={styles.startButton}>
                  <Button label={"Start"} />
                </div>
              </div>
            )}
          </>
        )
      })}
    </div>
  )
}
