-- 001_enums.sql
-- Create enums for the OSIS SMA Negeri 14 Samarinda database

DO $$ BEGIN
    CREATE TYPE public.program_status AS ENUM ('akan_datang', 'berlangsung', 'selesai');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.wspiras_category AS ENUM ('aspirasi', 'saran', 'kritik');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.wspiras_status AS ENUM ('baru', 'dibaca', 'diproses', 'selesai', 'spam');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.event_category AS ENUM ('rapat', 'event', 'program_kerja', 'lomba', 'sosial', 'sekolah', 'lainnya');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.telegram_status AS ENUM ('pending', 'sent', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.destination_type AS ENUM ('personal', 'group');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
