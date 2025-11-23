# WineFi Smart Contracts

Soroban smart contracts for wine tokenization and traceability on the Stellar blockchain. This repository contains two contract systems: a **Simple Wine Token System** (recommended for wine tracking) and a **Complex Vault System** (for DeFi wine investments).

## Quick Comparison

| Feature | Simple Wine Token | Complex Vault System |
|---------|------------------|----------------------|
| **Purpose** | Tokenize wine lots | Tokenized wine investment funds |
| **Complexity** | ⭐ Simple | ⭐⭐⭐⭐⭐ Complex |
| **Use Case** | Wine ownership tracking | DeFi wine investments |
| **Dependencies** | None | Soroswap, Strategies |
| **Contracts** | 2 (Factory + Token) | 3 (Factory + Vault + Common) |
| **Deployment** | `./deploy_wine_token.sh` | `./deploy_winefi.sh` |
| **Recommended For** | Wine tracking, authenticity | Investment platforms |

## Which System Should You Use?

### Use **Simple Wine Token** if you want to:
- ✅ Tokenize wine lots
- ✅ Track wine ownership
- ✅ Build a simple wine marketplace
- ✅ Verify authenticity
- ✅ Enable fractional ownership
- ✅ **Keep it simple**

### Use **Complex Vault System** if you want to:
- 🏦 Build a wine investment platform
- 📈 Implement yield strategies
- 💱 Integrate with DEXs
- 🔄 Auto-rebalance portfolios
- ⚠️ **Ready for complexity**

**For most wine tokenization use cases, we recommend the Simple Wine Token system.**

---

## Simple Wine Token System

### Overview

The Simple Wine Token system consists of two contracts:

1. **Wine Factory** (`wine_factory/`) - Deploys new wine token contracts
2. **Wine Token** (`wine_token/`) - Individual wine lot tokens with embedded metadata

Each wine lot token represents a specific wine lot (e.g., 1000 bottles of Malbec 2024) and includes rich metadata about the wine.

### Structure

```
contracts/
├── wine_factory/          # Factory contract
├── wine_token/            # Wine token contract
├── common/                 # Shared data models
├── deploy_wine_token.sh   # Deployment script
└── create_wine_token_example.sh  # Usage example
```

### Quick Start

#### Prerequisites

```bash
# Install Stellar CLI
cargo install --locked stellar-cli

# Install Rust WASM target
rustup target add wasm32v1-none
```

#### Deploy to Testnet

```bash
cd contracts

# Deploy factory and upload token WASM
./deploy_wine_token.sh testnet winefi-admin

# Load configuration
source .deployed_wine_token_testnet.env
```

#### Create Your First Wine Token

```bash
# Use the example script
./create_wine_token_example.sh

# Or manually
stellar contract invoke \
  --id $WINE_FACTORY_ID \
  --source-account winefi-admin \
  --network testnet \
  -- create_wine_token \
  --admin $(stellar keys address winefi-admin) \
  --decimal 0 \
  --name "Malbec Reserve 2024" \
  --symbol "MAL24" \
  --wine_lot_metadata '{
    "lot_id": "MAL-2024-001",
    "winery_name": "Bodega Catena",
    "region": "Mendoza",
    "country": "Argentina",
    "vintage": 2024,
    "varietal": "Malbec",
    "bottle_count": 1000,
    "description": "Premium Reserve",
    "token_code": "MAL24"
  }'
```

### Wine Factory Contract

The factory contract deploys new wine token instances.

#### Methods

**Initialization:**
```rust
fn __constructor(
    e: Env,
    admin: Address,
    token_wasm_hash: BytesN<32>,
) -> Result<(), WineFactoryError>
```

**Create Token:**
```rust
fn create_wine_token(
    e: Env,
    admin: Address,
    decimal: u32,
    name: String,
    symbol: String,
    wine_lot_metadata: WineLotMetadata,
) -> Result<Address, WineFactoryError>
```

**Admin Functions:**
```rust
fn set_admin(e: Env, new_admin: Address) -> Result<(), WineFactoryError>
fn set_token_wasm_hash(e: Env, new_token_wasm_hash: BytesN<32>) -> Result<(), WineFactoryError>
```

**Read Methods:**
```rust
fn admin(e: Env) -> Result<Address, WineFactoryError>
fn total_tokens(e: Env) -> Result<u32, WineFactoryError>
fn get_token_by_index(e: Env, index: u32) -> Result<Address, WineFactoryError>
fn token_wasm_hash(e: Env) -> Result<BytesN<32>, WineFactoryError>
```

