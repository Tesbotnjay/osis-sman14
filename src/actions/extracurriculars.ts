'use server'

import { createClient } from '@/lib/supabase/server'
import { checkPermission } from '@/lib/permissions/check'
import { PERMISSIONS } from '@/constants'
import { logActivity } from './activity-log'
import { Database } from '@/types/database'

type ExtracurricularInsert = Database['public']['Tables']['extracurriculars']['Insert']

export async function getExtracurriculars() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('extracurriculars')
    .select('*')
    .order('order_index')

  if (error) throw new Error('Gagal memuat ekstrakurikuler.')
  return data
}

export async function getActiveExtracurriculars() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('extracurriculars')
    .select('*')
    .eq('active', true)
    .order('order_index')

  if (error) throw new Error('Gagal memuat ekstrakurikuler.')
  return data
}

export async function createExtracurricular(formData: Partial<ExtracurricularInsert>) {
  const { authorized, error } = await checkPermission(PERMISSIONS.MANAGE_EXTRACURRICULARS)
  if (!authorized) throw new Error(error || 'Unauthorized')

  const supabase = await createClient()
  const { data, error: insertError } = await supabase.from('extracurriculars').insert(formData as ExtracurricularInsert).select().single()
  if (insertError) throw new Error('Gagal menambahkan ekstrakurikuler.')

  await logActivity('create', 'extracurricular', data.id, { name: formData.name })
  return data
}

export async function updateExtracurricular(id: string, formData: Partial<ExtracurricularInsert>) {
  const { authorized, error } = await checkPermission(PERMISSIONS.MANAGE_EXTRACURRICULARS)
  if (!authorized) throw new Error(error || 'Unauthorized')

  const supabase = await createClient()
  const { data, error: updateError } = await supabase.from('extracurriculars').update(formData as Partial<ExtracurricularInsert>).eq('id', id).select().single()
  if (updateError) throw new Error('Gagal mengupdate ekstrakurikuler.')

  await logActivity('update', 'extracurricular', id, formData)
  return data
}

export async function deleteExtracurricular(id: string) {
  const { authorized, error } = await checkPermission(PERMISSIONS.MANAGE_EXTRACURRICULARS)
  if (!authorized) throw new Error(error || 'Unauthorized')

  const supabase = await createClient()
  const { error: deleteError } = await supabase.from('extracurriculars').delete().eq('id', id)
  if (deleteError) throw new Error('Gagal menghapus ekstrakurikuler.')

  await logActivity('delete', 'extracurricular', id)
}
