import apiClient from '../lib/api'
import { Tag } from './tagService'

export interface DayRule {
  id: number
  userId: string
  dayOfWeek: number // 1=Monday, 7=Sunday
  tagId: number
  tagName?: string // Added from backend JOIN
  tagDescription?: string // Added from backend JOIN
  tag?: Tag
  createdAt?: string
  updatedAt?: string
}

export interface CreateDayRuleRequest {
  dayOfWeek: number
  tagId: number
}

export interface UpdateDayRuleRequest {
  dayOfWeek?: number
  tagId?: number
}

export const dayRuleService = {
  // Get all day rules for the current user
  getAll: async (): Promise<DayRule[]> => {
    const response = await apiClient.get('/day-rules')
    return response.data
  },

  // Create a new day rule (uses POST /day-rules for upsert)
  create: async (rule: CreateDayRuleRequest): Promise<DayRule> => {
    const response = await apiClient.post('/day-rules', rule)
    return response.data
  },

  // Update an existing day rule (uses POST /day-rules for upsert)
  update: async (dayOfWeek: number, updates: { tagId: number }): Promise<DayRule> => {
    const response = await apiClient.post('/day-rules', {
      dayOfWeek,
      tagId: updates.tagId
    })
    return response.data
  },

  // Delete all day rules for the current user
  delete: async (): Promise<void> => {
    await apiClient.delete('/day-rules')
  },

  // Upsert a single day rule using the backend's PUT endpoint
  upsertSingleDay: async (dayOfWeek: number, tagId: number): Promise<DayRule> => {
    const response = await apiClient.put(`/day-rules/${dayOfWeek}`, { tagId })
    return response.data
  },

  // Delete a day rule by dayOfWeek using the backend's DELETE endpoint
  deleteBydayOfWeek: async (dayOfWeek: number): Promise<void> => {
    await apiClient.delete(`/day-rules/${dayOfWeek}`)
  },

  // Upsert multiple day rules at once
  upsert: async (rules: CreateDayRuleRequest[]): Promise<DayRule[]> => {
    const results: DayRule[] = []

    for (const rule of rules) {
      try {
        const result = await dayRuleService.upsertSingleDay(rule.dayOfWeek, rule.tagId)
        results.push(result)
      } catch (error) {
        console.error(`Failed to upsert rule for day ${rule.dayOfWeek}:`, error)
        throw error
      }
    }

    return results
  },

  // Get day rule for a specific day
  getByDay: async (dayOfWeek: number): Promise<DayRule | null> => {
    try {
      const allRules = await dayRuleService.getAll()
      return allRules.find(rule => rule.dayOfWeek === dayOfWeek) || null
    } catch (error) {
      console.error(`Failed to get rule for day ${dayOfWeek}:`, error)
      return null
    }
  },

  // Delete all day rules for the current user
  deleteAll: async (): Promise<void> => {
    await apiClient.delete('/day-rules')
  }
}
