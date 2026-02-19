DROP TYPE IF EXISTS public.professionals_category CASCADE;
CREATE TYPE public.professionals_category AS ENUM ('video', 'photo', 'costumes', 'make-up-artist', 'models', 'equipments', 'restaurants', 'studios', 'custom');

-- Professionals Table
CREATE TABLE IF NOT EXISTS public.professionals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    instagram TEXT,
    whatsapp TEXT,
    category public.professionals_category DEFAULT 'photo',
    last_contact TIMESTAMPTZ,
    avatar TEXT,
    avatar_alt TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
