import { useAuthStore } from '../store/authStore'

export const isAuthenticated = () => useAuthStore.getState().isAuthenticated

export const signIn = () => {
  useAuthStore.getState().setTokens({
    accessToken: 'oauth-access-token-placeholder',
    refreshToken: 'oauth-refresh-token-placeholder',
  })
}

export const signOut = () => {
  useAuthStore.getState().clearTokens()
}
