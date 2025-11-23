# Quick Fix: Use Token Address, Not Factory ID

## The Problem
You're calling `set_status` on the factory contract, but it's a method on the **wine token contract**.

## The Solution

From your output, your token address is:
```
CAPYNLEFDZYPP63TLNNH2ZFHIVHZJHQWXTL2CRW6RWATC6PGOHLQMOPW
```

Use this command instead:

```bash
stellar contract invoke \
  --id CAPYNLEFDZYPP63TLNNH2ZFHIVHZJHQWXTL2CRW6RWATC6PGOHLQMOPW \
  --source-account winefi-admin \
  --network testnet \
  -- set_status \
  --status "harvested"
```

## Quick Reference

**Factory Contract** (`CBJQKDZUQAWXJMMI4CVBNK4IHDEEZNV77TNQYHOY2XWKZ3R3AE6E3X4I`):
- `create_wine_token` ✅
- `admin` ✅
- `total_tokens` ✅
- `set_status` ❌ (doesn't exist here!)

**Token Contract** (`CAPYNLEFDZYPP63TLNNH2ZFHIVHZJHQWXTL2CRW6RWATC6PGOHLQMOPW`):
- `get_wine_lot_metadata` ✅
- `set_status` ✅
- `get_status` ✅
- `mint` ✅
- `balance` ✅
- `transfer` ✅

## Save Your Token Address

Add this to your `.deployed_wine_token_testnet.env`:

```bash
TOKEN_ADDRESS=CAPYNLEFDZYPP63TLNNH2ZFHIVHZJHQWXTL2CRW6RWATC6PGOHLQMOPW
```

Then you can use:
```bash
source .deployed_wine_token_testnet.env
stellar contract invoke \
  --id $TOKEN_ADDRESS \
  --source-account winefi-admin \
  --network testnet \
  -- set_status \
  --status "harvested"
```
