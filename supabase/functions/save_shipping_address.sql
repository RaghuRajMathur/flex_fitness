
-- Function to save shipping address and return its ID
CREATE OR REPLACE FUNCTION public.save_shipping_address(
  user_id UUID,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT
) RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  address_id UUID;
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
    user_id,
    first_name,
    last_name,
    email,
    phone,
    address,
    city,
    state,
    zip_code
  ) RETURNING id INTO address_id;
  
  RETURN address_id;
END;
$$;
