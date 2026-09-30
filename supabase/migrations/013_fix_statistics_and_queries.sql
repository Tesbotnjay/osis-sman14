-- =============================================
-- FIX: Update get_statistics to SECURITY DEFINER
-- =============================================
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
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
