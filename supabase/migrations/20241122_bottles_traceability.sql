-- VineFi Bottle Traceability Schema
-- Migration: 20241122_bottles_traceability.sql

-- Simplified wine_lots table (for grouping reference only)
-- Keep existing wine_lots table but mark investment-related fields as optional/deprecated
ALTER TABLE IF EXISTS wine_lots 
  DROP COLUMN IF EXISTS price_per_bottle_usd,
  DROP COLUMN IF EXISTS distribution_public_key,
  DROP COLUMN IF EXISTS distribution_secret_encrypted,
  DROP COLUMN IF EXISTS distribution_tx_hash,
  DROP COLUMN IF EXISTS distributed_at,
  DROP COLUMN IF EXISTS platform_fee_bps;

ALTER TABLE IF EXISTS wine_lots 
  ADD COLUMN IF NOT EXISTS lot_id text,
  ADD COLUMN IF NOT EXISTS total_bottles integer DEFAULT 0;

-- Create bottles table for individual bottle tracking
CREATE TABLE IF NOT EXISTS bottles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    bottle_id text NOT NULL UNIQUE,  -- e.g., "MALBEC-2024-001-0001"
    lot_id text NOT NULL,
    bottle_number integer NOT NULL,
    winery_address text NOT NULL,
    current_owner_address text NOT NULL,
    wine_name text NOT NULL,
    vintage integer NOT NULL,
    region text,
    country text,
    metadata_uri text,  -- IPFS reference for rich metadata
    qr_code text UNIQUE,  -- Generated QR code for scanning
    stellar_token_address text,  -- If we create a unique token per bottle
    created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
    updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS bottles_bottle_id_idx ON bottles (bottle_id);
CREATE INDEX IF NOT EXISTS bottles_lot_id_idx ON bottles (lot_id);
CREATE INDEX IF NOT EXISTS bottles_qr_code_idx ON bottles (qr_code);
CREATE INDEX IF NOT EXISTS bottles_current_owner_idx ON bottles (current_owner_address);
CREATE INDEX IF NOT EXISTS bottles_winery_idx ON bottles (winery_address);

-- Create traceability_events table for event logging
CREATE TABLE IF NOT EXISTS traceability_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    bottle_id uuid NOT NULL REFERENCES bottles(id) ON DELETE CASCADE,
    event_type text NOT NULL CHECK (event_type IN ('bottling', 'shipped', 'received', 'scanned')),
    actor_address text NOT NULL,
    description text,
    on_chain_tx_hash text,  -- Stellar transaction hash if logged on-chain
    timestamp timestamptz NOT NULL DEFAULT timezone('utc', now()),
    created_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS traceability_events_bottle_id_idx ON traceability_events (bottle_id);
CREATE INDEX IF NOT EXISTS traceability_events_event_type_idx ON traceability_events (event_type);
CREATE INDEX IF NOT EXISTS traceability_events_timestamp_idx ON traceability_events (timestamp DESC);
CREATE INDEX IF NOT EXISTS traceability_events_actor_idx ON traceability_events (actor_address);

-- Create qr_code_mapping table for fast QR lookups
CREATE TABLE IF NOT EXISTS qr_code_mapping (
    qr_code text PRIMARY KEY,
    bottle_id uuid NOT NULL REFERENCES bottles(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS qr_code_mapping_bottle_id_idx ON qr_code_mapping (bottle_id);

-- View for bottle traceability (bottles + latest event)
CREATE OR REPLACE VIEW bottle_traceability_view AS
SELECT
    b.id AS bottle_db_id,
    b.bottle_id,
    b.lot_id,
    b.bottle_number,
    b.winery_address,
    b.current_owner_address,
    b.wine_name,
    b.vintage,
    b.region,
    b.country,
    b.metadata_uri,
    b.qr_code,
    b.stellar_token_address,
    b.created_at AS bottle_created_at,
    b.updated_at AS bottle_updated_at,
    (
        SELECT event_type
        FROM traceability_events te
        WHERE te.bottle_id = b.id
        ORDER BY te.timestamp DESC
        LIMIT 1
    ) AS latest_event_type,
    (
        SELECT timestamp
        FROM traceability_events te
        WHERE te.bottle_id = b.id
        ORDER BY te.timestamp DESC
        LIMIT 1
    ) AS latest_event_timestamp,
    (
        SELECT COUNT(*)
        FROM traceability_events te
        WHERE te.bottle_id = b.id
    ) AS event_count
FROM bottles b;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_bottles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bottles_updated_at_trigger
    BEFORE UPDATE ON bottles
    FOR EACH ROW
    EXECUTE FUNCTION update_bottles_updated_at();

-- Deprecate old views (keep for backward compatibility but mark as deprecated)
COMMENT ON VIEW wine_marketplace_view IS 'DEPRECATED: Use bottle_traceability_view instead';
COMMENT ON VIEW wine_portfolio_view IS 'DEPRECATED: Use bottle_traceability_view instead';

