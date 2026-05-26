import { isLocalMode } from '@/services/config'
import type { IAuthService } from './types'
import { supabaseAuthService } from './supabaseAuthService'
import { localAuthService } from './localAuthService'

export const authService: IAuthService = isLocalMode
  ? localAuthService
  : supabaseAuthService

export type { AppUser, IAuthService } from './types'