#### Example Usage

```bash
# Get factory admin
stellar contract invoke \
  --id $WINE_FACTORY_ID \
  --source-account winefi-admin \
  --network testnet \
  -- admin

# Get total tokens created
stellar contract invoke \
  --id $WINE_FACTORY_ID \
  --source-account winefi-admin \
  --network testnet \
  -- total_tokens

# Get token by index
stellar contract invoke \
  --id $WINE_FACTORY_ID \
  --source-account winefi-admin \
  --network testnet \
  -- get_token_by_index \
  --index 0
```

### Wine Token Contract

Individual wine lot tokens with embedded metadata.

#### Methods

**Initialization:**
```rust
fn __constructor(
    e: Env,
    admin: Address,
    decimal: u32,
    name: String,
    symbol: String,
    wine_lot_metadata: WineLotMetadata,
)
```

**Wine Metadata:**
```rust
fn get_wine_lot_metadata(e: Env) -> WineLotMetadata
```

**Minting (Admin Only):**
```rust
fn mint(e: Env, to: Address, amount: i128)
```

**Admin Management:**
```rust
fn set_admin(e: Env, new_admin: Address)
fn admin(e: Env) -> Address
```

**Token Interface (Standard):**
```rust
fn balance(e: Env, id: Address) -> i128
fn transfer(e: Env, from: Address, to: Address, amount: i128)
fn burn(e: Env, from: Address, amount: i128)
fn decimals(e: Env) -> u32
fn name(e: Env) -> String
fn symbol(e: Env) -> String
```

**Note:** `approve`, `allowance`, `transfer_from`, and `burn_from` are not supported in the simple implementation.

#### Example Usage

```bash
# Query wine metadata
stellar contract invoke \
  --id <TOKEN_ADDRESS> \
  --source-account winefi-admin \
  --network testnet \
  -- get_wine_lot_metadata

# Check balance
stellar contract invoke \
  --id <TOKEN_ADDRESS> \
  --source-account winefi-admin \
  --network testnet \
  -- balance \
  --id <ADDRESS>

# Mint tokens (admin only)
stellar contract invoke \
  --id <TOKEN_ADDRESS> \
  --source-account winefi-admin \
  --network testnet \
  -- mint \
  --to <RECIPIENT_ADDRESS> \
  --amount 100

# Transfer tokens
stellar contract invoke \
  --id <TOKEN_ADDRESS> \
  --source-account sender-account \
  --network testnet \
  -- transfer \
  --from $(stellar keys address sender-account) \
  --to <RECIPIENT_ADDRESS> \
  --amount 10

# Burn tokens
stellar contract invoke \
  --id <TOKEN_ADDRESS> \
  --source-account owner-account \
  --network testnet \
  -- burn \
  --from $(stellar keys address owner-account) \
  --amount 5
```

### Wine Metadata Structure

```rust
pub struct WineLotMetadata {
    pub lot_id: String,          // Unique lot identifier (e.g., "MAL-2024-001")
    pub winery_name: String,     // Name of the winery
    pub region: String,          // Wine region (e.g., "Mendoza")
    pub country: String,         // Country (e.g., "Argentina")
    pub vintage: u32,            // Year (e.g., 2024)
    pub varietal: String,        // Grape variety (e.g., "Malbec")
    pub bottle_count: u32,       // Number of bottles in lot
    pub description: Option<String>,  // Optional description
    pub token_code: String,      // Short code (e.g., "MAL24")
}
```

### Common Operations

#### Mint Tokens

```bash
stellar contract invoke \
  --id <TOKEN_ADDRESS> \
  --source-account winefi-admin \
  --network testnet \
  -- mint \
  --to <BUYER_ADDRESS> \
  --amount 100
```

#### Check Balance

```bash
stellar contract invoke \
  --id <TOKEN_ADDRESS> \
  --source-account winefi-admin \
  --network testnet \
  -- balance \
  --id <ADDRESS>
```

#### Transfer Tokens

```bash
stellar contract invoke \
  --id <TOKEN_ADDRESS> \
  --source-account buyer-account \
  --network testnet \
  -- transfer \
  --from $(stellar keys address buyer-account) \
  --to <RECIPIENT_ADDRESS> \
  --amount 10
```

#### Query Wine Metadata

```bash
stellar contract invoke \
  --id <TOKEN_ADDRESS> \
  --source-account winefi-admin \
  --network testnet \
  -- get_wine_lot_metadata
```

---

## Complex Vault System

