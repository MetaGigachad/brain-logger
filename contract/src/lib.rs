//! Contract definition

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::Vector;
use near_sdk::env::{block_timestamp_ms, signer_account_id};
use near_sdk::store::UnorderedMap;
use near_sdk::{near_bindgen, AccountId};
use std::cmp::min;

mod schemas;
use schemas::{BlockResponse, Message, User};

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    messages: Vector<Message>,
    users: UnorderedMap<AccountId, User>,
}

impl Default for Contract {
    fn default() -> Self {
        Self {
            messages: Vector::new(b"vector-messages".to_vec()),
            users: UnorderedMap::new(b"umap-users".to_vec()),
        }
    }
}

#[near_bindgen]
impl Contract {
    /// Returns latest block of messages of specified `length` or less
    pub fn get_latest_block(&self, length: u64) -> BlockResponse {
        let mut block = Vec::new();
        let start_id = if length >= self.messages.len() {
            0
        } else {
            self.messages.len() - length
        };
        for i in start_id..self.messages.len() {
            block.push(self.messages.get(i).unwrap());
        }
        BlockResponse { block, start_id }
    }

    /// Returns block of messages which starts from `start_id` and has specified
    /// `length` or less
    pub fn get_block(&self, start_id: u64, length: u64) -> BlockResponse {
        let mut block = Vec::new();
        if start_id >= self.messages.len() {
            return BlockResponse { block, start_id };
        }
        for i in start_id..min(self.messages.len(), start_id + length) {
            block.push(self.messages.get(i).unwrap());
        }
        BlockResponse { block, start_id }
    }

    /// Adds new message to contract `messages` state
    pub fn push_message(&mut self, text: String) {
        if text.is_empty() {
            return;
        }

        self.messages.push(&Message {
            text,
            timestamp: block_timestamp_ms(),
            sender: signer_account_id(),
        })
    }

    /// Edits user info in contract's `user` state
    pub fn add_user_info(
        &mut self,
        name: Option<String>,
        surname: Option<String>,
        photo_url: Option<String>,
    ) {
        let mut user = User {
            name,
            surname,
            photo_url,
        };
        if let Some(user_old) = self.users.get(&signer_account_id()).cloned() {
            if user.name == None {
                user.name = user_old.name;
            }
            if user.surname == None {
                user.surname = user_old.surname;
            }
            if user.photo_url == None {
                user.photo_url = user_old.photo_url;
            }
        }
        self.users.insert(signer_account_id(), user);
    }

    /// Returns user info for `user_id`
    pub fn get_user_info(&self, user_id: AccountId) -> Option<User> {
        self.users.get(&user_id).cloned()
    }
}

#[cfg(test)]
mod tests {}
