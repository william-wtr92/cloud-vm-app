export type CreateVmInitialValues = {
  jwt?: string
  osType: string
}

export interface VmInitialValues {
  subscriptionId: string
  resourceGroupName: string
  labName: string
  vmName: string
  jwt: string
}

export interface Credentials {
  username: string
  password: string
  ip: string
}

export interface StartedVms {
  [key: string]: {
    credentials: Credentials
  }
}

interface OsImagesReferences {
  [key: string]: {
    offer: string
    publisher: string
    sku: string
    osType: string
    version: string
  }
}

export interface ImageReferences {
  [key: string]: string
}
export const osImageReferences: OsImagesReferences = {
  Ubuntu: {
    offer: "UbuntuServer",
    publisher: "Canonical",
    sku: "16.04-LTS",
    osType: "Linux",
    version: "Latest",
  },
  "Windows 10": {
    offer: "Windows-10",
    publisher: "MicrosoftWindowsDesktop",
    sku: "win10-22h2-pro",
    osType: "Windows",
    version: "Latest",
  },
  CentOS: {
    offer: "CentOS",
    publisher: "OpenLogic",
    sku: "8_5-gen2",
    osType: "Linux",
    version: "Latest",
  },
  Debian: {
    offer: "Debian-11",
    publisher: "Debian",
    sku: "11-backports-gen2",
    osType: "Linux",
    version: "Latest",
  },
}
