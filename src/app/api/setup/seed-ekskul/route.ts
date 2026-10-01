import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase credentials missing' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get active period
    const { data: period, error: periodError } = await supabase
      .from('periods')
      .select('id')
      .eq('is_active', true)
      .limit(1)
      .single();

    if (periodError || !period) {
      return NextResponse.json({ error: 'Active period not found', details: periodError }, { status: 404 });
    }

    const activePeriodId = period.id;

    const ekskuls = [
      {
        name: 'Paskib',
        description: 'Kegiatan yang mengembangkan kedisiplinan, ketangkasan, dan jiwa kepemimpinan melalui latihan kepaskibraan. Anggota mempelajari teknik baris-berbaris, sikap sempurna, penghormatan, formasi, hingga tata cara pelaksanaan upacara dengan mengutamakan kekompakan dan ketepatan gerakan.',
        social_links: { instagram: 'https://www.instagram.com/paskassmapas.smd?stkn=OXJ0M3U0bDM3NDI4' },
        active: true,
        order_index: 1,
        period_id: activePeriodId,
      },
      {
        name: 'Badminton',
        description: 'Kegiatan yang mengembangkan kemampuan bermain bulu tangkis melalui latihan teknik, strategi, dan permainan. Anggota mempelajari teknik dasar seperti servis, forehand, backhand, smash, dropshot, lob, dan netting, serta mengembangkan kelincahan, kecepatan, ketepatan, dan strategi permainan.',
        social_links: { instagram: 'https://www.instagram.com/badmintonn14?stkn=MWI4OWNnNjY5OGFkMQ==' },
        active: true,
        order_index: 2,
        period_id: activePeriodId,
      },
      {
        name: 'Basket',
        description: 'Kegiatan yang mengembangkan kemampuan bermain bola basket melalui latihan teknik dan strategi permainan. Anggota mempelajari dribbling, passing, shooting, lay-up, pivot, hingga teknik defense, serta memahami pola serangan dan kerja sama dalam tim.',
        social_links: { instagram: 'https://www.instagram.com/fourteenhoopss?stkn=MXB5YXV1d2xsYXlldA==' },
        active: true,
        order_index: 3,
        period_id: activePeriodId,
      },
      {
        name: 'Marching Band',
        description: 'Perpaduan antara musik, gerakan, dan formasi yang membutuhkan ketepatan serta kekompakan. Anggota mempelajari teknik memainkan alat musik tiup, perkusi, maupun pit, sekaligus berlatih marching, formasi, tempo, dan koordinasi gerakan untuk menghasilkan penampilan yang harmonis.',
        social_links: { instagram: 'https://www.instagram.com/canka_mahakamwijaya14?stkn=emZ6bTVzaXF1NHQ4' },
        active: true,
        order_index: 4,
        period_id: activePeriodId,
      },
      {
        name: 'Tari',
        description: 'Kegiatan yang menjadi ruang untuk mengeksplorasi gerak dan ekspresi melalui berbagai jenis tarian. Anggota mempelajari teknik dasar gerak, wiraga, wirama, wirasa, olah tubuh, ekspresi, serta penguasaan pola lantai untuk menghasilkan penampilan yang kompak dan menarik.',
        social_links: { instagram: 'https://www.instagram.com/fwairysmapas?stkn=MTR6ODF3cTdpNnR3bQ==' },
        active: true,
        order_index: 5,
        period_id: activePeriodId,
      },
      {
        name: 'English Club',
        description: 'Kegiatan untuk mengembangkan kemampuan berbahasa Inggris melalui suasana belajar yang aktif dan komunikatif. Anggota dapat berlatih speaking, listening, reading, dan writing, serta mengembangkan vocabulary, pronunciation, grammar, dan public speaking melalui diskusi, permainan, presentasi, dan berbagai kegiatan berbahasa Inggris.',
        social_links: { instagram: 'https://www.instagram.com/englishclub_fourteen?stkn=MXY5eGs2Y2xlemNucw==' },
        active: true,
        order_index: 6,
        period_id: activePeriodId,
      },
      {
        name: 'KBS Biology',
        description: 'Wadah bagi siswa yang tertarik mendalami ilmu biologi melalui kegiatan belajar dan eksplorasi yang lebih mendalam. Anggota dapat mengembangkan pemahaman tentang sel, genetika, ekologi, anatomi, fisiologi, hingga keanekaragaman hayati, serta berlatih observasi, eksperimen, analisis data, dan pemecahan masalah yang berkaitan dengan bidang biologi.',
        social_links: { instagram: 'https://www.instagram.com/bioclub.smapas?stkn=ZjRocnN0dWY4ZWx5' },
        active: true,
        order_index: 7,
        period_id: activePeriodId,
      },
      {
        name: 'BBAQ',
        description: 'Bina Baca Al-Qur\'an merupakan kegiatan yang berfokus pada pengembangan kemampuan membaca dan memahami Al-Qur\'an. Anggota dapat berlatih tajwid, makhrajul huruf, tartil, kelancaran membaca, serta hafalan, sekaligus membangun kebiasaan membaca Al-Qur\'an dengan baik dan menerapkan nilai-nilainya dalam kehidupan sehari-hari.',
        social_links: { instagram: 'https://www.instagram.com/qycsmapas?stkn=MW1xaHh6cHJsczdiMQ==' },
        active: true,
        order_index: 8,
        period_id: activePeriodId,
      },
      {
        name: 'PIK-R',
        description: 'Kegiatan yang menjadi ruang bagi remaja untuk berdiskusi dan mendapatkan informasi mengenai berbagai hal yang dekat dengan kehidupan mereka. Anggota dilatih dalam komunikasi, public speaking, konseling sebaya, diskusi, dan edukasi, sekaligus mengembangkan kemampuan menjadi teman sebaya yang mampu mendukung lingkungan yang positif.',
        social_links: { label: 'Link Tree', url: 'https://www.instagram.com/sahaja.generation?stkn=MTJvM2dpZ3hxbnkyYg==' },
        active: true,
        order_index: 9,
        period_id: activePeriodId,
      },
      {
        name: 'Handball',
        description: 'Olahraga beregu yang mengandalkan kecepatan, ketepatan, dan kerja sama dalam menguasai bola. Anggota mempelajari teknik passing, catching, dribbling, shooting, hingga teknik bertahan dan strategi permainan untuk membangun koordinasi antarpemain.',
        social_links: { label: 'Link Tree', url: 'https://www.instagram.com/fourteen.handball?stkn=MTUybnpiamgybGsxcQ==' },
        active: true,
        order_index: 10,
        period_id: activePeriodId,
      }
    ];

    // Delete all extracurriculars for the active period
    const { error: deleteError } = await supabase
      .from('extracurriculars')
      .delete()
      .eq('period_id', activePeriodId);

    if (deleteError) {
      return NextResponse.json({ error: 'Failed to clear existing extracurriculars', details: deleteError }, { status: 500 });
    }

    // Insert all
    const { data: insertedData, error: insertError } = await supabase
      .from('extracurriculars')
      .insert(ekskuls)
      .select();

    return NextResponse.json({ success: true, results: insertedData, error: insertError });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
