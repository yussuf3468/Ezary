-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT,
  type TEXT NOT NULL CHECK (type IN ('agent', 'customer', 'staff')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  channel TEXT NOT NULL CHECK (channel IN ('MPESA', 'Taaj', 'Forex', 'Cash')),
  amount_in NUMERIC(12, 2) NOT NULL DEFAULT 0,
  amount_out NUMERIC(12, 2) NOT NULL DEFAULT 0,
  balance_after NUMERIC(12, 2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL CHECK (currency IN ('KES', 'USD')),
  remarks TEXT,
  is_unclaimed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forex_rates table
CREATE TABLE forex_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL UNIQUE DEFAULT CURRENT_DATE,
  usd_to_kes NUMERIC(12, 2) NOT NULL,
  kes_to_usd NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shop_balances table
CREATE TABLE shop_balances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  currency TEXT NOT NULL UNIQUE CHECK (currency IN ('KES', 'USD')),
  total_balance NUMERIC(12, 2) NOT NULL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Initialize shop balances
INSERT INTO shop_balances (currency, total_balance) VALUES
  ('KES', 0),
  ('USD', 0);

-- Create indexes for better performance
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_customer_id ON transactions(customer_id);
CREATE INDEX idx_transactions_currency ON transactions(currency);
CREATE INDEX idx_transactions_unclaimed ON transactions(is_unclaimed);
CREATE INDEX idx_customers_type ON customers(type);
CREATE INDEX idx_forex_rates_date ON forex_rates(date);

-- Function to update balance after transaction
CREATE OR REPLACE FUNCTION update_balances_after_transaction()
RETURNS TRIGGER AS $$
DECLARE
  last_balance NUMERIC(12, 2);
  net_amount NUMERIC(12, 2);
BEGIN
  -- Calculate net amount (in - out)
  net_amount := NEW.amount_in - NEW.amount_out;
  
  -- Get the last balance for this currency
  SELECT COALESCE(
    (SELECT balance_after 
     FROM transactions 
     WHERE currency = NEW.currency 
       AND id != NEW.id
     ORDER BY created_at DESC, date DESC 
     LIMIT 1),
    (SELECT total_balance FROM shop_balances WHERE currency = NEW.currency),
    0
  ) INTO last_balance;
  
  -- Set the new balance
  NEW.balance_after := last_balance + net_amount;
  
  -- Update shop balance
  UPDATE shop_balances
  SET total_balance = total_balance + net_amount,
      last_updated = NOW()
  WHERE currency = NEW.currency;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new transactions
CREATE TRIGGER trigger_update_balances_on_insert
BEFORE INSERT ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_balances_after_transaction();

-- Function to recalculate all balances (for maintenance)
CREATE OR REPLACE FUNCTION recalculate_all_balances()
RETURNS void AS $$
DECLARE
  curr TEXT;
  running_balance NUMERIC(12, 2);
  trans RECORD;
BEGIN
  FOR curr IN SELECT DISTINCT currency FROM transactions LOOP
    running_balance := 0;
    
    FOR trans IN 
      SELECT id, amount_in, amount_out
      FROM transactions
      WHERE currency = curr
      ORDER BY date, created_at
    LOOP
      running_balance := running_balance + trans.amount_in - trans.amount_out;
      
      UPDATE transactions
      SET balance_after = running_balance
      WHERE id = trans.id;
    END LOOP;
    
    -- Update shop balance
    UPDATE shop_balances
    SET total_balance = running_balance,
        last_updated = NOW()
    WHERE currency = curr;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE forex_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_balances ENABLE ROW LEVEL SECURITY;

-- Create policies (authenticated users can do everything for now)
CREATE POLICY "Allow authenticated users full access to customers"
  ON customers FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to transactions"
  ON transactions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to forex_rates"
  ON forex_rates FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to shop_balances"
  ON shop_balances FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
