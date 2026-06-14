"use client";

import React, { useEffect, useState } from 'react';
import { ShieldAlert, AlertOctagon, Info, AlertTriangle, FileText, Lock, Activity } from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  type: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  details: any;
  ip: string;
  hash: string;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/audit');
        const json = await res.json();
        if (json.success) {
          setLogs(json.logs);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'warning': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'info': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default: return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertOctagon size={18} />;
      case 'warning': return <AlertTriangle size={18} />;
      case 'info': return <Info size={18} />;
      default: return <Activity size={18} />;
    }
  };

  return (
    <div className="animate-fade-up max-w-5xl mx-auto pb-20">
      <div className="mb-10">
        <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
          <Lock size={14} />
          <span>Sistema Inmutable</span>
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight flex items-center space-x-3">
          <ShieldAlert size={36} className="text-zinc-400" />
          <span>Registro de Auditoría Legal</span>
        </h1>
        <p className="text-zinc-400 mt-3 text-sm font-medium max-w-2xl">
          Historial inalterable de eventos críticos del sistema, bloqueos de comisiones y auditorías financieras. Estos registros son pruebas con validez jurídica amparadas bajo hashes criptográficos.
        </p>
      </div>

      <div className="glass-panel rounded-3xl border border-white/5 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-zinc-500 text-sm font-medium">Desencriptando registros seguros...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5 text-zinc-500 text-xs uppercase tracking-wider">
                  <th className="p-5 font-bold">Nivel</th>
                  <th className="p-5 font-bold">Fecha / Hora</th>
                  <th className="p-5 font-bold">Evento Crítico</th>
                  <th className="p-5 font-bold">Evidencia (IP / HASH)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-5">
                      <div className={`inline-flex items-center justify-center p-2 rounded-xl border ${getSeverityColor(log.severity)}`}>
                        {getSeverityIcon(log.severity)}
                      </div>
                    </td>
                    <td className="p-5 align-top">
                      <p className="text-sm font-bold text-zinc-300">
                        {new Date(log.timestamp).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </p>
                    </td>
                    <td className="p-5 align-top max-w-md">
                      <div className="mb-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">{log.type}</span>
                        <p className="text-sm font-bold text-white mt-1">{log.message}</p>
                      </div>
                      <div className="bg-black/30 rounded-lg p-3 text-xs border border-white/5">
                        <ul className="space-y-1">
                          {Object.entries(log.details).map(([key, value]) => (
                            <li key={key} className="flex space-x-2">
                              <span className="text-zinc-500 capitalize">{key}:</span>
                              <span className="text-zinc-300 font-medium">{String(value)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </td>
                    <td className="p-5 align-top">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 bg-white/5 rounded-md px-2 py-1 border border-white/5">
                          <span className="text-[10px] uppercase text-zinc-500 font-bold">IP:</span>
                          <span className="text-xs text-zinc-300 font-mono">{log.ip}</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-white/5 rounded-md px-2 py-1 border border-white/5">
                          <span className="text-[10px] uppercase text-zinc-500 font-bold">HASH:</span>
                          <span className="text-xs text-zinc-300 font-mono">{log.hash}</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
