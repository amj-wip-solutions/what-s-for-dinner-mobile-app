import apiClient from '../lib/api'

export interface UserSettings {
  id: number
  userId: string
  plannerDuration: number // 7 or 14 days
  autoCreatePlans: boolean
  weekStartDay: number // 1=Monday, 6=Saturday, 7=Sunday
  createdAt: string
  updatedAt: string
}

export interface UpdateUserSettingsRequest {
  plannerDuration?: number
  autoCreatePlans?: boolean
  weekStartDay?: number
}

export const settingsService = {
  // Get user's settings (creates defaults if none exist)
  async getSettings(): Promise<UserSettings> {
    const response = await apiClient.get('/settings')
    return response.data
  },

  // Update user's settings
  async updateSettings(settings: UpdateUserSettingsRequest): Promise<UserSettings> {
    const response = await apiClient.put('/settings', settings)
    return response.data
  }
}
