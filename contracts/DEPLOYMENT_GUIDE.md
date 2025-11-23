# 🚀 Wine Token Contract Deployment Guide - Testnet

Complete step-by-step guide to deploy the wine token contract with status functionality on Stellar Testnet.

## Prerequisites

### 1. Install Stellar CLI

```bash
# Install Stellar CLI using Cargo
cargo install --locked stellar-cli

# Verify installation
stellar --version
```

### 2. Install Rust WASM Target

```bash
# Add WASM target for Soroban contracts
rustup target add wasm32v1-none

# Verify target is installed
rustup target list | grep wasm32v1-none
```

### 3. Navigate to Contracts Directory

```bash
cd /home/linuxito11/wine-fi/contracts
```

---

## Step-by-Step Deployment

### Step 1: Create/Fund Your Testnet Account

```bash
# Create a new account (if you don't have one)
stellar keys generate winefi-admin

# Get your account address
stellar keys address winefi-admin

# Fund your account on testnet (automatic)
stellar keys fund winefi-admin --network testnet

# If automatic funding fails, use friendbot:
ACCOUNT_ADDRESS=$(stellar keys address winefi-admin)
curl "https://friendbot.stellar.org/?addr=$ACCOUNT_ADDRESS"

# Or manually fund at: https://laboratory.stellar.org/#account-creator?network=testnet
```

**Expected Output:**
```
Account address: GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
✓ Account funded
```

---

### Step 2: Build the Contracts

```bash
# Build both wine_token and wine_factory contracts
cargo build --target wasm32v1-none --release -p wine-token -p wine-factory

# Verify build succeeded (should see .wasm files)
ls -lh target/wasm32v1-none/release/*.wasm
```

**Expected Output:**
```
   Compiling wine-token v0.1.0
   Compiling wine-factory v0.1.0
    Finished release [optimized] target(s)
```

---

### Step 3: Deploy Using the Script (Recommended)

```bash
# Make script executable (if not already)
chmod +x deploy_wine_token.sh

# Deploy to testnet
./deploy_wine_token.sh testnet winefi-admin
```

**What the script does:**
1. ✅ Checks Stellar CLI installation
2. ✅ Creates/funds your account
3. ✅ Builds contracts
4. ✅ Uploads wine_token WASM
5. ✅ Deploys wine_factory contract
6. ✅ Saves configuration to `.deployed_wine_token_testnet.env`

**Expected Output:**
```
🍷 Simple Wine Token Deployment
========================================
Network: testnet
Account: winefi-admin

📦 Building wine token contracts...
✓ Contracts built

🚀 Step 1: Uploading Wine Token WASM...
✓ Token WASM Hash: abc123def456...

🚀 Step 2: Deploying Wine Factory Contract...
✓ Factory Contract ID: CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

✓ Configuration saved to: .deployed_wine_token_testnet.env

✅ Deployment Complete!
```

---

### Step 4: Verify Deployment

```bash
# Load the deployment configuration
source .deployed_wine_token_testnet.env

# Check factory admin
stellar contract invoke \
  --id $WINE_FACTORY_ID \
  --source-account winefi-admin \
  --network testnet \
  -- admin

# Check total tokens (should be 0 initially)
stellar contract invoke \
  --id $WINE_FACTORY_ID \
  --source-account winefi-admin \
  --network testnet \
  -- total_tokens
```

**Expected Output:**
```
Admin: GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
Total tokens: 0
```

---

### Step 5: Create Your First Wine Token

```bash
# Make sure you've loaded the config
source .deployed_wine_token_testnet.env

# Create a wine token
stellar contract invoke \
  --id $WINE_FACTORY_ID \
  --source-account winefi-admin \
  --network testnet \
  -- create_wine_token \
  --admin $(stellar keys address winefi-admin) \
  --decimal 0 \
  --name "Malbec Reserve 2024" \
  --symbol "MAL24" \
  --wine_lot_metadata '{"lot_id": "MAL-2024-001", "winery_name": "Bodega Catena", "region": "Mendoza", "country": "Argentina", "vintage": 2024, "varietal": "Malbec", "bottle_count": 1000, "description": "Premium Reserve", "token_code": "MAL24"}'
```

**Save the token address from the output!**

```bash
# Extract and save token address
TOKEN_ADDRESS=$(stellar contract invoke \
  --id $WINE_FACTORY_ID \
  --source-account winefi-admin \
  --network testnet \
  -- create_wine_token \
  --admin $(stellar keys address winefi-admin) \
  --decimal 0 \
  --name "Test Wine" \
  --symbol "TEST" \
  --wine_lot_metadata '{"lot_id": "TEST-001", "winery_name": "Test Winery", "region": "Test", "country": "Test", "vintage": 2024, "varietal": "Test", "bottle_count": 100, "token_code": "TEST"}' 2>&1 | grep -oE 'C[A-Z0-9]{55}' | head -1)

echo "TOKEN_ADDRESS=$TOKEN_ADDRESS" >> .deployed_wine_token_testnet.env
```

---

### Step 6: Test Status Functionality

