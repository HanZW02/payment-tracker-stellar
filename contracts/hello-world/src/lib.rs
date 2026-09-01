#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, Symbol};

// Payment Status
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum PaymentStatus {
    Pending,
    Completed,
    Failed,
}

// Payment Data Structure
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PaymentRecord {
    pub customer: Address,
    pub amount: i128,
    pub status: PaymentStatus,
}

#[contract]
pub struct PaymentTrackerContract;

#[contractimpl]
impl PaymentTrackerContract {
    pub fn create_payment(env: Env, order_id: Symbol, customer: Address, amount: i128) {
        customer.require_auth();

        let new_payment = PaymentRecord {
            customer,
            amount,
            status: PaymentStatus::Pending,
        };

        env.storage().persistent().set(&order_id, &new_payment);

        env.events().publish((symbol_short!("created"), order_id), new_payment);
    }
}

// Change Status
    pub fn complete_payment(env: Env, order_id: Symbol) {
        let mut payment: PaymentRecord = env.storage().persistent().get(&order_id).unwrap();

        payment.status = PaymentStatus::Completed;

        env.storage().persistent().set(&order_id, &payment);

        env.events().publish((symbol_short!("completed"), order_id.clone()), payment);
    }

    // Read Payment Detail
    pub fn get_payment(env: Env, order_id: Symbol) -> PaymentRecord {
        env.storage().persistent().get(&order_id).unwrap()
    }