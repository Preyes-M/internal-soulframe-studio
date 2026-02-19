-- StudioFlow Database Schema Migration
-- Creates all tables for studio management system

-- 1. Types (ENUMs)
DROP TYPE IF EXISTS public.shoot_type CASCADE;
CREATE TYPE public.shoot_type AS ENUM ('wedding', 'portrait', 'commercial', 'event', 'product', 'maternity', 'fashion', 'podcasting', 'baby', 'modeling');

DROP TYPE IF EXISTS public.booking_status CASCADE;
CREATE TYPE public.booking_status AS ENUM ('confirmed', 'pending', 'completed', 'cancelled');

DROP TYPE IF EXISTS public.task_status CASCADE;
CREATE TYPE public.task_status AS ENUM ('todo', 'in_progress', 'waiting', 'done');

DROP TYPE IF EXISTS public.task_priority CASCADE;
CREATE TYPE public.task_priority AS ENUM ('low', 'medium', 'high', 'urgent');

DROP TYPE IF EXISTS public.client_status CASCADE;
CREATE TYPE public.client_status AS ENUM ('lead', 'booked', 'editing', 'shoot_done', 'delivered', 'inactive');

DROP TYPE IF EXISTS public.inventory_category CASCADE;
CREATE TYPE public.inventory_category AS ENUM ('lights', 'mics', 'backdrops', 'consumables', 'equipment', 'other');

DROP TYPE IF EXISTS public.inventory_status CASCADE;
CREATE TYPE public.inventory_status AS ENUM ('needed', 'ordered', 'received', 'purchased');

-- 2. Core Tables

-- User Profiles Table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    studio_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    shoot_type public.shoot_type NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    duration INTEGER, -- in minutes
    location TEXT,
    status public.booking_status DEFAULT 'pending'::public.booking_status,
    notes TEXT,
    price NUMERIC(10, 2),
    deposit_paid BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Tasks Table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    status public.task_status DEFAULT 'todo'::public.task_status,
    priority public.task_priority DEFAULT 'medium'::public.task_priority,
    due_date DATE,
    linked_to_calendar BOOLEAN DEFAULT false,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Task Assignees Table (for multiple assignees)
CREATE TABLE IF NOT EXISTS public.task_assignees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    avatar TEXT,
    avatar_alt TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Task Subtasks Table
CREATE TABLE IF NOT EXISTS public.task_subtasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT false,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Clients Table
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    instagram TEXT,
    whatsapp TEXT,
    status public.client_status DEFAULT 'lead'::public.client_status,
    shoot_types TEXT[], -- array of shoot types
    project_value NUMERIC(10, 2),
    last_contact TIMESTAMPTZ,
    avatar TEXT,
    avatar_alt TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Client Timeline Table
CREATE TABLE IF NOT EXISTS public.client_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    completed BOOLEAN DEFAULT false,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Client Communications Table
CREATE TABLE IF NOT EXISTS public.client_communications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'call', 'email', 'meeting', 'whatsapp'
    subject TEXT,
    notes TEXT,
    date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Client Attachments Table
CREATE TABLE IF NOT EXISTS public.client_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    size TEXT,
    url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Inventory Items Table
CREATE TABLE IF NOT EXISTS public.inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category public.inventory_category NOT NULL,
    quantity INTEGER DEFAULT 1,
    estimated_price NUMERIC(10, 2),
    vendor TEXT,
    notes TEXT,
    is_priority BOOLEAN DEFAULT false,
    status public.inventory_status DEFAULT 'needed'::public.inventory_status,
    added_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(date);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_task_assignees_task_id ON public.task_assignees(task_id);
CREATE INDEX IF NOT EXISTS idx_task_subtasks_task_id ON public.task_subtasks(task_id);
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON public.clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_status ON public.clients(status);
CREATE INDEX IF NOT EXISTS idx_client_timeline_client_id ON public.client_timeline(client_id);
CREATE INDEX IF NOT EXISTS idx_client_communications_client_id ON public.client_communications(client_id);
CREATE INDEX IF NOT EXISTS idx_client_attachments_client_id ON public.client_attachments(client_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_user_id ON public.inventory_items(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_category ON public.inventory_items(category);

-- 4. Functions (BEFORE RLS policies)

-- Trigger function to create user_profiles when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, studio_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'studio_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
    );
    RETURN NEW;
END;
$$;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- 5. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_assignees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies (AFTER functions)

-- User Profiles Policies
DROP POLICY IF EXISTS "users_manage_own_user_profiles" ON public.user_profiles;
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Bookings Policies
DROP POLICY IF EXISTS "users_manage_own_bookings" ON public.bookings;
CREATE POLICY "users_manage_own_bookings"
ON public.bookings
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Tasks Policies
DROP POLICY IF EXISTS "users_manage_own_tasks" ON public.tasks;
CREATE POLICY "users_manage_own_tasks"
ON public.tasks
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Task Assignees Policies
DROP POLICY IF EXISTS "users_manage_task_assignees" ON public.task_assignees;
CREATE POLICY "users_manage_task_assignees"
ON public.task_assignees
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.tasks
        WHERE tasks.id = task_assignees.task_id
        AND tasks.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.tasks
        WHERE tasks.id = task_assignees.task_id
        AND tasks.user_id = auth.uid()
    )
);

