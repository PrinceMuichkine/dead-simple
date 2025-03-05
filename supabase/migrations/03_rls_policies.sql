-- Create RLS policies

-- Merchants table policies
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants can view their own profile"
  ON merchants FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Merchants can update their own profile"
  ON merchants FOR UPDATE
  USING (auth.uid() = id);

-- Customers table policies
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view their own profile"
  ON customers FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Customers can update their own profile"
  ON customers FOR UPDATE
  USING (auth.uid() = id);

-- Stores table policies
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Stores are viewable by everyone"
  ON stores FOR SELECT
  USING (true);

CREATE POLICY "Stores can be created by merchants"
  ON stores FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM merchants
    WHERE merchants.id = auth.uid()
  ));

CREATE POLICY "Stores can be updated by their owners or admins"
  ON stores FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM merchant_stores
    WHERE merchant_stores.store_id = id
    AND merchant_stores.merchant_id = auth.uid()
    AND merchant_stores.role IN ('owner')
  ));

-- Merchant_stores table policies
ALTER TABLE merchant_stores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Store owners can view their store staff"
  ON merchant_stores FOR SELECT
  USING (
    merchant_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM merchant_stores ms
      WHERE ms.store_id = store_id
      AND ms.merchant_id = auth.uid()
      AND ms.role = 'owner'
    )
  );

CREATE POLICY "Store owners can manage their store staff"
  ON merchant_stores FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM merchant_stores ms
      WHERE ms.store_id = store_id
      AND ms.merchant_id = auth.uid()
      AND ms.role = 'owner'
    )
  );

-- Payment providers table policies
ALTER TABLE payment_providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Payment providers are viewable by everyone"
  ON payment_providers FOR SELECT
  USING (true);

-- Store payment providers table policies
ALTER TABLE store_payment_providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Store payment providers are viewable by store owners and admins"
  ON store_payment_providers FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM merchant_stores
    WHERE merchant_stores.store_id = store_id
    AND merchant_stores.merchant_id = auth.uid()
    AND merchant_stores.role IN ('owner')
  ));

CREATE POLICY "Store payment providers can be managed by store owners"
  ON store_payment_providers FOR ALL
  USING (EXISTS (
    SELECT 1 FROM merchant_stores
    WHERE merchant_stores.store_id = store_id
    AND merchant_stores.merchant_id = auth.uid()
    AND merchant_stores.role = 'owner'
  ));

-- Bank accounts table policies
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bank accounts are viewable by their owners"
  ON bank_accounts FOR SELECT
  USING (merchant_id = auth.uid());

CREATE POLICY "Bank accounts can be managed by their owners"
  ON bank_accounts FOR ALL
  USING (merchant_id = auth.uid());

-- Merchant accounts table policies
ALTER TABLE merchant_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchant accounts are viewable by their owners and store owners"
  ON merchant_accounts FOR SELECT
  USING (
    merchant_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM merchant_stores
      WHERE merchant_stores.store_id = store_id
      AND merchant_stores.merchant_id = auth.uid()
      AND merchant_stores.role = 'owner'
    )
  );

-- Account transactions table policies
ALTER TABLE account_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Account transactions are viewable by account owners"
  ON account_transactions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM merchant_accounts
    WHERE merchant_accounts.id = account_id
    AND (
      merchant_accounts.merchant_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM merchant_stores
        WHERE merchant_stores.store_id = merchant_accounts.store_id
        AND merchant_stores.merchant_id = auth.uid()
        AND merchant_stores.role = 'owner'
      )
    )
  ));

-- Products table policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Products can be created by store staff"
  ON products FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM merchant_stores
    WHERE merchant_stores.store_id = store_id
    AND merchant_stores.merchant_id = auth.uid()
  ));

CREATE POLICY "Products can be updated by store staff"
  ON products FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM merchant_stores
    WHERE merchant_stores.store_id = store_id
    AND merchant_stores.merchant_id = auth.uid()
  ));

CREATE POLICY "Products can be deleted by store staff"
  ON products FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM merchant_stores
    WHERE merchant_stores.store_id = store_id
    AND merchant_stores.merchant_id = auth.uid()
  ));

-- Product images table policies
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Product images are viewable by everyone"
  ON product_images FOR SELECT
  USING (true);

CREATE POLICY "Product images can be managed by product owners"
  ON product_images FOR ALL
  USING (EXISTS (
    SELECT 1 FROM products
    JOIN merchant_stores ON products.store_id = merchant_stores.store_id
    WHERE products.id = product_id
    AND merchant_stores.merchant_id = auth.uid()
  ));

