use soroban_sdk::{contracttype, symbol_short, Address, Env, String};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct TransferCompletedEvent {
    pub bottle_id: String,
    pub from: Address,
    pub to: Address,
}

pub(crate) fn emit_transfer_completed(
    e: &Env,
    bottle_id: String,
    from: Address,
    to: Address,
) {
    let event = TransferCompletedEvent {
        bottle_id,
        from,
        to,
    };
    e.events()
        .publish(("Transfer", symbol_short!("completed")), event);
}

