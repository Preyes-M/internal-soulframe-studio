-- Ensure `user_profiles` exists (create minimal table if missing) and include `is_admin`
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    studio_name TEXT,
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Ensure is_admin column exists (safe if table already had it)
ALTER TABLE IF EXISTS public.user_profiles
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create monthly_budgets table
CREATE TABLE IF NOT EXISTS public.monthly_budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  month TEXT NOT NULL, -- YYYY-MM
  amount BIGINT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Unique constraints: per-user (user_id + month) and one global per month (user_id IS NULL)
CREATE UNIQUE INDEX IF NOT EXISTS monthly_budgets_user_month_unique ON public.monthly_budgets(user_id, month) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS monthly_budgets_global_month_unique ON public.monthly_budgets(month) WHERE user_id IS NULL;

-- Updated_at trigger
DROP TRIGGER IF EXISTS update_monthly_budgets_updated_at ON public.monthly_budgets;
CREATE TRIGGER update_monthly_budgets_updated_at
  BEFORE UPDATE ON public.monthly_budgets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.monthly_budgets ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "monthly_budgets_select" ON public.monthly_budgets;
CREATE POLICY "monthly_budgets_select"
  ON public.monthly_budgets
  FOR SELECT
  TO authenticated
  USING (
    user_id IS NULL OR user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.user_profiles up WHERE up.id = auth.uid() AND up.is_admin)
  );

DROP POLICY IF EXISTS "monthly_budgets_insert" ON public.monthly_budgets;
CREATE POLICY "monthly_budgets_insert"
  ON public.monthly_budgets
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (
      (new.user_id IS NULL AND EXISTS (SELECT 1 FROM public.user_profiles up WHERE up.id = auth.uid() AND up.is_admin))
      OR (new.user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "monthly_budgets_update" ON public.monthly_budgets;
CREATE POLICY "monthly_budgets_update"
  ON public.monthly_budgets
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.user_profiles up WHERE up.id = auth.uid() AND up.is_admin)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_profiles up WHERE up.id = auth.uid() AND up.is_admin)
  );

DROP POLICY IF EXISTS "monthly_budgets_delete" ON public.monthly_budgets;
CREATE POLICY "monthly_budgets_delete"
  ON public.monthly_budgets
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.user_profiles up WHERE up.id = auth.uid() AND up.is_admin)
  );
