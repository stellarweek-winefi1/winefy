use soroban_sdk::{contracttype, symbol_short, Address, Env, String};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BottleMintedEvent {
    pub bottle_id: String,
    pub lot_id: String,
    pub bottle_number: u32,
    pub winery: Address,
    pub wine_name: String,
    pub vintage: u32,
}

pub(crate) fn emit_bottle_minted(
    e: &Env,
    bottle_id: String,
    lot_id: String,
    bottle_number: u32,
    winery: Address,
    wine_name: String,
    vintage: u32,
) {
    let event = BottleMintedEvent {
        bottle_id: bottle_id.clone(),
        lot_id,
        bottle_number,
        winery: winery.clone(),
        wine_name,
        vintage,
    };
    e.events()
        .publish(("BottleFactory", symbol_short!("minted")), event);
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct OwnerUpdatedEvent {
    pub bottle_id: String,
    pub previous_owner: Address,
    pub new_owner: Address,
}

pub(crate) fn emit_owner_updated(
    e: &Env,
    bottle_id: String,
    previous_owner: Address,
    new_owner: Address,
) {
    let event = OwnerUpdatedEvent {
        bottle_id,
        previous_owner,
        new_owner,
    };
    e.events()
        .publish(("BottleFactory", symbol_short!("ownr_upd")), event);
}
