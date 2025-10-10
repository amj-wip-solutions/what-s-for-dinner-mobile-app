import apiClient from '../lib/api'

export interface UserSettings {
  id: number
  userId: string
  plannerDuration: number // 7 or 14 days
  autoCreatePlans: boolean
  createdAt: string
  updatedAt: string
}

export interface UpdateUserSettingsRequest {
  plannerDuration?: number
  autoCreatePlans?: boolean
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
