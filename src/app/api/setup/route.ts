import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Initial setup endpoint.
 * Creates the first Super Admin user.
 * Uses atomic setup_state lock to prevent race conditions.
 */
export async function POST(request: NextRequest) {
  try {
    const setupSecret = process.env.SETUP_SECRET_KEY
    if (!setupSecret) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { email, password, fullName, setup_key } = body

    if (!setup_key || setup_key !== setupSecret) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password diperlukan.' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password minimal 8 karakter.' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // 1. ATOMIC LOCK: Try to claim initialization
    const { data: lockClaim, error: lockError } = await (supabase as any)
      .from('setup_state')
      .update({ status: 'initializing', last_attempt_at: new Date().toISOString() })
      .eq('id', true)
      .eq('status', 'not_started') // Only succeeds if currently not_started
      .select()
      .single()

    if (lockError || !lockClaim) {
      // Check if it's already completed
      const { data: currentState } = await (supabase as any).from('setup_state').select('status').eq('id', true).single()
      
      if (currentState?.status === 'completed') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      
      return NextResponse.json(
        { error: 'Setup is already initializing or locked. Please wait.' }, 
        { status: 409 }
      )
    }

    // From here, this process OWNS the lock. Must safely release if it fails.
    let authUserId: string | null = null

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })

      if (authError || !authData.user) {
        throw new Error('Gagal membuat user auth.')
      }

      authUserId = authData.user.id

      // Get Super Admin role
      const { data: superAdminRole } = await supabase
        .from('roles')
        .select('id')
        .eq('name', 'Super Admin')
        .single()

      if (!superAdminRole) {
        throw new Error('Sistem belum di-seed.')
      }

      // Create profile
      const { error: profileError } = await (supabase as any)
        .from('profiles')
        .insert({
          id: authUserId,
          full_name: fullName || 'Super Admin',
          role_id: superAdminRole.id,
        })

      if (profileError) {
        throw new Error('Gagal membuat profil user.')
      }

      // Finalize setup state
      await (supabase as any)
        .from('setup_state')
        .update({ status: 'completed' })
        .eq('id', true)

      return NextResponse.json({
        success: true,
        message: 'Super Admin berhasil dibuat.',
      })

    } catch (processError) {
      // Rollback Auth user if it was created
      if (authUserId) {
        await supabase.auth.admin.deleteUser(authUserId)
      }
      
      // Release lock so it can be retried
      await (supabase as any)
        .from('setup_state')
        .update({ status: 'not_started' })
        .eq('id', true)

      throw processError // Re-throw to be caught by outer catch
    }

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    )
  }
}
