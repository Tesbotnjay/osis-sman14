-- Add featured and order_index to programs table
ALTER TABLE public.programs 
ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS order_index integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS caption text;

-- Add index for featured programs for faster homepage loading
CREATE INDEX IF NOT EXISTS idx_programs_featured ON public.programs(period_id, featured, order_index) WHERE featured = true;
