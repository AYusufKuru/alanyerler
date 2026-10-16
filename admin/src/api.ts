export type AdminUser = {
  id: string
  name: string
  email: string
  role: string
}

export type ListingPhoto = {
  id: string
  path: string
  sortOrder: number
}

export type Listing = {
  id: string
  title: string
  status: string
  specs: Record<string, string>
  condition: Record<string, string>
  createdAt: string
  category: { id: string; name: string; slug: string }
  deviceType: { id: string; name: string; slug: string }
  photos: ListingPhoto[]
  offerCount: number
  customer: { id: string; name: string; email: string }
}

const storageKey = 'alanyerler_admin'

export function loadSession(): { token: string; user: AdminUser } | null {
  const raw = localStorage.getItem(storageKey)
  if (!raw) return null
  try {
    return JSON.parse(raw) as { token: string; user: AdminUser }
  } catch {
    return null
  }
}

export function saveSession(token: string, user: AdminUser) {
  localStorage.setItem(storageKey, JSON.stringify({ token, user }))
}

export function clearSession() {
  localStorage.removeItem(storageKey)
}

export type Store = {
  id: string
  name: string
  logo: string | null
  cover: string | null
  city: string
  address: string
  about: string
  hours: string[]
  badges: string[]
  rating: number | null
  reviewCount: number | null
  active: boolean
  createdAt: string
}

export type Offer = {
  id: string
  listingId: string
  price: number
  currency: string
  note: string | null
  createdAt: string
  updatedAt: string
  store: { id: string; name: string; city: string; active: boolean }
}

export async function api<T>(path: string, token?: string, body?: unknown): Promise<T> {
  return request<T>(path, token, body ? { body } : {})
}

export async function request<T>(
  path: string,
  token?: string,
  init: { method?: string; body?: unknown; form?: FormData } = {},
): Promise<T> {
  const response = await fetch(path, {
    method: init.method ?? (init.body || init.form ? 'POST' : 'GET'),
    headers: {
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: init.form ?? (init.body ? JSON.stringify(init.body) : undefined),
  })
  if (response.status === 204) return undefined as T
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    const message =
      data && typeof data.message === 'string'
        ? data.message
        : Array.isArray(data?.message)
          ? String(data.message[0])
          : 'İstek tamamlanamadı.'
    throw new Error(message)
  }
  return data as T
}
