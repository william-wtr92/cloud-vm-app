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
export interface GetUserId {
  locals: {
    query: {
      id: string
    }
  }
  res: any
}

// Create VM Types for Middleware

export interface CreateVm {
  locals: {
    body: {
      osType: string
    }
  }
  req: any
  res: any
}
