import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/services/supabase'

const ADMIN_ROLES = ['owner', 'admin', 'catalog_manager', 'order_manager']

export const useAuthStore = defineStore('auth', () => {
  const session = ref(null)
  const role = ref(null)
  const loading = ref(false)
  let initPromise = null

  const user = computed(() => session.value?.user ?? null)
  const token = computed(() => session.value?.access_token ?? null)
  const isAdmin = computed(() => !!user.value && ADMIN_ROLES.includes(role.value))

  async function fetchRole() {
    if (!user.value) { role.value = null; return }
    const { data } = await supabase
      .from('user_roles').select('role').eq('user_id', user.value.id).maybeSingle()
    role.value = data?.role ?? null
  }

  // Safe to call repeatedly (router guard does); runs once
  function init() {
    initPromise ??= (async () => {
      const { data } = await supabase.auth.getSession()
      session.value = data.session
      await fetchRole()
      supabase.auth.onAuthStateChange((_event, s) => {
        session.value = s
        setTimeout(fetchRole, 0) // avoid calling supabase inside its own auth callback
      })
    })()
    return initPromise
  }

  async function login(email, password) {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        throw new Error(/invalid login/i.test(error.message) ? 'Incorrect email or password' : error.message)
      }
      session.value = data.session
      await fetchRole()
      if (!isAdmin.value) {
        await logout()
        throw new Error('This account does not have admin access')
      }
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    await supabase.auth.signOut()
    session.value = null
    role.value = null
  }

  return { session, role, loading, user, token, isAdmin, init, login, logout }
})