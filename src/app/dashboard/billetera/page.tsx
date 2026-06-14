"use client";

import React, { useState } from 'react';
import { Wallet, CreditCard, Coins, ArrowRight, Zap, History, TrendingUp, Building2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function BilleteraPage() {
  const [bankConnected, setBankConnected] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [saldo, setSaldo] = useState(340.50);

  const handleWithdraw = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(withdrawAmount) })
      });
      const data = await res.json();
      if (data.success) {
        setSaldo(prev => prev - parseFloat(withdrawAmount));
        setShowWithdrawModal(false);
        setWithdrawAmount('');
        // Aquí idealmente mostraríamos un toast de éxito
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="animate-fade-up max-w-5xl mx-auto pb-20 relative">
      <div className="mb-10">
        <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
          <Coins size={14} />
          <span>Ecosistema Financiero</span>
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight flex items-center space-x-3">
          <Wallet size={36} className="text-zinc-400" />
          <span>Mi Billetera</span>
        </h1>
        <p className="text-zinc-400 mt-3 text-sm font-medium max-w-2xl">
          Gestiona tu saldo acumulado por ventas (Amazon) y retira tus fondos directamente a tu banco personal, Payoneer o PayPal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Card: Saldo Monetización */}
        <div className="glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 transition-transform group-hover:scale-110">
            <TrendingUp size={120} />
          </div>
          <div className="relative z-10">
            <h3 className="text-zinc-400 text-sm font-bold uppercase tracking-widest mb-2">Saldo Disponible</h3>
            <div className="flex items-end space-x-2 mb-6">
              <span className="text-5xl font-black text-white">${saldo.toFixed(2)}</span>
              <span className="text-zinc-500 mb-1 font-medium">USD</span>
            </div>
            
            <p className="text-xs text-emerald-400 font-medium mb-6 flex items-center space-x-1 bg-emerald-500/10 inline-flex px-2 py-1 rounded-md">
              <TrendingUp size={12} />
              <span>+$45.00 esta semana por Amazon Afiliados</span>
            </p>

            <div className="flex flex-col space-y-3">
              {!bankConnected ? (
                <button 
                  onClick={() => setBankConnected(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all text-sm shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-2"
                >
                  <Building2 size={16} />
                  <span>Conectar Banco, Payoneer o PayPal</span>
                </button>
              ) : (
                <button 
                  onClick={() => setShowWithdrawModal(true)}
                  className="w-full bg-white text-black font-bold py-3 px-4 rounded-xl hover:bg-zinc-200 transition-all text-sm shadow-lg shadow-white/10 flex items-center justify-center space-x-2"
                >
                  <CreditCard size={16} />
                  <span>Retirar Fondos a mi Banco</span>
                </button>
              )}
              
              <button className="w-full bg-white/5 border border-white/10 text-white font-bold py-3 px-4 rounded-xl hover:bg-white/10 transition-all text-sm">
                Pagar Mensualidad Altus
              </button>
            </div>
            
            {bankConnected && (
              <p className="text-[10px] text-zinc-500 mt-4 flex items-center justify-center space-x-1 font-medium">
                <CheckCircle2 size={12} className="text-emerald-500" />
                <span>Cuenta verificada (Terminada en 4091)</span>
              </p>
            )}
          </div>
        </div>

        {/* Card: Créditos de IA */}
        <div className="glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 transition-transform group-hover:scale-110">
            <Zap size={120} />
          </div>
          <div className="relative z-10">
            <h3 className="text-zinc-400 text-sm font-bold uppercase tracking-widest mb-2">Créditos de IA Restantes</h3>
            <div className="flex items-end space-x-2 mb-6">
              <span className="text-5xl font-black text-blue-400">1,840</span>
              <span className="text-zinc-500 mb-1 font-medium">/ 2000</span>
            </div>
            
            <div className="w-full bg-white/5 rounded-full h-2 mb-6 overflow-hidden">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
            </div>

            <button className="w-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold py-3 px-4 rounded-xl hover:bg-blue-500/20 transition-all text-sm flex items-center justify-center space-x-2">
              <Zap size={16} />
              <span>Comprar Recarga (Top-Up)</span>
            </button>
          </div>
        </div>

      </div>

      {/* Historial de Transacciones */}
      <div className="glass-panel rounded-3xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center space-x-2">
          <History size={18} className="text-zinc-400" />
          <h2 className="text-lg font-bold text-white">Historial de Transacciones</h2>
        </div>
        <div className="p-6 text-center text-zinc-500 text-sm">
          Aún no hay transacciones recientes en tu billetera.
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-md w-full animate-fade-up">
            <h2 className="text-2xl font-black text-white mb-2">Retirar Fondos</h2>
            <p className="text-sm text-zinc-400 mb-6">El monto será transferido a tu banco, Payoneer o cuenta de PayPal. Toma de 3 a 5 días hábiles.</p>
            
            <div className="bg-black border border-white/5 rounded-xl p-4 mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-500 font-medium">Saldo Disponible</span>
                <span className="text-emerald-400 font-bold">${saldo.toFixed(2)} USD</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl text-zinc-500 font-medium">$</span>
                <input 
                  type="number" 
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.00"
                  className="bg-transparent text-3xl font-black text-white w-full outline-none"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button 
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors text-sm"
                disabled={isProcessing}
              >
                Cancelar
              </button>
              <button 
                onClick={handleWithdraw}
                disabled={isProcessing || !withdrawAmount || parseFloat(withdrawAmount) < 50 || parseFloat(withdrawAmount) > saldo}
                className="flex-[2] px-4 py-3 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>Confirmar Retiro</span>
                )}
              </button>
            </div>
            
            {(parseFloat(withdrawAmount) > 0 && parseFloat(withdrawAmount) < 50) && (
              <p className="text-red-400 text-xs text-center mt-4 font-medium flex items-center justify-center space-x-1">
                <AlertCircle size={12} />
                <span>El monto mínimo de retiro es de $50.00 USD</span>
              </p>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
