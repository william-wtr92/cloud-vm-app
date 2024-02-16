import styles from "@/styles/components/NavBar.module.css"

export const NavBar = () => {
  return (
    <div className={styles.navContainer}>
      <div>
        <h1 className={styles.title}>Azure VM Manager</h1>
      </div>
      <div className={styles.infos}>
        <div>
          <span>Client:</span> d751438b-68ec-4be3-8437-d65ce2f762db
        </div>
        <div>
          <span>Subscription:</span> f41fe805-fdc1-4ee8-9844-dbb3c12bd610
        </div>
        <div>
          <span>Tenant:</span> b7b023b8-7c32-4c02-92a6-c8cdaa1d189c
        </div>
      </div>
    </div>
  )
}
