use soroban_sdk::{contracttype, symbol_short, Address, Env, String};
use crate::storage::EventType;

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct EventLoggedEvent {
    pub bottle_id: String,
    pub event_type: EventType,
    pub actor: Address,
    pub timestamp: u64,
    pub description: String,
}

pub(crate) fn emit_event_logged(
    e: &Env,
    bottle_id: String,
    event_type: EventType,
    actor: Address,
    timestamp: u64,
    description: String,
) {
    let event = EventLoggedEvent {
        bottle_id,
        event_type,
        actor,
        timestamp,
        description,
    };
    e.events()
        .publish(("TraceabilityLog", symbol_short!("logged")), event);
}

