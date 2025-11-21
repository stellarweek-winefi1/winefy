use crate::constants::{
    INSTANCE_BUMP_AMOUNT, INSTANCE_LIFETIME_THRESHOLD, PERSISTENT_BUMP_AMOUNT,
    PERSISTENT_LIFETIME_THRESHOLD,
};
use crate::error::BottleFactoryError;
use soroban_sdk::{contracttype, Address, Env, String};

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    Bottle(String),
}

#[derive(Clone)]
#[contracttype]
pub struct Bottle {
    pub id: String,
    pub lot_id: String,
    pub bottle_number: u32,
    pub winery: Address,
    pub current_owner: Address,
    pub wine_name: String,
    pub vintage: u32,
    pub created_at: u64,
    pub metadata_uri: String,
}

pub fn extend_instance_ttl(e: &Env) {
    e.storage()
        .instance()
        .extend_ttl(INSTANCE_LIFETIME_THRESHOLD, INSTANCE_BUMP_AMOUNT);
}

pub fn extend_persistent_ttl(e: &Env, key: &DataKey) {
    e.storage()
        .persistent()
        .extend_ttl(key, PERSISTENT_LIFETIME_THRESHOLD, PERSISTENT_BUMP_AMOUNT);
}

pub fn has_admin(e: &Env) -> bool {
    e.storage().instance().has(&DataKey::Admin)
}

pub fn put_admin(e: &Env, admin: &Address) {
    e.storage().instance().set(&DataKey::Admin, admin);
}

pub fn get_admin(e: &Env) -> Result<Address, BottleFactoryError> {
    e.storage()
        .instance()
        .get(&DataKey::Admin)
        .ok_or(BottleFactoryError::NotInitialized)
}

pub fn put_bottle(e: &Env, bottle_id: &String, bottle: &Bottle) {
    let key = DataKey::Bottle(bottle_id.clone());
    e.storage().persistent().set(&key, bottle);
    extend_persistent_ttl(e, &key);
}

pub fn has_bottle(e: &Env, bottle_id: &String) -> bool {
    let key = DataKey::Bottle(bottle_id.clone());
    e.storage().persistent().has(&key)
}

pub fn get_bottle(e: &Env, bottle_id: &String) -> Option<Bottle> {
    let key = DataKey::Bottle(bottle_id.clone());
    e.storage()
        .persistent()
        .get(&key)
        .map(|bottle| {
            extend_persistent_ttl(e, &key);
            bottle
        })
}
