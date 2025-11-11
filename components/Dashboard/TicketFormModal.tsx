import React, { useState, useEffect } from 'react';
import { TicketEntry, TripType } from '../../types';

interface TicketFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: TicketEntry) => void;
  entryToEdit: TicketEntry | null;
}

const TicketFormModal: React.FC<TicketFormModalProps> = ({ isOpen, onClose, onSave, entryToEdit }) => {
  
  const getInitialState = () => ({
    passengerName: '',
    pnr: '',
    flightName: '',
    issueDate: '',
    tripType: TripType.OneWay,
    from: '',
    to: '',
    departureDate: '',
    arrivalDate: '',
    returnDate: '',
    fromIssuer: '',
    bdNumber: '',
    qrNumber: '',
    ticketCopy: null as { fileName: string; dataUrl: string } | null,
  });

  const [formData, setFormData] = useState(getInitialState());
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (isOpen && entryToEdit) {
        setFormData({
            passengerName: entryToEdit.passengerName,
            pnr: entryToEdit.pnr,
            flightName: entryToEdit.flightName,
            issueDate: entryToEdit.issueDate,
            tripType: entryToEdit.tripType,
            from: entryToEdit.from,
            to: entryToEdit.to,
            departureDate: entryToEdit.departureDate,
            arrivalDate: entryToEdit.arrivalDate,
            returnDate: entryToEdit.returnDate || '',
            fromIssuer: entryToEdit.fromIssuer,
            bdNumber: entryToEdit.bdNumber || '',
            qrNumber: entryToEdit.qrNumber || '',
            ticketCopy: entryToEdit.ticketCopy,
        });
        setError('');
    } else {
        setFormData(getInitialState());
    }
  }, [entryToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          ticketCopy: { fileName: file.name, dataUrl: reader.result as string },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryToEdit) return;
    setError('');

    const { passengerName, pnr, flightName, issueDate, from, to, departureDate, arrivalDate, fromIssuer } = formData;
    if (!passengerName.trim() || !pnr.trim() || !flightName.trim() || !issueDate || !from.trim() || !to.trim() || !departureDate || !arrivalDate.trim() || !fromIssuer.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    
    setError('');

    const ticketData: TicketEntry = {
        ...entryToEdit,
        ...formData,
        returnDate: formData.tripType === TripType.Return ? formData.returnDate : undefined,
    };

    onSave(ticketData);
  };

  if (!isOpen || !entryToEdit) return null;

  const formGridClass = "grid grid-cols-1 md:grid-cols-2 gap-4";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-full max-w-2xl m-4">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Edit Ticket Entry</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {error && <p className="text-red-400 text-sm mb-4 col-span-full">{error}</p>}
            <div className={formGridClass}>
                {/* Fields */}
                <div>
                  <label htmlFor="passengerName-edit" className="block text-sm font-medium text-gray-300">Passenger Name <span className="text-red-400">*</span></label>
                  <input type="text" id="passengerName-edit" name="passengerName" value={formData.passengerName} onChange={handleChange} className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2"/>
                </div>
                <div>
                  <label htmlFor="pnr-edit" className="block text-sm font-medium text-gray-300">PNR <span className="text-red-400">*</span></label>
                  <input type="text" id="pnr-edit" name="pnr" value={formData.pnr} onChange={handleChange} className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2"/>
                </div>
                <div>
                  <label htmlFor="flightName-edit" className="block text-sm font-medium text-gray-300">Airline / Flight Name <span className="text-red-400">*</span></label>
                  <input type="text" id="flightName-edit" name="flightName" value={formData.flightName} onChange={handleChange} className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2"/>
                </div>
                <div>
                  <label htmlFor="fromIssuer-edit" className="block text-sm font-medium text-gray-300">From Issuer <span className="text-red-400">*</span></label>
                  <input type="text" id="fromIssuer-edit" name="fromIssuer" value={formData.fromIssuer} onChange={handleChange} className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2"/>
                </div>
                <div>
                  <label htmlFor="from-edit" className="block text-sm font-medium text-gray-300">From <span className="text-red-400">*</span></label>
                  <input type="text" id="from-edit" name="from" value={formData.from} onChange={handleChange} className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2"/>
                </div>
                <div>
                  <label htmlFor="to-edit" className="block text-sm font-medium text-gray-300">To <span className="text-red-400">*</span></label>
                  <input type="text" id="to-edit" name="to" value={formData.to} onChange={handleChange} className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2"/>
                </div>
                <div>
                  <label htmlFor="departureDate-edit" className="block text-sm font-medium text-gray-300">Departure Date <span className="text-red-400">*</span></label>
                  <input type="date" id="departureDate-edit" name="departureDate" value={formData.departureDate} onChange={handleChange} className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2"/>
                </div>
                 <div>
                  <label htmlFor="arrivalDate-edit" className="block text-sm font-medium text-gray-300">Arrival Date <span className="text-red-400">*</span></label>
                  <input type="date" id="arrivalDate-edit" name="arrivalDate" value={formData.arrivalDate} onChange={handleChange} className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2"/>
                </div>
                <div>
                    <label htmlFor="tripType-edit" className="block text-sm font-medium text-gray-300">Trip Type</label>
                    <select id="tripType-edit" name="tripType" value={formData.tripType} onChange={handleChange} className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2">
                        <option value={TripType.OneWay}>1 Way</option>
                        <option value={TripType.Return}>Return</option>
                    </select>
                </div>
                {formData.tripType === TripType.Return && (
                  <div>
                    <label htmlFor="returnDate-edit" className="block text-sm font-medium text-gray-300">Return Date</label>
                    <input type="date" id="returnDate-edit" name="returnDate" value={formData.returnDate} onChange={handleChange} className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2"/>
                  </div>
                )}
                <div>
                    <label htmlFor="issueDate-edit" className="block text-sm font-medium text-gray-300">Issue Date <span className="text-red-400">*</span></label>
                    <input type="date" id="issueDate-edit" name="issueDate" value={formData.issueDate} onChange={handleChange} className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2"/>
                </div>
                 <div>
                    <label htmlFor="bdNumber-edit" className="block text-sm font-medium text-gray-300">BD Number</label>
                    <input type="text" id="bdNumber-edit" name="bdNumber" value={formData.bdNumber} onChange={handleChange} className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2"/>
                </div>
                <div>
                    <label htmlFor="qrNumber-edit" className="block text-sm font-medium text-gray-300">QR Number</label>
                    <input type="text" id="qrNumber-edit" name="qrNumber" value={formData.qrNumber} onChange={handleChange} className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2"/>
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="ticketCopy-edit" className="block text-sm font-medium text-gray-300">Ticket Copy (PDF/IMG)</label>
                    <input type="file" id="ticketCopy-edit" name="ticketCopy" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"/>
                    {formData.ticketCopy && (
                        <p className="text-xs text-gray-400 mt-1">Current file: <a href={formData.ticketCopy.dataUrl} download={formData.ticketCopy.fileName} className="text-blue-400 hover:underline">{formData.ticketCopy.fileName}</a>. Upload a new file to replace it.</p>
                    )}
                </div>
            </div>
          </div>
          <div className="p-4 bg-gray-900 bg-opacity-50 flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketFormModal;