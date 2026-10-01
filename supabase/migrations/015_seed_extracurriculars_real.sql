-- =============================================
-- SEED EXTRACURRICULARS (REAL DATA)
-- =============================================
DO $$
DECLARE
  v_period_id uuid;
BEGIN
  -- Get active period (2026/2027)
  SELECT id INTO v_period_id FROM public.periods WHERE name = '2026/2027' OR is_active = true LIMIT 1;
  IF v_period_id IS NULL THEN
    RAISE EXCEPTION 'No active period found';
  END IF;

  -- Delete dummy extracurriculars seeded previously (Pramuka, PMR, Paduan Suara, Tari Tradisional, Futsal, Basket dummy)
  -- Or just clean all extracurriculars to ensure a fresh start, since the current ones are all dummy
  DELETE FROM public.extracurriculars;

  -- Insert 10 Real Extracurriculars
  INSERT INTO public.extracurriculars (name, description, social_links, active, order_index, period_id)
  VALUES
    (
      'Paskib',
      'Kegiatan yang mengembangkan kedisiplinan, ketangkasan, dan jiwa kepemimpinan melalui latihan kepaskibraan. Anggota mempelajari teknik baris-berbaris, sikap sempurna, penghormatan, formasi, hingga tata cara pelaksanaan upacara dengan mengutamakan kekompakan dan ketepatan gerakan.',
      '{"instagram": "https://www.instagram.com/paskassmapas.smd?stkn=OXJ0M3U0bDM3NDI4"}'::jsonb,
      true, 1, v_period_id
    ),
    (
      'Badminton',
      'Kegiatan yang mengembangkan kemampuan bermain bulu tangkis melalui latihan teknik, strategi, dan permainan. Anggota mempelajari teknik dasar seperti servis, forehand, backhand, smash, dropshot, lob, dan netting, serta mengembangkan kelincahan, kecepatan, ketepatan, dan strategi permainan.',
      '{"instagram": "https://www.instagram.com/badmintonn14?stkn=MWI4OWNnNjY5OGFkMQ=="}'::jsonb,
      true, 2, v_period_id
    ),
    (
      'Basket',
      'Kegiatan yang mengembangkan kemampuan bermain bola basket melalui latihan teknik dan strategi permainan. Anggota mempelajari dribbling, passing, shooting, lay-up, pivot, hingga teknik defense, serta memahami pola serangan dan kerja sama dalam tim.',
      '{"instagram": "https://www.instagram.com/fourteenhoopss?stkn=MXB5YXV1d2xsYXlldA=="}'::jsonb,
      true, 3, v_period_id
    ),
    (
      'Marching Band',
      'Perpaduan antara musik, gerakan, dan formasi yang membutuhkan ketepatan serta kekompakan. Anggota mempelajari teknik memainkan alat musik tiup, perkusi, maupun pit, sekaligus berlatih marching, formasi, tempo, dan koordinasi gerakan untuk menghasilkan penampilan yang harmonis.',
      '{"instagram": "https://www.instagram.com/canka_mahakamwijaya14?stkn=emZ6bTVzaXF1NHQ4"}'::jsonb,
      true, 4, v_period_id
    ),
    (
      'Tari',
      'Kegiatan yang menjadi ruang untuk mengeksplorasi gerak dan ekspresi melalui berbagai jenis tarian. Anggota mempelajari teknik dasar gerak, wiraga, wirama, wirasa, olah tubuh, ekspresi, serta penguasaan pola lantai untuk menghasilkan penampilan yang kompak dan menarik.',
      '{"instagram": "https://www.instagram.com/fwairysmapas?stkn=MTR6ODF3cTdpNnR3bQ=="}'::jsonb,
      true, 5, v_period_id
    ),
    (
      'English Club',
      'Kegiatan untuk mengembangkan kemampuan berbahasa Inggris melalui suasana belajar yang aktif dan komunikatif. Anggota dapat berlatih speaking, listening, reading, dan writing, serta mengembangkan vocabulary, pronunciation, grammar, dan public speaking melalui diskusi, permainan, presentasi, dan berbagai kegiatan berbahasa Inggris.',
      '{"instagram": "https://www.instagram.com/englishclub_fourteen?stkn=MXY5eGs2Y2xlemNucw=="}'::jsonb,
      true, 6, v_period_id
    ),
    (
      'KBS Biology',
      'Wadah bagi siswa yang tertarik mendalami ilmu biologi melalui kegiatan belajar dan eksplorasi yang lebih mendalam. Anggota dapat mengembangkan pemahaman tentang sel, genetika, ekologi, anatomi, fisiologi, hingga keanekaragaman hayati, serta berlatih observasi, eksperimen, analisis data, dan pemecahan masalah yang berkaitan dengan bidang biologi.',
      '{"instagram": "https://www.instagram.com/bioclub.smapas?stkn=ZjRocnN0dWY4ZWx5"}'::jsonb,
      true, 7, v_period_id
    ),
    (
      'BBAQ',
      'Bina Baca Al-Qur''an merupakan kegiatan yang berfokus pada pengembangan kemampuan membaca dan memahami Al-Qur''an. Anggota dapat berlatih tajwid, makhrajul huruf, tartil, kelancaran membaca, serta hafalan, sekaligus membangun kebiasaan membaca Al-Qur''an dengan baik dan menerapkan nilai-nilainya dalam kehidupan sehari-hari.',
      '{"instagram": "https://www.instagram.com/qycsmapas?stkn=MW1xaHh6cHJsczdiMQ=="}'::jsonb,
      true, 8, v_period_id
    ),
    (
      'PIK-R',
      'Kegiatan yang menjadi ruang bagi remaja untuk berdiskusi dan mendapatkan informasi mengenai berbagai hal yang dekat dengan kehidupan mereka. Anggota dilatih dalam komunikasi, public speaking, konseling sebaya, diskusi, dan edukasi, sekaligus mengembangkan kemampuan menjadi teman sebaya yang mampu mendukung lingkungan yang positif.',
      '{"label": "Link Tree", "url": "https://www.instagram.com/sahaja.generation?stkn=MTJvM2dpZ3hxbnkyYg=="}'::jsonb,
      true, 9, v_period_id
    ),
    (
      'Handball',
      'Olahraga beregu yang mengandalkan kecepatan, ketepatan, dan kerja sama dalam menguasai bola. Anggota mempelajari teknik passing, catching, dribbling, shooting, hingga teknik bertahan dan strategi permainan untuk membangun koordinasi antarpemain.',
      '{"label": "Link Tree", "url": "https://www.instagram.com/fourteen.handball?stkn=MTUybnpiamgybGsxcQ=="}'::jsonb,
      true, 10, v_period_id
    );

  RAISE NOTICE 'Successfully seeded 10 real extracurriculars for period %', v_period_id;
END $$;
