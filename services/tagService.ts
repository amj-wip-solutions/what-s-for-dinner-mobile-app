import apiClient from '../lib/api'

export interface Tag {
  id: number
  userId: string
  name: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateTagRequest {
  name: string
  description?: string
}

export interface UpdateTagRequest {
  name?: string
  description?: string
}

export const tagService = {
  // Get all tags for the current user
  getAll: async (): Promise<Tag[]> => {
    const response = await apiClient.get('/tags')
    return response.data
  },

  // Create a new tag
  create: async (tag: CreateTagRequest): Promise<Tag> => {
    const response = await apiClient.post('/tags', tag)
    return response.data
  },

  // Update an existing tag
  update: async (id: number, updates: UpdateTagRequest): Promise<Tag> => {
    const response = await apiClient.put(`/tags/${id}`, updates)
    return response.data
  },

  // Delete a tag
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/tags/${id}`)
  },

  // Get a single tag by ID
  getById: async (id: number): Promise<Tag> => {
    const response = await apiClient.get(`/tags/${id}`)
    return response.data
  }
}
