// import { create } from 'zustand'
// import { createJSONStorage, persist } from 'zustand/middleware'

// type TokenPayload = {
//   accessToken: string
//   refreshToken: string
// }

// type AuthState = {
//   accessToken: string | null
//   refreshToken: string | null
//   isAuthenticated: boolean
//   isInitialized: boolean
//   setTokens: (tokens: TokenPayload) => void
//   clearTokens: () => void
//   markInitialized: () => void
// }

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       accessToken: null,
//       refreshToken: null,
//       isAuthenticated: false,
//       isInitialized: false,
//       setTokens: ({ accessToken, refreshToken }) =>
//         set({
//           accessToken,
//           refreshToken,
//           isAuthenticated: true,
//         }),
//       clearTokens: () =>
//         set({
//           accessToken: null,
//           refreshToken: null,
//           isAuthenticated: false,
//         }),
//       markInitialized: () => set({ isInitialized: true }),
//     }),
//     {
//       name: 're-call-auth',
//       storage: createJSONStorage(() => localStorage),
//       partialize: ({ accessToken, refreshToken, isAuthenticated }) => ({
//         accessToken,
//         refreshToken,
//         isAuthenticated,
//       }),
//       onRehydrateStorage: () => (state) => {
//         state?.markInitialized()
//       },
//     },
//   ),
// )


import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type TokenPayload = {
  accessToken: string
  refreshToken: string
}

type AuthPayload = {
  accessToken: string
  refreshToken: string
  isRegistered: boolean
}

type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isInitialized: boolean
  isRegistered: boolean
  setTokens: (tokens: TokenPayload) => void
  setAuth: (payload: AuthPayload) => void
  clearTokens: () => void
  markInitialized: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isInitialized: false,
      isRegistered: false,

      setTokens: ({ accessToken, refreshToken }) =>
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
        }),

      setAuth: ({ accessToken, refreshToken, isRegistered }) =>
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isRegistered,
        }),

      clearTokens: () =>
        set({
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isRegistered: false,
        }),

      markInitialized: () => set({ isInitialized: true }),
    }),
    {
      name: 're-call-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: ({ accessToken, refreshToken, isAuthenticated, isRegistered }) => ({
        accessToken,
        refreshToken,
        isAuthenticated,
        isRegistered,
      }),
      onRehydrateStorage: () => (state) => {
        state?.markInitialized()
      },
    },
  ),
)