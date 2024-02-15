import React from "react"
import { Field } from "formik"
import styles from "@/styles/components/FormikField.module.css"

type Props = {
  type: string
  placeholder?: string
  label?: string
  value?: any
  name?: string
}

const FormikField = (props: Props) => {
  const { type, placeholder, value, label, name }: Props = props

  return (
    <Field name={name}>
      {({ field, meta }: { field: any; meta: any }) => {
        return (
          <label className={styles.wrapper}>
            <span>{label}</span>

            {meta.touched && meta.error && (
              <span className={styles.errorMessage}>{meta.error}</span>
            )}

            <input
              {...field}
              className={styles.input}
              type={type}
              placeholder={placeholder}
              defaultValue={value}
              name={name}
              min={0}
            />
          </label>
        )
      }}
    </Field>
  )
}

export default FormikField
