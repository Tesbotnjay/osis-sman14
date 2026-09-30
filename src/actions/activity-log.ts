'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Log an admin activity.
 */
export async function logActivity(
  action: string,
  entityType?: string,
  entityId?: string,
  details?: Record<string, unknown>
) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details,
    })
  } catch (error) {
    // Activity logging should not break the main operation
    console.error('Failed to log activity:', error)
  }
}
