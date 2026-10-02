import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase credentials missing' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const email = 'OSISsmapas2627@gmail.com'
    const password = 'smapas2627'

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError || !authData.user) {
      return NextResponse.json({ error: 'Gagal membuat user', details: authError?.message }, { status: 500 })
    }

    // Get Super Admin role
    const { data: superAdminRole } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'Super Admin')
      .single()

    if (!superAdminRole) {
      return NextResponse.json({ error: 'Role Super Admin tidak ditemukan. Pastikan seed sudah dijalankan.' }, { status: 500 })
    }

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        full_name: 'Super Admin OSIS',
        role_id: superAdminRole.id,
      })

    if (profileError) {
      // Rollback: delete auth user
      await supabase.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json({ error: 'Gagal membuat profil', details: profileError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Admin baru berhasil dibuat!',
      email,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
