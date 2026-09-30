'use server'

import { createClient } from '@/lib/supabase/server'
import { checkPermission } from '@/lib/permissions/check'
import { PERMISSIONS } from '@/constants'
import { logActivity } from './activity-log'
import { Database } from '@/types/database'

type GalleryInsert = Database['public']['Tables']['gallery']['Insert']

export async function getGallery(filters?: { category?: string; published?: boolean }) {
  const supabase = await createClient()
  let query = supabase.from('gallery').select('*').order('created_at', { ascending: false })

  if (filters?.category) query = query.eq('category', filters.category)
  if (filters?.published !== undefined) query = query.eq('published', filters.published)

  const { data, error } = await query
  if (error) throw new Error('Gagal memuat gallery.')
  return data
}

export async function getPublishedGallery(limit?: number) {
  const supabase = await createClient()
  let query = supabase
    .from('gallery')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (limit) query = query.limit(limit)

  const { data, error } = await query
  if (error) throw new Error('Gagal memuat gallery.')
  return data
}

export async function createGalleryItem(formData: Partial<GalleryInsert>) {
  const { authorized, error } = await checkPermission(PERMISSIONS.MANAGE_GALLERY)
  if (!authorized) throw new Error(error || 'Unauthorized')

  const supabase = await createClient()
  const { data, error: insertError } = await supabase.from('gallery').insert(formData as GalleryInsert).select().single()
  if (insertError) throw new Error('Gagal menambahkan foto.')

  await logActivity('create', 'gallery', data.id, { title: formData.title })
  return data
}

export async function updateGalleryItem(id: string, formData: Partial<GalleryInsert>) {
  const { authorized, error } = await checkPermission(PERMISSIONS.MANAGE_GALLERY)
  if (!authorized) throw new Error(error || 'Unauthorized')

  const supabase = await createClient()
  const { data, error: updateError } = await supabase.from('gallery').update(formData as Partial<GalleryInsert>).eq('id', id).select().single()
  if (updateError) throw new Error('Gagal mengupdate foto.')

  await logActivity('update', 'gallery', id, formData)
  return data
}

export async function deleteGalleryItem(id: string) {
  const { authorized, error } = await checkPermission(PERMISSIONS.MANAGE_GALLERY)
  if (!authorized) throw new Error(error || 'Unauthorized')

  const supabase = await createClient()
  const { error: deleteError } = await supabase.from('gallery').delete().eq('id', id)
  if (deleteError) throw new Error('Gagal menghapus foto.')

  await logActivity('delete', 'gallery', id)
}
