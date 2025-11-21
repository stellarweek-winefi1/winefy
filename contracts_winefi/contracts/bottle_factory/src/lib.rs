#![no_std]

mod constants;
mod error;
mod events;
mod storage;

use error::BottleFactoryError;
use events::emit_bottle_minted;
use soroban_sdk::{contract, contractimpl, Address, Env, String, Vec};
use storage::{extend_instance_ttl, get_admin, get_bottle, has_bottle, put_admin, put_bottle};

pub use storage::Bottle;

#[contract]
pub struct BottleFactory;

#[contractimpl]
impl BottleFactory {
    pub fn init(e: Env, admin: Address) -> Result<(), BottleFactoryError> {
        if storage::has_admin(&e) {
            return Err(BottleFactoryError::AlreadyInitialized);
        }
        put_admin(&e, &admin);
        extend_instance_ttl(&e);
        Ok(())
    }

    pub fn mint_bottle(
        e: Env,
        lot_id: String,
        bottle_number: u32,
        winery: Address,
        wine_name: String,
        vintage: u32,
        metadata_uri: String,
    ) -> Result<String, BottleFactoryError> {
        extend_instance_ttl(&e);
        let admin = get_admin(&e)?;
        admin.require_auth();

        // Generate unique bottle_id: {LOT_ID}-{BOTTLE_NUMBER}
        let bottle_id = format_bottle_id(&e, &lot_id, bottle_number);

        // Check if bottle already exists
        if has_bottle(&e, &bottle_id) {
            return Err(BottleFactoryError::DuplicateBottle);
        }

        // Create bottle record
        let bottle = Bottle {
            id: bottle_id.clone(),
            lot_id: lot_id.clone(),
            bottle_number,
            winery: winery.clone(),
            current_owner: winery.clone(),
            wine_name: wine_name.clone(),
            vintage,
            created_at: e.ledger().timestamp(),
            metadata_uri: metadata_uri.clone(),
        };

        put_bottle(&e, &bottle_id, &bottle);

        emit_bottle_minted(
            &e,
            bottle_id.clone(),
            lot_id,
            bottle_number,
            winery,
            wine_name,
            vintage,
        );

        Ok(bottle_id)
    }

    pub fn get_bottle(e: Env, bottle_id: String) -> Result<Bottle, BottleFactoryError> {
        extend_instance_ttl(&e);
        get_bottle(&e, &bottle_id).ok_or(BottleFactoryError::BottleNotFound)
    }

    pub fn update_owner(
        e: Env,
        bottle_id: String,
        new_owner: Address,
    ) -> Result<(), BottleFactoryError> {
        extend_instance_ttl(&e);
        let current_owner = get_bottle(&e, &bottle_id)
            .ok_or(BottleFactoryError::BottleNotFound)?
            .current_owner;
        current_owner.require_auth();

        let mut bottle = get_bottle(&e, &bottle_id).ok_or(BottleFactoryError::BottleNotFound)?;
        bottle.current_owner = new_owner.clone();
        put_bottle(&e, &bottle_id, &bottle);

        events::emit_owner_updated(&e, bottle_id, current_owner, new_owner);

        Ok(())
    }

    pub fn admin(e: Env) -> Result<Address, BottleFactoryError> {
        extend_instance_ttl(&e);
        get_admin(&e)
    }
}

fn format_bottle_id(e: &Env, lot_id: &String, bottle_number: u32) -> String {
    // Format bottle_number as 4-digit string (0001, 0002, etc.)
    // Since format! is not available in no_std, we manually build the string
    let num_str = match bottle_number {
        n if n < 10 => {
            let prefix = String::from_str(e, "000");
            let n_str = u32_to_string(e, n);
            concat_strings(e, &prefix, &n_str)
        }
        n if n < 100 => {
            let prefix = String::from_str(e, "00");
            let n_str = u32_to_string(e, n);
            concat_strings(e, &prefix, &n_str)
        }
        n if n < 1000 => {
            let prefix = String::from_str(e, "0");
            let n_str = u32_to_string(e, n);
            concat_strings(e, &prefix, &n_str)
        }
        n => u32_to_string(e, n),
    };
    
    let dash = String::from_str(e, "-");
    let with_dash = concat_strings(e, lot_id, &dash);
    concat_strings(e, &with_dash, &num_str)
}

fn u32_to_string(e: &Env, mut n: u32) -> String {
    if n == 0 {
        return String::from_str(e, "0");
    }
    
    // Build digits in reverse order first (right to left)
    // We'll store them and build string forward (left to right)
    let mut digits: [u8; 10] = [0; 10]; // Max u32 has 10 digits
    let mut count = 0;
    
    while n > 0 {
        digits[count] = (n % 10) as u8;
        n /= 10;
        count += 1;
    }
    
    // Build string from most significant to least significant
    let mut result = String::from_str(e, "");
    for i in (0..count).rev() {
        let digit_char = match digits[i] {
            0 => "0",
            1 => "1",
            2 => "2",
            3 => "3",
            4 => "4",
            5 => "5",
            6 => "6",
            7 => "7",
            8 => "8",
            9 => "9",
            _ => unreachable!(),
        };
        let digit_str = String::from_str(e, digit_char);
        result = concat_strings(e, &result, &digit_str);
    }
    
    result
}

fn concat_strings(e: &Env, a: &String, b: &String) -> String {
    // Convert both strings to byte iterators
    let a_bytes = a.to_bytes();
    let b_bytes = b.to_bytes();
    
    // Collect all bytes into a fixed-size array (bottles IDs should be relatively short)
    let mut bytes_array = [0u8; 256]; // Max reasonable concatenated string length
    let mut idx = 0;
    
    // Copy bytes from first string (iterator yields u8 directly)
    for byte in a_bytes.iter() {
        if idx >= bytes_array.len() {
            break;
        }
        bytes_array[idx] = byte;
        idx += 1;
    }
    // Copy bytes from second string
    for byte in b_bytes.iter() {
        if idx >= bytes_array.len() {
            break;
        }
        bytes_array[idx] = byte;
        idx += 1;
    }
    
    String::from_bytes(e, &bytes_array[..idx])
}

mod test;
