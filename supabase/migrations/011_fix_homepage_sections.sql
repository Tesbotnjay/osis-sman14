-- Fix homepage_sections: Ensure all 13 sections exist with correct keys
-- This migration reconciles the section_key values between the seed, the admin UI, and the public homepage.

-- Step 1: Fix the 'about' key that should be 'background' (matching page.tsx switch)
UPDATE public.homepage_sections SET section_key = 'background' WHERE section_key = 'about';

-- Step 2: Insert all missing sections that were never seeded
INSERT INTO public.homepage_sections (section_key, visible, order_index) VALUES
('hero', true, 0),
('broadcast', true, 1),
('background', true, 2),
('statistics', true, 3),
('vision_mission', true, 4),
('programs', true, 5),
('organization', true, 6),
('extracurriculars', true, 7),
('agenda', true, 8),
('timeline', true, 9),
('wspiras', true, 10),
('gallery', true, 11),
('linktree', true, 12)
ON CONFLICT (section_key) DO NOTHING;
