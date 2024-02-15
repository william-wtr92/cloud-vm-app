import React from "react"
import { NextRouter, useRouter } from "next/router"
import Image from "next/image"
import { Formik, Form } from "formik"

import styles from "@/styles/pages/Login.module.css"
import {
  LoginInitialValues,
  loginValidator,
} from "@/utils/validators/loginValidator"
import { LoginLayout } from "@/components/ui/LoginLayout"
import FormikField from "@/components/utils/FormikField"
import Button from "@/components/utils/Button"
import loginService from "@/web/services/loginService"

const initialValues: LoginInitialValues = {
  email: "",
  password: "",
}

const Login = () => {
  const router: NextRouter = useRouter()

  const [loginError, setLoginError] = React.useState<string | null>(null)

  const handleSubmit = async (values: LoginInitialValues): Promise<void> => {
    const [error] = await loginService(values)

    if (error) {
      setLoginError(
        "Failed to login. Please check your credentials and try again.",
      )
    } else {
      router.push("/")
    }
  }

  return (
    <main className={styles.container}>
      <div className={styles.login}>
        <div className={styles.titleContainer}>
          <span className={styles.emoji}>💻</span>
          <div className={styles.titleSubContainer}>
            <h1>Welcome Home</h1>
            <span>Please enter your Azure details.</span>
          </div>
        </div>

        <div className={styles.formContainer}>
          <Formik
            className={styles.loginForm}
            initialValues={initialValues}
            validationSchema={loginValidator}
            onSubmit={handleSubmit}
          >
            {() => {
              return (
                <Form className={styles.form}>
                  <FormikField
                    type={"text"}
                    placeholder="E-mail"
                    name={"email"}
                    label={"E-mail"}
                  />
                  <FormikField
                    type={"password"}
                    placeholder="Password"
                    name={"password"}
                    label={"Password"}
                  />

                  {loginError && (
                    <span className={styles.formErrors}>{loginError}</span>
                  )}

                  <Button label={"Login"} />
                </Form>
              )
            }}
          </Formik>
        </div>
      </div>

      <div className={styles.imagesContainer}>
        <Image
          className={styles.mageWrapper}
          src={"/images/login-image.jpeg"}
          alt="logo"
          fill={true}
          layout={"fill"}
          objectFit={"cover"}
        />
      </div>
    </main>
  )
}

Login.getLayout = function (page: any): React.JSX.Element {
  return <LoginLayout>{page}</LoginLayout>
}

export default Login
