import React, { useState } from 'react';
import { Plus, Edit, Trash, Eye, CheckCircle, XCircle } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { Template } from '../types';

interface TemplateFormData {
  name: string;
  description: string;
  price: string;
  tier: 'Basic' | 'Premium' | 'Enterprise';
}

const initialFormData: TemplateFormData = {
  name: '',
  description: '',
  price: '',
  tier: 'Basic',
};

export function TemplateManager() {
  const { walletState } = useWallet();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<TemplateFormData>(initialFormData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletState.marketplace) return;

    try {
      await walletState.marketplace.createTemplate(
        formData.name,
        JSON.stringify({ description: formData.description }),
        parseFloat(formData.price),
        ['Basic', 'Premium', 'Enterprise'].indexOf(formData.tier)
      );
      setIsCreating(false);
      setFormData(initialFormData);
    } catch (error) {
      console.error('Failed to create template:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Template Management</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Template
        </button>
      </div>

      {isCreating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Create New Template</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 p-2 bg-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 p-2 bg-transparent"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price (ETH)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 p-2 bg-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tier</label>
                <select
                  value={formData.tier}
                  onChange={(e) => setFormData({ ...formData, tier: e.target.value as Template['tier'] })}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 p-2 bg-transparent"
                  required
                >
                  <option value="Basic">Basic</option>
                  <option value="Premium">Premium</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Create Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Template
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Tier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {mockTemplates.map((template) => (
              <tr key={template.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div>
                      <div className="font-medium">{template.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {template.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{template.price} ETH</td>
                <td className="px-6 py-4">{template.tier}</td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Active
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-1 hover:text-blue-500 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1 hover:text-yellow-500 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1 hover:text-red-500 transition-colors">
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Mock data for development
const mockTemplates = [
  {
    id: '1',
    name: 'NFT Marketplace Template',
    description: 'A complete NFT marketplace solution with bidding and auctions.',
    price: 0.5,
    tier: 'Premium',
  },
  {
    id: '2',
    name: 'DeFi Dashboard',
    description: 'Professional DeFi dashboard with portfolio tracking and swap interface.',
    price: 0.3,
    tier: 'Basic',
  },
  {
    id: '3',
    name: 'DAO Governance',
    description: 'Enterprise-grade DAO governance system with voting and proposals.',
    price: 1.0,
    tier: 'Enterprise',
  },
];
