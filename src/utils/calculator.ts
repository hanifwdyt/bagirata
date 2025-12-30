import { Participant, DebtTransaction, ExpenseSummary } from '@/types';

export function calculateExpenseSplit(participants: Participant[]): ExpenseSummary {
  if (participants.length === 0) {
    return {
      totalExpense: 0,
      averagePerPerson: 0,
      participants: [],
      transactions: []
    };
  }

  const totalExpense = participants.reduce((sum, p) => sum + p.amount, 0);
  const averagePerPerson = totalExpense / participants.length;

  // Calculate who owes how much
  const debts = participants.map(p => ({
    name: p.name,
    balance: p.amount - averagePerPerson
  }));

  // Separate debtors and creditors
  const debtors = debts.filter(d => d.balance < 0).map(d => ({
    name: d.name,
    amount: Math.abs(d.balance)
  }));
  
  const creditors = debts.filter(d => d.balance > 0).map(d => ({
    name: d.name,
    amount: d.balance
  }));

  // Generate simplified transactions
  const transactions: DebtTransaction[] = [];
  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];
    
    const amount = Math.min(debtor.amount, creditor.amount);
    
    transactions.push({
      from: debtor.name,
      to: creditor.name,
      amount: Math.round(amount)
    });

    debtor.amount -= amount;
    creditor.amount -= amount;

    if (debtor.amount === 0) debtorIndex++;
    if (creditor.amount === 0) creditorIndex++;
  }

  return {
    totalExpense: Math.round(totalExpense),
    averagePerPerson: Math.round(averagePerPerson),
    participants,
    transactions
  };
}