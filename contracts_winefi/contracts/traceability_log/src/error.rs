use soroban_sdk::{self, contracterror};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum TraceabilityLogError {
    NotInitialized = 400,
    Unauthorized = 401,
    InvalidEvent = 402,
    InvalidInput = 403,
}

