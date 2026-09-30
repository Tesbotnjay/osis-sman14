'use server'

import { createClient } from '@/lib/supabase/server'
import { checkPermission } from '@/lib/permissions/check'
import { PERMISSIONS } from '@/constants'
import { logActivity } from './activity-log'

// ===== Settings =====
export async function getSiteSettings() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('site_settings').select('*')
  if (error) throw new Error('Gagal memuat pengaturan.')

  // Transform to key-value map
  const settings: Record<string, unknown> = {}
  data?.forEach((s) => { settings[s.key] = s.value })
  return settings
}

export async function updateSiteSetting(key: string, value: unknown) {
  const { authorized, error } = await checkPermission(PERMISSIONS.MANAGE_SETTINGS)
  if (!authorized) throw new Error(error || 'Unauthorized')

  const supabase = await createClient()

  const { error: upsertError } = await supabase
    .from('site_settings')
    .upsert({ key, value: value as Record<string, unknown> }, { onConflict: 'key' })

  if (upsertError) throw new Error('Gagal menyimpan pengaturan.')

  await logActivity('update', 'site_settings', undefined, { key })
}

// ===== Homepage Sections =====
export async function getHomepageSections() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('homepage_sections')
    .select('*')
    .order('order_index')

  if (error) throw new Error('Gagal memuat section homepage.')
  return data
}

export async function updateHomepageSection(id: string, updates: { visible?: boolean; order_index?: number }) {
  const { authorized, error } = await checkPermission(PERMISSIONS.MANAGE_SETTINGS)
  if (!authorized) throw new Error(error || 'Unauthorized')

  const supabase = await createClient()

  const { error: updateError } = await supabase
    .from('homepage_sections')
    .update(updates)
    .eq('id', id)

  if (updateError) throw new Error('Gagal mengupdate section.')

  await logActivity('update', 'homepage_section', id, updates)
}

// ===== Vision & Mission =====
export async function getVisionMission(periodId?: string) {
  const supabase = await createClient()

  let query = supabase
    .from('vision_mission')
    .select('*, mission_items(*)')

  if (periodId) {
    query = query.eq('period_id', periodId)
  }

  const { data, error } = await query
    .order('order_index', { referencedTable: 'mission_items' })
    .single()

  if (error && error.code !== 'PGRST116') throw new Error('Gagal memuat visi & misi.')
  return data
}

export async function updateVision(id: string, visionText: string) {
  const { authorized, error } = await checkPermission(PERMISSIONS.MANAGE_VISION_MISSION)
  if (!authorized) throw new Error(error || 'Unauthorized')

  const supabase = await createClient()

  const { error: updateError } = await supabase
    .from('vision_mission')
    .update({ vision_text: visionText })
    .eq('id', id)

  if (updateError) throw new Error('Gagal menyimpan visi.')

  await logActivity('update', 'vision', id)
}

// ===== Background Content =====
export async function getBackgroundContent() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('background_content')
    .select('*')
    .single()

  if (error && error.code !== 'PGRST116') throw new Error('Gagal memuat latar belakang.')
  return data
}

export async function updateBackgroundContent(updates: {
  heading?: string
  content?: string
  image_url?: string
}) {
  const { authorized, error } = await checkPermission(PERMISSIONS.MANAGE_BACKGROUND)
  if (!authorized) throw new Error(error || 'Unauthorized')

  const supabase = await createClient()

  // Check if exists
  const { data: existing } = await supabase
    .from('background_content')
    .select('id')
    .single()

  if (existing) {
    const { error: updateError } = await supabase
      .from('background_content')
      .update(updates)
      .eq('id', existing.id)

    if (updateError) throw new Error('Gagal menyimpan latar belakang.')
  } else {
    const { error: insertError } = await supabase
      .from('background_content')
      .insert(updates)

    if (insertError) throw new Error('Gagal menyimpan latar belakang.')
  }

  await logActivity('update', 'background_content')
}

// ===== Social Links =====
export async function getSocialLinks() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .order('order_index')

  if (error) throw new Error('Gagal memuat social links.')
  return data
}

// ===== Linktree =====
export async function getLinktreeItems() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('linktree_items')
    .select('*')
    .eq('enabled', true)
    .order('order_index')

  if (error) throw new Error('Gagal memuat linktree.')
  return data
}

// ===== Statistics =====
export async function getStatistics() {
  const supabase = await createClient()

  const [members, extracurriculars, programs, gallery, events] = await Promise.all([
    supabase.from('members').select('*', { count: 'exact', head: true }).eq('active', true),
    supabase.from('extracurriculars').select('*', { count: 'exact', head: true }).eq('active', true),
    supabase.from('programs').select('*', { count: 'exact', head: true }).eq('published', true),
    supabase.from('gallery').select('*', { count: 'exact', head: true }).eq('published', true),
    supabase.from('events').select('*', { count: 'exact', head: true }).eq('published', true),
  ])

  return {
    members: members.count || 0,
    extracurriculars: extracurriculars.count || 0,
    programs: programs.count || 0,
    gallery: gallery.count || 0,
    events: events.count || 0,
  }
}