The complex vault system is designed for DeFi wine investment platforms. It includes:

- **Factory** (`factory/`) - Deploys investment vaults
- **Vault** (`vault/`) - Multi-asset investment vault with strategies
- **Common** (`common/`) - Shared models

### Features

- ✅ Multi-asset investment strategies
- ✅ Soroswap DEX integration
- ✅ Rebalancing
- ✅ Fee management
- ✅ Yield optimization
- ✅ Wine metadata (optional)

### Deployment

```bash
# Build and deploy
./deploy_winefi.sh testnet winefi-admin

# Load configuration
source .deployed_winefi_testnet.env
```

**Note:** The complex vault system requires additional setup including Soroswap router addresses and strategy contracts. See `WINE_CONTRACTS_GUIDE.md` for detailed information.

---

## Development

### Build Contracts

```bash
# Build all contracts
cargo build --target wasm32v1-none --release

# Build only simple system
cargo build --target wasm32v1-none --release -p wine-token -p wine-factory

# Build only complex system
cargo build --target wasm32v1-none --release -p vinifica-vault -p vinifica-factory

# Run tests
cargo test
```

### Project Structure

```
contracts/
├── contracts/
│   ├── wine_token/          # Simple wine token contract
│   ├── wine_factory/        # Simple factory contract
│   ├── vault/               # Complex DeFi vault
│   ├── factory/             # Complex factory
│   └── common/              # Shared models
├── target/                  # Build output
├── deploy_wine_token.sh    # Deploy simple system
├── deploy_winefi.sh        # Deploy complex system
├── create_wine_token_example.sh  # Usage example
└── Cargo.toml              # Workspace configuration
```

### Build Profiles

The project uses optimized release profiles:

- `release` - Optimized for size and performance
- `release-with-logs` - Includes debug assertions for development

---

## Networks

### Testnet (Default)

- **RPC:** `https://soroban-testnet.stellar.org`
- **Passphrase:** `Test SDF Network ; September 2015`
- **Get free XLM:** https://laboratory.stellar.org/#account-creator?network=testnet

```bash
./deploy_wine_token.sh testnet your-account
```

### Futurenet

- **RPC:** `https://rpc-futurenet.stellar.org`
- **Passphrase:** `Test SDF Future Network ; October 2022`

```bash
./deploy_wine_token.sh futurenet your-account
```

### Mainnet

- **RPC:** `https://soroban-rpc.mainnet.stellar.org`
- **Passphrase:** `Public Global Stellar Network ; September 2015`

```bash
./deploy_wine_token.sh mainnet your-account
```

**⚠️ Warning:** Mainnet deployment requires real XLM and should only be done after thorough testing.

---

## Deployment

### Using the Deployment Script

The `deploy_wine_token.sh` script automates the deployment process:

1. Checks for Stellar CLI installation
2. Creates/funds account (testnet only)
3. Builds contracts
4. Uploads token WASM
5. Deploys factory contract
6. Saves configuration to `.deployed_wine_token_<network>.env`

```bash
./deploy_wine_token.sh [network] [account-name]

# Examples:
./deploy_wine_token.sh testnet winefi-admin
./deploy_wine_token.sh futurenet my-account
./deploy_wine_token.sh mainnet production-admin
```

### Manual Deployment

If you prefer manual deployment:

```bash
# 1. Build contracts
cargo build --target wasm32v1-none --release -p wine-token -p wine-factory

# 2. Upload token WASM
stellar contract upload \
  --wasm target/wasm32v1-none/release/wine_token.wasm \
  --source-account your-account \
  --network testnet

# 3. Deploy factory
stellar contract deploy \
  --wasm target/wasm32v1-none/release/wine_factory.wasm \
  --network testnet \
  -- \
  --admin $(stellar keys address your-account) \
  --token_wasm_hash <WASM_HASH_FROM_STEP_2>
```

### Deployed Configuration

After deployment, contract IDs are saved in `.deployed_wine_token_<network>.env`:

```env
WINE_FACTORY_ID=CA...
TOKEN_WASM_HASH=...
NETWORK=testnet
ACCOUNT_NAME=winefi-admin
ADMIN_ADDRESS=G...
```

Load the configuration:

```bash
source .deployed_wine_token_testnet.env
echo $WINE_FACTORY_ID
```

---

## Integration with Edge Functions

The contracts integrate with Supabase Edge Functions for seamless backend operations. See `supabase/functions/README.md` for details.

### Environment Variables

Set these in Supabase Edge Functions secrets:

