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

    // Find the user by email
    const { data: listData, error: listError } = await supabase.auth.admin.listUsers()

    if (listError) {
      return NextResponse.json({ error: 'Gagal list users', details: listError.message }, { status: 500 })
    }

    const existingUser = listData.users.find(u => u.email === email)

    if (!existingUser) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })
    }

    // Update password
    const { data, error } = await supabase.auth.admin.updateUserById(existingUser.id, {
      password,
      email_confirm: true,
    })

    if (error) {
      return NextResponse.json({ error: 'Gagal update password', details: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Password berhasil di-reset!',
      email,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
