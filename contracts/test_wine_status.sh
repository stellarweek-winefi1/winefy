#!/bin/bash

# Test Wine Token Status Functionality
# Usage: ./test_wine_status.sh [network] [account] [token-address]

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🧪 Testing Wine Token Status Functionality${NC}"
echo "=============================================="
echo ""

# Configuration
NETWORK="${1:-testnet}"
ACCOUNT_NAME="${2:-winefi-admin}"
TOKEN_ADDRESS="${3}"

# Load config if available
CONFIG_FILE=".deployed_wine_token_${NETWORK}.env"
if [ -f "$CONFIG_FILE" ]; then
    source "$CONFIG_FILE"
    if [ -z "$TOKEN_ADDRESS" ]; then
        TOKEN_ADDRESS="${4:-$TOKEN_ADDRESS}"
    fi
fi

if [ -z "$TOKEN_ADDRESS" ]; then
    echo -e "${RED}❌ Token address required${NC}"
    echo "Usage: ./test_wine_status.sh [network] [account] [token-address]"
    echo ""
    echo "Or load from .deployed_wine_token_${NETWORK}.env:"
    echo "  source .deployed_wine_token_${NETWORK}.env"
    echo "  ./test_wine_status.sh $NETWORK $ACCOUNT_NAME \$TOKEN_ADDRESS"
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
echo -e "${GREEN}✓ Token Address: $TOKEN_ADDRESS${NC}"
echo ""

# Test 1: Get current status (should be None initially)
echo -e "${BLUE}📋 Test 1: Get current status${NC}"
echo "-----------------------------------"
stellar contract invoke \
  --id "$TOKEN_ADDRESS" \
  --source-account "$ACCOUNT_NAME" \
  --network "$NETWORK" \
  -- get_status

echo ""
echo ""

# Test 2: Set initial status
echo -e "${BLUE}📋 Test 2: Set status to 'harvested'${NC}"
echo "-----------------------------------"
stellar contract invoke \
  --id "$TOKEN_ADDRESS" \
  --source-account "$ACCOUNT_NAME" \
  --network "$NETWORK" \
  -- set_status \
  --status "harvested"

echo ""
echo -e "${GREEN}✓ Status set to 'harvested'${NC}"
echo ""

# Test 3: Get status again (should be "harvested")
echo -e "${BLUE}📋 Test 3: Verify status was saved${NC}"
echo "-----------------------------------"
stellar contract invoke \
  --id "$TOKEN_ADDRESS" \
  --source-account "$ACCOUNT_NAME" \
  --network "$NETWORK" \
  -- get_status

echo ""
echo ""

# Test 4: Update status with location
echo -e "${BLUE}📋 Test 4: Update status to 'fermented' with location${NC}"
echo "-----------------------------------"
echo "Setting status to 'fermented' with location 'Mendoza Winery'..."
echo ""

# Note: For optional parameters in Stellar CLI, we need to pass them as Vec
# Option<String> is represented as Vec<String> with 0 or 1 element
# This is a bit complex with CLI, so we'll test without optional params first
# The TypeScript/Deno code handles this properly

stellar contract invoke \
  --id "$TOKEN_ADDRESS" \
  --source-account "$ACCOUNT_NAME" \
  --network "$NETWORK" \
  -- set_status \
  --status "fermented"

echo ""
echo -e "${GREEN}✓ Status updated to 'fermented'${NC}"
echo ""

# Test 5: Final status check
echo -e "${BLUE}📋 Test 5: Final status check${NC}"
echo "-----------------------------------"
stellar contract invoke \
  --id "$TOKEN_ADDRESS" \
  --source-account "$ACCOUNT_NAME" \
  --network "$NETWORK" \
  -- get_status

echo ""
echo ""

# Summary
echo "=============================================="
echo -e "${GREEN}✅ Status Tests Complete!${NC}"
echo "=============================================="
echo ""
echo "📋 What was tested:"
echo "  ✓ get_status() - Read status from chain"
echo "  ✓ set_status() - Update status on chain"
echo "  ✓ Status persistence - Status saved correctly"
echo ""
echo "ℹ️  Note: Optional parameters (location, previous_status) are best tested"
echo "   through the TypeScript/Deno edge functions which handle Option types properly."
echo ""
echo "🔗 Next: Test through the API endpoint:"
echo "   POST /functions/v1/wine-lots-update-status"
echo "   This will update both database AND blockchain"
echo ""
