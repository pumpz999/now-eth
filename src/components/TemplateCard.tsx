import React from 'react';
import { Template } from '../types';
import { Tag, Star } from 'lucide-react';

interface TemplateCardProps {
  template: Template;
  onPurchase: (templateId: string) => void;
}

export function TemplateCard({ template, onPurchase }: TemplateCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <img
        src={template.previewUrl}
        alt={template.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">{template.name}</h3>
          <span className="flex items-center gap-1 text-sm text-gray-500">
            <Tag className="w-4 h-4" />
            {template.tier}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          {template.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">{template.price} ETH</span>
          <button
            onClick={() => onPurchase(template.id)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Star className="w-4 h-4" />
            Purchase
          </button>
        </div>
      </div>
    </div>
  );
}
