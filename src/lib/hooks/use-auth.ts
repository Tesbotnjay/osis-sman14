'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { Profile, Permission } from '@/types/database'

interface AuthState {
  user: User | null
  profile: Profile | null
  permissions: string[]
  loading: boolean
}

/**
 * Hook for accessing auth state, user profile, and permissions.
 */
export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    permissions: [],
    loading: true,
  })

  const fetchAuth = useCallback(async () => {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setState({ user: null, profile: null, permissions: [], loading: false })
      return
    }

    // Fetch profile with role
    const { data: profile } = await supabase
      .from('profiles')
      .select('*, role:roles(*)')
      .eq('id', user.id)
      .single()

    // Fetch permissions
    let permissions: string[] = []
    const profData = profile as any
    if (profData?.role_id) {
      const { data: rolePerms } = await supabase
        .from('role_permissions')
        .select('permission:permissions(key)')
        .eq('role_id', profData.role_id)

      permissions = ((rolePerms as any[]) || [])
        .map((rp) => {
          const perm = rp.permission as any
          return perm?.key
        })
        .filter(Boolean) as string[]
    }

    setState({
      user,
      profile: profile as Profile | null,
      permissions,
      loading: false,
    })
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAuth()

    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchAuth()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchAuth])

  const hasPermission = useCallback(
    (permission: string) => state.permissions.includes(permission),
    [state.permissions]
  )

  const isSuperAdmin = useCallback(
    () => state.profile?.role?.name === 'Super Admin',
    [state.profile]
  )

  const signOut = useCallback(async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
  }, [])

  return {
    ...state,
    hasPermission,
    isSuperAdmin,
    signOut,
    refetch: fetchAuth,
  }
}
