#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String};

#[test]
fn test_init() {
    let e = Env::default();
    let admin = Address::generate(&e);

    let contract_id = e.register_contract(None, BottleFactory);
    let client = BottleFactoryClient::new(&e, &contract_id);

    client.init(&admin);
    
    assert_eq!(client.admin(), admin);
}

#[test]
fn test_mint_bottle() {
    let e = Env::default();
    let admin = Address::generate(&e);
    let winery = Address::generate(&e);

    let contract_id = e.register_contract(Some(&admin), BottleFactory);
    let client = BottleFactoryClient::new(&e, &contract_id);

    client.init(&admin);

    let lot_id = String::from_str(&e, "MALBEC-2024-001");
    let wine_name = String::from_str(&e, "Gran Reserva Malbec");
    let metadata_uri = String::from_str(&e, "ipfs://Qm...");

    let bottle_id = client.mint_bottle(
        &lot_id,
        &1,
        &winery,
        &wine_name,
        &2024,
        &metadata_uri,
    );

    assert_eq!(bottle_id, String::from_str(&e, "MALBEC-2024-001-0001"));

    let bottle = client.get_bottle(&bottle_id);
    assert_eq!(bottle.id, bottle_id);
    assert_eq!(bottle.lot_id, lot_id);
    assert_eq!(bottle.bottle_number, 1);
    assert_eq!(bottle.winery, winery);
    assert_eq!(bottle.current_owner, winery);
    assert_eq!(bottle.wine_name, wine_name);
    assert_eq!(bottle.vintage, 2024);
}

#[test]
#[should_panic(expected = "BottleFactoryError(403)")] // DuplicateBottle
fn test_duplicate_bottle() {
    let e = Env::default();
    let admin = Address::generate(&e);
    let winery = Address::generate(&e);

    let contract_id = e.register_contract(Some(&admin), BottleFactory);
    let client = BottleFactoryClient::new(&e, &contract_id);

    client.init(&admin);

    let lot_id = String::from_str(&e, "MALBEC-2024-001");
    let wine_name = String::from_str(&e, "Gran Reserva Malbec");
    let metadata_uri = String::from_str(&e, "ipfs://Qm...");

    client.mint_bottle(&lot_id, &1, &winery, &wine_name, &2024, &metadata_uri);
    client.mint_bottle(&lot_id, &1, &winery, &wine_name, &2024, &metadata_uri);
}

#[test]
fn test_update_owner() {
    let e = Env::default();
    let admin = Address::generate(&e);
    let winery = Address::generate(&e);
    let distributor = Address::generate(&e);

    let contract_id = e.register_contract(Some(&admin), BottleFactory);
    let client = BottleFactoryClient::new(&e, &contract_id);

    client.init(&admin);

    let lot_id = String::from_str(&e, "MALBEC-2024-001");
    let wine_name = String::from_str(&e, "Gran Reserva Malbec");
    let metadata_uri = String::from_str(&e, "ipfs://Qm...");

    let bottle_id = client.mint_bottle(
        &lot_id,
        &1,
        &winery,
        &wine_name,
        &2024,
        &metadata_uri,
    );

    let mut bottle = client.get_bottle(&bottle_id);
    assert_eq!(bottle.current_owner, winery);

    // Update owner (as winery)
    client.update_owner(&bottle_id, &distributor);

    bottle = client.get_bottle(&bottle_id);
    assert_eq!(bottle.current_owner, distributor);
}

