-- =============================================
-- SEED KEPENGURUSAN OSIS 2026/2027 (FIXED HIERARCHY)
-- =============================================
-- Structure:
--   KETUA
--     └── WAKIL
--           ├── Sekretaris 1 & 2
--           ├── Bendahara 1 & 2
--           ├── Agama (Koor → Anggota)
--           ├── Medkom (Koor → Anggota)
--           ├── Belneg (Koor → Anggota)
--           ├── Olahraga (Koor → Anggota)
--           ├── KWH (Koor → Anggota)
--           └── TIK (Koor → Anggota)

DO $$
DECLARE
  v_period_id uuid;
  -- Member IDs
  m_rizky uuid := 'a0000001-0001-4000-8000-000000000001';
  m_naura_ken uuid := 'a0000001-0001-4000-8000-000000000002';
  m_febi uuid := 'a0000001-0001-4000-8000-000000000003';
  m_alfiora uuid := 'a0000001-0001-4000-8000-000000000004';
  m_tristan uuid := 'a0000001-0001-4000-8000-000000000005';
  m_adalicia uuid := 'a0000001-0001-4000-8000-000000000006';
  -- Agama
  m_fahrurrozi uuid := 'a0000001-0001-4000-8000-000000000010';
  m_khalishah uuid := 'a0000001-0001-4000-8000-000000000011';
  m_yesikha uuid := 'a0000001-0001-4000-8000-000000000012';
  m_queenzania uuid := 'a0000001-0001-4000-8000-000000000013';
  m_assifa uuid := 'a0000001-0001-4000-8000-000000000014';
  -- Medkom
  m_avinda uuid := 'a0000001-0001-4000-8000-000000000020';
  m_annisa_f uuid := 'a0000001-0001-4000-8000-000000000021';
  m_bilqies_m uuid := 'a0000001-0001-4000-8000-000000000022';
  m_jelita uuid := 'a0000001-0001-4000-8000-000000000023';
  m_naura_suci uuid := 'a0000001-0001-4000-8000-000000000024';
  -- Belneg
  m_maulana uuid := 'a0000001-0001-4000-8000-000000000030';
  m_rizky_f uuid := 'a0000001-0001-4000-8000-000000000031';
  m_lintang uuid := 'a0000001-0001-4000-8000-000000000032';
  m_amanda_c uuid := 'a0000001-0001-4000-8000-000000000033';
  m_riby uuid := 'a0000001-0001-4000-8000-000000000034';
  m_anisa_h uuid := 'a0000001-0001-4000-8000-000000000035';
  -- Olahraga
  m_kalila uuid := 'a0000001-0001-4000-8000-000000000040';
  m_aisyah uuid := 'a0000001-0001-4000-8000-000000000041';
  m_amanda_t uuid := 'a0000001-0001-4000-8000-000000000042';
  m_rafif uuid := 'a0000001-0001-4000-8000-000000000043';
  m_naila uuid := 'a0000001-0001-4000-8000-000000000044';
  m_waode uuid := 'a0000001-0001-4000-8000-000000000045';
  -- KWH
  m_febiangi uuid := 'a0000001-0001-4000-8000-000000000050';
  m_raysha uuid := 'a0000001-0001-4000-8000-000000000051';
  m_najya uuid := 'a0000001-0001-4000-8000-000000000052';
  m_adisty uuid := 'a0000001-0001-4000-8000-000000000053';
  m_thady uuid := 'a0000001-0001-4000-8000-000000000054';
  m_mazda uuid := 'a0000001-0001-4000-8000-000000000055';
  -- TIK
  m_jenie uuid := 'a0000001-0001-4000-8000-000000000060';
  m_lones uuid := 'a0000001-0001-4000-8000-000000000061';
  m_chelsea uuid := 'a0000001-0001-4000-8000-000000000062';
  m_rasha uuid := 'a0000001-0001-4000-8000-000000000063';
  m_naura_malca uuid := 'a0000001-0001-4000-8000-000000000064';
  m_brayan uuid := 'a0000001-0001-4000-8000-000000000065';
  m_yulia uuid := 'a0000001-0001-4000-8000-000000000066';

  -- Position IDs
  p_ketua uuid := 'b0000001-0001-4000-8000-000000000001';
  p_wakil uuid := 'b0000001-0001-4000-8000-000000000002';
  p_sekre1 uuid := 'b0000001-0001-4000-8000-000000000003';
  p_sekre2 uuid := 'b0000001-0001-4000-8000-000000000004';
  p_benda1 uuid := 'b0000001-0001-4000-8000-000000000005';
  p_benda2 uuid := 'b0000001-0001-4000-8000-000000000006';
  p_agama_head uuid := 'b0000001-0001-4000-8000-000000000010';
  p_medkom_head uuid := 'b0000001-0001-4000-8000-000000000020';
  p_belneg_head uuid := 'b0000001-0001-4000-8000-000000000030';
  p_olahraga_head uuid := 'b0000001-0001-4000-8000-000000000040';
  p_kwh_head uuid := 'b0000001-0001-4000-8000-000000000050';
  p_tik_head uuid := 'b0000001-0001-4000-8000-000000000060';

