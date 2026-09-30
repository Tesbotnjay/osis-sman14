'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { checkPermission } from '@/lib/permissions/check'
import { PERMISSIONS } from '@/constants'
import { logActivity } from './activity-log'

export async function getRoles() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('roles').select('*').order('name')
  if (error) throw new Error('Gagal memuat roles.')
  return data
}

export async function getPermissions() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('permissions').select('*').order('key')
  if (error) throw new Error('Gagal memuat permissions.')
  return data
}

export async function getRolePermissions(roleId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('role_permissions')
    .select('*, permission:permissions(*)')
    .eq('role_id', roleId)

  if (error) throw new Error('Gagal memuat role permissions.')
  return data
}

export async function getUsers() {
  const { authorized, error } = await checkPermission(PERMISSIONS.MANAGE_USERS)
  if (!authorized) throw new Error(error || 'Unauthorized')

  const supabase = await createClient()
  const { data, error: queryError } = await supabase
    .from('profiles')
    .select('*, role:roles(*)')
    .order('created_at', { ascending: false })

  if (queryError) throw new Error('Gagal memuat users.')
  return data
}

export async function updateUserRole(userId: string, roleId: string) {
  const { authorized, error } = await checkPermission(PERMISSIONS.MANAGE_USERS)
  if (!authorized) throw new Error(error || 'Unauthorized')

  const supabase = await createClient()
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ role_id: roleId })
    .eq('id', userId)

  if (updateError) throw new Error('Gagal mengupdate role user.')

  await logActivity('update', 'user_role', userId, { role_id: roleId })
}

export async function createUser(email: string, password: string, fullName: string, roleId: string) {
  const { authorized, error } = await checkPermission(PERMISSIONS.MANAGE_USERS)
  if (!authorized) throw new Error(error || 'Unauthorized')

  const supabaseAdmin = createAdminClient()

  // Create auth user
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError) throw new Error('Gagal membuat user: ' + authError.message)

  // Create profile
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .insert({
      id: authData.user.id,
      full_name: fullName,
      role_id: roleId,
    })

  if (profileError) throw new Error('User dibuat tetapi profil gagal.')

  await logActivity('create', 'user', authData.user.id, { email, fullName })
  return authData.user
}

export async function deleteUser(userId: string) {
  const { authorized, error, userId: currentUserId } = await checkPermission(PERMISSIONS.MANAGE_USERS)
  if (!authorized) throw new Error(error || 'Unauthorized')

  if (userId === currentUserId) {
    throw new Error('Tidak dapat menghapus akun sendiri.')
  }

  const supabaseAdmin = createAdminClient()

  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)
  if (deleteError) throw new Error('Gagal menghapus user.')

  await logActivity('delete', 'user', userId)
}
