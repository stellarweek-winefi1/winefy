#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String};

#[test]
fn test_log_event() {
    let e = Env::default();
    let actor = Address::generate(&e);

    let contract_id = e.register_contract(None, TraceabilityLog);
    let client = TraceabilityLogClient::new(&e, &contract_id);

    let bottle_id = String::from_str(&e, "MALBEC-2024-001-0001");
    let description = String::from_str(&e, "Bottled at winery");

    client.log_event(
        &bottle_id,
        &EventType::Bottling,
        &actor,
        &description,
    );

    let history = client.get_history(&bottle_id);
    assert_eq!(history.len(), 1);

    let event = history.get(0).unwrap();
    assert_eq!(event.bottle_id, bottle_id);
    assert_eq!(event.event_type, EventType::Bottling);
    assert_eq!(event.actor, actor);
    assert_eq!(event.description, description);
}

#[test]
fn test_multiple_events() {
    let e = Env::default();
    let winery = Address::generate(&e);
    let distributor = Address::generate(&e);
    let consumer = Address::generate(&e);

    let contract_id = e.register_contract(None, TraceabilityLog);
    let client = TraceabilityLogClient::new(&e, &contract_id);

    let bottle_id = String::from_str(&e, "MALBEC-2024-001-0001");

    // Log Bottling event
    client.log_event(
        &bottle_id,
        &EventType::Bottling,
        &winery,
        &String::from_str(&e, "Bottled"),
    );

    // Log Shipped event
    client.log_event(
        &bottle_id,
        &EventType::Shipped,
        &winery,
        &String::from_str(&e, "Shipped to distributor"),
    );

    // Log Received event
    client.log_event(
        &bottle_id,
        &EventType::Received,
        &distributor,
        &String::from_str(&e, "Received at warehouse"),
    );

    // Log Scanned event
    client.log_event(
        &bottle_id,
        &EventType::Scanned,
        &consumer,
        &String::from_str(&e, "Scanned by consumer"),
    );

    let history = client.get_history(&bottle_id);
    assert_eq!(history.len(), 4);

    assert_eq!(history.get(0).unwrap().event_type, EventType::Bottling);
    assert_eq!(history.get(1).unwrap().event_type, EventType::Shipped);
    assert_eq!(history.get(2).unwrap().event_type, EventType::Received);
    assert_eq!(history.get(3).unwrap().event_type, EventType::Scanned);
}

