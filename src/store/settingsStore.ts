import { Store } from '@tanstack/store'

export interface SettingsStoreState {
  settings: boolean
  rates: boolean
  summary: boolean
  domains: boolean
  subscriptions: boolean
}

// SECTION: Panels showing status
const settingsStoreData = {
  settings: true,
  rates: false,
  summary: false,
  domains: false,
  subscriptions: true
}

export const settingsStore = new Store<SettingsStoreState>(settingsStoreData)

// SECTION: Panels showing status
export const updateSettingsPanelStatus = (key: string, status: boolean) => {
  settingsStore.setState((state) => ({
    ...state,
    [key]: status,
  }))
}