'use server'

import { createClient } from '@/lib/supabase/server'
import { checkPermission } from '@/lib/permissions/check'
import { PERMISSIONS } from '@/constants'
import { logActivity } from './activity-log'
import { Database } from '@/types/database'

type ProgramInsert = Database['public']['Tables']['programs']['Insert']

export async function getPrograms(filters?: { status?: Database['public']['Enums']['program_status']; published?: boolean; periodId?: string }) {
  const supabase = await createClient()
  let query = supabase.from('programs').select('*').order('created_at', { ascending: false })

  if (filters?.status) query = query.eq('status', filters.status as Database['public']['Enums']['program_status'])
  if (filters?.published !== undefined) query = query.eq('published', filters.published)
  if (filters?.periodId) query = query.eq('period_id', filters.periodId)

  const { data, error } = await query
  if (error) throw new Error('Gagal memuat program kerja.')
  return data
}

export async function getPublishedPrograms(limit?: number) {
  const supabase = await createClient()
  let query = supabase
    .from('programs')
    .select('*')
    .eq('published', true)
    .order('date', { ascending: false })

  if (limit) query = query.limit(limit)

  const { data, error } = await query
  if (error) throw new Error('Gagal memuat program kerja.')
  return data
}

export async function getProgramById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error('Program tidak ditemukan.')
  return data
}

export async function createProgram(formData: {
  title: string
  description?: string
  date?: string
  location?: string
  responsible_person?: string
  image_url?: string
  category?: string
  status?: string
  published?: boolean
  period_id?: string
}) {
  const { authorized, error } = await checkPermission(PERMISSIONS.MANAGE_PROGRAMS)
  if (!authorized) throw new Error(error || 'Unauthorized')

  const supabase = await createClient()

  const { data, error: insertError } = await supabase
    .from('programs')
    .insert(formData as ProgramInsert)
    .select()
    .single()

  if (insertError) throw new Error('Gagal membuat program kerja.')

  await logActivity('create', 'program', data.id, { title: formData.title })
  return data
}

export async function updateProgram(id: string, formData: Partial<ProgramInsert>) {
  const { authorized, error } = await checkPermission(PERMISSIONS.MANAGE_PROGRAMS)
  if (!authorized) throw new Error(error || 'Unauthorized')

  const supabase = await createClient()

  const { data, error: updateError } = await supabase
    .from('programs')
    .update(formData as Partial<ProgramInsert>)
    .eq('id', id)
    .select()
    .single()

  if (updateError) throw new Error('Gagal mengupdate program kerja.')

  await logActivity('update', 'program', id, formData)
  return data
}

export async function deleteProgram(id: string) {
  const { authorized, error } = await checkPermission(PERMISSIONS.MANAGE_PROGRAMS)
  if (!authorized) throw new Error(error || 'Unauthorized')

  const supabase = await createClient()

  const { error: deleteError } = await supabase
    .from('programs')
    .delete()
    .eq('id', id)

  if (deleteError) throw new Error('Gagal menghapus program kerja.')

  await logActivity('delete', 'program', id)
}
