
import React, { useState, useEffect, useCallback } from 'react';
import { Transaction } from './types';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import { getFinancialAdvice } from './services/geminiService';
import { Plus, BrainCircuit, Sparkles, Loader2, RefreshCcw } from 'lucide-react';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('financas_pro_transactions');
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load transactions", e);
      }
    }
  }, []);

  // Save to local storage when transactions change
  useEffect(() => {
    localStorage.setItem('financas_pro_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (newT: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newT,
      id: Math.random().toString(36).substring(2, 9),
    };
    setTransactions(prev => [...prev, transaction]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleGetAdvice = async () => {
    setIsLoadingAdvice(true);
    const advice = await getFinancialAdvice(transactions);
    setAiAdvice(advice);
    setIsLoadingAdvice(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 lg:pb-8">
      {/* Header */}
      <header className="bg-indigo-600 text-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white p-1.5 rounded-lg shadow-sm">
              <Sparkles className="text-indigo-600" size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Finanças Pró</h1>
          </div>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 px-4 py-2 rounded-lg font-semibold transition-all shadow-sm"
          >
            <Plus size={20} />
            Nova Transação
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero / AI Advice Section */}
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-3xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <BrainCircuit size={120} />
          </div>
          
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                AI Insight
              </span>
            </div>
            
            {aiAdvice ? (
              <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-500">
                <p className="text-indigo-100 text-lg leading-relaxed whitespace-pre-line">
                  {aiAdvice}
                </p>
                <button 
                  onClick={handleGetAdvice}
                  disabled={isLoadingAdvice}
                  className="flex items-center gap-2 text-indigo-200 hover:text-white transition-colors text-sm font-medium"
                >
                  <RefreshCcw size={16} className={isLoadingAdvice ? 'animate-spin' : ''} />
                  Atualizar conselho
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-3xl font-bold mb-3">Sua saúde financeira, turbinada por IA.</h2>
                <p className="text-indigo-200 mb-6">
                  Nossa inteligência artificial analisa seus gastos e sugere onde você pode economizar de verdade.
                </p>
                <button 
                  onClick={handleGetAdvice}
                  disabled={isLoadingAdvice || transactions.length === 0}
                  className="bg-white text-indigo-900 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingAdvice ? <Loader2 className="animate-spin" size={20} /> : <BrainCircuit size={20} />}
                  Consultar IA Financeira
                </button>
                {transactions.length === 0 && (
                  <p className="mt-3 text-xs text-indigo-300">Adicione transações para habilitar a IA</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Dashboard Components */}
        <Dashboard transactions={transactions} />

        {/* Transaction History */}
        <TransactionList transactions={transactions} onDelete={deleteTransaction} />
      </main>

      {/* Floating Action Button (Mobile) */}
      <button 
        onClick={() => setIsFormOpen(true)}
        className="sm:hidden fixed bottom-6 right-6 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50 hover:scale-110 active:scale-95 transition-transform"
      >
        <Plus size={32} />
      </button>

      {/* Form Modal */}
      {isFormOpen && (
        <TransactionForm onAdd={addTransaction} onClose={() => setIsFormOpen(false)} />
      )}
    </div>
  );
};

export default App;
