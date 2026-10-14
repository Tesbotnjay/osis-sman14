import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const supabase = createAdminClient()
    
    const { data: wspirasSetting } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'w_spiras_enabled')
      .single()

    const isEnabled = wspirasSetting?.value === true || wspirasSetting?.value === 'true'

    return NextResponse.json({ enabled: isEnabled })
  } catch {
    // Default to enabled if check fails
    return NextResponse.json({ enabled: true })
  }
}