-- Task Subtasks Policies
DROP POLICY IF EXISTS "users_manage_task_subtasks" ON public.task_subtasks;
CREATE POLICY "users_manage_task_subtasks"
ON public.task_subtasks
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.tasks
        WHERE tasks.id = task_subtasks.task_id
        AND tasks.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.tasks
        WHERE tasks.id = task_subtasks.task_id
        AND tasks.user_id = auth.uid()
    )
);

-- Clients Policies
DROP POLICY IF EXISTS "users_manage_own_clients" ON public.clients;
CREATE POLICY "users_manage_own_clients"
ON public.clients
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Client Timeline Policies
DROP POLICY IF EXISTS "users_manage_client_timeline" ON public.client_timeline;
CREATE POLICY "users_manage_client_timeline"
ON public.client_timeline
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.clients
        WHERE clients.id = client_timeline.client_id
        AND clients.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.clients
        WHERE clients.id = client_timeline.client_id
        AND clients.user_id = auth.uid()
    )
);

-- Client Communications Policies
DROP POLICY IF EXISTS "users_manage_client_communications" ON public.client_communications;
CREATE POLICY "users_manage_client_communications"
ON public.client_communications
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.clients
        WHERE clients.id = client_communications.client_id
        AND clients.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.clients
        WHERE clients.id = client_communications.client_id
        AND clients.user_id = auth.uid()
    )
);

-- Client Attachments Policies
DROP POLICY IF EXISTS "users_manage_client_attachments" ON public.client_attachments;
CREATE POLICY "users_manage_client_attachments"
ON public.client_attachments
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.clients
        WHERE clients.id = client_attachments.client_id
        AND clients.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.clients
        WHERE clients.id = client_attachments.client_id
        AND clients.user_id = auth.uid()
    )
);

-- Inventory Items Policies
DROP POLICY IF EXISTS "users_manage_own_inventory_items" ON public.inventory_items;
CREATE POLICY "users_manage_own_inventory_items"
ON public.inventory_items
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 7. Triggers

-- Trigger to create user_profiles on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Triggers to update updated_at timestamp
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_tasks_updated_at ON public.tasks;
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_clients_updated_at ON public.clients;
CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON public.clients
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_inventory_items_updated_at ON public.inventory_items;
CREATE TRIGGER update_inventory_items_updated_at
    BEFORE UPDATE ON public.inventory_items
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Mock Data
DO $$
DECLARE
    demo_user_uuid UUID := gen_random_uuid();
    booking1_uuid UUID := gen_random_uuid();
    booking2_uuid UUID := gen_random_uuid();
    task1_uuid UUID := gen_random_uuid();
    task2_uuid UUID := gen_random_uuid();
    client1_uuid UUID := gen_random_uuid();
    client2_uuid UUID := gen_random_uuid();
