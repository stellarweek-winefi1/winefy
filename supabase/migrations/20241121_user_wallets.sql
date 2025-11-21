-- Custodial user wallets table for invisible wallet flow

CREATE TABLE IF NOT EXISTS user_wallets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
    public_key text NOT NULL UNIQUE,
    secret_encrypted text NOT NULL,
    wallet_provider text NOT NULL DEFAULT 'vinefi_custodial',
    network text NOT NULL DEFAULT 'stellar',
    created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
    last_used_at timestamptz,
    metadata jsonb DEFAULT '{}'::jsonb
);

CREATE UNIQUE INDEX IF NOT EXISTS user_wallets_user_id_idx ON user_wallets (user_id);

ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can never access wallet rows directly"
ON user_wallets
FOR ALL
USING (false)
WITH CHECK (false);

