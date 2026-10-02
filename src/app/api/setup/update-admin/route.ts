import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const setupSecret = process.env.SETUP_SECRET_KEY
    if (!setupSecret) {
      return NextResponse.json({ error: 'SETUP_SECRET_KEY not configured' }, { status: 403 })
    }

    const body = await request.json()
    const { email, password, setup_key } = body

    if (!setup_key || setup_key !== setupSecret) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password diperlukan.' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // List all users and find the one with Super Admin role
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, roles!inner(name)')
      .eq('roles.name', 'Super Admin')
      .limit(1)

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({ error: 'No Super Admin user found' }, { status: 404 })
    }

    const adminUserId = profiles[0].id

    // Update auth user email and password
    const { data, error } = await supabase.auth.admin.updateUserById(adminUserId, {
      email,
      password,
      email_confirm: true,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Admin credentials updated successfully.',
      user_id: adminUserId,
      new_email: email,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
