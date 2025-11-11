import React, { useState, useEffect } from 'react';
import { IncomeEntry, EntryType, User } from '../../types';

interface EntryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Omit<IncomeEntry, 'id' | 'time'> | IncomeEntry) => void;
  entryToEdit: IncomeEntry | null;
  currentUser: User;
}

const EntryFormModal: React.FC<EntryFormModalProps> = ({ isOpen, onClose, onSave, entryToEdit, currentUser }) => {
  const [date, setDate] = useState('');
  const [type, setType] = useState<EntryType>(EntryType.IncomeAdd);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [recipient, setRecipient] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (entryToEdit) {
      setDate(entryToEdit.date);
      setType(entryToEdit.type);
      setAmount(entryToEdit.amount.toString());
      setDescription(entryToEdit.description);
      setRecipient(entryToEdit.recipient || '');
    } else {
      // Reset form
      setDate(new Date().toISOString().split('T')[0]);
      setType(EntryType.IncomeAdd);
      setAmount('');
      setDescription('');
      setRecipient('');
    }
  }, [entryToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isPaymentType = type === EntryType.IncomePayment || type === EntryType.OTPPayment;

    if (!date || !amount || !description) {
        setError('Date, Amount, and Description are required.');
        return;
    }
    if (isPaymentType && !recipient.trim()) {
      setError('Recipient name is required for payment types.');
      return;
    }
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
        setError('Please enter a valid positive amount.');
        return;
    }
    setError('');

    const entryData = {
        userId: currentUser.id,
        userName: currentUser.name,
        date,
        type,
        amount: numericAmount,
        description,
        recipient: isPaymentType ? recipient : undefined,
    };

    if (entryToEdit) {
        onSave({ ...entryData, id: entryToEdit.id, time: entryToEdit.time });
    } else {
        onSave(entryData);
    }
  };

  if (!isOpen) return null;

  const isPaymentType = type === EntryType.IncomePayment || type === EntryType.OTPPayment;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-full max-w-md m-4">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">{entryToEdit ? 'Edit Entry' : 'Add New Entry'}</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-300">Date</label>
              <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-300">Type</label>
              <select id="type" value={type} onChange={e => setType(e.target.value as EntryType)} className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
                <option value={EntryType.IncomeAdd}>Income Add</option>
                <option value={EntryType.IncomeMinus}>Income Minus (Expense)</option>
                <option value={EntryType.IncomePayment}>Income Payment (to Person)</option>
                <option value={EntryType.OTPAdd}>OTP Add</option>
                <option value={EntryType.OTPMinus}>OTP Minus (Expense)</option>
                <option value={EntryType.OTPPayment}>OTP Payment (to Person)</option>
              </select>
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-300">Amount (QR)</label>
              <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
              <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            {isPaymentType && (
              <div>
                <label htmlFor="recipient" className="block text-sm font-medium text-gray-300">Recipient Name <span className="text-red-400">*</span></label>
                <input 
                  type="text" 
                  id="recipient" 
                  value={recipient} 
                  onChange={e => setRecipient(e.target.value)} 
                  placeholder="e.g., Al Amin"
                  className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"/>
              </div>
            )}
          </div>
          <div className="p-4 bg-gray-900 bg-opacity-50 flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">{entryToEdit ? 'Update' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EntryFormModal;