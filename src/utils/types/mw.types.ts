export type MethodHandlers = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [method: string]: Function | Function[]
}

export interface Login {
  locals: {
    body: {
      email: string
      password: string
    }
  }
  res: any
}
