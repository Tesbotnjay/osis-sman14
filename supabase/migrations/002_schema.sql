-- 002_schema.sql

-- Helper function for auto-updating updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. periods
CREATE TABLE IF NOT EXISTS public.periods (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    start_date date,
    end_date date,
    is_active boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 2. roles
CREATE TABLE IF NOT EXISTS public.roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    description text,
    is_system boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 3. permissions
CREATE TABLE IF NOT EXISTS public.permissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    key text NOT NULL UNIQUE,
    description text,
    created_at timestamptz DEFAULT now()
);

-- 4. role_permissions
CREATE TABLE IF NOT EXISTS public.role_permissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id uuid REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id uuid REFERENCES public.permissions(id) ON DELETE CASCADE,
    UNIQUE(role_id, permission_id)
);

-- 5. profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text,
    avatar_url text,
    role_id uuid REFERENCES public.roles(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 6. members
CREATE TABLE IF NOT EXISTS public.members (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    photo_url text,
    description text,
    active boolean DEFAULT true,
    order_index integer DEFAULT 0,
    period_id uuid REFERENCES public.periods(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 7. organization_positions
CREATE TABLE IF NOT EXISTS public.organization_positions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    division text,
    parent_position_id uuid REFERENCES public.organization_positions(id) ON DELETE SET NULL,
    member_id uuid REFERENCES public.members(id) ON DELETE SET NULL,
    order_index integer DEFAULT 0,
    period_id uuid NOT NULL REFERENCES public.periods(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 8. extracurriculars
CREATE TABLE IF NOT EXISTS public.extracurriculars (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    logo_url text,
    photo_url text,
    description text,
    pembina text,
    contact text,
    social_links jsonb DEFAULT '{}'::jsonb,
    active boolean DEFAULT true,
    order_index integer DEFAULT 0,
    period_id uuid REFERENCES public.periods(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 9. programs
CREATE TABLE IF NOT EXISTS public.programs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    date date,
    period text,
    location text,
    responsible_person text,
    image_url text,
    category text,
    status public.program_status DEFAULT 'akan_datang',
    published boolean DEFAULT false,
    period_id uuid REFERENCES public.periods(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 10. events
CREATE TABLE IF NOT EXISTS public.events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    date date NOT NULL,
    start_time time,
    end_time time,
    location text,
    category public.event_category DEFAULT 'lainnya',
    responsible_person text,
    status text DEFAULT 'upcoming',
    related_program_id uuid REFERENCES public.programs(id) ON DELETE SET NULL,
    published boolean DEFAULT false,
    period_id uuid REFERENCES public.periods(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 11. timeline_items
CREATE TABLE IF NOT EXISTS public.timeline_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    date date,
    order_index integer DEFAULT 0,
    published boolean DEFAULT false,
    period_id uuid REFERENCES public.periods(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 12. broadcasts
CREATE TABLE IF NOT EXISTS public.broadcasts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    content text,
    date date,
    published boolean DEFAULT false,
    pinned boolean DEFAULT false,
    priority integer DEFAULT 0,
    start_at timestamptz,
    expires_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 13. vision_mission
CREATE TABLE IF NOT EXISTS public.vision_mission (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    vision_text text,
    period_id uuid UNIQUE REFERENCES public.periods(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 14. mission_items
CREATE TABLE IF NOT EXISTS public.mission_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    content text NOT NULL,
    order_index integer DEFAULT 0,
    vision_mission_id uuid REFERENCES public.vision_mission(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 15. background_content
CREATE TABLE IF NOT EXISTS public.background_content (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    heading text,
    content text,
    image_url text,
    updated_at timestamptz DEFAULT now()
);

-- 16. gallery
CREATE TABLE IF NOT EXISTS public.gallery (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text,
    caption text,
    description text,
    image_url text NOT NULL,
    thumbnail_url text,
    medium_url text,
    category text,
    date date,
    related_program_id uuid REFERENCES public.programs(id) ON DELETE SET NULL,
    published boolean DEFAULT false,
    period_id uuid REFERENCES public.periods(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 17. w_spiras
CREATE TABLE IF NOT EXISTS public.w_spiras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    category public.wspiras_category NOT NULL,
    name text,
    class text,
    message text NOT NULL,
    status public.wspiras_status DEFAULT 'baru',
    is_anonymous boolean DEFAULT true,
    ip_hash text,
    telegram_status public.telegram_status DEFAULT 'pending',
    telegram_sent_at timestamptz,
    telegram_error text,
    period_id uuid REFERENCES public.periods(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 18. site_settings
CREATE TABLE IF NOT EXISTS public.site_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    key text NOT NULL UNIQUE,
    value jsonb,
    updated_at timestamptz DEFAULT now()
);

-- 19. telegram_settings
CREATE TABLE IF NOT EXISTS public.telegram_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    bot_token_encrypted text,
    destination_type public.destination_type DEFAULT 'personal',
    chat_id text,
    enabled boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 20. social_links
CREATE TABLE IF NOT EXISTS public.social_links (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    platform text NOT NULL,
    url text NOT NULL,
    icon text,
    enabled boolean DEFAULT true,
    order_index integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 21. linktree_items
CREATE TABLE IF NOT EXISTS public.linktree_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    label text NOT NULL,
    url text NOT NULL,
    enabled boolean DEFAULT true,
    order_index integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 22. homepage_sections
CREATE TABLE IF NOT EXISTS public.homepage_sections (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key text NOT NULL UNIQUE,
    visible boolean DEFAULT true,
    order_index integer DEFAULT 0,
    updated_at timestamptz DEFAULT now()
);

-- 23. activity_logs
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    action text NOT NULL,
    entity_type text,
    entity_id uuid,
    details jsonb,
    created_at timestamptz DEFAULT now()
);

-- 24. notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    title text NOT NULL,
    message text,
    type text,
    entity_type text,
    entity_id uuid,
    read boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- Add updated_at triggers
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name FROM information_schema.columns 
        WHERE column_name = 'updated_at' 
        AND table_schema = 'public' 
        AND table_name IN (
            'periods', 'roles', 'profiles', 'members', 'organization_positions',
            'extracurriculars', 'programs', 'events', 'timeline_items', 'broadcasts',
            'vision_mission', 'mission_items', 'background_content', 'gallery',
            'w_spiras', 'site_settings', 'telegram_settings', 'social_links',
            'linktree_items', 'homepage_sections'
        )
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS set_updated_at ON %I;
            CREATE TRIGGER set_updated_at
            BEFORE UPDATE ON %I
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
        ', t, t);
    END LOOP;
END $$;
