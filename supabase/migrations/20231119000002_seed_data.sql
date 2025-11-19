-- Seed customers
INSERT INTO customers (name, phone, type) VALUES
  ('Ali Muse Fatah', '+254700000001', 'customer'),
  ('Bahjo', '+254700000002', 'customer'),
  ('Ibrahim Alshifa', '+254700000003', 'customer'),
  ('Sarif', '+254700000004', 'agent'),
  ('Abdibasid', '+254700000005', 'customer');

-- Seed forex rates
INSERT INTO forex_rates (date, usd_to_kes, kes_to_usd) VALUES
  ('2025-11-16', 129.50, 0.0077),
  ('2025-11-17', 129.75, 0.0077),
  ('2025-11-18', 130.00, 0.0077),
  ('2025-11-19', 130.25, 0.0077);

-- Seed sample transactions for November 16-18, 2025
-- Get customer IDs
DO $$
DECLARE
  ali_id UUID;
  bahjo_id UUID;
  ibrahim_id UUID;
  sarif_id UUID;
  abdibasid_id UUID;
BEGIN
  SELECT id INTO ali_id FROM customers WHERE name = 'Ali Muse Fatah';
  SELECT id INTO bahjo_id FROM customers WHERE name = 'Bahjo';
  SELECT id INTO ibrahim_id FROM customers WHERE name = 'Ibrahim Alshifa';
  SELECT id INTO sarif_id FROM customers WHERE name = 'Sarif';
  SELECT id INTO abdibasid_id FROM customers WHERE name = 'Abdibasid';

  -- November 16, 2025 transactions
  INSERT INTO transactions (date, customer_id, channel, amount_in, amount_out, currency, remarks) VALUES
    ('2025-11-16', ali_id, 'MPESA', 50000, 0, 'KES', 'Deposit via M-PESA'),
    ('2025-11-16', bahjo_id, 'Cash', 25000, 0, 'KES', 'Cash deposit'),
    ('2025-11-16', ibrahim_id, 'Taaj', 0, 15000, 'KES', 'Money transfer to Somalia'),
    ('2025-11-16', NULL, 'Cash', 10000, 0, 'KES', 'Unclaimed deposit'),
    ('2025-11-16', sarif_id, 'Forex', 100, 0, 'USD', 'USD purchase');

  -- November 17, 2025 transactions
  INSERT INTO transactions (date, customer_id, channel, amount_in, amount_out, currency, remarks) VALUES
    ('2025-11-17', ali_id, 'Cash', 0, 20000, 'KES', 'Withdrawal'),
    ('2025-11-17', abdibasid_id, 'MPESA', 35000, 0, 'KES', 'M-PESA deposit'),
    ('2025-11-17', ibrahim_id, 'Forex', 50, 0, 'USD', 'USD exchange'),
    ('2025-11-17', bahjo_id, 'Taaj', 0, 12000, 'KES', 'Transfer to Dubai'),
    ('2025-11-17', NULL, 'Cash', 8000, 0, 'KES', 'Unclaimed cash');

  -- November 18, 2025 transactions
  INSERT INTO transactions (date, customer_id, channel, amount_in, amount_out, currency, remarks) VALUES
    ('2025-11-18', sarif_id, 'MPESA', 45000, 0, 'KES', 'Agent collection'),
    ('2025-11-18', ali_id, 'Cash', 0, 10000, 'KES', 'Cash withdrawal'),
    ('2025-11-18', ibrahim_id, 'Forex', 0, 30, 'USD', 'USD sale'),
    ('2025-11-18', abdibasid_id, 'Taaj', 0, 18000, 'KES', 'International transfer'),
    ('2025-11-18', bahjo_id, 'Cash', 30000, 0, 'KES', 'Deposit');

END $$;
