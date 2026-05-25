/*
  # Create Audits and Leads Tables

  1. New Tables
    - `audits`
      - `id` (uuid, primary key)
      - `slug` (text, unique) - unique shareable URL identifier
      - `form_data` (jsonb) - audit form data with tools and settings
      - `recommendations` (jsonb) - calculated recommendations
      - `total_current_monthly_spend` (numeric) - current total spend
      - `total_optimized_monthly_spend` (numeric) - optimized total spend
      - `total_monthly_savings` (numeric) - monthly savings
      - `total_annual_savings` (numeric) - annual savings
      - `ai_summary` (text) - AI-generated summary
      - `is_optimized` (boolean) - whether stack is already efficient
      - `created_at` (timestamp)
    - `leads`
      - `id` (uuid, primary key)
      - `email` (text)
      - `company_name` (text)
      - `role` (text)
      - `team_size` (integer)
      - `audit_id` (uuid, foreign key to audits)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on both tables
    - Policies allow public inserts for audits (for form submission)
    - Policies allow public reads of audits by slug (for sharing)
    - Leads are only readable by service role (private)
*/

CREATE TABLE IF NOT EXISTS audits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  form_data jsonb NOT NULL,
  recommendations jsonb NOT NULL DEFAULT '[]'::jsonb,
  total_current_monthly_spend numeric NOT NULL DEFAULT 0,
  total_optimized_monthly_spend numeric NOT NULL DEFAULT 0,
  total_monthly_savings numeric NOT NULL DEFAULT 0,
  total_annual_savings numeric NOT NULL DEFAULT 0,
  ai_summary text DEFAULT '',
  is_optimized boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  company_name text NOT NULL,
  role text NOT NULL,
  team_size integer NOT NULL,
  audit_id uuid NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_audits_slug ON audits(slug);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_audits_created_at ON audits(created_at DESC);

-- Create index on audit_id for leads
CREATE INDEX IF NOT EXISTS idx_leads_audit_id ON leads(audit_id);

-- Enable RLS
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Audits: Allow public inserts (for form submission)
CREATE POLICY "Anyone can create audits"
  ON audits FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Audits: Allow public reads by slug (for sharing)
CREATE POLICY "Anyone can read audits by slug"
  ON audits FOR SELECT
  TO anon, authenticated
  USING (true);

-- Leads: Only service role can read (private data)
CREATE POLICY "Service role can manage leads"
  ON leads FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Leads: Allow public inserts (for lead capture)
CREATE POLICY "Anyone can create leads"
  ON leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
