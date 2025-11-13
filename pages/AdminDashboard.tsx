import React, { useState, useEffect, useMemo } from 'react';
import Layout from '../components/layout/Layout';
import SummaryCard from '../components/Dashboard/SummaryCard';
import { getAllEntries, getAllTicketEntries, getStaffMembers } from '../services/api';
import { generateInvoice, generateTicketReport } from '../services/invoiceService';
import { IncomeEntry, EntryType, User, TicketEntry, TicketStatus } from '../types';
import DataChart from '../components/Dashboard/DataChart';
import NotificationToast from '../components/Dashboard/NotificationToast';

const DollarSignIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v1m0 6v1m0-10a9 9 0 110 18 9 9 0 010-18z" />
    </svg>
);

const CashIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const MinusCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const allMonths = Array.from({length: 12}, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    name: new Date(0, i).toLocaleString('default', { month: 'long' })
}));

type ViewType = 'income' | 'tickets';
type ChartTimeframe = 'daily' | 'monthly' | 'yearly';
interface UINotification { id: number; message: string; }


// Helper to generate the correct booking URL
const getManageBookingUrl = (flightName: string, pnr: string, lastName: string): string => {
    const normalizedFlightName = flightName.toLowerCase().replace(/airlines|airways|air/g, '').trim();

    // These URLs point to the airline's 'Manage Booking' page where users can manually enter details.
    const airlinePages: { [key: string]: string } = {
        'biman': 'https://www.biman-airlines.com/',
        'qatar': 'https://www.qatarairways.com/en/manage-booking.html',
        'emirates': 'https://www.emirates.com/manage-booking/',
        'saudia': 'https://www.saudia.com/managing-your-booking',
        'gulf': 'https://www.gulfair.com/manage-my-booking',
        'flydubai': 'https://www.flydubai.com/en/manage/manage-booking',
        'air arabia': 'https://www.airarabia.com/en/manage-booking',
        'etihad': 'https://www.etihad.com/en/manage',
        'kuwait': 'https://www.kuwaitairways.com/en/manage-booking',
    };

    const matchedKey = Object.keys(airlinePages).find(key => normalizedFlightName.includes(key));

    if (matchedKey) {
        return airlinePages[matchedKey];
    }

    // Fallback to Google search if no direct match is found
    const searchQuery = `${flightName} manage booking`;
    return `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
};


const AdminDashboard: React.FC = () => {
    const [incomeEntries, setIncomeEntries] = useState<IncomeEntry[]>([]);
    const [ticketEntries, setTicketEntries] = useState<TicketEntry[]>([]);
    const [staff, setStaff] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStaff, setFilterStaff] = useState<string>('all');
    const [filterMonth, setFilterMonth] = useState<string>('all');
    const [filterYear, setFilterYear] = useState<string>(new Date().getFullYear().toString());
    const [filterTicketStatus, setFilterTicketStatus] = useState<string>('all');
    const [activeView, setActiveView] = useState<ViewType>('income');
    const [searchQuery, setSearchQuery] = useState('');
    const [highlightedTicketId, setHighlightedTicketId] = useState<string | null>(null);
    const [chartTimeframe, setChartTimeframe] = useState<ChartTimeframe>('monthly');
    const [notifications, setNotifications] = useState<UINotification[]>([]);


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [allIncome, allTickets, staffMembers] = await Promise.all([getAllEntries(), getAllTicketEntries(), getStaffMembers()]);
                setIncomeEntries(allIncome);
                setTicketEntries(allTickets);
                setStaff(staffMembers);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Effect for handling live notifications
    useEffect(() => {
        const handleNotification = (event: CustomEvent) => {
            const newNotification = event.detail as UINotification;
            setNotifications(prev => [newNotification, ...prev]);
            
            // Automatically refresh data in the background to show the new entry
            (async () => {
                 try {
                    const [allIncome, allTickets] = await Promise.all([getAllEntries(), getAllTicketEntries()]);
                    setIncomeEntries(allIncome);
                    setTicketEntries(allTickets);
                } catch (error) {
                    console.error("Failed to auto-refresh data:", error);
                }
            })();
        };

        window.addEventListener('newAdminNotification', handleNotification as EventListener);

        return () => {
            window.removeEventListener('newAdminNotification', handleNotification as EventListener);
        };
    }, []);

    const removeNotification = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };


    const yearOptions = useMemo(() => {
        const dataYears = new Set<string>();
        incomeEntries.forEach(e => dataYears.add(e.date.substring(0, 4)));
        ticketEntries.forEach(t => dataYears.add(t.issueDate.substring(0, 4)));

        const futureYears: string[] = [];
        const currentYear = new Date().getFullYear();
        for (let y = currentYear; y <= 2050; y++) {
            futureYears.push(y.toString());
        }
        
        const allYears = new Set([...Array.from(dataYears), ...futureYears]);

        return Array.from(allYears).sort((a, b) => parseInt(b) - parseInt(a));
    }, [incomeEntries, ticketEntries]);

    const filteredIncomeEntries = useMemo(() => {
        return incomeEntries.filter(entry => {
            const staffMatch = filterStaff === 'all' || entry.userId === filterStaff;
            const yearMatch = filterYear === 'all' || entry.date.startsWith(filterYear);
            const monthMatch = filterMonth === 'all' || (entry.date.substring(5, 7) === filterMonth);
            return staffMatch && yearMatch && monthMatch;
        });
    }, [incomeEntries, filterStaff, filterMonth, filterYear]);

    const filteredTicketEntries = useMemo(() => {
        return ticketEntries.filter(entry => {
            const staffMatch = filterStaff === 'all' || entry.userId === filterStaff;
            const yearMatch = filterYear === 'all' || entry.issueDate.startsWith(filterYear);
            const monthMatch = filterMonth === 'all' || (entry.issueDate.substring(5, 7) === filterMonth);
            const statusMatch = filterTicketStatus === 'all' || entry.status === filterTicketStatus;
            return staffMatch && yearMatch && monthMatch && statusMatch;
        });
    }, [ticketEntries, filterStaff, filterMonth, filterYear, filterTicketStatus]);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setHighlightedTicketId(null);
            return;
        }

        const lowercasedQuery = searchQuery.toLowerCase().trim();
        const foundTicket = filteredTicketEntries.find(t => 
            t.passengerName.toLowerCase().includes(lowercasedQuery) ||
            t.pnr.toLowerCase().includes(lowercasedQuery)
        );
        
        if (foundTicket) {
            setHighlightedTicketId(foundTicket.id);
            const element = document.getElementById(`ticket-row-admin-${foundTicket.id}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else {
            setHighlightedTicketId(null);
        }
    }, [searchQuery, filteredTicketEntries]);
    
    const summary = useMemo(() => {
        return filteredIncomeEntries.reduce((acc, entry) => {
            if (entry.type === EntryType.IncomeAdd) acc.totalIncome += entry.amount;
            else if (entry.type === EntryType.IncomeMinus || entry.type === EntryType.IncomePayment) {
                acc.totalIncome -= entry.amount;
                acc.totalIncomeMinus += entry.amount;
            }
            else if (entry.type === EntryType.OTPAdd) acc.totalOtpCash += entry.amount;
            else if (entry.type === EntryType.OTPMinus || entry.type === EntryType.OTPPayment) {
                acc.totalOtpCash -= entry.amount;
                acc.totalOtpMinus += entry.amount;
            }
            return acc;
        }, { totalIncome: 0, totalOtpCash: 0, totalIncomeMinus: 0, totalOtpMinus: 0 });
    }, [filteredIncomeEntries]);

    const summaryTitle = useMemo(() => {
        if (filterStaff === 'all') return 'Overall Summary';
        const selectedStaff = staff.find(s => s.id === filterStaff);
        return selectedStaff ? `Summary for ${selectedStaff.name}` : 'Summary';
    }, [filterStaff, staff]);

    const handleDownloadInvoice = () => {
        if (filterStaff === 'all' || filterMonth === 'all' || filterYear === 'all') {
            alert('Please select a specific staff, month, and year to download an invoice.');
            return;
        }
        const selectedStaff = staff.find(s => s.id === filterStaff);
        const monthName = allMonths.find(m => m.value === filterMonth)?.name;
        if(selectedStaff && monthName) {
             generateInvoice(selectedStaff, filteredIncomeEntries, `${monthName} ${filterYear}`);
        }
    };

    const handleDownloadTicketReport = () => {
        if (filteredTicketEntries.length === 0) {
            alert('No ticket entries to export.');
            return;
        }
        const staffName = filterStaff === 'all' ? 'All Staff' : staff.find(s => s.id === filterStaff)?.name || 'Unknown Staff';
        const monthName = filterMonth === 'all' ? 'All Months' : allMonths.find(m => m.value === filterMonth)?.name;
        const year = filterYear === 'all' ? 'All Years' : filterYear;
        const title = `Ticket Report: ${staffName} - ${monthName} ${year}`;
        generateTicketReport(filteredTicketEntries, title, true);
    };

    const getEntryTypeColor = (type: EntryType) => {
        switch (type) {
            case EntryType.IncomeAdd: return 'bg-green-100 text-green-800';
            case EntryType.IncomeMinus:
            case EntryType.IncomePayment:
                return 'bg-red-100 text-red-800';
            case EntryType.OTPAdd: return 'bg-blue-100 text-blue-800';
            case EntryType.OTPMinus:
            case EntryType.OTPPayment:
                return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    
    const getTicketStatusColor = (status: TicketStatus) => {
        switch (status) {
            case TicketStatus.Confirmed: return 'bg-green-100 text-green-800';
            case TicketStatus.Pending: return 'bg-yellow-100 text-yellow-800';
            case TicketStatus.Cancelled: return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getLastName = (fullName: string): string => {
        if (!fullName) return '';
        const parts = fullName.trim().split(/\s+/);
        if (parts.length === 0) return '';
        const titles = ['MR', 'MRS', 'MS', 'MISS', 'MD', 'DR'];
        const nameParts = parts.filter(part => !titles.includes(part.toUpperCase().replace('.', '')));
        return nameParts[nameParts.length - 1] || '';
    };

    const isYearlyPossible = true;
    const isMonthlyPossible = filterYear !== 'all';
    const isDailyPossible = filterYear !== 'all' && filterMonth !== 'all';

    useEffect(() => {
        if (chartTimeframe === 'daily' && !isDailyPossible) {
            setChartTimeframe('monthly');
        }
        if (chartTimeframe === 'monthly' && !isMonthlyPossible) {
            setChartTimeframe('yearly');
        }
    }, [isDailyPossible, isMonthlyPossible, chartTimeframe]);

    const renderIncomeTable = () => (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900 bg-opacity-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Staff</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Description / Details</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase">Amount</th>
                    </tr>
                </thead>
                <tbody className="bg-gray-800 bg-opacity-50 divide-y divide-gray-700">
                    {loading ? (
                        <tr><td colSpan={6} className="text-center py-4 text-gray-300">Loading entries...</td></tr>
                    ) : filteredIncomeEntries.length === 0 ? (
                        <tr><td colSpan={6} className="text-center py-4 text-gray-400">No income entries match the selected filters.</td></tr>
                    ) : (
                        filteredIncomeEntries.map(entry => (
                            <tr key={entry.id} className="hover:bg-gray-700">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{entry.userName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{entry.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{entry.time}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEntryTypeColor(entry.type)}`}>{entry.type}</span></td>
                                <td className="px-6 py-4 text-sm text-gray-300">
                                    <div>{entry.description}</div>
                                    {(entry.type === EntryType.IncomePayment || entry.type === EntryType.OTPPayment) && entry.recipient && (
                                        <div className="text-xs text-gray-400">To: {entry.recipient}</div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-right font-semibold">{entry.amount.toFixed(2)}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );

    const renderTicketTable = () => (
        <>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by Passenger Name or PNR to highlight..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full max-w-sm bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                     <thead className="bg-gray-900 bg-opacity-50">
                        <tr>
                            {['Staff', 'Passenger', 'PNR', 'Status', 'Route', 'Departure', 'Arrival', 'Airline', 'From Issuer', 'BD Number', 'QR Number', 'Ticket Copy'].map(h => 
                                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{h}</th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800 bg-opacity-50 divide-y divide-gray-700">
                        {loading ? (
                            <tr><td colSpan={12} className="text-center py-4 text-gray-300">Loading entries...</td></tr>
                        ) : filteredTicketEntries.length === 0 ? (
                            <tr><td colSpan={12} className="text-center py-4 text-gray-400">No ticket entries match the selected filters.</td></tr>
                        ) : (
                            filteredTicketEntries.map(t => {
                                const lastName = getLastName(t.passengerName);
                                const bookingUrl = getManageBookingUrl(t.flightName, t.pnr, lastName);
                                return (
                                <tr 
                                    key={t.id} 
                                    id={`ticket-row-admin-${t.id}`}
                                    className={`${highlightedTicketId === t.id ? 'bg-blue-900 ring-2 ring-blue-500' : 'hover:bg-gray-700'} transition-all duration-300`}
                                >
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{t.userName}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{t.passengerName}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-400 font-semibold">
                                         <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="hover:underline" title={`Check PNR for ${t.passengerName} on ${t.flightName}`}>
                                            {t.pnr}
                                        </a>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTicketStatusColor(t.status)}`}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{`${t.from} -> ${t.to}`}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{t.departureDate}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{t.arrivalDate}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{t.flightName}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{t.fromIssuer}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{t.bdNumber || 'N/A'}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{t.qrNumber || 'N/A'}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                                        {t.ticketCopy ? (
                                            <a href={t.ticketCopy.dataUrl} download={t.ticketCopy.fileName} className="text-blue-400 hover:underline">Download</a>
                                        ) : (
                                            <span className="text-gray-500">N/A</span>
                                        )}
                                    </td>
                                </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );

    return (
        <Layout title="Admin Dashboard">
            <div className="fixed top-20 right-4 z-50 w-full max-w-sm space-y-2">
                {notifications.map(notif => (
                    <NotificationToast
                        key={notif.id}
                        message={notif.message}
                        onClose={() => removeNotification(notif.id)}
                    />
                ))}
            </div>
        
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-2">{summaryTitle}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <SummaryCard title="Total Daily Income" value={`QR ${summary.totalIncome.toFixed(2)}`} icon={<DollarSignIcon />} color="bg-green-500" />
                    <SummaryCard title="Total OTP Cash" value={`QR ${summary.totalOtpCash.toFixed(2)}`} icon={<CashIcon />} color="bg-blue-500" />
                    <SummaryCard title="Total Income Spent" value={`QR ${summary.totalIncomeMinus.toFixed(2)}`} icon={<MinusCircleIcon />} color="bg-red-500" />
                    <SummaryCard title="Total OTP Spent" value={`QR ${summary.totalOtpMinus.toFixed(2)}`} icon={<MinusCircleIcon />} color="bg-yellow-500" />
                </div>
            </div>

            <div className="bg-gray-800 bg-opacity-75 backdrop-blur-sm p-6 rounded-lg shadow-lg mb-6 border border-gray-700">
                <div className="flex flex-wrap justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white">Financial Overview</h2>
                    <div className="flex border border-gray-600 rounded-lg p-1">
                        <button
                            onClick={() => setChartTimeframe('daily')}
                            disabled={!isDailyPossible}
                            className={`px-3 py-1 text-sm rounded-md ${chartTimeframe === 'daily' ? 'bg-blue-600 text-white' : 'text-gray-300'} disabled:text-gray-500 disabled:cursor-not-allowed`}
                            title={!isDailyPossible ? "Select a specific month and year" : ""}
                        >
                            Daily
                        </button>
                        <button
                            onClick={() => setChartTimeframe('monthly')}
                            disabled={!isMonthlyPossible}
                            className={`px-3 py-1 text-sm rounded-md ${chartTimeframe === 'monthly' ? 'bg-blue-600 text-white' : 'text-gray-300'} disabled:text-gray-500 disabled:cursor-not-allowed`}
                             title={!isMonthlyPossible ? "Select a specific year" : ""}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setChartTimeframe('yearly')}
                            disabled={!isYearlyPossible}
                            className={`px-3 py-1 text-sm rounded-md ${chartTimeframe === 'yearly' ? 'bg-blue-600 text-white' : 'text-gray-300'}`}
                        >
                            Yearly
                        </button>
                    </div>
                </div>
                <div className="h-96">
                    <DataChart
                        entries={filteredIncomeEntries}
                        timeframe={chartTimeframe}
                        year={filterYear}
                        month={filterMonth}
                    />
                </div>
            </div>

             <div className="bg-gray-800 bg-opacity-75 backdrop-blur-sm p-6 rounded-lg shadow-lg mb-6 flex flex-wrap items-center justify-between gap-4 border border-gray-700">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                         <label className="text-sm font-medium text-gray-300">Staff:</label>
                        <select value={filterStaff} onChange={e => setFilterStaff(e.target.value)} className="block bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm p-2">
                            <option value="all">All Staff</option>
                            {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-300">Year:</label>
                         <select value={filterYear} onChange={e => setFilterYear(e.target.value)} className="block bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm p-2">
                            <option value="all">All Years</option>
                            {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                     <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-300">Month:</label>
                        <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="block bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm p-2">
                            <option value="all">All Months</option>
                            {allMonths.map(m => <option key={m.value} value={m.value}>{m.name}</option>)}
                        </select>
                    </div>
                     {activeView === 'tickets' && (
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-300">Status:</label>
                            <select value={filterTicketStatus} onChange={e => setFilterTicketStatus(e.target.value)} className="block bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm p-2">
                                <option value="all">All Statuses</option>
                                {Object.values(TicketStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    )}
                </div>
                <div>
                 <button onClick={handleDownloadInvoice} disabled={filterStaff === 'all' || filterMonth === 'all' || filterYear === 'all'} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-500 mr-2">
                    Download Income Invoice
                </button>
                 {activeView === 'tickets' && (
                    <button onClick={handleDownloadTicketReport} disabled={filteredTicketEntries.length === 0} className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 disabled:bg-gray-500">
                        Download Ticket Report
                    </button>
                )}
                </div>
            </div>

            <div className="bg-gray-800 bg-opacity-75 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-gray-700">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white">All Entries</h2>
                     <div className="flex border border-gray-600 rounded-lg p-1">
                        <button onClick={() => setActiveView('income')} className={`px-3 py-1 text-sm rounded-md ${activeView === 'income' ? 'bg-blue-600 text-white' : 'text-gray-300'}`}>Income/OTP</button>
                        <button onClick={() => setActiveView('tickets')} className={`px-3 py-1 text-sm rounded-md ${activeView === 'tickets' ? 'bg-blue-600 text-white' : 'text-gray-300'}`}>Ticket Sales</button>
                    </div>
                </div>
                {activeView === 'income' ? renderIncomeTable() : renderTicketTable()}
            </div>

        </Layout>
    );
};

export default AdminDashboard;