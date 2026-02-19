DROP FUNCTION IF EXISTS public.get_booking_analytics();

CREATE OR REPLACE FUNCTION public.get_booking_analytics()
RETURNS TABLE (
  revenue_this_month NUMERIC,
  revenue_last_month NUMERIC,
  growth_percentage NUMERIC,
  avg_monthly_revenue NUMERIC,
  shoots_completed INTEGER
)
LANGUAGE sql
SECURITY DEFINER
AS $$
WITH monthly AS (
  SELECT
    date_trunc('month', date) AS month,
    SUM(price) AS revenue
  FROM public.bookings
  WHERE status IN ('confirmed', 'completed')
  GROUP BY 1
),
current_prev AS (
  SELECT
    SUM(price) FILTER (
      WHERE date >= date_trunc('month', CURRENT_DATE)
        AND date < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
    ) AS current_month,
    SUM(price) FILTER (
      WHERE date >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month')
        AND date < date_trunc('month', CURRENT_DATE)
    ) AS previous_month,
    COUNT(*) FILTER (
      WHERE date >= date_trunc('month', CURRENT_DATE)
        AND date < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
    ) AS shoots_completed
  FROM public.bookings
  WHERE status IN ('confirmed', 'completed')
)
SELECT
  cp.current_month AS revenue_this_month,
  cp.previous_month AS revenue_last_month,
  CASE
    WHEN cp.previous_month IS NULL OR cp.previous_month = 0 THEN NULL
    ELSE ROUND(
      ((cp.current_month - cp.previous_month) / cp.previous_month) * 100,
      2
    )
  END AS growth_percentage,
  (
    SELECT ROUND(AVG(m.revenue), 2)
    FROM monthly m
  ) AS avg_monthly_revenue,
  cp.shoots_completed
FROM current_prev cp;
$$;


GRANT EXECUTE ON FUNCTION public.get_booking_analytics() TO authenticated;
