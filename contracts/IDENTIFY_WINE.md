# 🍷 How to Identify Wine from Token Address

## The Problem

When you see a blockchain event like:
```
Event: status_update -> status = "harvested"
Contract: CAPYNLEFDZYPP63TLNNH2ZFHIVHZJHQWXTL2CRW6RWATC6PGOHLQMOPW
```

The event doesn't tell you **which wine** this is. You need to query the token contract to get the wine metadata.

## Solution: Query Wine Metadata

### From Command Line

```bash
# Get wine metadata from token address
stellar contract invoke \
  --id CAPYNLEFDZYPP63TLNNH2ZFHIVHZJHQWXTL2CRW6RWATC6PGOHLQMOPW \
  --source-account winefi-admin \
  --network testnet \
  -- get_wine_lot_metadata
```

This will return:
```json
{
  "lot_id": "MAL-2024-001",
  "winery_name": "Bodega Catena",
  "region": "Mendoza",
  "country": "Argentina",
  "vintage": 2024,
  "varietal": "Malbec",
  "bottle_count": 1000,
  "description": "Premium Reserve",
  "token_code": "MAL24"
}
```

### Complete Workflow

1. **See status event on blockchain:**
   ```
   Contract: CAPYNLEFDZYPP63TLNNH2ZFHIVHZJHQWXTL2CRW6RWATC6PGOHLQMOPW
   Event: status_update -> status = "harvested"
   ```

2. **Query metadata to identify the wine:**
   ```bash
   stellar contract invoke \
     --id CAPYNLEFDZYPP63TLNNH2ZFHIVHZJHQWXTL2CRW6RWATC6PGOHLQMOPW \
     --source-account winefi-admin \
     --network testnet \
     -- get_wine_lot_metadata
   ```

3. **Result:** Now you know it's "Malbec Reserve 2024" from Bodega Catena

## Better Solution: Store Mapping in Database

The best practice is to store the mapping in your database:

```sql
-- In your wine_tokens table
token_address | lot_id        | winery_name      | vintage
--------------|---------------|------------------|--------
CAPY...MOPW   | MAL-2024-001  | Bodega Catena    | 2024
```

Then when you see an event, you can:
1. Look up the token_address in your database
2. Get the wine information instantly

## Enhanced Event Query

You can also query multiple things at once:

```bash
# Get both status and metadata
TOKEN_ADDRESS="CAPYNLEFDZYPP63TLNNH2ZFHIVHZJHQWXTL2CRW6RWATC6PGOHLQMOPW"

# Get status
stellar contract invoke \
  --id $TOKEN_ADDRESS \
  --source-account winefi-admin \
  --network testnet \
  -- get_status

# Get metadata
stellar contract invoke \
  --id $TOKEN_ADDRESS \
  --source-account winefi-admin \
  --network testnet \
  -- get_wine_lot_metadata
```

## Why Events Don't Include Wine Info

Blockchain events are designed to be minimal for efficiency. Including full metadata in every event would:
- Increase transaction costs
- Make events harder to parse
- Duplicate data (metadata is already stored in the contract)

The pattern is:
- **Events** = What happened (status changed to "harvested")
- **Contract storage** = What it is (wine metadata)

## Recommended Approach

1. **Store token_address → wine mapping in database** when creating tokens
2. **Query metadata from chain** when you need to verify
3. **Use events** to track status changes efficiently

This gives you:
- ✅ Fast lookups (database)
- ✅ Verifiable data (blockchain)
- ✅ Efficient events (minimal data)
