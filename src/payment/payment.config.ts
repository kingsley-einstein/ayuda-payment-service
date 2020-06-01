import Paystack from "paystack";
import PaystackTransfer from "paystack-transfer";
import env from "../env";

export class Payment {
  payment: Paystack.Object;
  transfer: any;

  constructor() {
    this.configure();
  }

  configure(): void {
    this.payment = Paystack(env.paystack_secret);
    this.transfer = PaystackTransfer(env.paystack_secret);
  }

  async initializeTransaction(
    amount: number, 
    reference: string, 
    name: string, 
    email: string,
    callback_url: string,
    currency: string = "NGN"
  ) {
    const Transaction = this.payment.transaction;
    const response = await Transaction.initialize({
      amount,
      reference,
      name,
      email,
      callback_url,
      currency
    });
    return response;
  }

  async verifyTransaction(reference: string) {
    const Transaction = this.payment.transaction;
    const response = await Transaction.verify(reference);
    return response;
  }

  async createTransferRecipient(
    accountNumber: any, 
    bankName: string, 
    name: string,
    description: string = "Ayuda transfer recipient",
    metadata: any = {}
  ) {
    const Banks = this.transfer.all_banks;
    const recipient = await this.transfer.createRecipient(
      name, description, accountNumber, Banks[bankName], metadata
    );
    return recipient;
  }

  async initiateTransfer(
    source: any, 
    amount: any,
    recipient: any,
    reason: string = "Eligible for withdrawal from Ayuda."
  ) {
    const initializedTransfer = await this.transfer.initiateSingle(
      source, reason, amount, recipient
    );
    return initializedTransfer;
  }

  // async finalizeTransfer(code: any, otp: any) {
  //   const finalizedTransfer = await this.transfer.finalize(code, otp);
  //   return finalizedTransfer;
  // }
  async fetchTransfer(code: any) {
    const transferByCode = await this.transfer.fetchTransfer(code);
    return transferByCode;
  }
}
