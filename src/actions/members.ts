'use server'

import { createClient } from '@/lib/supabase/server'
import { checkPermission } from '@/lib/permissions/check'
import { PERMISSIONS } from '@/constants'
import { logActivity } from './activity-log'
import { Database } from '@/types/database'

type MemberInsert = Database['public']['Tables']['members']['Insert']

export async function getMembers(periodId?: string) {
  const supabase = await createClient()
  let query = supabase.from('members').select('*').order('order_index')

  if (periodId) {
    query = query.eq('period_id', periodId)
  }

  const { data, error } = await query

  if (error) throw new Error('Gagal memuat anggota.')
  return data
}

export async function createMember(formData: {
  name: string
  photo_url?: string
  description?: string
  active?: boolean
  order_index?: number
  period_id?: string
}) {
  const { authorized, error } = await checkPermission(PERMISSIONS.MANAGE_MEMBERS)
  if (!authorized) throw new Error(error || 'Unauthorized')

  const supabase = await createClient()

  const { data, error: insertError } = await supabase
    .from('members')
    .insert(formData as MemberInsert)
    .select()
    .single()

  if (insertError) throw new Error('Gagal menambahkan anggota.')

  await logActivity('create', 'member', data.id, { name: formData.name })
  return data
}

export async function updateMember(id: string, formData: Partial<MemberInsert>) {
  const { authorized, error } = await checkPermission(PERMISSIONS.MANAGE_MEMBERS)
  if (!authorized) throw new Error(error || 'Unauthorized')

  const supabase = await createClient()

  const { data, error: updateError } = await supabase
    .from('members')
    .update(formData as Partial<MemberInsert>)
    .eq('id', id)
    .select()
    .single()

  if (updateError) throw new Error('Gagal mengupdate anggota.')

  await logActivity('update', 'member', id, formData)
  return data
}

export async function deleteMember(id: string) {
  const { authorized, error } = await checkPermission(PERMISSIONS.MANAGE_MEMBERS)
  if (!authorized) throw new Error(error || 'Unauthorized')

  const supabase = await createClient()

  const { error: deleteError } = await supabase
    .from('members')
    .delete()
    .eq('id', id)

  if (deleteError) throw new Error('Gagal menghapus anggota.')

  await logActivity('delete', 'member', id)
}
