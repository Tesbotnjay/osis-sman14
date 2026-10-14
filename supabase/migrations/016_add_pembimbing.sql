-- =============================================
-- ADD PEMBIMBING POSITION (R01)
-- =============================================
-- Adds List Hartiningsih as Pembimbing, positioned above Pembina in hierarchy

DO $$
DECLARE
  v_period_id uuid;
  m_pembimbing uuid := 'a0000001-0001-4000-8000-000000000099';
  p_pembimbing uuid := 'b0000001-0001-4000-8000-000000000099';
  target_pembina_id uuid;
BEGIN
  SELECT id INTO v_period_id FROM public.periods WHERE is_active = true LIMIT 1;
  IF v_period_id IS NULL THEN
    RAISE NOTICE 'No active period found. Skipping.';
    RETURN;
  END IF;

  -- 1. Upsert Member List Hartiningsih
  INSERT INTO public.members (id, name, description, active, order_index, period_id)
  VALUES (m_pembimbing, 'List Hartiningsih', 'Pembimbing OSIS', true, -1, v_period_id)
  ON CONFLICT (id) DO UPDATE 
    SET name = EXCLUDED.name,
        description = EXCLUDED.description,
        active = EXCLUDED.active,
        period_id = EXCLUDED.period_id;

  -- 2. Upsert Position Pembimbing as top-level (NULL parent)
  INSERT INTO public.organization_positions 
  (id, title, division, parent_position_id, member_id, order_index, period_id)
  VALUES (p_pembimbing, 'Pembimbing', 'Pembimbing', NULL, m_pembimbing, 0, v_period_id)
  ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        division = EXCLUDED.division,
        parent_position_id = NULL,
        member_id = EXCLUDED.member_id,
        order_index = 0,
        period_id = EXCLUDED.period_id;

  -- 3. Link Pembina to Pembimbing as parent
  SELECT id INTO target_pembina_id 
  FROM public.organization_positions 
  WHERE period_id = v_period_id 
    AND (title ILIKE '%Pembina%' OR id = 'b0000001-0001-4000-8000-000000000000')
  LIMIT 1;

  IF target_pembina_id IS NOT NULL THEN
    UPDATE public.organization_positions
    SET parent_position_id = p_pembimbing,
        order_index = 1
    WHERE id = target_pembina_id;
  END IF;

  RAISE NOTICE 'Pembimbing position configured successfully for period %', v_period_id;
END $$;
