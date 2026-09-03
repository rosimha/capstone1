import api from './axiosInstance'

export const getAllRecipes = (params?: { title?: string; tag?: string; ingredient?: string }) =>
  api.get('/api/recipes', { params })

export const getRecipe = (id: string) =>
  api.get(`/api/recipes/${id}`)

export const createRecipe = (data: unknown) =>
  api.post('/api/recipes', data)

export const updateRecipe = (id: string, data: unknown) =>
  api.put(`/api/recipes/${id}`, data)

export const deleteRecipe = (id: string) =>
  api.delete(`/api/recipes/${id}`)
