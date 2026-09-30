'use server'

import { createClient } from '@/lib/supabase/server'
import { checkPermission } from '@/lib/permissions/check'
import { PERMISSIONS } from '@/constants'
import { logActivity } from './activity-log'
import { Database } from '@/types/database'

type WspirasStatus = Database['public']['Enums']['wspiras_status']
type WspirasCategory = Database['public']['Enums']['wspiras_category']

export async function getWspiras(filters?: { status?: string; category?: string }) {
  const supabase = await createClient()
  let query = supabase.from('w_spiras').select('*').order('created_at', { ascending: false })

  if (filters?.status) query = query.eq('status', filters.status as WspirasStatus)
  if (filters?.category) query = query.eq('category', filters.category as WspirasCategory)

  const { data, error } = await query
  if (error) throw new Error('Gagal memuat W-SPIRAS.')
  return data
}

export async function getWspirasCount(status?: string) {
  const supabase = await createClient()
  let query = supabase.from('w_spiras').select('*', { count: 'exact', head: true })

  if (status) query = query.eq('status', status as WspirasStatus)

  const { count, error } = await query
  if (error) throw new Error('Gagal menghitung W-SPIRAS.')
  return count || 0
}

export async function updateWspirasStatus(id: string, status: string) {
  const { authorized, error } = await checkPermission(PERMISSIONS.MANAGE_WSPIRAS)
  if (!authorized) throw new Error(error || 'Unauthorized')

  const supabase = await createClient()
  const { error: updateError } = await supabase
    .from('w_spiras')
    .update({ status: status as WspirasStatus })
    .eq('id', id)

  if (updateError) throw new Error('Gagal mengupdate status W-SPIRAS.')

  await logActivity('update', 'w_spiras', id, { status })
}

export async function deleteWspiras(id: string) {
  const { authorized, error } = await checkPermission(PERMISSIONS.MANAGE_WSPIRAS)
  if (!authorized) throw new Error(error || 'Unauthorized')

  const supabase = await createClient()
  const { error: deleteError } = await supabase.from('w_spiras').delete().eq('id', id)
  if (deleteError) throw new Error('Gagal menghapus W-SPIRAS.')

  await logActivity('delete', 'w_spiras', id)
}
