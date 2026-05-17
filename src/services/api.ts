const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

export interface BusinessPayload {
  businessName: string;
  phoneNumber: string;
  email: string;
  businessType: string;
  location: string;
}

export const businessApi = {
  create: (data: BusinessPayload) => api.post<{ id: string }>('/businesses', data),
  update: (id: string, data: Partial<BusinessPayload>) =>
    api.put<{ id: string }>(`/businesses/${id}`, data),
  get: (id: string) => api.get<BusinessPayload>(`/businesses/${id}`),
};
