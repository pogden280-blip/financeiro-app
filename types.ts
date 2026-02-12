
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
}

export interface FinanceSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
}

export const CATEGORIES = {
  income: ['Salário', 'Investimentos', 'Presente', 'Outros'],
  expense: ['Alimentação', 'Transporte', 'Moradia', 'Lazer', 'Saúde', 'Educação', 'Outros']
};
