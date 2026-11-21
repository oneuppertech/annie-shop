import ApiService from '@/services/api'

export const createCheckout = async (payload) => {
  const res = await ApiService.post('/checkout-create', payload)
  return res?.data || res
}

export const verifyPayment = async (reference) => {
  const res = await ApiService.get(`/payment-verify?reference=${encodeURIComponent(reference)}`)
  return res?.data || res
}