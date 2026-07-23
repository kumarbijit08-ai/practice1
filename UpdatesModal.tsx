import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { useWeb } from '../context/WebContext';

interface UpdatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
}

export default function UpdatesModal({ isOpen, onClose, theme }: UpdatesModalProps) {
  const { data } = useWeb();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`w-full max-w-lg rounded-3xl p-6 shadow-2xl relative ${theme === 'dark' ? 'bg-neutral-900 border border-neutral-800' : 'bg-white'}`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full ${theme === 'dark' ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100'}`}
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-black mb-6">Latest Updates</h2>
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
          {(Array.isArray(data?.updates) && data.updates.length > 0) ? (
            data.updates.map((update) => (
              <div key={update.id} className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-neutral-950 border border-neutral-800' : 'bg-neutral-50 border border-neutral-100'}`}>
                <h3 className="font-bold text-lg mb-1">{update.title}</h3>
                <p className="text-sm text-neutral-500 mb-3 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {update.date}
                </p>
                {update.imageUrl && (
                  <img src={update.imageUrl} alt={update.title} className="max-w-full h-auto rounded-xl mb-3" />
                )}
                <p className="text-sm leading-relaxed">{update.content}</p>
              </div>
            ))
          ) : (
            <p className="text-neutral-500">No updates available at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}
