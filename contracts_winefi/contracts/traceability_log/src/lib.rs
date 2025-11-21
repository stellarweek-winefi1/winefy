#![no_std]

mod constants;
mod error;
mod events;
mod storage;

use error::TraceabilityLogError;
use events::emit_event_logged;
use soroban_sdk::{contract, contractimpl, Address, Env, String, Vec};
use storage::{extend_instance_ttl, get_history, log_event};

pub use storage::{Event, EventType};

#[contract]
pub struct TraceabilityLog;

#[contractimpl]
impl TraceabilityLog {
    pub fn log_event(
        e: Env,
        bottle_id: String,
        event_type: EventType,
        actor: Address,
        description: String,
    ) -> Result<(), TraceabilityLogError> {
        extend_instance_ttl(&e);
        actor.require_auth();

        let timestamp = e.ledger().timestamp();

        let event = Event {
            bottle_id: bottle_id.clone(),
            event_type: event_type.clone(),
            actor: actor.clone(),
            timestamp,
            description: description.clone(),
        };

        log_event(&e, &bottle_id, &event);

        emit_event_logged(
            &e,
            bottle_id,
            event_type,
            actor,
            timestamp,
            description,
        );

        Ok(())
    }

    pub fn get_history(e: Env, bottle_id: String) -> Vec<Event> {
        extend_instance_ttl(&e);
        get_history(&e, &bottle_id)
    }
}

mod test;