```bash
WINE_FACTORY_ID=CA...              # Factory contract address
TOKEN_WASM_HASH=...                # Token WASM hash
STELLAR_NETWORK=TESTNET            # Network name
STELLAR_RPC_URL=https://...       # Soroban RPC URL
STELLAR_NETWORK_PASSPHRASE=...    # Network passphrase
```

### Edge Function Integration

The following edge functions interact with these contracts:

- `wine-tokens-create` - Creates tokens via factory
- `wine-tokens-mint` - Mints tokens from wine token contract
- `wine-tokens-transfer` - Transfers tokens between addresses

Example flow:

1. User calls `wine-tokens-create` edge function
2. Edge function invokes factory `create_wine_token`
3. New wine token contract is deployed
4. Token address is stored in Supabase database
5. User can mint/transfer via edge functions

---

## Troubleshooting

### Account Not Funded

```bash
# Testnet: Auto-fund via CLI
stellar keys fund your-account --network testnet

# Or use friendbot
curl "https://friendbot.stellar.org/?addr=$(stellar keys address your-account)"

# Or manually fund at:
# https://laboratory.stellar.org/#account-creator?network=testnet
```

### WASM Hash Mismatch

If you need to update the token WASM:

```bash
# 1. Re-upload the token WASM
stellar contract upload \
  --wasm target/wasm32v1-none/release/wine_token.wasm \
  --source-account your-account \
  --network testnet

# 2. Update factory with new hash
stellar contract invoke \
  --id $WINE_FACTORY_ID \
  --source-account your-account \
  --network testnet \
  -- set_token_wasm_hash \
  --new_token_wasm_hash <NEW_HASH>
```

### Contract Invocation Errors

**"Contract not found":**
- Verify contract address is correct
- Check network matches deployment network

**"Insufficient balance":**
- Ensure account has XLM for transaction fees
- Fund account: `stellar keys fund your-account --network testnet`

**"Not authorized":**
- Verify you're using the correct admin account
- Check that the account has proper permissions

**"Invalid arguments":**
- Verify argument types match contract method signature
- Check JSON formatting for metadata arguments

### Build Errors

**"target not found":**
```bash
rustup target add wasm32v1-none
```

**"soroban-sdk not found":**
```bash
cargo update
```

**"Linker errors":**
- Ensure you're using the correct Rust version (1.70+)
- Try cleaning and rebuilding: `cargo clean && cargo build --target wasm32v1-none --release`

---

## Contract Methods Reference

### Wine Factory

| Method | Description | Auth Required |
|--------|-------------|---------------|
| `__constructor` | Initialize factory | None (deployment) |
| `create_wine_token` | Create new wine token | None (anyone can create) |
| `set_admin` | Change factory admin | Current admin |
| `set_token_wasm_hash` | Update token WASM hash | Admin |
| `admin` | Get factory admin | None |
| `total_tokens` | Get total tokens created | None |
| `get_token_by_index` | Get token address by index | None |
| `token_wasm_hash` | Get current token WASM hash | None |

### Wine Token

| Method | Description | Auth Required |
|--------|-------------|---------------|
| `__constructor` | Initialize token | None (deployment) |
| `get_wine_lot_metadata` | Get wine metadata | None |
| `mint` | Mint new tokens | Admin only |
| `set_admin` | Change token admin | Current admin |
| `admin` | Get token admin | None |
| `balance` | Get token balance | None |
| `transfer` | Transfer tokens | From address |
| `burn` | Burn tokens | From address |
| `decimals` | Get token decimals | None |
| `name` | Get token name | None |
| `symbol` | Get token symbol | None |

---

## Security Considerations

1. **Admin Keys**: Keep admin private keys secure. Use hardware wallets for production.
2. **WASM Hash**: Verify WASM hash before deploying to ensure contract integrity.
3. **Access Control**: Factory admin can update WASM hash - ensure admin is trusted.
4. **Token Admin**: Token admin can mint unlimited tokens - verify admin before accepting tokens.
5. **Network**: Use testnet/futurenet for development, mainnet only after thorough testing.

---

## Resources

- [Stellar Documentation](https://developers.stellar.org/)
- [Soroban Smart Contracts](https://soroban.stellar.org/)
- [Stellar Laboratory](https://laboratory.stellar.org/)
- [Stellar Explorer](https://stellar.expert/)
- [Stellar CLI Documentation](https://developers.stellar.org/docs/tools/stellar-cli)
- [Supabase Edge Functions](../supabase/functions/README.md)

---

## License

MIT License - VineFi Team
