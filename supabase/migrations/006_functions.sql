-- 006_functions.sql
-- Create helper functions

-- 1. get_active_period_id()
CREATE OR REPLACE FUNCTION public.get_active_period_id()
RETURNS uuid AS $$
DECLARE
    active_id uuid;
BEGIN
    SELECT id INTO active_id FROM public.periods WHERE is_active = true LIMIT 1;
    RETURN active_id;
END;
$$ LANGUAGE plpgsql STABLE;

-- 2. get_statistics()
CREATE OR REPLACE FUNCTION public.get_statistics()
RETURNS json AS $$
DECLARE
    active_period uuid;
    members_count int;
    ekskul_count int;
    programs_count int;
    gallery_count int;
    events_count int;
BEGIN
    active_period := public.get_active_period_id();
    
    SELECT count(*) INTO members_count FROM public.members WHERE active = true AND (period_id = active_period OR active_period IS NULL);
    SELECT count(*) INTO ekskul_count FROM public.extracurriculars WHERE active = true AND (period_id = active_period OR active_period IS NULL);
    SELECT count(*) INTO programs_count FROM public.programs WHERE published = true AND (period_id = active_period OR active_period IS NULL);
    SELECT count(*) INTO gallery_count FROM public.gallery WHERE published = true AND (period_id = active_period OR active_period IS NULL);
    SELECT count(*) INTO events_count FROM public.events WHERE published = true AND (period_id = active_period OR active_period IS NULL);
    
    RETURN json_build_object(
        'members', members_count,
        'extracurriculars', ekskul_count,
        'programs', programs_count,
        'gallery', gallery_count,
        'events', events_count
    );
END;
$$ LANGUAGE plpgsql STABLE;

-- 3. auto_set_period_id() trigger
CREATE OR REPLACE FUNCTION public.auto_set_period_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.period_id IS NULL THEN
        NEW.period_id := public.get_active_period_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name FROM information_schema.columns 
        WHERE column_name = 'period_id' 
        AND table_schema = 'public' 
        AND table_name IN (
            'members', 'organization_positions', 'extracurriculars',
            'programs', 'events', 'timeline_items', 'gallery', 'w_spiras'
        )
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS set_period_id ON %I;
            CREATE TRIGGER set_period_id
            BEFORE INSERT ON %I
            FOR EACH ROW
            EXECUTE FUNCTION public.auto_set_period_id();
        ', t, t);
    END LOOP;
END $$;
