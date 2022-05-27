CREATE TABLE IF NOT EXISTS users(
    id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(128) NOT NULL,
    email VARCHAR(320) NOT NULL,
    balance DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nfts(
    id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    description VARCHAR(1024) NOT NULL DEFAULT '',
    price DECIMAL(10, 2) NOT NULL,
    path VARCHAR(2048) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    owner_id uuid,

    CONSTRAINT fk_owner
      FOREIGN KEY(owner_id) 
	    REFERENCES users(id)
            ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS users_nfts(
    nft_id uuid,
    user_id uuid,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY(nft_id, user_id),

    CONSTRAINT fk_nft
      FOREIGN KEY(nft_id) 
	    REFERENCES nfts(id)
            ON DELETE CASCADE,

    CONSTRAINT fk_user
      FOREIGN KEY(user_id) 
	    REFERENCES users(id)
            ON DELETE CASCADE
);

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON nfts
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users_nfts
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
