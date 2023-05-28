import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI & {
      store: {
        get: (key: string) => any;
        set: (key: string, val: any) => void;
      }
    }
    electron: ElectronAPI
    api: unknown
  }
}
