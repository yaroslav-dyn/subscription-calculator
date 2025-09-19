import { Store } from '@tanstack/store'
import type { IMessageDrawerData } from '@/lib/utils/types'

const defaultNotification: IMessageDrawerData = {
  status: false,
  message: '',
  type: 'DEFAULT',
  countdown: 4,
}

export const notificationStore = new Store<IMessageDrawerData>(defaultNotification)

export function setNotification(data: IMessageDrawerData) {
  notificationStore.setState(data)
}

export function clearNotification() {
  notificationStore.setState(defaultNotification)
}