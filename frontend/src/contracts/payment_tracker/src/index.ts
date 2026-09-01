import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CAPPSOIGFKBBEEJDKBZ2SEDRZD6IP2R6VZJ5KPWI4Z6PFHS4RWNU65IH",
  }
} as const


export interface PaymentRecord {
  amount: i128;
  customer: string;
  status: PaymentStatus;
}

export type PaymentStatus = {tag: "Pending", values: void} | {tag: "Completed", values: void} | {tag: "Failed", values: void};

export interface Client {
  /**
   * Construct and simulate a get_payment transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_payment: ({order_id}: {order_id: string}, options?: MethodOptions) => Promise<AssembledTransaction<PaymentRecord>>

  /**
   * Construct and simulate a create_payment transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  create_payment: ({order_id, customer, amount}: {order_id: string, customer: string, amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a complete_payment transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  complete_payment: ({order_id}: {order_id: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAQAAAAAAAAAAAAAADVBheW1lbnRSZWNvcmQAAAAAAAADAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAACGN1c3RvbWVyAAAAEwAAAAAAAAAGc3RhdHVzAAAAAAfQAAAADVBheW1lbnRTdGF0dXMAAAA=",
        "AAAAAgAAAAAAAAAAAAAADVBheW1lbnRTdGF0dXMAAAAAAAADAAAAAAAAAAAAAAAHUGVuZGluZwAAAAAAAAAAAAAAAAlDb21wbGV0ZWQAAAAAAAAAAAAAAAAAAAZGYWlsZWQAAA==",
        "AAAAAAAAAAAAAAALZ2V0X3BheW1lbnQAAAAAAQAAAAAAAAAIb3JkZXJfaWQAAAARAAAAAQAAB9AAAAANUGF5bWVudFJlY29yZAAAAA==",
        "AAAAAAAAAAAAAAAOY3JlYXRlX3BheW1lbnQAAAAAAAMAAAAAAAAACG9yZGVyX2lkAAAAEQAAAAAAAAAIY3VzdG9tZXIAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
        "AAAAAAAAAAAAAAAQY29tcGxldGVfcGF5bWVudAAAAAEAAAAAAAAACG9yZGVyX2lkAAAAEQAAAAA=" ]),
      options
    )
  }
  public readonly fromJSON = {
    get_payment: this.txFromJSON<PaymentRecord>,
        create_payment: this.txFromJSON<null>,
        complete_payment: this.txFromJSON<null>
  }
}