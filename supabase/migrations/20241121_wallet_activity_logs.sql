-- Activity logs for custodial wallet actions and basic auditing

CREATE TABLE IF NOT EXISTS wallet_activity_logs (
    id bigserial PRIMARY KEY,
    user_id uuid NOT NULL,
    wallet_id uuid NOT NULL REFERENCES user_wallets(id) ON DELETE CASCADE,
    action text NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS wallet_activity_logs_wallet_idx ON wallet_activity_logs (wallet_id, action, created_at);
CREATE INDEX IF NOT EXISTS wallet_activity_logs_user_idx ON wallet_activity_logs (user_id, created_at);

ALTER TABLE wallet_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No direct access to wallet logs"
ON wallet_activity_logs
FOR ALL
USING (false)
WITH CHECK (false);

