import ApiService from '@/services/api'

const BASE = '/admin-inventory'
const un = (r) => r?.data ?? r
const qs = (o) =>
  new URLSearchParams(Object.entries(o).filter(([, v]) => v !== '' && v != null)).toString()

export const inventoryApi = {
  collections: () => ApiService.get(`${BASE}?resource=collections`),
  products: (p) => ApiService.get(`${BASE}?${qs({ resource: 'products', ...p })}`),
  product: (id) => ApiService.get(`${BASE}?${qs({ resource: 'product', id })}`),
  lowStock: (threshold) => ApiService.get(`${BASE}?${qs({ resource: 'low_stock', threshold })}`),
  act: (action, payload = {}) => ApiService.post(BASE, { action, ...payload }),
  uploadImage: (file) => {
    const fd = new FormData()
    fd.append('file', file)
    return ApiService.upload(BASE, fd)
  }
}

export const errMsg = (e) => e?.response?.data?.error || e?.message || 'Something went wrong'
export const toKobo = (n) => Math.round(Number(n || 0) * 100)
export const toNaira = (k) => (k || 0) / 100
export const formatNaira = (kobo) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format((kobo || 0) / 100)