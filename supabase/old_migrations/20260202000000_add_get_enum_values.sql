-- Create a helper function to return enum values as text[] for UI consumption
-- Usage: SELECT get_enum_values('client_status');

CREATE OR REPLACE FUNCTION public.get_enum_values(enum_name TEXT)
RETURNS TEXT[]
LANGUAGE plpgsql
AS $$
DECLARE
  result TEXT[];
BEGIN
  -- Use %I to safely interpolate identifier (enum type name)
  EXECUTE format('SELECT enum_range(NULL::public.%I)', enum_name) INTO result;
  RETURN result;
END;
$$
STABLE;

-- Grant execute to anon (if needed) or manage via policies as appropriate
-- GRANT EXECUTE ON FUNCTION public.get_enum_values(TEXT) TO anon;
