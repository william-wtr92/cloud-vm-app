export type MethodHandlers = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [method: string]: Function | Function[]
}

// User Login Types for Middleware
export interface Login {
  locals: {
    body: {
      email: string
      password: string
    }
  }
  res: any
}

// User ID Types for Middleware
export interface getUserId {
  locals: {
    query: {
      id: string
    }
  }
  res: any
}
