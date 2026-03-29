-- Allow all inserts on analyses (for backend/service role)
CREATE POLICY "Allow all inserts for backend"
  ON "analyses"
  FOR INSERT
  WITH CHECK (true);
