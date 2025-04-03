/*
  # Create scans table for storing rock analysis results

  1. New Tables
    - `scans`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `image_url` (text)
      - `analysis` (jsonb)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `scans` table
    - Add policies for authenticated users to:
      - Insert their own scans
      - Read their own scans
*/

CREATE TABLE IF NOT EXISTS scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  image_url text NOT NULL,
  analysis jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own scans"
  ON scans
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own scans"
  ON scans
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX scans_user_id_idx ON scans(user_id);
CREATE INDEX scans_created_at_idx ON scans(created_at DESC);