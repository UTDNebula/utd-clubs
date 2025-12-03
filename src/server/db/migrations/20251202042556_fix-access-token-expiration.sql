-- Custom SQL migration file, put your code below! --

ALTER TABLE account
ALTER COLUMN access_token_expires_at TYPE TIMESTAMP
USING TO_TIMESTAMP(access_token_expires_at);
