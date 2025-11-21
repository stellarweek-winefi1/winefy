use crate::constants::{
    INSTANCE_BUMP_AMOUNT, INSTANCE_LIFETIME_THRESHOLD,
};
use crate::error::TransferError;
use soroban_sdk::{contracttype, Address, Env};

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    BottleFactory,
    TraceabilityLog,
}

// Re-export EventType for use in contract
#[derive(Clone, Debug, Eq, PartialEq)]
#[contracttype]
pub enum EventType {
    Bottling,
    Shipped,
    Received,
    Scanned,
}

// Bottle struct from BottleFactory (for type compatibility)
#[derive(Clone)]
#[contracttype]
pub struct Bottle {
    pub id: soroban_sdk::String,
    pub lot_id: soroban_sdk::String,
    pub bottle_number: u32,
    pub winery: Address,
    pub current_owner: Address,
    pub wine_name: soroban_sdk::String,
    pub vintage: u32,
    pub created_at: u64,
    pub metadata_uri: soroban_sdk::String,
}

pub fn extend_instance_ttl(e: &Env) {
    e.storage()
        .instance()
        .extend_ttl(INSTANCE_LIFETIME_THRESHOLD, INSTANCE_BUMP_AMOUNT);
}

pub fn has_bottle_factory(e: &Env) -> bool {
    e.storage().instance().has(&DataKey::BottleFactory)
}

pub fn put_bottle_factory(e: &Env, factory: &Address) {
    e.storage().instance().set(&DataKey::BottleFactory, factory);
}

pub fn get_bottle_factory(e: &Env) -> Result<Address, TransferError> {
    e.storage()
        .instance()
        .get(&DataKey::BottleFactory)
        .ok_or(TransferError::NotInitialized)
}

pub fn put_traceability_log(e: &Env, log: &Address) {
    e.storage().instance().set(&DataKey::TraceabilityLog, log);
}

pub fn get_traceability_log(e: &Env) -> Result<Address, TransferError> {
    e.storage()
        .instance()
        .get(&DataKey::TraceabilityLog)
        .ok_or(TransferError::NotInitialized)
}
