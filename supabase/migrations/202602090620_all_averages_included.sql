DROP FUNCTION IF EXISTS public.get_booking_analytics();

CREATE OR REPLACE FUNCTION public.get_booking_analytics()
RETURNS TABLE (
  revenue_this_month NUMERIC,
  revenue_last_month NUMERIC,
  growth_percentage NUMERIC,
  previous_growth_percentage NUMERIC,
  avg_monthly_booking_value NUMERIC,
  shoots_completed INTEGER
)
LANGUAGE sql
SECURITY DEFINER
AS $$
WITH monthly AS (
  SELECT
    date_trunc('month', date) AS month,
    SUM(price) AS revenue,
    COUNT(*) AS bookings,
    ROUND(SUM(price) / NULLIF(COUNT(*), 0), 2) AS avg_booking_value
  FROM public.bookings
  WHERE status IN ('confirmed', 'completed')
  GROUP BY 1
),
month_refs AS (
  SELECT
    date_trunc('month', CURRENT_DATE) AS current_month,
    date_trunc('month', CURRENT_DATE) - INTERVAL '1 month' AS last_month,
    date_trunc('month', CURRENT_DATE) - INTERVAL '2 months' AS prev_month
),
pivot AS (
  SELECT
    MAX(m.revenue) FILTER (WHERE m.month = r.current_month) AS revenue_this_month,
    MAX(m.revenue) FILTER (WHERE m.month = r.last_month) AS revenue_last_month,
    MAX(m.revenue) FILTER (WHERE m.month = r.prev_month) AS revenue_prev_month,
    MAX(m.bookings) FILTER (WHERE m.month = r.current_month) AS shoots_completed
  FROM monthly m
  CROSS JOIN month_refs r
)
SELECT
  p.revenue_this_month,
  p.revenue_last_month,

  /* Current vs Last month growth */
  CASE
    WHEN p.revenue_last_month IS NULL OR p.revenue_last_month = 0 THEN NULL
    ELSE ROUND(
      ((p.revenue_this_month - p.revenue_last_month) / p.revenue_last_month) * 100,
      2
    )
  END AS growth_percentage,

  /* Last month vs Month-before-last growth */
  CASE
    WHEN p.revenue_prev_month IS NULL OR p.revenue_prev_month = 0 THEN NULL
    ELSE ROUND(
      ((p.revenue_last_month - p.revenue_prev_month) / p.revenue_prev_month) * 100,
      2
    )
  END AS previous_growth_percentage,

  /* Average booking value per month (exclude current month) */
  (
    SELECT ROUND(AVG(m.avg_booking_value), 2)
    FROM monthly m
    WHERE m.month < date_trunc('month', CURRENT_DATE)
  ) AS avg_monthly_booking_value,

  p.shoots_completed
FROM pivot p;
$$;

GRANT EXECUTE ON FUNCTION public.get_booking_analytics() TO authenticated;
