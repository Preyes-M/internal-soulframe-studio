DROP FUNCTION IF EXISTS public.get_revenue_dashboard(uuid);

CREATE OR REPLACE FUNCTION public.get_revenue_dashboard(p_user_id uuid)
RETURNS TABLE (
  monthly_revenue NUMERIC,
  shoots_completed INTEGER,
  shoots_this_week INTEGER,
  upcoming_shoots_count INTEGER,
  potential_revenue NUMERIC,
  revenue_by_type JSONB
)
LANGUAGE sql
SECURITY DEFINER
AS $$
WITH boundaries AS (
  SELECT
    date_trunc('month', CURRENT_DATE) AS month_start,
    date_trunc('month', CURRENT_DATE) + INTERVAL '1 month' AS month_end,
    CURRENT_DATE AS today,
    CURRENT_DATE - INTERVAL '7 days' AS week_start
),

filtered AS (
  SELECT b.*
  FROM public.bookings b, boundaries bd
  WHERE b.user_id = p_user_id
    AND b.status IN ('confirmed', 'completed')
),

monthly AS (
  SELECT
    COALESCE(SUM(price), 0) AS monthly_revenue,
    COUNT(*) AS shoots_completed
  FROM filtered f, boundaries bd
  WHERE f.date >= bd.month_start
    AND f.date < bd.today
),

weekly AS (
  SELECT COUNT(*) AS shoots_this_week
  FROM filtered f, boundaries bd
  WHERE f.date >= bd.week_start
    AND f.date < bd.today
),

upcoming AS (
  SELECT
    COUNT(*) AS upcoming_shoots_count,
    COALESCE(SUM(price), 0) AS potential_revenue
  FROM filtered f, boundaries bd
  WHERE f.date >= bd.today
    AND f.date < bd.month_end
),

by_type AS (
  SELECT jsonb_agg(
           jsonb_build_object(
             'shoot_type', shoot_type,
             'revenue', revenue
           )
         ) AS revenue_by_type
  FROM (
    SELECT
      shoot_type,
      SUM(price) AS revenue
    FROM filtered
    GROUP BY shoot_type
  ) t
)

SELECT
  m.monthly_revenue,
  m.shoots_completed,
  w.shoots_this_week,
  u.upcoming_shoots_count,
  u.potential_revenue,
  COALESCE(bt.revenue_by_type, '[]'::jsonb)
FROM monthly m
CROSS JOIN weekly w
CROSS JOIN upcoming u
CROSS JOIN by_type bt;
$$;

GRANT EXECUTE ON FUNCTION public.get_revenue_dashboard(uuid) TO authenticated;
