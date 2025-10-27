export class TransactionDTO {
  id: string;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  status: string;
  createdAt: Date;

  constructor(transaction: any) {
    this.id = transaction._id;
    this.type = transaction.type;
    this.amount = transaction.amount;
    this.balanceBefore = transaction.balanceBefore;
    this.balanceAfter = transaction.balanceAfter;
    this.description = transaction.description;
    this.status = transaction.status;
    this.createdAt = transaction.createdAt;
  }
}