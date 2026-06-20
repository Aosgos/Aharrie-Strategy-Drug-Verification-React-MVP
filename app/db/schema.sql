-- Aharrie Strategy — Supabase Schema
-- Paste into: Supabase → Database → SQL Editor → New query → Run

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('patient','pharmacist')),
  pharmacy_name TEXT, pcn_licence TEXT,
  subscription_plan TEXT CHECK (subscription_plan IN ('basic','professional','enterprise')),
  subscription_expiry TIMESTAMPTZ, is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS drugs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nafdac_number TEXT NOT NULL, batch_number TEXT NOT NULL, brand_name TEXT NOT NULL,
  generic_name TEXT NOT NULL, category TEXT NOT NULL, strength TEXT NOT NULL, form TEXT NOT NULL,
  manufacturer TEXT NOT NULL, country_of_origin TEXT NOT NULL, expiry_date TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('authentic','suspicious','counterfeit','expired','unregistered')),
  nafdac_registered BOOLEAN NOT NULL DEFAULT FALSE, database_match TEXT NOT NULL,
  recall_status TEXT NOT NULL, qr_integrity INTEGER NOT NULL DEFAULT 0, price_range_ngn TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), UNIQUE(nafdac_number, batch_number)
);
CREATE INDEX IF NOT EXISTS idx_drugs_nafdac ON drugs(nafdac_number);
CREATE INDEX IF NOT EXISTS idx_drugs_batch  ON drugs(batch_number);
CREATE INDEX IF NOT EXISTS idx_drugs_status ON drugs(status);

CREATE TABLE IF NOT EXISTS scan_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  qr_code TEXT NOT NULL, drug_name TEXT NOT NULL, batch_number TEXT NOT NULL,
  nafdac_number TEXT NOT NULL, status TEXT NOT NULL, scanned_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_scan_history_user ON scan_history(user_id);

CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  drug_name TEXT NOT NULL, batch_number TEXT NOT NULL, nafdac_number TEXT, location TEXT NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('fake_packaging','wrong_appearance','no_effect','bad_reaction')),
  details TEXT, status TEXT DEFAULT 'pending' CHECK (status IN ('pending','reviewed','escalated','closed')),
  ref_code TEXT UNIQUE NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pharmacies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL, address TEXT NOT NULL, state TEXT NOT NULL, lga TEXT,
  verified BOOLEAN DEFAULT FALSE, pcn_licence TEXT, trust_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE users        ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports      ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read drugs"      ON drugs      FOR SELECT USING (true);
CREATE POLICY "Public can read pharmacies" ON pharmacies FOR SELECT USING (true);
