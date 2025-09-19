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
  summary: true,
  domains: false,
  subscriptions: true
}

export const settingsStore = new Store<SettingsStoreState>(settingsStoreData)

// Load persisted state from localStorage on initialization
const persistedSettings = localStorage.getItem('settingsStore')
if (persistedSettings) {
  try {
    settingsStore.setState(JSON.parse(persistedSettings))
  } catch (error: unknown) {
    console.error('Error while parsing settings from storage', error)
  }
}

// Subscribe to store changes and persist to localStorage
settingsStore.subscribe((state) => {
  localStorage.setItem('settingsStore', JSON.stringify(state?.currentVal))
})
// SECTION: Panels showing status
export const updateSettingsPanelStatus = (key: string, status: boolean) => {
  settingsStore.setState((state) => ({
    ...state,
    [key]: status,
  }))
}