BEGIN
    -- Create demo auth user (trigger creates user_profiles automatically)
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (demo_user_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'demo@studioflow.com', crypt('demo123', gen_salt('bf', 10)), now(), now(), now(),
         jsonb_build_object('full_name', 'Demo User', 'studio_name', 'SoulFrame Studio'),
         jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null)
    ON CONFLICT (id) DO NOTHING;

    -- Create sample bookings
    INSERT INTO public.bookings (id, user_id, client_name, phone, shoot_type, date, time, duration, location, status, notes, price)
    VALUES
        (booking1_uuid, demo_user_uuid, 'Priya & Arjun', '+91 98765 43210', 'maternity'::public.shoot_type, '2026-02-15', '10:00', 120, 'Cubbon Park', 'confirmed'::public.booking_status, 'Outdoor shoot at Cubbon Park. Bring props for maternity theme.', 15000),
        (booking2_uuid, demo_user_uuid, 'Mehta Fashion House', '+91 98765 43211', 'fashion'::public.shoot_type, '2026-02-15', '14:00', 180, 'Studio', 'confirmed'::public.booking_status, 'Studio shoot for new collection. 5 models confirmed.', 35000)
    ON CONFLICT (id) DO NOTHING;

    -- Create sample tasks
    INSERT INTO public.tasks (id, user_id, title, category, priority, status, due_date, description, linked_to_calendar)
    VALUES
        (task1_uuid, demo_user_uuid, 'Edit Priya & Arjun wedding photos', 'Editing', 'high'::public.task_priority, 'in_progress'::public.task_status, '2026-02-15', 'Complete color correction and retouching for 150 wedding photos', true),
        (task2_uuid, demo_user_uuid, 'Instagram content for this week', 'Marketing/Content', 'medium'::public.task_priority, 'todo'::public.task_status, '2026-02-14', 'Create 5 posts showcasing recent portfolio shoots', false)
    ON CONFLICT (id) DO NOTHING;

    -- Create task assignees
    INSERT INTO public.task_assignees (task_id, name, avatar, avatar_alt)
    VALUES
        (task1_uuid, 'Rajesh Kumar', 'https://img.rocket.new/generatedImages/rocket_gen_img_1b09cae8d-1763295945796.png', 'Professional headshot of Indian man with short black hair wearing blue shirt'),
        (task2_uuid, 'Priya Sharma', 'https://img.rocket.new/generatedImages/rocket_gen_img_1c6a0feff-1763294815529.png', 'Professional headshot of Indian woman with long black hair wearing red top')
    ON CONFLICT (id) DO NOTHING;

    -- Create task subtasks
    INSERT INTO public.task_subtasks (task_id, title, completed, position)
    VALUES
        (task1_uuid, 'Color correction', true, 0),
        (task1_uuid, 'Retouching', false, 1),
        (task1_uuid, 'Export finals', false, 2)
    ON CONFLICT (id) DO NOTHING;

    -- Create sample clients
    INSERT INTO public.clients (id, user_id, name, phone, email, instagram, whatsapp, status, shoot_types, project_value, last_contact, avatar, avatar_alt)
    VALUES
        (client1_uuid, demo_user_uuid, 'Priya Sharma', '+91 98765 43210', 'priya.sharma@email.com', '@priyasharma_official', '+91 98765 43210', 'booked'::public.client_status, ARRAY['Wedding', 'Fashion'], 125000, '2026-01-10T10:30:00', 'https://img.rocket.new/generatedImages/rocket_gen_img_1cfa37edb-1763295967528.png', 'Professional portrait of Indian woman with long black hair wearing elegant red saree with gold jewelry'),
        (client2_uuid, demo_user_uuid, 'Arjun Mehta', '+91 87654 32109', 'arjun.mehta@email.com', '@arjunmehta_fit', '+91 87654 32109', 'editing'::public.client_status, ARRAY['Modeling', 'Product'], 85000, '2026-01-09T15:45:00', 'https://img.rocket.new/generatedImages/rocket_gen_img_1e86435d4-1763295802223.png', 'Professional headshot of Indian man with short black hair and trimmed beard wearing navy blue blazer')
    ON CONFLICT (id) DO NOTHING;

    -- Create client timeline
    INSERT INTO public.client_timeline (client_id, title, date, completed, position)
    VALUES
        (client1_uuid, 'Initial Consultation', '2026-01-05T14:00:00', true, 0),
        (client1_uuid, 'Booking Confirmed', '2026-01-08T11:00:00', true, 1),
        (client1_uuid, 'Pre-shoot Meeting', '2026-02-15T16:00:00', false, 2),
        (client1_uuid, 'Wedding Shoot', '2026-02-20T09:00:00', false, 3)
    ON CONFLICT (id) DO NOTHING;

    -- Create client communications
    INSERT INTO public.client_communications (client_id, type, subject, notes, date)
    VALUES
        (client1_uuid, 'call', 'Discussed wedding shoot requirements', 'Client wants traditional and contemporary shots. Preferred outdoor location at Cubbon Park.', '2026-01-05T14:30:00'),
        (client1_uuid, 'email', 'Sent booking confirmation and contract', 'Contract signed and advance payment of ₹50,000 received.', '2026-01-08T11:15:00')
    ON CONFLICT (id) DO NOTHING;

    -- Create sample inventory items
    INSERT INTO public.inventory_items (user_id, name, category, quantity, estimated_price, vendor, notes, is_priority, status)
    VALUES
        (demo_user_uuid, 'Softbox 60x90cm', 'lights'::public.inventory_category, 2, 8500, 'Camera House Bangalore', 'For portrait shoots, need diffusion panels included', true, 'needed'::public.inventory_status),
        (demo_user_uuid, 'Rode VideoMic Pro', 'mics'::public.inventory_category, 1, 18500, 'Amazon India', 'For podcast recording setup', true, 'ordered'::public.inventory_status),
        (demo_user_uuid, 'White Muslin Backdrop 3x6m', 'backdrops'::public.inventory_category, 1, 4200, 'Studio Equipment Co.', 'Seamless, wrinkle-resistant material preferred', false, 'needed'::public.inventory_status)
    ON CONFLICT (id) DO NOTHING;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Mock data insertion failed: %', SQLERRM;
END $$;