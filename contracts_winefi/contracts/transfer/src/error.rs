use soroban_sdk::{self, contracterror};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum TransferError {
    NotInitialized = 400,
    AlreadyInitialized = 401,
    Unauthorized = 402,
    BottleNotFound = 403,
    FactoryCallFailed = 404,
    LogCallFailed = 405,
    InvalidInput = 406,
}

