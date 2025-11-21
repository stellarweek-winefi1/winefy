#![no_std]

mod constants;
mod error;
mod events;
mod storage;

use error::TransferError;
use events::emit_transfer_completed;
use soroban_sdk::{contract, contractimpl, vec, Address, Env, IntoVal, String, Symbol};

// Note: This contract integrates with BottleFactory and TraceabilityLog
// The BottleFactory address and TraceabilityLog address should be provided at init
use storage::{extend_instance_ttl, get_bottle_factory, get_traceability_log, put_bottle_factory, put_traceability_log};

#[contract]
pub struct Transfer;

#[contractimpl]
impl Transfer {
    pub fn init(
        e: Env,
        bottle_factory: Address,
        traceability_log: Address,
    ) -> Result<(), TransferError> {
        if storage::has_bottle_factory(&e) {
            return Err(TransferError::AlreadyInitialized);
        }
        put_bottle_factory(&e, &bottle_factory);
        put_traceability_log(&e, &traceability_log);
        extend_instance_ttl(&e);
        Ok(())
    }

    pub fn transfer(
        e: Env,
        bottle_id: String,
        to: Address,
    ) -> Result<(), TransferError> {
        extend_instance_ttl(&e);
        
        // Get bottle from BottleFactory to verify current owner
        let bottle = e.invoke_contract::<storage::Bottle>(
            &get_bottle_factory(&e)?,
            &Symbol::new(&e, "get_bottle"),
            vec![&e, bottle_id.clone().into_val(&e)],
        );

        let current_owner = bottle.current_owner;

        // Verify current owner is the caller
        current_owner.require_auth();

        // Update owner in BottleFactory
        e.invoke_contract::<()>(
            &get_bottle_factory(&e)?,
            &Symbol::new(&e, "update_owner"),
            vec![
                &e,
                bottle_id.clone().into_val(&e),
                to.clone().into_val(&e),
            ],
        );

        // Auto-log Shipped event in TraceabilityLog
        let description = String::from_str(&e, "Transferred ownership");
        e.invoke_contract::<()>(
            &get_traceability_log(&e)?,
            &soroban_sdk::symbol_short!("log_event"),
            vec![
                &e,
                bottle_id.clone().into_val(&e),
                storage::EventType::Shipped.into_val(&e),
                current_owner.clone().into_val(&e),
                description.into_val(&e),
            ],
        );

        emit_transfer_completed(&e, bottle_id, current_owner, to);

        Ok(())
    }

    pub fn get_owner(e: Env, bottle_id: String) -> Result<Address, TransferError> {
        extend_instance_ttl(&e);
        
        // Get bottle from BottleFactory
        let bottle = e.invoke_contract::<storage::Bottle>(
            &get_bottle_factory(&e)?,
            &Symbol::new(&e, "get_bottle"),
            vec![&e, bottle_id.clone().into_val(&e)],
        );
        
        Ok(bottle.current_owner)
    }

    pub fn bottle_factory(e: Env) -> Result<Address, TransferError> {
        extend_instance_ttl(&e);
        get_bottle_factory(&e)
    }

    pub fn traceability_log(e: Env) -> Result<Address, TransferError> {
        extend_instance_ttl(&e);
        get_traceability_log(&e)
    }
}

mod test;