BEGIN
  SELECT id INTO v_period_id FROM public.periods WHERE is_active = true LIMIT 1;
  IF v_period_id IS NULL THEN
    RAISE EXCEPTION 'No active period found.';
  END IF;

  -- Clean existing data for this period
  DELETE FROM public.organization_positions WHERE period_id = v_period_id;
  DELETE FROM public.members WHERE period_id = v_period_id;

  -- =============================================
  -- INSERT MEMBERS
  -- =============================================
  INSERT INTO public.members (id, name, description, active, order_index, period_id) VALUES
  (m_rizky, 'Muhammad Rizky Andhika', 'XI-5', true, 1, v_period_id),
  (m_naura_ken, 'Naura Ken Nurul Izzah', 'X-6', true, 2, v_period_id),
  (m_febi, 'Febi Fitria Anindah', 'XI-3', true, 3, v_period_id),
  (m_alfiora, 'Alfiora Bilqies Izzati Sharomah', 'XI-1', true, 4, v_period_id),
  (m_tristan, 'Tristan Elvis Pratama Putra', 'XI-5', true, 5, v_period_id),
  (m_adalicia, 'Adalicia Allese Lisulembang', 'X-6', true, 6, v_period_id),
  (m_fahrurrozi, 'Muhammad Fahrurrozi', 'XI-5', true, 10, v_period_id),
  (m_khalishah, 'Khalishah Mahirah', 'X-4', true, 11, v_period_id),
  (m_yesikha, 'Yesikha Charolin Makigawe', 'X-6', true, 12, v_period_id),
  (m_queenzania, 'Queenzania Ramadhani Ilyas', 'X-2', true, 13, v_period_id),
  (m_assifa, 'Assifa Rahma', 'X-6', true, 14, v_period_id),
  (m_avinda, 'Avinda Aulia Khafid', 'XI-5', true, 20, v_period_id),
  (m_annisa_f, 'Annisa Fauzie', 'X-5', true, 21, v_period_id),
  (m_bilqies_m, 'Bilqies Muna Hadi Putri', 'X-1', true, 22, v_period_id),
  (m_jelita, 'Jelita Regina Saputri', 'X-2', true, 23, v_period_id),
  (m_naura_suci, 'Naura Suci', '-', true, 24, v_period_id),
  (m_maulana, 'Muhammad Maulana', 'XI-1', true, 30, v_period_id),
  (m_rizky_f, 'Muhammad Rizky Faizal Ahkdan', 'X-2', true, 31, v_period_id),
  (m_lintang, 'Lintang Abimanyu', 'X-4', true, 32, v_period_id),
  (m_amanda_c, 'Amanda Chantika Ramadhanie', 'X-4', true, 33, v_period_id),
  (m_riby, 'Riby Rafifa Elvari Putri', 'X-4', true, 34, v_period_id),
  (m_anisa_h, 'Anisa Hana Dzakira', 'X-3', true, 35, v_period_id),
  (m_kalila, 'Kalila Najmil Al Humaira', 'XI-5', true, 40, v_period_id),
  (m_aisyah, 'Aisyah Ariyani', 'X-5', true, 41, v_period_id),
  (m_amanda_t, 'Amanda Triandita Putri', 'X-5', true, 42, v_period_id),
  (m_rafif, 'Rafif Zaky Andra Pratama', 'X-6', true, 43, v_period_id),
  (m_naila, 'Naila Zaviera Ade Putri', 'X-1', true, 44, v_period_id),
  (m_waode, 'Wa Ode Aprilia Izzati A.D', 'X-1', true, 45, v_period_id),
  (m_febiangi, 'Febiangi Siti Nurhalisa', 'XI-5', true, 50, v_period_id),
  (m_raysha, 'Raysha Putri Syah', 'X-5', true, 51, v_period_id),
  (m_najya, 'Najya Sadira', 'XI-2', true, 52, v_period_id),
  (m_adisty, 'Adisty Nurani', 'X-6', true, 53, v_period_id),
  (m_thady, 'Thady Syahdan Syakur', 'X-6', true, 54, v_period_id),
  (m_mazda, 'Mazda', 'X-1', true, 55, v_period_id),
  (m_jenie, 'Jenie Gunawan', 'XI-5', true, 60, v_period_id),
  (m_lones, 'Lones Liola', 'X-5', true, 61, v_period_id),
  (m_chelsea, 'Chelsea Kornika', 'X-2', true, 62, v_period_id),
  (m_rasha, 'Rasha Leandra', 'X-1', true, 63, v_period_id),
  (m_naura_malca, 'Naura Malca Elma Mazhea', 'X-2', true, 64, v_period_id),
  (m_brayan, 'Brayan Immanuel', 'X-6', true, 65, v_period_id),
  (m_yulia, 'Yulia Putri', 'X-5', true, 66, v_period_id);

  -- =============================================
  -- ORGANIZATION POSITIONS
  -- =============================================

  -- Level 0: KETUA (root, no parent)
  INSERT INTO public.organization_positions (id, title, division, parent_position_id, member_id, order_index, period_id)
  VALUES (p_ketua, 'Ketua OSIS', 'Pengurus Inti', NULL, m_rizky, 0, v_period_id);

  -- Level 1: WAKIL (parent = KETUA)
  INSERT INTO public.organization_positions (id, title, division, parent_position_id, member_id, order_index, period_id)
  VALUES (p_wakil, 'Wakil Ketua OSIS', 'Pengurus Inti', p_ketua, m_naura_ken, 1, v_period_id);

  -- Level 2: Sekretaris & Bendahara (parent = WAKIL)
  INSERT INTO public.organization_positions (id, title, division, parent_position_id, member_id, order_index, period_id) VALUES
  (p_sekre1, 'Sekretaris 1', 'Pengurus Inti', p_wakil, m_febi, 2, v_period_id),
  (p_sekre2, 'Sekretaris 2', 'Pengurus Inti', p_wakil, m_alfiora, 3, v_period_id),
  (p_benda1, 'Bendahara 1', 'Pengurus Inti', p_wakil, m_tristan, 4, v_period_id),
  (p_benda2, 'Bendahara 2', 'Pengurus Inti', p_wakil, m_adalicia, 5, v_period_id);

  -- Level 2: Seksi Bidang Koordinator (parent = WAKIL)
  INSERT INTO public.organization_positions (id, title, division, parent_position_id, member_id, order_index, period_id) VALUES
  (p_agama_head, 'Koordinator', 'Agama', p_wakil, m_fahrurrozi, 10, v_period_id),
  (p_medkom_head, 'Koordinator', 'Media Komunikasi (Medkom)', p_wakil, m_avinda, 20, v_period_id),
  (p_belneg_head, 'Koordinator', 'Bela Negara (Belneg)', p_wakil, m_maulana, 30, v_period_id),
  (p_olahraga_head, 'Koordinator', 'Olah Raga', p_wakil, m_kalila, 40, v_period_id),
  (p_kwh_head, 'Koordinator', 'Kewirausahaan (KWH)', p_wakil, m_febiangi, 50, v_period_id),
  (p_tik_head, 'Koordinator', 'TIK', p_wakil, m_jenie, 60, v_period_id);

  -- Level 3: Anggota per Divisi

  -- AGAMA
  INSERT INTO public.organization_positions (title, division, parent_position_id, member_id, order_index, period_id) VALUES
  ('Anggota', 'Agama', p_agama_head, m_khalishah, 11, v_period_id),
  ('Anggota', 'Agama', p_agama_head, m_yesikha, 12, v_period_id),
  ('Anggota', 'Agama', p_agama_head, m_queenzania, 13, v_period_id),
  ('Anggota', 'Agama', p_agama_head, m_assifa, 14, v_period_id);

  -- MEDKOM
  INSERT INTO public.organization_positions (title, division, parent_position_id, member_id, order_index, period_id) VALUES
  ('Anggota', 'Media Komunikasi (Medkom)', p_medkom_head, m_annisa_f, 21, v_period_id),
  ('Anggota', 'Media Komunikasi (Medkom)', p_medkom_head, m_bilqies_m, 22, v_period_id),
  ('Anggota', 'Media Komunikasi (Medkom)', p_medkom_head, m_jelita, 23, v_period_id),
  ('Anggota', 'Media Komunikasi (Medkom)', p_medkom_head, m_naura_suci, 24, v_period_id);

  -- BELNEG
  INSERT INTO public.organization_positions (title, division, parent_position_id, member_id, order_index, period_id) VALUES
  ('Anggota', 'Bela Negara (Belneg)', p_belneg_head, m_rizky_f, 31, v_period_id),
  ('Anggota', 'Bela Negara (Belneg)', p_belneg_head, m_lintang, 32, v_period_id),
  ('Anggota', 'Bela Negara (Belneg)', p_belneg_head, m_amanda_c, 33, v_period_id),
  ('Anggota', 'Bela Negara (Belneg)', p_belneg_head, m_riby, 34, v_period_id),
  ('Anggota', 'Bela Negara (Belneg)', p_belneg_head, m_anisa_h, 35, v_period_id);

  -- OLAHRAGA
  INSERT INTO public.organization_positions (title, division, parent_position_id, member_id, order_index, period_id) VALUES
  ('Anggota', 'Olah Raga', p_olahraga_head, m_aisyah, 41, v_period_id),
  ('Anggota', 'Olah Raga', p_olahraga_head, m_amanda_t, 42, v_period_id),
  ('Anggota', 'Olah Raga', p_olahraga_head, m_rafif, 43, v_period_id),
  ('Anggota', 'Olah Raga', p_olahraga_head, m_naila, 44, v_period_id),
  ('Anggota', 'Olah Raga', p_olahraga_head, m_waode, 45, v_period_id);

  -- KWH
  INSERT INTO public.organization_positions (title, division, parent_position_id, member_id, order_index, period_id) VALUES
  ('Anggota', 'Kewirausahaan (KWH)', p_kwh_head, m_raysha, 51, v_period_id),
  ('Anggota', 'Kewirausahaan (KWH)', p_kwh_head, m_najya, 52, v_period_id),
  ('Anggota', 'Kewirausahaan (KWH)', p_kwh_head, m_adisty, 53, v_period_id),
  ('Anggota', 'Kewirausahaan (KWH)', p_kwh_head, m_thady, 54, v_period_id),
  ('Anggota', 'Kewirausahaan (KWH)', p_kwh_head, m_mazda, 55, v_period_id);

  -- TIK
  INSERT INTO public.organization_positions (title, division, parent_position_id, member_id, order_index, period_id) VALUES
  ('Anggota', 'TIK', p_tik_head, m_lones, 61, v_period_id),
  ('Anggota', 'TIK', p_tik_head, m_chelsea, 62, v_period_id),
  ('Anggota', 'TIK', p_tik_head, m_rasha, 63, v_period_id),
  ('Anggota', 'TIK', p_tik_head, m_naura_malca, 64, v_period_id),
  ('Anggota', 'TIK', p_tik_head, m_brayan, 65, v_period_id),
  ('Anggota', 'TIK', p_tik_head, m_yulia, 66, v_period_id);

  RAISE NOTICE 'Successfully seeded OSIS structure for period %', v_period_id;
END $$;
