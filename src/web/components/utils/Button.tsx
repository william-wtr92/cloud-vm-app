import React from "react"
import styles from "@/styles/components/Button.module.css"

type Props = {
  label: string
  onClickAction?: () => void
  disabled?: boolean
}

const Button = (props: Props) => {
  const { label, onClickAction, disabled }: Props = props

  return (
    <button
      type={"submit"}
      className={styles.button}
      disabled={disabled}
      onClick={onClickAction}
    >
      {label}
    </button>
  )
}

export default Button
