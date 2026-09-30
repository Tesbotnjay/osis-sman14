import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type { PermissionKey } from '@/constants'

/**
 * Server-side permission check.
 * Use this in Server Actions and API routes.
 */
export async function checkPermission(
  requiredPermission: PermissionKey
): Promise<{ authorized: boolean; userId?: string; error?: string }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { authorized: false, error: 'Tidak terautentikasi.' }
  }

  // Get user's profile with role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role_id, role:roles(name)')
    .eq('id', user.id)
    .single()

  const profileData = profile as unknown as { role_id: string | null; role: { name: string } | null }
  if (!profileData?.role_id) {
    return { authorized: false, userId: user.id, error: 'Tidak memiliki role.' }
  }

  // Super Admin has all permissions
  if (profileData.role?.name === 'Super Admin') {
    return { authorized: true, userId: user.id }
  }

  // Check specific permission
  const { data: rolePerms } = await supabase
    .from('role_permissions')
    .select('permission:permissions(key)')
    .eq('role_id', profileData.role_id)

  const permissionKeys = ((rolePerms as { permission: { key: string } | null }[]) || [])
    .map((rp) => rp.permission?.key)
    .filter(Boolean)

  if (!permissionKeys.includes(requiredPermission)) {
    return {
      authorized: false,
      userId: user.id,
      error: 'Tidak memiliki izin untuk operasi ini.',
    }
  }

  return { authorized: true, userId: user.id }
}

/**
 * Throw an error if permission is denied.
 * Use this in Server Actions to automatically fail the action if unauthorized.
 */
export async function requirePermission(requiredPermission: PermissionKey) {
  const result = await checkPermission(requiredPermission)
  if (!result.authorized) {
    throw new Error(`Unauthorized: ${result.error}`)
  }
  return result
}

/**
 * Require authentication (any role).
 */
export async function requireAuth(): Promise<{
  authenticated: boolean
  userId?: string
  error?: string
}> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { authenticated: false, error: 'Tidak terautentikasi.' }
  }

  return { authenticated: true, userId: user.id }
}
