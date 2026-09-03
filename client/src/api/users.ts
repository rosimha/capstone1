import api from './axiosInstance'

export const signup = (data: { email: string; password: string }) =>
  api.post('/api/users/signup', data)

export const login = (data: { email: string; password: string }) =>
  api.post('/api/users/login', data)