```bash
# Load config with token address
source .deployed_wine_token_testnet.env

# Test 1: Get status (should be None initially)
stellar contract invoke \
  --id $TOKEN_ADDRESS \
  --source-account winefi-admin \
  --network testnet \
  -- get_status

# Test 2: Set status to "harvested"
stellar contract invoke \
  --id $TOKEN_ADDRESS \
  --source-account winefi-admin \
  --network testnet \
  -- set_status \
  --status "harvested"

# Test 3: Get status again (should return "harvested")
stellar contract invoke \
  --id $TOKEN_ADDRESS \
  --source-account winefi-admin \
  --network testnet \
  -- get_status

# Test 4: Update status to "fermented"
stellar contract invoke \
  --id $TOKEN_ADDRESS \
  --source-account winefi-admin \
  --network testnet \
  -- set_status \
  --status "fermented"

# Test 5: Verify final status
stellar contract invoke \
  --id $TOKEN_ADDRESS \
  --source-account winefi-admin \
  --network testnet \
  -- get_status
```

**Expected Output:**
```
# First get_status: null or empty
# After set_status("harvested"): "harvested"
# After set_status("fermented"): "fermented"
```

---

## Manual Deployment (Alternative)

If you prefer to deploy manually step by step:

### 1. Set Network Environment Variables

```bash
export STELLAR_RPC_URL=https://soroban-testnet.stellar.org
export STELLAR_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
export STELLAR_NETWORK=testnet
stellar keys use winefi-admin
```

### 2. Build Contracts

```bash
cargo build --target wasm32v1-none --release -p wine-token -p wine-factory
```

### 3. Upload Wine Token WASM

```bash
TOKEN_WASM_HASH=$(stellar contract upload \
  --wasm target/wasm32v1-none/release/wine_token.wasm \
  --source-account winefi-admin \
  --network testnet 2>&1 | grep -oE '[a-f0-9]{64}' | head -1)

echo "Token WASM Hash: $TOKEN_WASM_HASH"
```

### 4. Deploy Factory Contract

```bash
ADMIN_ADDRESS=$(stellar keys address winefi-admin)

FACTORY_ID=$(stellar contract deploy \
  --wasm target/wasm32v1-none/release/wine_factory.wasm \
  --network testnet \
  -- \
  --admin "$ADMIN_ADDRESS" \
  --token_wasm_hash "$TOKEN_WASM_HASH" 2>&1 | grep -oE 'C[A-Z0-9]{55}' | head -1)

echo "Factory ID: $FACTORY_ID"
```

### 5. Save Configuration

```bash
cat > .deployed_wine_token_testnet.env << EOF
WINE_FACTORY_ID=$FACTORY_ID
TOKEN_WASM_HASH=$TOKEN_WASM_HASH
NETWORK=testnet
ACCOUNT_NAME=winefi-admin
ADMIN_ADDRESS=$ADMIN_ADDRESS
EOF
```

---

## Troubleshooting

### Error: "Account not found"
```bash
# Fund your account
stellar keys fund winefi-admin --network testnet
# Or use friendbot
curl "https://friendbot.stellar.org/?addr=$(stellar keys address winefi-admin)"
```

### Error: "Insufficient balance"
```bash
# Check your balance
stellar account balance winefi-admin --network testnet

# Fund if needed (minimum ~2 XLM for deployment)
```

### Error: "Build failed"
```bash
# Clean and rebuild
cargo clean
cargo build --target wasm32v1-none --release -p wine-token -p wine-factory
```

### Error: "Contract method not found"
- Make sure you deployed the NEW version with status methods
- Check that you're using the correct token address
- Verify the contract was built with the latest code

### Check Contract Events

```bash
# View contract events (status updates emit events)
stellar contract events \
  --id $TOKEN_ADDRESS \
  --network testnet \
  --limit 10
```

---

## Quick Reference Commands

```bash
# Load deployment config
source .deployed_wine_token_testnet.env

# Check factory admin
stellar contract invoke --id $WINE_FACTORY_ID --source-account winefi-admin --network testnet -- admin

# Create wine token
stellar contract invoke --id $WINE_FACTORY_ID --source-account winefi-admin --network testnet -- create_wine_token --admin $(stellar keys address winefi-admin) --decimal 0 --name "Wine Name" --symbol "SYMBOL" --wine_lot_metadata '{...}'

# Get status
stellar contract invoke --id $TOKEN_ADDRESS --source-account winefi-admin --network testnet -- get_status

# Set status
stellar contract invoke --id $TOKEN_ADDRESS --source-account winefi-admin --network testnet -- set_status --status "harvested"

# Check balance
stellar contract invoke --id $TOKEN_ADDRESS --source-account winefi-admin --network testnet -- balance --id $(stellar keys address winefi-admin)
```

---

## Next Steps

After successful deployment:

1. ✅ **Update your database** with the new factory and token addresses
2. ✅ **Test the API endpoint** `/functions/v1/wine-lots-update-status`
3. ✅ **Verify status updates** are stored both in database and on-chain
4. ✅ **Check transaction hashes** in the database match blockchain events

---

## Support

If you encounter issues:
1. Check the error message carefully
2. Verify all prerequisites are installed
3. Ensure your account has sufficient XLM (minimum 2 XLM)
4. Check network connectivity to Stellar testnet RPC

For more information, see:
- [Stellar Documentation](https://developers.stellar.org/docs)
- [Soroban Documentation](https://soroban.stellar.org/docs)
