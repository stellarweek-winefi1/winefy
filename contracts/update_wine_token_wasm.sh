#!/bin/bash

# Update Wine Token WASM Hash in Existing Factory
# Usage: ./update_wine_token_wasm.sh [network] [account] [factory-id]

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔄 Updating Wine Token WASM Hash${NC}"
echo "========================================"
echo ""

# Configuration
NETWORK="${1:-testnet}"
ACCOUNT_NAME="${2:-winefi-admin}"
FACTORY_ID="${3}"

if [ -z "$FACTORY_ID" ]; then
    echo -e "${RED}❌ Factory ID required${NC}"
    echo "Usage: ./update_wine_token_wasm.sh [network] [account] [factory-id]"
    echo ""
    echo "Or load from .deployed_wine_token_${NETWORK}.env:"
    echo "  source .deployed_wine_token_${NETWORK}.env"
    echo "  ./update_wine_token_wasm.sh $NETWORK $ACCOUNT_NAME \$WINE_FACTORY_ID"
    exit 1
fi

# Configure network
case "$NETWORK" in
    testnet)
        export STELLAR_RPC_URL=https://soroban-testnet.stellar.org
        export STELLAR_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
        ;;
    futurenet)
        export STELLAR_RPC_URL=https://rpc-futurenet.stellar.org
        export STELLAR_NETWORK_PASSPHRASE="Test SDF Future Network ; October 2022"
        ;;
    mainnet)
        export STELLAR_RPC_URL=https://soroban-rpc.mainnet.stellar.org
        export STELLAR_NETWORK_PASSPHRASE="Public Global Stellar Network ; September 2015"
        ;;
    *)
        echo -e "${RED}❌ Unknown network: $NETWORK${NC}"
        exit 1
        ;;
esac

export STELLAR_NETWORK="$NETWORK"
stellar keys use "$ACCOUNT_NAME"

ADMIN_ADDRESS=$(stellar keys address "$ACCOUNT_NAME")
echo -e "${GREEN}✓ Admin Address: $ADMIN_ADDRESS${NC}"
echo -e "${GREEN}✓ Factory ID: $FACTORY_ID${NC}"
echo ""

# Build contracts
echo "📦 Building wine token contract..."
cargo build --target wasm32v1-none --release -p wine-token

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Contract built${NC}"
echo ""

# Step 1: Upload new Wine Token WASM
echo "🚀 Step 1: Uploading new Wine Token WASM..."
TOKEN_WASM_HASH=$(stellar contract upload \
  --wasm target/wasm32v1-none/release/wine_token.wasm \
  --source-account "$ACCOUNT_NAME" \
  --network "$NETWORK" 2>&1 | tee /dev/tty | grep -oE '[a-f0-9]{64}' | head -1)

if [ -z "$TOKEN_WASM_HASH" ]; then
    echo -e "${RED}❌ Failed to get Token WASM hash${NC}"
    exit 1
fi

echo -e "${GREEN}✓ New Token WASM Hash: $TOKEN_WASM_HASH${NC}"
echo ""

# Step 2: Update factory with new WASM hash
echo "🚀 Step 2: Updating Factory with new WASM hash..."
stellar contract invoke \
  --id "$FACTORY_ID" \
  --source-account "$ACCOUNT_NAME" \
  --network "$NETWORK" \
  -- \
  set_token_wasm_hash \
  --new_token_wasm_hash "$TOKEN_WASM_HASH"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to update factory${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Factory updated successfully${NC}"
echo ""

# Update configuration file if it exists
CONFIG_FILE=".deployed_wine_token_${NETWORK}.env"
if [ -f "$CONFIG_FILE" ]; then
    # Update TOKEN_WASM_HASH in config file
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/^TOKEN_WASM_HASH=.*/TOKEN_WASM_HASH=$TOKEN_WASM_HASH/" "$CONFIG_FILE"
    else
        # Linux
        sed -i "s/^TOKEN_WASM_HASH=.*/TOKEN_WASM_HASH=$TOKEN_WASM_HASH/" "$CONFIG_FILE"
    fi
    echo -e "${GREEN}✓ Configuration file updated: $CONFIG_FILE${NC}"
    echo ""
fi

# Summary
echo "========================================"
echo -e "${GREEN}✅ Update Complete!${NC}"
echo "========================================"
echo ""
echo "📋 Updated Values:"
echo "  Factory ID:      $FACTORY_ID"
echo "  New WASM Hash:   $TOKEN_WASM_HASH"
echo ""
echo "ℹ️  Note: Only NEW tokens created after this update will have the new status methods."
echo "   Existing tokens will continue to work but won't have set_status/get_status methods."
echo ""

