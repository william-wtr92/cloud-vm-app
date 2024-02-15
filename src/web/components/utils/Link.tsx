import classNames from "classnames"
import NextLink, { LinkProps } from "next/link"
import React, { FC } from "react"

export interface Props extends LinkProps {
  href: string
  children: any
  className?: string
}

const Link: FC<Props> = ({ className, children, ...otherProps }) => {
  return (
    <NextLink {...otherProps} className={classNames("no-underline", className)}>
      {children}
    </NextLink>
  )
}

export default Link
