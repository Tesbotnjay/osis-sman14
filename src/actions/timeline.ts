'use server'

import { createClient } from '@/lib/supabase/server'
import { checkPermission } from '@/lib/permissions/check'
import { PERMISSIONS } from '@/constants'
import { logActivity } from './activity-log'
import { Database } from '@/types/database'

type TimelineInsert = Database['public']['Tables']['timeline_items']['Insert']

export async function getTimeline(periodId?: string) {
  const supabase = await createClient()
  let query = supabase.from('timeline_items').select('*').order('order_index')

  if (periodId) query = query.eq('period_id', periodId)

  const { data, error } = await query
  if (error) throw new Error('Gagal memuat timeline.')
  return data
}

export async function getPublishedTimeline() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('timeline_items')
    .select('*')
    .eq('published', true)
    .order('order_index')

  if (error) throw new Error('Gagal memuat timeline.')
  return data
}

export async function createTimelineItem(formData: Partial<TimelineInsert>) {
  const { authorized, error } = await checkPermission(PERMISSIONS.MANAGE_TIMELINE)
  if (!authorized) throw new Error(error || 'Unauthorized')

  const supabase = await createClient()
  const { data, error: insertError } = await supabase.from('timeline_items').insert(formData as TimelineInsert).select().single()
  if (insertError) throw new Error('Gagal membuat timeline item.')

  await logActivity('create', 'timeline', data.id, { title: formData.title })
  return data
}

export async function updateTimelineItem(id: string, formData: Partial<TimelineInsert>) {
  const { authorized, error } = await checkPermission(PERMISSIONS.MANAGE_TIMELINE)
  if (!authorized) throw new Error(error || 'Unauthorized')

  const supabase = await createClient()
  const { data, error: updateError } = await supabase.from('timeline_items').update(formData as Partial<TimelineInsert>).eq('id', id).select().single()
  if (updateError) throw new Error('Gagal mengupdate timeline item.')

  await logActivity('update', 'timeline', id, formData)
  return data
}

export async function deleteTimelineItem(id: string) {
  const { authorized, error } = await checkPermission(PERMISSIONS.MANAGE_TIMELINE)
  if (!authorized) throw new Error(error || 'Unauthorized')

  const supabase = await createClient()
  const { error: deleteError } = await supabase.from('timeline_items').delete().eq('id', id)
  if (deleteError) throw new Error('Gagal menghapus timeline item.')

  await logActivity('delete', 'timeline', id)
}
