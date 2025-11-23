#!/bin/bash

# Example: Create a wine token using the simple wine factory
# This script shows how to tokenize a wine lot

set -e

# Load deployed contract IDs
if [ -f ".deployed_wine_token_testnet.env" ]; then
    source .deployed_wine_token_testnet.env
else
    echo "❌ Deployment config not found. Run ./deploy_wine_token.sh first"
    exit 1
fi

echo "🍷 Creating Wine Token Example"
echo "================================"
echo "Factory ID: $WINE_FACTORY_ID"
echo "Admin: $ADMIN_ADDRESS"
echo ""

# Create the wine token
echo "Creating Malbec Reserve 2024 token..."
echo ""

# Invoke create_wine_token and capture full output
INVOKE_OUTPUT=$(stellar contract invoke \
  --id "$WINE_FACTORY_ID" \
  --source-account "$ACCOUNT_NAME" \
  --network "$NETWORK" \
  -- create_wine_token \
  --admin "$ADMIN_ADDRESS" \
  --decimal 0 \
  --name "Malbec Reserve 2024" \
  --symbol "MAL24" \
  --wine_lot_metadata "{\"lot_id\": \"MAL-2024-001\", \"winery_name\": \"Bodega Catena Zapata\", \"region\": \"Mendoza\", \"country\": \"Argentina\", \"vintage\": 2024, \"varietal\": \"Malbec\", \"bottle_count\": 1000, \"description\": \"Premium Estate Reserve\", \"token_code\": \"MAL24\"}" 2>&1)

# Extract token address from output (look for contract address pattern)
TOKEN_ADDRESS=$(echo "$INVOKE_OUTPUT" | grep -oE 'C[A-Z0-9]{55}' | grep -v "$WINE_FACTORY_ID" | head -1)

# If not found, try to extract from return value or other patterns
if [ -z "$TOKEN_ADDRESS" ]; then
    # Try to find address in the output
    TOKEN_ADDRESS=$(echo "$INVOKE_OUTPUT" | grep -iE '(result|return|address|contract)' | grep -oE 'C[A-Z0-9]{55}' | head -1)
fi

# Display the output for debugging
echo "$INVOKE_OUTPUT"
echo ""

echo ""
echo "✅ Wine token created!"
echo "Token Address: $TOKEN_ADDRESS"
echo ""

# Save token address
echo "TOKEN_ADDRESS=$TOKEN_ADDRESS" >> .deployed_wine_token_testnet.env

# Verify token address was extracted
if [ -z "$TOKEN_ADDRESS" ]; then
    echo "⚠️  Warning: Could not extract token address from output"
    echo "Please check the output above and manually set TOKEN_ADDRESS"
    echo ""
    echo "You can query metadata manually with:"
    echo "stellar contract invoke --id <TOKEN_ADDRESS> --source-account $ACCOUNT_NAME --network $NETWORK -- get_wine_lot_metadata"
    exit 1
fi

# Query wine metadata
echo "📋 Querying wine metadata..."
echo ""

# Use stellar contract invoke with proper syntax
stellar contract invoke \
  --id "$TOKEN_ADDRESS" \
  --source-account "$ACCOUNT_NAME" \
  --network "$NETWORK" \
  -- \
  get_wine_lot_metadata

echo ""
echo "🎉 Done! Your wine lot is now tokenized."
echo ""
echo "Next steps:"
echo "  1. Mint tokens to distribute to buyers"
echo "  2. Transfer tokens to represent ownership"
echo "  3. Query wine metadata anytime"
echo ""
echo "Example commands:"
echo ""
echo "# Mint 100 tokens to a buyer"
echo "stellar contract invoke \\"
echo "  --id $TOKEN_ADDRESS \\"
echo "  --source-account $ACCOUNT_NAME \\"
echo "  --network $NETWORK \\"
echo "  -- mint \\"
echo "  --to <BUYER_ADDRESS> \\"
echo "  --amount 100"
echo ""
echo "# Check balance"
echo "stellar contract invoke \\"
echo "  --id $TOKEN_ADDRESS \\"
echo "  --source-account $ACCOUNT_NAME \\"
echo "  --network $NETWORK \\"
echo "  -- balance \\"
echo "  --id <ADDRESS>"
echo ""
