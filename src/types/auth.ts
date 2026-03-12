export type OAuthProvider = 'kakao'

export type OAuthUser = {
  oauthId: string
  provider: OAuthProvider
  email: string
  name?: string | null
  isRegistered: boolean
}

export type OAuthLoginRequest = {
  code: string
  redirectUri: string
}

export type OAuthLoginResponse = {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: 'Bearer'
  user: OAuthUser
}

export type RefreshTokenResponse = {
  accessToken: string
  expiresIn: number
  tokenType: 'Bearer'
}
