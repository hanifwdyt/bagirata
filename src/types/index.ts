export interface Participant {
  id: string;
  name: string;
  amount: number;
}

export interface DebtTransaction {
  from: string;
  to: string;
  amount: number;
}

export interface ExpenseSummary {
  totalExpense: number;
  averagePerPerson: number;
  participants: Participant[];
  transactions: DebtTransaction[];
}

export interface SessionData {
  participants: Participant[];
  timestamp: number;
}