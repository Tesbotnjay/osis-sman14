'use server'

import { createClient } from '@/lib/supabase/server'
import { checkPermission } from '@/lib/permissions/check'
import { PERMISSIONS } from '@/constants'
import { logActivity } from './activity-log'
import { Database } from '@/types/database'

export async function getBroadcasts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('broadcasts')
    .select('*')
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) throw new Error('Gagal memuat broadcast.')
  return data
}

export async function getActiveBroadcasts() {
  const supabase = await createClient()
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('broadcasts')
    .select('*')
    .eq('published', true)
    .or(`start_at.is.null,start_at.lte.${now}`)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .order('pinned', { ascending: false })
    .order('priority', { ascending: false })

  if (error) throw new Error('Gagal memuat broadcast.')
  return data
}

export async function createBroadcast(formData: {
  title: string
  content?: string
  priority?: number
  pinned?: boolean
  start_at?: string
  expires_at?: string
  published?: boolean
}) {
  const { authorized, error } = await checkPermission(PERMISSIONS.MANAGE_BROADCASTS)
  if (!authorized) throw new Error(error || 'Unauthorized')

  const supabase = await createClient()

  const { data, error: insertError } = await supabase
    .from('broadcasts')
    .insert({
      title: formData.title,
      content: formData.content,
      priority: formData.priority || 0,
      pinned: formData.pinned || false,
      start_at: formData.start_at || null,
      expires_at: formData.expires_at || null,
      published: formData.published || false,
      date: new Date().toISOString().split('T')[0],
    })
    .select()
    .single()

  if (insertError) throw new Error('Gagal membuat broadcast.')

  await logActivity('create', 'broadcast', data.id, { title: formData.title })
  return data
}

export async function updateBroadcast(id: string, formData: Partial<Database['public']['Tables']['broadcasts']['Insert']>) {
  const { authorized, error } = await checkPermission(PERMISSIONS.MANAGE_BROADCASTS)
  if (!authorized) throw new Error(error || 'Unauthorized')

  const supabase = await createClient()

  const { data, error: updateError } = await supabase
    .from('broadcasts')
    .update(formData)
    .eq('id', id)
    .select()
    .single()

  if (updateError) throw new Error('Gagal mengupdate broadcast.')

  await logActivity('update', 'broadcast', id, formData)
  return data
}

export async function deleteBroadcast(id: string) {
  const { authorized, error } = await checkPermission(PERMISSIONS.MANAGE_BROADCASTS)
  if (!authorized) throw new Error(error || 'Unauthorized')

  const supabase = await createClient()

  const { error: deleteError } = await supabase
    .from('broadcasts')
    .delete()
    .eq('id', id)

  if (deleteError) throw new Error('Gagal menghapus broadcast.')

  await logActivity('delete', 'broadcast', id)
}

export async function toggleBroadcastPublish(id: string, published: boolean) {
  return updateBroadcast(id, { published })
}
