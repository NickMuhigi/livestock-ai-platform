-- Enable RLS on analyses table and allow authenticated user inserts
ALTER TABLE "analyses" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow user inserts on analyses"
  ON "analyses"
  FOR INSERT
  WITH CHECK (auth.uid() = "userId");
