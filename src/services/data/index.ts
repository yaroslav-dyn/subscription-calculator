import { isLocalMode } from '@/services/config'
import type { IDataService } from './types'
import { supabaseDataService } from './supabaseDataService'
import { localDataService } from './localDataService'

export const dataService: IDataService = isLocalMode
  ? localDataService
  : supabaseDataService

export type { IDataService } from './types'
