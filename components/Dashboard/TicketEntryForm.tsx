import React, { useState } from 'react';
import { TicketEntry, TripType, User } from '../../types';

interface TicketEntryFormProps {
  onSave: (entry: Omit<TicketEntry, 'id'>) => void;
  currentUser: User;
}

const TicketEntryForm: React.FC<TicketEntryFormProps> = ({ onSave, currentUser }) => {
  const getInitialState = () => ({
    passengerName: '',
    pnr: '',
    flightName: '',
    issueDate: new Date().toISOString().split('T')[0],
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
    } else {
      setFormData(prev => ({ ...prev, ticketCopy: null }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const { passengerName, pnr, flightName, issueDate, from, to, departureDate, arrivalDate, fromIssuer } = formData;
    if (!passengerName.trim() || !pnr.trim() || !flightName.trim() || !issueDate || !from.trim() || !to.trim() || !departureDate || !arrivalDate.trim() || !fromIssuer.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    const submissionData = {
      ...formData,
      returnDate: formData.tripType === TripType.Return ? formData.returnDate : undefined,
    };

    onSave({
      ...submissionData,
      userId: currentUser.id,
      userName: currentUser.name,
    });
    
    setFormData(getInitialState());
    const fileInput = document.getElementById('ticketCopy-add') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };
  
  const formGridClass = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";

  return (
    <div className="bg-gray-900 bg-opacity-50 p-6 rounded-lg shadow-lg mb-6 border border-gray-700">
      <h2 className="text-xl font-semibold text-white mb-4">✈️ Add New Ticket Entry</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="text-red-400 text-sm mb-4 col-span-full">{error}</p>}
        <div className={formGridClass}>
            <div>
              <label htmlFor="passengerName-add" className="block text-sm font-medium text-gray-300">Passenger Name <span className="text-red-400">*</span></label>
              <input type="text" id="passengerName-add" name="passengerName" value={formData.passengerName} onChange={handleChange} className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2"/>
            </div>
             <div>
              <label htmlFor="pnr-add" className="block text-sm font-medium text-gray-300">PNR <span className="text-red-400">*</span></label>
              <input type="text" id="pnr-add" name="pnr" value={formData.pnr} onChange={handleChange} className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2"/>
            </div>
             <div>
              <label htmlFor="flightName-add" className="block text-sm font-medium text-gray-300">Airline / Flight Name <span className="text-red-400">*</span></label>
              <input type="text" id="flightName-add" name="flightName" value={formData.flightName} onChange={handleChange} className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2"/>
            </div>
            <div>
              <label htmlFor="from-add" className="block text-sm font-medium text-gray-300">From <span className="text-red-400">*</span></label>
              <input type="text" id="from-add" name="from" value={formData.from} onChange={handleChange} className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2"/>
            </div>
            <div>
              <label htmlFor="to-add" className="block text-sm font-medium text-gray-300">To <span className="text-red-400">*</span></label>
              <input type="text" id="to-add" name="to" value={formData.to} onChange={handleChange} className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2"/>
            </div>
             <div>
              <label htmlFor="fromIssuer-add" className="block text-sm font-medium text-gray-300">From Issuer <span className="text-red-400">*</span></label>
              <input type="text" id="fromIssuer-add" name="fromIssuer" value={formData.fromIssuer} onChange={handleChange} className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2"/>
            </div>
            <div>
              <label htmlFor="departureDate-add" className="block text-sm font-medium text-gray-300">Departure Date <span className="text-red-400">*</span></label>
              <input type="date" id="departureDate-add" name="departureDate" value={formData.departureDate} onChange={handleChange} className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2"/>
            </div>
            <div>
              <label htmlFor="arrivalDate-add" className="block text-sm font-medium text-gray-300">Arrival Date <span className="text-red-400">*</span></label>
              <input type="date" id="arrivalDate-add" name="arrivalDate" value={formData.arrivalDate} onChange={handleChange} className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2"/>
            </div>
            <div>
              <label htmlFor="issueDate-add" className="block text-sm font-medium text-gray-300">Issue Date <span className="text-red-400">*</span></label>
              <input type="date" id="issueDate-add" name="issueDate" value={formData.issueDate} onChange={handleChange} className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2"/>
            </div>
             <div>
                <label htmlFor="tripType-add" className="block text-sm font-medium text-gray-300">Trip Type</label>
                <select id="tripType-add" name="tripType" value={formData.tripType} onChange={handleChange} className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2">
                    <option value={TripType.OneWay}>1 Way</option>
                    <option value={TripType.Return}>Return</option>
                </select>
            </div>
            {formData.tripType === TripType.Return && (
              <div>
                <label htmlFor="returnDate-add" className="block text-sm font-medium text-gray-300">Return Date</label>
                <input type="date" id="returnDate-add" name="returnDate" value={formData.returnDate} onChange={handleChange} className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2"/>
              </div>
            )}
            <div>
                <label htmlFor="bdNumber-add" className="block text-sm font-medium text-gray-300">BD Number</label>
                <input type="text" id="bdNumber-add" name="bdNumber" value={formData.bdNumber} onChange={handleChange} className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2"/>
            </div>
            <div>
                <label htmlFor="qrNumber-add" className="block text-sm font-medium text-gray-300">QR Number</label>
                <input type="text" id="qrNumber-add" name="qrNumber" value={formData.qrNumber} onChange={handleChange} className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2"/>
            </div>
            <div className="lg:col-span-3">
                <label htmlFor="ticketCopy-add" className="block text-sm font-medium text-gray-300">Ticket Copy (PDF/IMG)</label>
                <input type="file" id="ticketCopy-add" name="ticketCopy" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"/>
            </div>
        </div>
        <div className="mt-6">
          <button type="submit" className="w-full px-6 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
            Save Ticket
          </button>
        </div>
      </form>
    </div>
  );
};

export default TicketEntryForm;