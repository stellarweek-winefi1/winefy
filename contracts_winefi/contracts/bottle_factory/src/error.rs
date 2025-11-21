use soroban_sdk::{self, contracterror};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum BottleFactoryError {
    NotInitialized = 400,
    AlreadyInitialized = 401,
    Unauthorized = 402,
    DuplicateBottle = 403,
    BottleNotFound = 404,
    InvalidInput = 405,
}

