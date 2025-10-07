import apiClient from '../lib/api'
import { Tag } from './tagService'

export interface DayRule {
  id: number
  userId: string
  week: 1 | 2 // Week 1 or Week 2 of the fortnight
  dayOfWeek: number // 1=Monday, 7=Sunday
  tagId: number
  tag?: Tag
  createdAt?: string
  updatedAt?: string
}

export interface CreateDayRuleRequest {
  week: 1 | 2
  dayOfWeek: number
  tagId: number
}

export interface UpdateDayRuleRequest {
  week?: 1 | 2
  dayOfWeek?: number
  tagId?: number
}

export interface UpsertDayRulesRequest {
  rules: CreateDayRuleRequest[]
}

export const dayRuleService = {
  // Get all day rules for the current user
  getAll: async (): Promise<DayRule[]> => {
    const response = await apiClient.get('/day-rules')
    return response.data
  },

  // Create a new day rule
  create: async (rule: CreateDayRuleRequest): Promise<DayRule> => {
    const response = await apiClient.post('/day-rules', rule)
    return response.data
  },

  // Update an existing day rule
  update: async (id: number, updates: UpdateDayRuleRequest): Promise<DayRule> => {
    const response = await apiClient.put(`/day-rules/${id}`, updates)
    return response.data
  },

  // Delete a day rule
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/day-rules/${id}`)
  },

  // Upsert (create or update) multiple day rules at once
  // This replaces all existing rules for the user
  upsert: async (rules: CreateDayRuleRequest[]): Promise<DayRule[]> => {
    const response = await apiClient.post('/day-rules/upsert', { rules })
    return response.data
  },

  // Get day rules for a specific week
  getByWeek: async (week: 1 | 2): Promise<DayRule[]> => {
    const response = await apiClient.get(`/day-rules/week/${week}`)
    return response.data
  },

  // Get day rule for a specific week and day
  getByWeekAndDay: async (week: 1 | 2, dayOfWeek: number): Promise<DayRule | null> => {
    const response = await apiClient.get(`/day-rules/week/${week}/day/${dayOfWeek}`)
    return response.data
  },

  // Delete all day rules for the current user
  deleteAll: async (): Promise<void> => {
    await apiClient.delete('/day-rules/all')
  }
}
