-- Fixit247BM job-media Storage bucket and policies.
-- The app stores public media URLs, so reads are public while writes are scoped to each signed-in user's folder.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'job-media',
  'job-media',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public read job media" ON storage.objects;
CREATE POLICY "Public read job media"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'job-media');

DROP POLICY IF EXISTS "Authenticated users upload own job media" ON storage.objects;
CREATE POLICY "Authenticated users upload own job media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'job-media'
    AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
  );

DROP POLICY IF EXISTS "Authenticated users update own job media" ON storage.objects;
CREATE POLICY "Authenticated users update own job media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'job-media'
    AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
  )
  WITH CHECK (
    bucket_id = 'job-media'
    AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
  );

DROP POLICY IF EXISTS "Authenticated users delete own job media" ON storage.objects;
CREATE POLICY "Authenticated users delete own job media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'job-media'
    AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
  );
