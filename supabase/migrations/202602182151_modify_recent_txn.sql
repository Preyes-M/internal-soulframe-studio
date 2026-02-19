DROP FUNCTION IF EXISTS public.get_recent_transactions();

CREATE OR REPLACE FUNCTION public.get_recent_transactions()
RETURNS TABLE (
  booking_date DATE,
  booking_name TEXT,
  shoot_type TEXT,
  total_price NUMERIC,
  net_revenue NUMERIC,
  profit_percentage NUMERIC
)
LANGUAGE sql
SECURITY DEFINER
AS $$
WITH costs AS (
  SELECT
    booking_id,
    SUM(amount) AS total_cost
  FROM public.booking_costs
  GROUP BY booking_id
)
SELECT
  b.date::date AS booking_date,
  b.booking_name,
  b.shoot_type,
  b.price AS total_price,

  -- repeat expression instead of alias
  (b.price - (b.price * (b.gst / 100)) - COALESCE(c.total_cost, 0)) AS net_revenue,

  ROUND(
    (b.price - (b.price * (b.gst / 100)) - COALESCE(c.total_cost, 0))
    / NULLIF(b.price, 0) * 100,
    2
  ) AS profit_percentage

FROM public.bookings b
LEFT JOIN costs c ON c.booking_id = b.id
WHERE b.status IN ('confirmed', 'completed')
ORDER BY b.date DESC
LIMIT 15;
$$;

GRANT EXECUTE ON FUNCTION public.get_recent_transactions() TO authenticated;
