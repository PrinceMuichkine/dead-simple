-- Create storage buckets for different types of media
INSERT INTO storage.buckets (id, name, public, avif_autodetection)
VALUES
  ('avatars', 'avatars', true, false),
  ('logos', 'logos', true, false),
  ('products', 'products', true, false),
  ('banners', 'banners', true, false)
ON CONFLICT (id) DO NOTHING;

-- Set up security policies for the avatars bucket
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid() = (storage.foldername(name))[1]::uuid
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.uid() = (storage.foldername(name))[1]::uuid
  );

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    auth.uid() = (storage.foldername(name))[1]::uuid
  );

-- Set up security policies for the logos bucket
CREATE POLICY "Logo images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'logos');

CREATE POLICY "Store owners can upload logos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'logos' AND
    EXISTS (
      SELECT 1 FROM merchant_stores
      WHERE merchant_stores.store_id = (storage.foldername(name))[1]::uuid
      AND merchant_stores.merchant_id = auth.uid()
      AND merchant_stores.role = 'owner'
    )
  );

CREATE POLICY "Store owners can update logos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'logos' AND
    EXISTS (
      SELECT 1 FROM merchant_stores
      WHERE merchant_stores.store_id = (storage.foldername(name))[1]::uuid
      AND merchant_stores.merchant_id = auth.uid()
      AND merchant_stores.role = 'owner'
    )
  );

CREATE POLICY "Store owners can delete logos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'logos' AND
    EXISTS (
      SELECT 1 FROM merchant_stores
      WHERE merchant_stores.store_id = (storage.foldername(name))[1]::uuid
      AND merchant_stores.merchant_id = auth.uid()
      AND merchant_stores.role = 'owner'
    )
  );

-- Set up security policies for the products bucket
CREATE POLICY "Product images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

CREATE POLICY "Store staff can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'products' AND
    EXISTS (
      SELECT 1 FROM products
      JOIN merchant_stores ON products.store_id = merchant_stores.store_id
      WHERE products.id = (storage.foldername(name))[1]::uuid
      AND merchant_stores.merchant_id = auth.uid()
    )
  );

CREATE POLICY "Store staff can update product images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'products' AND
    EXISTS (
      SELECT 1 FROM products
      JOIN merchant_stores ON products.store_id = merchant_stores.store_id
      WHERE products.id = (storage.foldername(name))[1]::uuid
      AND merchant_stores.merchant_id = auth.uid()
    )
  );

CREATE POLICY "Store staff can delete product images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'products' AND
    EXISTS (
      SELECT 1 FROM products
      JOIN merchant_stores ON products.store_id = merchant_stores.store_id
      WHERE products.id = (storage.foldername(name))[1]::uuid
      AND merchant_stores.merchant_id = auth.uid()
    )
  );

-- Set up security policies for the banners bucket
CREATE POLICY "Banner images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'banners');

CREATE POLICY "Store owners can upload banner images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'banners' AND
    EXISTS (
      SELECT 1 FROM merchant_stores
      WHERE merchant_stores.store_id = (storage.foldername(name))[1]::uuid
      AND merchant_stores.merchant_id = auth.uid()
      AND merchant_stores.role = 'owner'
    )
  );

CREATE POLICY "Store owners can update banner images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'banners' AND
    EXISTS (
      SELECT 1 FROM merchant_stores
      WHERE merchant_stores.store_id = (storage.foldername(name))[1]::uuid
      AND merchant_stores.merchant_id = auth.uid()
      AND merchant_stores.role = 'owner'
    )
  );

CREATE POLICY "Store owners can delete banner images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'banners' AND
    EXISTS (
      SELECT 1 FROM merchant_stores
      WHERE merchant_stores.store_id = (storage.foldername(name))[1]::uuid
      AND merchant_stores.merchant_id = auth.uid()
      AND merchant_stores.role = 'owner'
    )
  ); 