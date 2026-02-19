-- 202602060945_create_booking_analytics.sql

CREATE OR REPLACE FUNCTION public.get_booking_analytics()
RETURNS TABLE (
  revenue_this_month NUMERIC,
  revenue_last_month NUMERIC,
  growth_percentage NUMERIC,
  avg_monthly_revenue NUMERIC
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
    ) AS previous_month
  FROM public.bookings
  WHERE status IN ('confirmed', 'completed')
)
SELECT
  cp.current_month,
  cp.previous_month,
  CASE
    WHEN cp.previous_month = 0 THEN NULL
    ELSE ROUND(
      ((cp.current_month - cp.previous_month) / cp.previous_month) * 100,
      2
    )
  END,
  ROUND(AVG(m.revenue), 2)
FROM current_prev cp
CROSS JOIN monthly m;
$$;

GRANT EXECUTE ON FUNCTION public.booking_analytics() TO authenticated;