-- Discounts table policies
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Discounts are viewable by everyone"
  ON discounts FOR SELECT
  USING (true);

CREATE POLICY "Discounts can be managed by store owners"
  ON discounts FOR ALL
  USING (EXISTS (
    SELECT 1 FROM merchant_stores
    WHERE merchant_stores.store_id = store_id
    AND merchant_stores.merchant_id = auth.uid()
    AND merchant_stores.role = 'owner'
  ));

-- Product variants policies
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Product variants are viewable by everyone"
  ON product_variants FOR SELECT
  USING (true);

CREATE POLICY "Product variants can be managed by store staff"
  ON product_variants FOR ALL
  USING (EXISTS (
    SELECT 1 FROM products
    JOIN merchant_stores ON products.store_id = merchant_stores.store_id
    WHERE products.id = product_id
    AND merchant_stores.merchant_id = auth.uid()
  ));

-- Orders table policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants can view orders for their stores"
  ON orders FOR SELECT
  USING (
    store_id IN (
      SELECT store_id FROM merchant_stores
      WHERE merchant_id = auth.uid()
    )
    OR customer_id = auth.uid()
  );

CREATE POLICY "Customers can create orders"
  ON orders FOR INSERT
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Orders can be updated by store staff or the customer"
  ON orders FOR UPDATE
  USING (
    (EXISTS (
      SELECT 1 FROM merchant_stores
      WHERE merchant_stores.store_id = store_id
      AND merchant_stores.merchant_id = auth.uid()
    ))
    OR customer_id = auth.uid()
  );

-- Order items policies
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Order items are viewable by order participants"
  ON order_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM orders
    LEFT JOIN merchant_stores ON orders.store_id = merchant_stores.store_id
    WHERE orders.id = order_id
    AND (merchant_stores.merchant_id = auth.uid() OR orders.customer_id = auth.uid())
  ));

-- Refunds table policies
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Refunds are viewable by order participants"
  ON refunds FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM orders
    LEFT JOIN merchant_stores ON orders.store_id = merchant_stores.store_id
    WHERE orders.id = order_id
    AND (merchant_stores.merchant_id = auth.uid() OR orders.customer_id = auth.uid())
  ));

CREATE POLICY "Refunds can be created by store owners"
  ON refunds FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM orders
    JOIN merchant_stores ON orders.store_id = merchant_stores.store_id
    WHERE orders.id = order_id
    AND merchant_stores.merchant_id = auth.uid()
    AND merchant_stores.role = 'owner'
  ));

CREATE POLICY "Refunds can be updated by store owners"
  ON refunds FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM orders
    JOIN merchant_stores ON orders.store_id = merchant_stores.store_id
    WHERE orders.id = order_id
    AND merchant_stores.merchant_id = auth.uid()
    AND merchant_stores.role = 'owner'
  ));

-- Reviews table policies
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Reviews can be created by customers"
  ON reviews FOR INSERT
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Reviews can be updated by their authors"
  ON reviews FOR UPDATE
  USING (customer_id = auth.uid());

-- Customer favorites policies
ALTER TABLE customer_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Favorites are viewable by their owners"
  ON customer_favorites FOR SELECT
  USING (customer_id = auth.uid());

CREATE POLICY "Favorites can be managed by their owners"
  ON customer_favorites FOR ALL
  USING (customer_id = auth.uid());

-- Feedback table policies
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Feedback is viewable by its author"
  ON feedback FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Feedback can be created by any authenticated user"
  ON feedback FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Support requests table policies
ALTER TABLE support_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Support requests are viewable by their creators"
  ON support_requests FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Support requests can be created by any authenticated user"
  ON support_requests FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Customer messages table policies
ALTER TABLE customer_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants can view messages addressed to them"
  ON customer_messages FOR SELECT
  USING (merchant_id = auth.uid() OR
         EXISTS (
           SELECT 1 FROM merchant_stores
           WHERE merchant_stores.store_id = customer_messages.store_id
           AND merchant_stores.merchant_id = auth.uid()
         ));

CREATE POLICY "Anyone can create customer messages"
  ON customer_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Merchants can update messages addressed to them"
  ON customer_messages FOR UPDATE
  USING (merchant_id = auth.uid() OR
         EXISTS (
           SELECT 1 FROM merchant_stores
           WHERE merchant_stores.store_id = customer_messages.store_id
           AND merchant_stores.merchant_id = auth.uid()
         ));

-- Notifications policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Notifications are viewable by their recipients"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Notifications can be updated by their recipients"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());