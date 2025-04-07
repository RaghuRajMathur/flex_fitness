
CREATE OR REPLACE FUNCTION public.create_shipping_address(
  p_user_id UUID,
  p_first_name TEXT,
  p_last_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_address TEXT,
  p_city TEXT,
  p_state TEXT,
  p_zip_code TEXT
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_address_id UUID;
BEGIN
  INSERT INTO public.shipping_addresses (
    user_id,
    first_name,
    last_name,
    email,
    phone,
    address,
    city,
    state,
    zip_code
  ) VALUES (
    p_user_id,
    p_first_name,
    p_last_name,
    p_email,
    p_phone,
    p_address,
    p_city,
    p_state,
    p_zip_code
  )
  RETURNING id INTO v_address_id;
  
  RETURN v_address_id;
END;
$$;
