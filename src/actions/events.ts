'use server'

import { createClient } from '@/lib/supabase/server'
import { checkPermission } from '@/lib/permissions/check'
import { PERMISSIONS } from '@/constants'
import { logActivity } from './activity-log'
import { Database } from '@/types/database'

export async function getEvents(filters?: { category?: string; published?: boolean }) {
  const supabase = await createClient()
  let query = supabase.from('events').select('*').order('date', { ascending: true })

  if (filters?.category) query = query.eq('category', filters.category as Database['public']['Enums']['event_category'])
  if (filters?.published !== undefined) query = query.eq('published', filters.published)

  const { data, error } = await query
  if (error) throw new Error('Gagal memuat kegiatan.')
  return data
}

export async function getUpcomingEvents(limit: number = 5) {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('published', true)
    .gte('date', today)
    .order('date')
    .limit(limit)

  if (error) throw new Error('Gagal memuat agenda.')
  return data
}

export async function createEvent(formData: Record<string, unknown>) {
  const { authorized, error } = await checkPermission(PERMISSIONS.MANAGE_EVENTS)
  if (!authorized) throw new Error(error || 'Unauthorized')

  const supabase = await createClient()
  const { data, error: insertError } = await supabase.from('events').insert(formData).select().single()
  if (insertError) throw new Error('Gagal membuat kegiatan.')

  await logActivity('create', 'event', data.id, { title: formData.title })
  return data
}

export async function updateEvent(id: string, formData: Partial<Database['public']['Tables']['events']['Insert']>) {
  const { authorized, error } = await checkPermission(PERMISSIONS.MANAGE_EVENTS)
  if (!authorized) throw new Error(error || 'Unauthorized')

  const supabase = await createClient()
  const { data, error: updateError } = await supabase.from('events').update(formData).eq('id', id).select().single()
  if (updateError) throw new Error('Gagal mengupdate kegiatan.')

  await logActivity('update', 'event', id, formData)
  return data
}

export async function deleteEvent(id: string) {
  const { authorized, error } = await checkPermission(PERMISSIONS.MANAGE_EVENTS)
  if (!authorized) throw new Error(error || 'Unauthorized')

  const supabase = await createClient()
  const { error: deleteError } = await supabase.from('events').delete().eq('id', id)
  if (deleteError) throw new Error('Gagal menghapus kegiatan.')

  await logActivity('delete', 'event', id)
}
