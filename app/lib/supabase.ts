import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase env variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: {
      getItem: (key) => {
        if (typeof window !== 'undefined') {
          const name = `${key}=`
          const decodedCookie = decodeURIComponent(document.cookie)
          const ca = decodedCookie.split(';')
          for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim()
            if (c.indexOf(name) === 0) return c.substring(name.length, c.length)
          }
          return globalThis.localStorage?.getItem(key) || null
        }
        return null 
      },
      setItem: (key, value) => {
        if (typeof window !== 'undefined') {
          document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax; Secure`
          globalThis.localStorage?.setItem(key, value)
        }
      },
      removeItem: (key) => {
        if (typeof window !== 'undefined') {
          document.cookie = `${key}=; path=/; max-age=-1; SameSite=Lax; Secure`
          globalThis.localStorage?.removeItem(key)
        }
      }
    }
  }
})