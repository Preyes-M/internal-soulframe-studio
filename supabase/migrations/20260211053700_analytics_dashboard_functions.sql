-- {Revenue bucket distribution (bar chart)}
CREATE OR REPLACE FUNCTION public.get_revenue_buckets()
RETURNS TABLE (
  revenue_range TEXT,
  shoot_count INTEGER
)
LANGUAGE sql
SECURITY DEFINER
AS $$
SELECT
  CASE
    WHEN price BETWEEN 2000 AND 4999 THEN '₹2k–5k'
    WHEN price BETWEEN 5000 AND 9999 THEN '₹5k–10k'
    WHEN price BETWEEN 10000 AND 19999 THEN '₹10k–20k'
    ELSE '₹20k+'
  END AS revenue_range,
  COUNT(*) AS shoot_count
FROM public.bookings
WHERE status IN ('confirmed', 'completed')
GROUP BY revenue_range
ORDER BY MIN(price);
$$;

GRANT EXECUTE ON FUNCTION public.get_revenue_buckets() TO authenticated;

-- 15 most recent transactions (founder gold)
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
  (b.price - COALESCE(c.total_cost, 0)) AS net_revenue,
  ROUND(
    (b.price - COALESCE(c.total_cost, 0))
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

-- Shoot-type percentage split (pie chart)
CREATE OR REPLACE FUNCTION public.get_shoot_type_split()
RETURNS TABLE (
  shoot_type TEXT,
  revenue NUMERIC,
  percentage NUMERIC
)
LANGUAGE sql
SECURITY DEFINER
AS $$
WITH totals AS (
  SELECT SUM(price) AS total_revenue
  FROM public.bookings
  WHERE status IN ('confirmed', 'completed')
)
SELECT
  b.shoot_type,
  SUM(b.price) AS revenue,
  ROUND(
    SUM(b.price) / NULLIF(t.total_revenue, 0) * 100,
    2
  ) AS percentage
FROM public.bookings b
CROSS JOIN totals t
WHERE b.status IN ('confirmed', 'completed')
GROUP BY b.shoot_type, t.total_revenue
ORDER BY revenue DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_shoot_type_split() TO authenticated;

-- Last 6 months – month-wise revenue (for line / bar chart)
CREATE OR REPLACE FUNCTION public.get_last_6_months_revenue()
RETURNS TABLE (
  month_key DATE,
  month_name TEXT,
  revenue NUMERIC
)
LANGUAGE sql
SECURITY DEFINER
AS $$
SELECT
  date_trunc('month', b.date)::date AS month_key,
  to_char(date_trunc('month', b.date), 'Mon YYYY') AS month_name,
  SUM(b.price) AS revenue
FROM public.bookings b
WHERE b.status IN ('confirmed', 'completed')
  AND b.date >= date_trunc('month', CURRENT_DATE) - INTERVAL '5 months'
GROUP BY
  date_trunc('month', b.date)
ORDER BY month_key;
$$;

GRANT EXECUTE ON FUNCTION public.get_last_6_months_revenue() TO authenticated;
