import { apiRequest } from './client'
import type { MeResponse } from '../types/school'

export const getMe = () =>
  apiRequest<MeResponse>('/api/users/me', {
    auth: true,
  })
