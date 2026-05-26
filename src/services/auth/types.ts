export interface AppUser {
  id: string
  email?: string
  app_metadata?: { provider?: string }
}

export interface IAuthService {
  getUser(): Promise<AppUser | null>
  signOut(): Promise<void>
  onAuthStateChange(callback: (user: AppUser | null) => void): () => void
  signInWithPassword(credentials: {
    email: string
    password: string
  }): Promise<{ error?: Error }>
  signInWithOAuth(options: {
    provider: string
    redirectTo?: string
  }): Promise<{ error?: Error }>
  signUp(credentials: { email: string; password: string }): Promise<{ error?: Error }>
}
