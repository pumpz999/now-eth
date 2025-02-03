import React from 'react';
import { BarChart, Activity, Users, DollarSign, FileCode, ShieldCheck } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';

export function Dashboard() {
  const { walletState } = useWallet();
  const isAdmin = walletState.isConnected && walletState.address === "0x123"; // Replace with actual admin address

  const stats = [
    { label: 'Total Volume', value: '125.5 ETH', icon: BarChart },
    { label: 'Active Users', value: '1,234', icon: Users },
    { label: 'Templates Sold', value: '89', icon: Activity },
    { label: 'Current Fee Rate', value: '2.5%', icon: DollarSign },
    { label: 'Active Templates', value: '45', icon: FileCode },
    { label: 'Security Status', value: 'Secure', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-transform hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <Icon className="w-8 h-8 text-blue-500" />
              </div>
            </div>
          );
        })}
      </div>

      {isAdmin && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Admin Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Fee Management</h3>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  placeholder="New fee rate (%)"
                  className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 p-2 bg-transparent"
                />
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                  Update Fee
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Emergency Controls</h3>
              <div className="flex gap-4">
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
                  Pause Contract
                </button>
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
                  Resume Contract
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
