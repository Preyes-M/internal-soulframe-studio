CREATE TABLE public.booking_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  cost_type TEXT NOT NULL,          -- videographer | rental | assistant | travel | misc
  amount NUMERIC NOT NULL CHECK (amount >= 0),
  vendor_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_booking_costs_booking_id
  ON public.booking_costs(booking_id);

-- Net unit economics (per shoot)
CREATE OR REPLACE FUNCTION public.get_booking_unit_economics()
RETURNS TABLE (
  avg_net_revenue NUMERIC,
  avg_margin_percentage NUMERIC,
  loss_making_shoots INTEGER,
  total_shoots INTEGER
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
),
economics AS (
  SELECT
    b.id,
    b.price,
    COALESCE(c.total_cost, 0) AS total_cost,
    b.price - COALESCE(c.total_cost, 0) AS net_revenue
  FROM public.bookings b
  LEFT JOIN costs c ON c.booking_id = b.id
  WHERE b.status IN ('confirmed', 'completed')
)
SELECT
  ROUND(AVG(net_revenue), 2) AS avg_net_revenue,
  ROUND(AVG(net_revenue / NULLIF(price, 0)) * 100, 2) AS avg_margin_percentage,
  COUNT(*) FILTER (WHERE net_revenue < 0) AS loss_making_shoots,
  COUNT(*) AS total_shoots
FROM economics;
$$;

GRANT EXECUTE ON FUNCTION public.get_booking_unit_economics() TO authenticated;

-- Monthly net profit & growth (this is gold)
CREATE OR REPLACE FUNCTION public.get_monthly_profit_analytics()
RETURNS TABLE (
  net_profit_this_month NUMERIC,
  net_profit_last_month NUMERIC,
  net_growth_percentage NUMERIC
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
),
monthly AS (
  SELECT
    date_trunc('month', b.date) AS month,
    SUM(b.price - COALESCE(c.total_cost, 0)) AS net_profit
  FROM public.bookings b
  LEFT JOIN costs c ON c.booking_id = b.id
  WHERE b.status IN ('confirmed', 'completed')
  GROUP BY 1
),
refs AS (
  SELECT
    date_trunc('month', CURRENT_DATE) AS current_month,
    date_trunc('month', CURRENT_DATE) - INTERVAL '1 month' AS last_month
)
SELECT
  MAX(net_profit) FILTER (WHERE month = r.current_month) AS net_profit_this_month,
  MAX(net_profit) FILTER (WHERE month = r.last_month) AS net_profit_last_month,
  CASE
    WHEN MAX(net_profit) FILTER (WHERE month = r.last_month) = 0 THEN NULL
    ELSE ROUND(
      (
        MAX(net_profit) FILTER (WHERE month = r.current_month)
        -
        MAX(net_profit) FILTER (WHERE month = r.last_month)
      )
      /
      MAX(net_profit) FILTER (WHERE month = r.last_month)
      * 100,
      2
    )
  END AS net_growth_percentage
FROM monthly
CROSS JOIN refs r;
$$;

GRANT EXECUTE ON FUNCTION public.get_monthly_profit_analytics() TO authenticated;
