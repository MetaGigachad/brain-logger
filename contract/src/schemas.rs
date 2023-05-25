//! Data schemes for contract state and methods

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{AccountId, Timestamp};

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Message {
    pub sender: AccountId,
    pub text: String,
    pub timestamp: Timestamp,
}

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct User {
    pub name: Option<String>,
    pub surname: Option<String>,
    pub photo_url: Option<String>,
}

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize)]
#[serde(crate = "near_sdk::serde")]
pub struct BlockResponse {
    pub block: Vec<Message>,
    pub start_id: u64,
}
